import { getLenisInstance } from "@/lib/lenis-store";
import { isBrowser, prefersReducedMotion } from "@/utils/dom";

/**
 * Scroll control.
 *
 * Every function routes through the active Lenis instance when one exists, so programmatic
 * scrolling shares the same easing as wheel scrolling. Without Lenis — touch devices, reduced
 * motion — they degrade to the native API.
 *
 * The instance comes from `lib/lenis-store`, a module-scoped singleton written by `LenisProvider`.
 * These functions are called from event handlers and from the command palette, so they cannot use a
 * React context.
 */

export interface ScrollToOptions {
  /** Extra pixels of clearance above the target. Defaults to the header height. */
  offset?: number;
  /** Seconds. Ignored by the native fallback. */
  duration?: number;
  immediate?: boolean;
}

function getHeaderOffset(): number {
  if (!isBrowser) return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-height",
  );
  const parsed = Number.parseFloat(raw);
  if (Number.isNaN(parsed)) return 0;
  // The token is authored in `rem`.
  const rootFontSize = Number.parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  return parsed * (Number.isNaN(rootFontSize) ? 16 : rootFontSize);
}

export function scrollToTop(options: ScrollToOptions = {}): void {
  if (!isBrowser) return;
  const immediate = options.immediate ?? prefersReducedMotion();

  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(0, { immediate, duration: options.duration });
    return;
  }
  window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

export function scrollToElement(
  target: string | HTMLElement,
  options: ScrollToOptions = {},
): void {
  if (!isBrowser) return;

  const element =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(
          target.startsWith("#") ? target : `#${target}`,
        )
      : target;

  if (!element) return;

  const immediate = options.immediate ?? prefersReducedMotion();
  const offset = -(options.offset ?? getHeaderOffset() + 24);

  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(element, {
      offset,
      immediate,
      duration: options.duration,
    });
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
}

/** Freezes scrolling — used while a modal or drawer owns the viewport. */
export function stopScroll(): void {
  if (!isBrowser) return;
  getLenisInstance()?.stop();
}

export function startScroll(): void {
  if (!isBrowser) return;
  getLenisInstance()?.start();
}

/** 0–1 progress through the document. Returns 0 when there is nothing to scroll. */
export function getScrollProgress(): number {
  if (!isBrowser) return 0;
  const scrollable =
    document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}
