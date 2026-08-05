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

/** Coarse pointer, i.e. touch. The gate for hover-only affordances. */
export function isTouchDevice(): boolean {
  if (!isBrowser) return false;
  return matchesMedia(MEDIA_QUERIES.coarsePointer) || navigator.maxTouchPoints > 0;
}

export function supportsHover(): boolean {
  return matchesMedia(MEDIA_QUERIES.hoverCapable);
}

/* A `getPerformanceTier()` probe lived here to size particle counts and decide
   whether the WebGL backdrop mounted. Both are gone, and a capability tier with
   no consumer is just a guess waiting to be trusted, so the probe went with them. */

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
