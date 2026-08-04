"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query.
 *
 * Built on `useSyncExternalStore` rather than `useState` + `useEffect`: the
 * store form is tear-free under concurrent rendering and gives React an
 * explicit server snapshot, so there is exactly one hydration-safe render
 * instead of a flash of the wrong branch.
 *
 * @param serverFallback What the query evaluates to during SSR. Pick the value
 *   that produces the cheaper markup — a desktop-only effect should default to
 *   `false` so mobile never downloads a layout it discards.
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onStoreChange);
      return () => list.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => serverFallback, [serverFallback]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
