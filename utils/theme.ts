import { THEME_CYCLE, palette } from "@/config/theme";
import type { Palette } from "@/config/theme";
import type { ResolvedTheme, ThemeMode } from "@/types/theme";

/** JS-readable palette for the given theme. */
export function getPalette(theme: ResolvedTheme): Palette {
  return palette[theme];
}

export function isDarkTheme(theme: ThemeMode, systemTheme: ResolvedTheme): boolean {
  return theme === "system" ? systemTheme === "dark" : theme === "dark";
}

/** Next entry in the dark → light → system cycle. */
export function getNextTheme(current: ThemeMode): ThemeMode {
  const index = THEME_CYCLE.indexOf(current);
  return THEME_CYCLE[(index + 1) % THEME_CYCLE.length] ?? "dark";
}

/** Binary flip, ignoring `system`. Used by the two-state toggle. */
export function getOppositeTheme(resolved: ResolvedTheme): ResolvedTheme {
  return resolved === "dark" ? "light" : "dark";
}

/**
 * Reads a live CSS custom property.
 *
 * Prefer this over the static `palette` object whenever the value is needed at
 * runtime and might have been themed, because it reflects what is painted.
 */
export function readCssVariable(name: string, fallback = ""): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value.length > 0 ? value : fallback;
}
