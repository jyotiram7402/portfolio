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

const VERSION = "v1";
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

      await self.clients.claim();
    })(),
  );
});

/** Lets the page tell a waiting worker to activate — used by the update prompt. */
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
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

        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(ASSET_CACHE);
          void cache.put(request, response.clone());
        }
        return response;
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
