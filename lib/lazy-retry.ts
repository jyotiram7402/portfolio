/**
 * Retries a dynamic import once before giving up.
 *
 * **Why this exists.** `next/dynamic` and `React.lazy` memoise the *rejection* of a chunk
 * import, not just its resolution. So a single failed request for a lazily loaded chunk —
 * a dropped connection, a service worker serving a superseded build, a proxy hiccup — kills
 * that feature for the entire life of the page. The user clicks again, nothing happens, and
 * there is no error state because the component simply never mounts.
 *
 * On this site the only lazily imported chunks are the command palette and the chat panel,
 * which makes this failure mode look exactly like "everything works except search and chat".
 *
 * **The reload is the point.** A plain retry of the same `import()` returns the same cached
 * rejected promise from the bundler's module registry, so it cannot help. `location.reload()`
 * is the blunt but reliable escape: the page comes back on the current build, with fresh
 * chunk URLs and a service worker that has had a chance to update. It is gated behind
 * `sessionStorage` so a genuinely missing chunk cannot produce a reload loop — one attempt per
 * chunk per tab, then the failure is allowed through.
 *
 * Usage, in place of a bare `import()`:
 *
 * ```ts
 * const ChatPanel = dynamic(
 *   () => lazyRetry("chat-panel", () => import("@/features/ai-assistant")).then((m) => m.ChatPanel),
 *   { ssr: false },
 * );
 * ```
 */

const STORAGE_PREFIX = "chunk-retry:";

/** Session-scoped, so the guard clears itself when the tab closes. */
function hasRetried(key: string): boolean {
  try {
    return window.sessionStorage.getItem(`${STORAGE_PREFIX}${key}`) === "1";
  } catch {
    // Private mode or a blocked storage partition. Treat it as "already retried" so the
    // absence of storage can never turn into an unbounded reload loop.
    return true;
  }
}

function markRetried(key: string): void {
  try {
    window.sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, "1");
  } catch {
    // Nothing to do — `hasRetried` fails closed.
  }
}

/**
 * Clears the guard for a chunk that loaded successfully.
 *
 * Without this, a tab that recovered from one failure would refuse to retry a *later*,
 * unrelated failure of the same chunk.
 */
function clearRetried(key: string): void {
  try {
    window.sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // Ignored, as above.
  }
}

export async function lazyRetry<T>(
  /** Stable identifier for this chunk. Used as the session-storage key. */
  key: string,
  load: () => Promise<T>,
): Promise<T> {
  try {
    const value = await load();
    clearRetried(key);
    return value;
  } catch (cause) {
    // Server-side, or storage unavailable: there is nothing useful to do but propagate.
    if (typeof window === "undefined" || hasRetried(key)) throw cause;

    markRetried(key);
    window.location.reload();

    // The reload is asynchronous, so this promise must never settle — resolving it would
    // let the caller render against a half-torn-down page.
    return new Promise<T>(() => {});
  }
}
