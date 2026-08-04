"use client";

import { MEDIA_QUERIES } from "@/constants/breakpoints";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * The site's single source of truth for "should this animate?".
 *
 * Returns `true` when the user has asked for reduced motion. The server
 * snapshot is `false` so the markup matches the common case; the global CSS
 * escape hatch in `styles/base.css` covers the first paint either way.
 *
 * Every decorative animation must consult this. Essential motion — a focus
 * ring, a loading indicator — may ignore it.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery(MEDIA_QUERIES.reducedMotion, false);
}

/** Inverse, for the common `shouldAnimate && ...` guard. */
export function useShouldAnimate(): boolean {
  return !useReducedMotion();
}
