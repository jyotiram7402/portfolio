"use client";

import { type MotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import type { RefObject } from "react";

import { SPRING } from "@/config/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface ReadingProgress {
  /** 0–1 through the target element. Updates per frame, never re-renders. */
  progress: MotionValue<number>;
  /** Percentage string, for a `width` or an `aria-valuenow` readout. */
  percent: MotionValue<number>;
}

/**
 * Progress through one element, rather than through the document.
 *
 * The site-wide `ScrollProgress` bar from Sprint 0 measures the whole page, which on an
 * article page includes the header, the table of contents and the footer — so it reads
 * 40% when the reader is one paragraph in. This measures the article body only, which
 * is the number a reader actually cares about.
 *
 * Returns MotionValues, so the bar is written by the compositor and the component that
 * renders it never re-renders while scrolling.
 */
export function useReadingProgress(
  targetRef: RefObject<HTMLElement | null>,
): ReadingProgress {
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: targetRef,
    // Complete when the end of the article reaches the bottom of the viewport, not
    // when it reaches the top — otherwise the bar fills a screen early.
    offset: ["start start", "end end"],
  });

  const smoothed = useSpring(scrollYProgress, {
    stiffness: SPRING.responsive.stiffness,
    damping: SPRING.responsive.damping,
    mass: SPRING.responsive.mass,
    restDelta: 0.0005,
  });

  const progress = reduceMotion ? scrollYProgress : smoothed;
  const percent = useTransform(progress, (value) => Math.round(value * 100));

  return { progress, percent };
}
