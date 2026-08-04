/** Pure numeric helpers shared by every motion hook. */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation. `t` is not clamped — callers that need that use `clamp`. */
export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/**
 * Frame-rate independent lerp.
 *
 * A raw `lerp(current, target, 0.1)` in a rAF loop moves further per second on
 * a 144 Hz display than on a 60 Hz one. Scaling by delta time fixes that, so
 * the cursor and parallax feel identical on every monitor.
 */
export function damp(
  from: number,
  to: number,
  smoothing: number,
  deltaSeconds: number,
): number {
  return lerp(from, to, 1 - Math.pow(1 - smoothing, deltaSeconds * 60));
}

/** 0–1 position of `value` within `[min, max]`, clamped. */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return outMin + normalize(value, inMin, inMax) * (outMax - outMin);
}

export function roundTo(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** True when the two numbers are within `epsilon` — used to park rAF loops. */
export function approximately(a: number, b: number, epsilon = 0.01): boolean {
  return Math.abs(a - b) < epsilon;
}

export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
