"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { useIsTouchDevice } from "@/hooks/use-is-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface ParallaxProps {
  children: ReactNode;
  /**
   * Fraction of the element's own scroll distance to travel. Positive moves with
   * the scroll (slower than the page), negative moves against it.
   */
  strength?: number;
  className?: string;
}

/**
 * Scroll-linked vertical drift.
 *
 * The one place this site uses GSAP, and the reason is specific: ScrollTrigger's
 * `scrub` samples the same virtual scroll position Lenis is interpolating (through
 * the scroller proxy set up in `animations/gsap.ts`), so the drift stays locked to
 * the content. A Framer `useScroll` equivalent reads the native offset and visibly
 * trails the page by a frame during smooth scrolling.
 *
 * GSAP sits behind a dynamic `import()`, so it is only fetched where a parallax
 * actually mounts — never on touch, never under reduced motion.
 */
export function Parallax({ children, strength = 0.12, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduceMotion || isTouch) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    void import("@/animations/gsap").then(({ createParallax }) => {
      // The import can resolve after the effect has already been cleaned up,
      // which happens on every Strict Mode double-invoke.
      if (cancelled) return;
      dispose = createParallax(element, { strength });
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [isTouch, reduceMotion, strength]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
