/**
 * Breakpoints in pixels, mirroring the `--breakpoint-*` tokens.
 *
 * CSS should always use the Tailwind variants (`md:`, `3xl:`). These values
 * exist for the handful of cases that must be decided in JS — matchMedia
 * hooks, and the mobile checks that pick a drawer side or disable Lenis.
 */
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
  "4xl": 2560,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** `(min-width: 768px)` */
export function minWidth(breakpoint: Breakpoint): string {
  return `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
}

/** `(max-width: 767.98px)` — exclusive upper bound, so it never overlaps `minWidth`. */
export function maxWidth(breakpoint: Breakpoint): string {
  return `(max-width: ${BREAKPOINTS[breakpoint] - 0.02}px)`;
}

export const MEDIA_QUERIES = {
  /** Anything narrower than `lg` is treated as mobile for interaction purposes. */
  mobile: maxWidth("lg"),
  tablet: `${minWidth("md")} and ${maxWidth("lg")}`,
  desktop: minWidth("lg"),
  ultrawide: minWidth("3xl"),
  /** A real pointer — the gate for magnetic hovers, tilt and the card spotlight. */
  finePointer: "(pointer: fine)",
  coarsePointer: "(pointer: coarse)",
  hoverCapable: "(hover: hover)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  prefersDark: "(prefers-color-scheme: dark)",
  /** Chromium exposes this on metered / low-power connections. */
  reducedData: "(prefers-reduced-data: reduce)",
} as const;
