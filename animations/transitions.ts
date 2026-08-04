import type { Transition } from "framer-motion";

import { DURATION, SPRING } from "@/config/animations";
import { ease } from "@/animations/easings";

/**
 * Named transitions.
 *
 * Components reference these instead of writing `{ duration: 0.4, ease: [...] }`
 * inline, so the site's motion signature is defined in exactly one place.
 */

export const transition = {
  /** Micro-interactions: hover, focus, colour. */
  fast: { duration: DURATION.fast, ease: ease.outQuint },
  /** The default for entrances and layout shifts. */
  base: { duration: DURATION.normal, ease: ease.outQuint },
  /** Larger surfaces: cards, panels. */
  slow: { duration: DURATION.slow, ease: ease.outExpo },
  /** Hero-scale reveals. */
  cinematic: { duration: DURATION.slower, ease: ease.outExpo },

  springResponsive: SPRING.responsive,
  springSmooth: SPRING.smooth,
  springGentle: SPRING.gentle,
  springBouncy: SPRING.bouncy,
} as const satisfies Record<string, Transition>;

/** Adds a delay without mutating the preset. */
export function withDelay(base: Transition, delay: number): Transition {
  return { ...base, delay };
}

/** Wraps a transition so children animate in sequence. */
export function withStagger(
  base: Transition,
  staggerChildren: number,
  delayChildren = 0,
): Transition {
  return { ...base, staggerChildren, delayChildren };
}

/**
 * Collapses a transition to effectively instant.
 *
 * Reduced-motion variants keep their opacity change — going from nothing to
 * something abruptly is more jarring than a 10 ms fade — but drop all travel.
 */
export const instantTransition: Transition = { duration: 0.01 };
