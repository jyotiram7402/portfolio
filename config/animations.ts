/**
 * Motion configuration.
 *
 * Numbers here are the vocabulary the whole site animates in. Components pick a
 * named duration and a named easing; they never invent a magic `0.42`. The
 * easing curves are byte-identical to the `--ease-*` CSS tokens so a CSS
 * transition and a Framer Motion tween on the same element cannot drift apart.
 */

export const DURATION = {
  instant: 0.09,
  fast: 0.16,
  normal: 0.28,
  slow: 0.48,
  slower: 0.72,
  slowest: 1.2,
} as const;

export type DurationToken = keyof typeof DURATION;

/** Cubic-bézier control points, in Framer Motion's array form. */
export const EASING = {
  outQuad: [0.25, 0.46, 0.45, 0.94],
  outQuart: [0.165, 0.84, 0.44, 1],
  outQuint: [0.23, 1, 0.32, 1],
  outExpo: [0.19, 1, 0.22, 1],
  inOutQuart: [0.77, 0, 0.175, 1],
  outBack: [0.34, 1.56, 0.64, 1],
  spring: [0.16, 1, 0.3, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export type EasingToken = keyof typeof EASING;

export const SPRING = {
  /** Snappy, for pointer-following UI. */
  responsive: { type: "spring", stiffness: 400, damping: 40, mass: 0.6 },
  /** Default for entrances. */
  smooth: { type: "spring", stiffness: 220, damping: 28, mass: 0.9 },
  /** Heavy, for large surfaces like the drawer. */
  gentle: { type: "spring", stiffness: 140, damping: 24, mass: 1.1 },
  /** Slight overshoot, for badges and icon buttons. */
  bouncy: { type: "spring", stiffness: 320, damping: 18, mass: 0.7 },
} as const;

export const STAGGER = {
  tight: 0.04,
  normal: 0.07,
  loose: 0.12,
  /** Per-character text reveals. */
  character: 0.018,
  word: 0.045,
} as const;

/** Travel distances in pixels for directional entrances. */
export const DISTANCE = {
  xs: 8,
  sm: 16,
  md: 28,
  lg: 48,
  xl: 80,
} as const;

export const VIEWPORT = {
  /** Fire once, when 20% of the element has entered. */
  once: { once: true, amount: 0.2 },
  /** For tall sections where 20% is still below the fold. */
  onceEarly: { once: true, amount: 0.05 },
  /** Re-animates on every pass — use sparingly. */
  repeat: { once: false, amount: 0.35 },
  /** Starts slightly before the element is visible, to hide the pop-in. */
  eager: { once: true, amount: 0.01, margin: "0px 0px -12% 0px" },
} as const;

export const LENIS_CONFIG = {
  /** Seconds to settle. Higher feels heavier; above ~1.4 feels laggy. */
  duration: 1.1,
  /** Exponential ease-out — the curve Lenis's own demos use. */
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  wheelMultiplier: 1,
  touchMultiplier: 1.6,
  /** Native scrolling on touch: smoothing there fights the OS and feels wrong. */
  smoothWheel: true,
  syncTouch: false,
  autoRaf: false,
} as const;

export const PRELOADER = {
  /** Floor on how long the loader is shown, so it never flashes. */
  minDurationMs: 900,
  /** Hard ceiling — the loader must never be able to trap the user. */
  maxDurationMs: 4000,
  exitDurationMs: 720,
} as const;

/**
 * Cursor scale factors only. The dot and ring dimensions live in the component
 * as Tailwind classes, because a size expressed twice is a size that will drift.
 */
export const CURSOR = {
  ringHoverScale: 1.7,
  ringPressScale: 0.85,
} as const;

export const MAGNETIC = {
  /** Fraction of the pointer offset the element travels. */
  strength: 0.35,
  /** Pixels of surrounding area that still counts as a hover. */
  padding: 24,
} as const;

export const TILT = {
  /** Maximum rotation in degrees at the corners. */
  maxRotation: 8,
  perspective: 1200,
  scaleOnHover: 1.015,
} as const;

export const animationConfig = {
  DURATION,
  EASING,
  SPRING,
  STAGGER,
  DISTANCE,
  VIEWPORT,
  LENIS_CONFIG,
  PRELOADER,
  CURSOR,
  MAGNETIC,
  TILT,
} as const;
