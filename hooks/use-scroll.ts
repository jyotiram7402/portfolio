"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

import type { ScrollDirection } from "@/types/common";

export interface UseScrollOptions {
  /** Pixels scrolled before `isScrolled` flips. */
  threshold?: number;
  /** Pixels of travel required to change `direction`, to absorb trackpad jitter. */
  directionThreshold?: number;
  /** Distance from the document end that still counts as "at bottom". */
  bottomOffset?: number;
}

export interface ScrollState {
  direction: ScrollDirection;
  isScrolled: boolean;
  isAtTop: boolean;
  isAtBottom: boolean;
}

const INITIAL_STATE: ScrollState = {
  direction: "up",
  isScrolled: false,
  isAtTop: true,
  isAtBottom: false,
};

function isSameState(a: ScrollState, b: ScrollState): boolean {
  return (
    a.direction === b.direction &&
    a.isScrolled === b.isScrolled &&
    a.isAtTop === b.isAtTop &&
    a.isAtBottom === b.isAtBottom
  );
}

/**
 * Discrete scroll state, plus a ref holding the live offset.
 *
 * Deliberately returns only booleans and a direction: those change a handful of
 * times per scroll, so components that consume them re-render a handful of
 * times. The continuous position is exposed through `offsetRef` (readable in an
 * event handler without a render) and through `useScrollProgress`, which keeps
 * it in a MotionValue. Putting `scrollY` in state would re-render the tree on
 * every pixel.
 */
export function useScroll(options: UseScrollOptions = {}): ScrollState & {
  offsetRef: RefObject<number>;
} {
  const { threshold = 24, directionThreshold = 8, bottomOffset = 64 } = options;

  const [state, setState] = useState<ScrollState>(INITIAL_STATE);
  const offsetRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    // Anchor for direction changes — reset each time the direction flips.
    let anchor = window.scrollY;
    let direction: ScrollDirection = "up";

    const evaluate = () => {
      frame = 0;

      const y = window.scrollY;
      offsetRef.current = y;

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      const delta = y - anchor;
      if (Math.abs(delta) > directionThreshold) {
        direction = delta > 0 ? "down" : "up";
        anchor = y;
      }

      const next: ScrollState = {
        direction,
        isScrolled: y > threshold,
        isAtTop: y <= 2,
        isAtBottom: scrollable > 0 && y >= scrollable - bottomOffset,
      };

      // Returning the previous object lets React bail out of the re-render.
      setState((previous) => (isSameState(previous, next) ? previous : next));
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(evaluate);
    };

    evaluate();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [threshold, directionThreshold, bottomOffset]);

  return { ...state, offsetRef };
}
