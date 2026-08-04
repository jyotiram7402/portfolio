"use client";

import type Lenis from "lenis";
import { useContext, useEffect, useRef } from "react";

import { LenisContext } from "@/components/providers/lenis-context";

/**
 * The active Lenis instance, or `null` when smooth scrolling is not running
 * (touch devices, reduced motion). Callers must handle `null` — that is the
 * normal state on a phone, not an error.
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * Subscribes to Lenis's scroll event.
 *
 * Prefer this over a native `scroll` listener when the callback needs Lenis's
 * interpolated position: the native event reports the real offset, which trails
 * the eased value the user is actually looking at.
 *
 * The callback lives in a ref so passing an inline closure does not resubscribe
 * on every render, while still never going stale.
 */
export function useLenisScroll(
  callback: (lenis: Lenis) => void,
  enabled = true,
): void {
  const lenis = useLenis();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!lenis || !enabled) return;

    const handler = () => callbackRef.current(lenis);
    lenis.on("scroll", handler);
    return () => lenis.off("scroll", handler);
  }, [lenis, enabled]);
}
