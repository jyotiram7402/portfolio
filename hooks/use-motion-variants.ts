"use client";

import type { Variants } from "framer-motion";
import { useMemo } from "react";

import { toReducedMotion } from "@/animations/variants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Returns the motion-preference-appropriate version of a variant set.
 *
 * This is how a single component definition serves both preferences: the JSX
 * never branches, it just consumes whatever this returns. Under reduced motion
 * the travel and scale are stripped and only the opacity change survives.
 */
export function useMotionVariants(variants: Variants): Variants {
  const reduceMotion = useReducedMotion();

  return useMemo(
    () => (reduceMotion ? toReducedMotion(variants) : variants),
    [reduceMotion, variants],
  );
}
