import { MEDIA_QUERIES } from "@/constants/breakpoints";
import type { Coordinates } from "@/types/common";

/**
 * Environment probes.
 *
 * Every function here is safe to call during SSR: they short-circuit to a
 * conservative value rather than touching `window`.
 */

export const isBrowser = typeof window !== "undefined";

export function matchesMedia(query: string): boolean {
  if (!isBrowser) return false;
  return window.matchMedia(query).matches;
}

export function prefersReducedMotion(): boolean {
  return matchesMedia(MEDIA_QUERIES.reducedMotion);
}

/** Coarse pointer, i.e. touch. The gate for the cursor and magnetic effects. */
export function isTouchDevice(): boolean {
  if (!isBrowser) return false;
  return matchesMedia(MEDIA_QUERIES.coarsePointer) || navigator.maxTouchPoints > 0;
}

export function supportsHover(): boolean {
  return matchesMedia(MEDIA_QUERIES.hoverCapable);
}

/**
 * Coarse device-capability tier, used to decide particle counts and whether the
 * WebGL layer mounts at all. Deliberately pessimistic when it cannot tell.
 */
export function getPerformanceTier(): "low" | "medium" | "high" {
  if (!isBrowser) return "low";
  if (prefersReducedMotion() || matchesMedia(MEDIA_QUERIES.reducedData)) {
    return "low";
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  // Non-standard but widely available; absence is not a signal either way.
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  if (cores <= 4 || (memory !== undefined && memory <= 4)) return "low";
  if (cores <= 8) return "medium";
  return "high";
}

/** Viewport-space centre of an element. */
export function getElementCenter(element: Element): Coordinates {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/** Pointer offset from an element's centre, in pixels. */
export function getOffsetFromCenter(
  element: Element,
  pointer: Coordinates,
): Coordinates {
  const center = getElementCenter(element);
  return { x: pointer.x - center.x, y: pointer.y - center.y };
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Focusable descendants in tab order — the basis of focus trapping in the
 * modal and drawer.
 */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => element.offsetParent !== null);
}
