import type { Transition, Variants } from "framer-motion";

import { DISTANCE, DURATION, STAGGER } from "@/config/animations";
import { ease } from "@/animations/easings";
import { transition } from "@/animations/transitions";
import type { Direction } from "@/types/common";

/**
 * The variant library.
 *
 * Naming follows `hidden` / `visible` / `exit` throughout so any variant can be
 * dropped into a parent's `initial`/`animate`/`exit` without adaptation, and so
 * `staggerChildren` on a container propagates to children of any type.
 */

/* -------------------------------------------------------------------------- */
/*  Fades                                                                     */
/* -------------------------------------------------------------------------- */

/** Opacity only. Parameterised so callers can add a delay without redefining it. */
export function fadeOnly(customTransition: Transition = transition.base): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: customTransition },
    exit: { opacity: 0, transition: transition.fast },
  };
}

export const fadeIn: Variants = fadeOnly();

function axisOffset(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
  }
}

/**
 * Fade combined with travel. `direction` is where the element travels *towards*,
 * so `up` starts below its resting place and rises into it.
 */
export function fade(
  direction: Direction = "up",
  distance: number = DISTANCE.md,
  customTransition: Transition = transition.slow,
): Variants {
  const offset = axisOffset(direction, distance);
  return {
    hidden: { opacity: 0, ...offset },
    visible: { opacity: 1, x: 0, y: 0, transition: customTransition },
    exit: { opacity: 0, ...offset, transition: transition.fast },
  };
}

export const fadeUp = fade("up");
export const fadeDown = fade("down");
export const fadeLeft = fade("left");
export const fadeRight = fade("right");

/* -------------------------------------------------------------------------- */
/*  Slides — travel without a fade, for panels                                */
/* -------------------------------------------------------------------------- */

export function slide(
  direction: Direction = "up",
  distance: number = DISTANCE.xl,
): Variants {
  const offset = axisOffset(direction, distance);
  return {
    hidden: { ...offset },
    visible: { x: 0, y: 0, transition: transition.slow },
    exit: { ...offset, transition: transition.base },
  };
}

/* -------------------------------------------------------------------------- */
/*  Scale                                                                     */
/* -------------------------------------------------------------------------- */

export function scale(
  from = 0.94,
  customTransition: Transition = transition.springSmooth,
): Variants {
  return {
    hidden: { opacity: 0, scale: from },
    visible: { opacity: 1, scale: 1, transition: customTransition },
    exit: { opacity: 0, scale: 0.97, transition: transition.fast },
  };
}

export const scaleIn: Variants = scale();

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: transition.springBouncy },
  exit: { opacity: 0, scale: 0.9, transition: transition.fast },
};

/* -------------------------------------------------------------------------- */
/*  Stagger                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Parent that sequences its children. It animates nothing itself — the
 * `visible` variant exists only to carry the timing.
 */
export function staggerContainer(
  staggerChildren: number = STAGGER.normal,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
    exit: {
      transition: { staggerChildren: STAGGER.tight, staggerDirection: -1 },
    },
  };
}

/** Child of a `staggerContainer`. Inherits its delay from the parent. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: DISTANCE.sm },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: ease.outExpo },
  },
  exit: { opacity: 0, y: DISTANCE.xs, transition: transition.fast },
};

/* -------------------------------------------------------------------------- */
/*  Text reveal                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Mask-and-rise reveal, applied per word or per character.
 *
 * The child translates inside a parent with `overflow: hidden`, which reads as
 * type rising out of the baseline rather than sliding over it.
 */
export const textRevealContainer = (
  stagger: number = STAGGER.word,
  delay = 0,
): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const textRevealChild: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: DURATION.slower, ease: ease.outExpo },
  },
};

/** Simple per-character fade, for smaller type where masking is too heavy. */
export const characterFade: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: ease.outQuint },
  },
};

/* -------------------------------------------------------------------------- */
/*  Media reveal                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Clip-path wipe paired with a counter-scale on the inner image, so the frame
 * opens while the picture settles — the standard editorial image reveal.
 */
export const imageRevealFrame: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: DURATION.slowest, ease: ease.outExpo },
  },
};

export const imageRevealInner: Variants = {
  hidden: { scale: 1.18 },
  visible: {
    scale: 1,
    transition: { duration: DURATION.slowest, ease: ease.outExpo },
  },
};

/* -------------------------------------------------------------------------- */
/*  Page & route transitions                                                  */
/* -------------------------------------------------------------------------- */

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: ease.outExpo },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DURATION.fast, ease: ease.outQuad },
  },
};

/* -------------------------------------------------------------------------- */
/*  Overlays                                                                  */
/* -------------------------------------------------------------------------- */

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.base },
  exit: { opacity: 0, transition: transition.fast },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transition.springSmooth,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 8,
    transition: transition.fast,
  },
};

export function drawerVariants(side: "left" | "right" | "top" | "bottom"): Variants {
  const closed =
    side === "left"
      ? { x: "-100%" }
      : side === "right"
        ? { x: "100%" }
        : side === "top"
          ? { y: "-100%" }
          : { y: "100%" };

  return {
    hidden: closed,
    visible: { x: 0, y: 0, transition: transition.springGentle },
    exit: { ...closed, transition: { duration: DURATION.normal, ease: ease.outQuart } },
  };
}

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

export const mobileNavItem: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: ease.outExpo },
  },
  exit: { opacity: 0, x: 16, transition: transition.fast },
};

/* -------------------------------------------------------------------------- */
/*  Reduced motion                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Strips travel and scale from a variant set, keeping only opacity.
 *
 * Used by `useMotionVariants` so a single component definition serves both
 * motion preferences without branching in JSX.
 */
export function toReducedMotion(variants: Variants): Variants {
  const strip = (state: unknown) => {
    if (typeof state !== "object" || state === null) return state;
    const {
      x: _x,
      y: _y,
      scale: _scale,
      rotate: _rotate,
      clipPath: _clipPath,
      ...rest
    } = state as Record<string, unknown>;
    return { ...rest, transition: { duration: DURATION.fast } };
  };

  return Object.fromEntries(
    Object.entries(variants).map(([key, value]) => [key, strip(value)]),
  ) as Variants;
}
