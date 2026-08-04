import { EASING, type EasingToken } from "@/config/animations";

/** Framer Motion's cubic-bézier shape: four mutable control points. */
export type Bezier = [number, number, number, number];

/**
 * Converts a config easing into the tuple Framer Motion expects.
 *
 * The config declares its curves `as const` (readonly), which is right for a
 * configuration object but not assignable to Motion's mutable tuple, so this
 * copies rather than casts.
 */
function bezier(token: EasingToken): Bezier {
  const [a, b, c, d] = EASING[token];
  return [a, b, c, d];
}

export const ease = {
  outQuad: bezier("outQuad"),
  outQuart: bezier("outQuart"),
  outQuint: bezier("outQuint"),
  outExpo: bezier("outExpo"),
  inOutQuart: bezier("inOutQuart"),
  outBack: bezier("outBack"),
  spring: bezier("spring"),
} as const satisfies Record<EasingToken, Bezier>;

/** `cubic-bezier(...)` string, for the rare inline CSS transition in JS. */
export function toCssEasing(token: EasingToken): string {
  return `cubic-bezier(${EASING[token].join(", ")})`;
}
