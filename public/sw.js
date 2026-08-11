/* eslint-disable no-undef */

/**
 * Service worker.
 *
 * Hand-written rather than generated, and deliberately conservative. A badly scoped service
 * worker is the single most destructive thing that can be deployed to a static site: it can pin
 * a stale bundle for every returning visitor, and there is no way to reach them to fix it. So the
 * rules here are narrow and the failure mode is always "behave as if there is no service worker".
 *
 * The strategies, and why each one:
 *
 * • **Navigations — network first, cache fallback, then `/offline`.** A page must never be served
 *   stale. Next.js embeds build-specific asset URLs in its HTML, so a cached document paired with
 *   a newer deployment's assets is a white screen. Network first means the only time a cached
 *   document is used is when the network genuinely failed.
 *
 * • **Build assets (`/_next/static/*`) — cache first, forever.** These URLs are content-hashed, so
 *   a given URL's body can never change. This is the one case where cache-first is unambiguously
 *   correct and where the offline win actually comes from.
 *
 * • **Images and fonts — stale-while-revalidate.** Serve immediately, refresh in the background.
 *
 * • **Everything else — passthrough.** API routes, the manifest, RSC payloads and anything
 *   cross-origin are never touched. Caching a POST response or an RSC flight payload is how a
 *   form starts submitting yesterday's data.
 */

/**
 * Bumping this evicts every cache on the next activation — `activate` deletes anything not in
 * `expected`. That is the only lever that reaches a visitor whose browser is already holding a
 * bad entry, so it must be incremented whenever the strategies below change.
 *
 * v2: fixed the asset branch turning a transient network failure into a permanent one, and
 * stopped a new worker from claiming pages loaded by the previous build. See the notes on each.
 */
const VERSION = "v2";
const SHELL_CACHE = `shell-${VERSION}`;
const ASSET_CACHE = `assets-${VERSION}`;
const MEDIA_CACHE = `media-${VERSION}`;

const OFFLINE_URL = "/offline";

/** Precached on install. Kept to one page — the offline fallback and nothing else. */
const PRECACHE_URLS = [OFFLINE_URL, "/icons/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // `reload` bypasses the HTTP cache, so a precache never captures a stale copy.
      await cache.addAll(
        PRECACHE_URLS.map((url) => new Request(url, { cache: "reload" })),
      );
      // Take over immediately rather than waiting for every tab to close. Safe here
      // because nothing is served stale.
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const expected = [SHELL_CACHE, ASSET_CACHE, MEDIA_CACHE];
      const names = await caches.keys();

      await Promise.all(
        names.filter((name) => !expected.includes(name)).map((name) => caches.delete(name)),
      );

      // Enables navigation preload where supported, so the network request for a
      // navigation starts before this worker has finished booting.
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }

      /*
        `clients.claim()` is deliberately NOT called.

        It used to be, and it is the more destructive half of a real bug. Claiming makes this
        worker take over pages that are already open — pages served by the *previous* build.
        Next.js embeds build-specific, content-hashed chunk URLs in its HTML, and a lazily
        imported chunk is not requested until the visitor interacts. So an open tab from the
        old build would ask this worker for an old chunk URL that the new deployment no longer
        serves, get a 404, and the feature behind that chunk would simply never appear.

        On this site the only lazily imported chunks are the command palette and the chat
        panel, which is exactly the shape of "everything works except search and chat".

        Without claiming, an open tab keeps talking to the worker that matches its own build,
        and this one takes over on the next navigation — when the HTML and the chunk URLs are
        from the same deployment.
      */
    })(),
  );
});

/**
 * Lets the page tell a waiting worker to take over — used by the update prompt.
 *
 * This is the *only* place `clients.claim()` is called, and that is deliberate. Claiming on
 * activation swaps assets underneath pages that never asked (see the note in `activate`). Here
 * the page has explicitly requested the update and is listening for `controllerchange` to
 * reload itself, so taking over its assets is safe — it is about to discard them anyway.
 *
 * Claiming is also what makes `controllerchange` fire. `skipWaiting()` alone activates this
 * worker without giving it control of the open page, so the prompt's reload would never
 * trigger.
 */
self.addEventListener("message", (event) => {
  if (event.data !== "SKIP_WAITING") return;

  event.waitUntil(
    (async () => {
      await self.skipWaiting();
      await self.clients.claim();
    })(),
  );
});

function isBuildAsset(url) {
  return url.pathname.startsWith("/_next/static/");
}

function isMedia(request, url) {
  return (
    request.destination === "image" ||
    request.destination === "font" ||
    /\.(?:png|jpe?g|webp|avif|gif|svg|ico|woff2?)$/.test(url.pathname)
  );
}

/**
 * Paths that must always hit the network.
 *
 * RSC payloads are included because they are build-coupled in the same way documents are, and a
 * cached flight response against a new build fails in a way that is very hard to diagnose.
 */
function isNeverCached(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/_next/data") ||
    url.pathname === "/manifest.webmanifest" ||
    url.searchParams.has("_rsc")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only GET is ever cacheable, and only same-origin is ever ours to cache.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isNeverCached(url)) return;

  /* ------------------------------------------------------------ navigation -- */
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloaded = await event.preloadResponse;
          if (preloaded) return preloaded;

          const response = await fetch(request);

          // Cache successful documents so a later offline visit to the same page
          // works, but never prefer them over the network.
          if (response.ok) {
            const cache = await caches.open(SHELL_CACHE);
            void cache.put(request, response.clone());
          }

          return response;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;

          const offline = await caches.match(OFFLINE_URL);
          if (offline) return offline;

          return new Response("Offline", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        }
      })(),
    );
    return;
  }

  /* ---------------------------------------------------------- build assets -- */
  if (isBuildAsset(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        try {
          const response = await fetch(request);

          // Only store a real hit. Caching a 404 from a superseded build would make the
          // failure outlive the deployment that caused it.
          if (response.ok) {
            const cache = await caches.open(ASSET_CACHE);
            void cache.put(request, response.clone());
          }
          return response;
        } catch {
          /*
            The network failed on a build asset.

            This branch matters far more than its size suggests. `event.respondWith()` given a
            rejected promise fails the request — and for a lazily imported chunk, Next.js and
            React cache that rejection. The dynamic import never retries, so the feature behind
            it stays dead for the life of the page even after connectivity comes back.

            A second cache lookup is the only recovery available here; past that, fail so the
            browser reports a network error rather than the worker inventing a response. The
            client-side retry in `lib/lazy-retry.ts` is what actually makes the feature
            recoverable.
          */
          const fallback = await caches.match(request);
          if (fallback) return fallback;
          throw new Error(`Build asset unavailable: ${url.pathname}`);
        }
      })(),
    );
    return;
  }

  /* ----------------------------------------------------------------- media -- */
  if (isMedia(request, url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(MEDIA_CACHE);
        const cached = await cache.match(request);

        // Revalidate in the background whether or not there was a hit. The promise is
        // deliberately not awaited when a cached copy exists.
        const network = fetch(request)
          .then((response) => {
            if (response.ok) void cache.put(request, response.clone());
            return response;
          })
          .catch(() => undefined);

        if (cached) return cached;

        const response = await network;
        return response ?? new Response(null, { status: 504 });
      })(),
    );
  }
});
