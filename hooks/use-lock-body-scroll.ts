"use client";

import { useEffect } from "react";

import { startScroll, stopScroll } from "@/utils/scroll";

/**
 * Freezes the page behind an overlay.
 *
 * Three things have to happen together, and missing any one of them produces a
 * visible bug:
 *   1. Lenis is paused, or it keeps animating the virtual scroll underneath.
 *   2. `overflow` is clipped, so native wheel and touch scrolling stop too.
 *   3. `padding-right` compensates for the removed scrollbar, otherwise the
 *      whole layout jumps sideways the moment a modal opens.
 *
 * The previous inline values are restored on unlock rather than cleared, so
 * nested locks (a drawer that opens a modal) unwind correctly.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    stopScroll();
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      startScroll();
    };
  }, [locked]);
}
