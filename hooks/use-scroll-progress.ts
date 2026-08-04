"use client";

import { type MotionValue, useScroll as useFramerScroll, useSpring } from "framer-motion";

import { SPRING } from "@/config/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface ScrollProgress {
  /** Raw 0–1 document progress. Updates every frame, never re-renders. */
  progress: MotionValue<number>;
  /** Spring-smoothed progress. Use this for anything the eye follows. */
  smoothProgress: MotionValue<number>;
}

/**
 * Document scroll progress as MotionValues.
 *
 * Kept out of React state on purpose: a progress bar driven by state would
 * re-render its subtree on every frame, whereas a MotionValue writes straight
 * to the compositor.
 *
 * With reduced motion the spring is bypassed, so the indicator tracks the
 * scrollbar exactly instead of easing behind it.
 */
export function useScrollProgress(): ScrollProgress {
  const { scrollYProgress } = useFramerScroll();
  const reduceMotion = useReducedMotion();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: SPRING.responsive.stiffness,
    damping: SPRING.responsive.damping,
    mass: SPRING.responsive.mass,
    restDelta: 0.0005,
  });

  return {
    progress: scrollYProgress,
    smoothProgress: reduceMotion ? scrollYProgress : smoothProgress,
  };
}
