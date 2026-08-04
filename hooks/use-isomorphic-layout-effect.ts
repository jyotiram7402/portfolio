import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * Avoids React's "useLayoutEffect does nothing on the server" warning while
 * keeping synchronous measurement where it matters — reading layout before the
 * browser paints, which is what every measurement-driven animation needs.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
