import { STORAGE_KEYS } from "@/constants/storage-keys";
import type { ResolvedTheme, ThemeMode } from "@/types/theme";

/**
 * Theme behaviour, and the palette in a form JavaScript can read.
 *
 * CSS gets its colours from `styles/themes.css`. This file exists for the two
 * consumers that cannot read a custom property: the OG image renderer (Satori
 * has no CSS variable support) and `<meta name="theme-color">`.
 *
 * `styles/themes.css` is the source; this is the mirror. Where the stylesheet
 * uses an alpha over the background — the borders — this file carries the
 * flattened hex, because neither consumer composites.
 */

export const themeConfig = {
  attribute: "class",
  defaultTheme: "dark",
  enableSystem: true,
  storageKey: STORAGE_KEYS.theme,
  themes: ["dark", "light", "system"],
  /** Suppresses the CSS transition flash while the theme class swaps. */
  disableTransitionOnChange: true,
} as const satisfies {
  attribute: "class";
  defaultTheme: ThemeMode;
  enableSystem: boolean;
  storageKey: string;
  themes: readonly ThemeMode[];
  disableTransitionOnChange: boolean;
};

/** Order used by the theme toggle's cycle action. */
export const THEME_CYCLE: readonly ThemeMode[] = ["dark", "light", "system"];

export const palette = {
  dark: {
    background: "#000000",
    surface: "#0a0a0a",
    card: "#141416",
    foreground: "#f5f5f7",
    muted: "#a1a1a6",
    border: "#1a1a1a",
    primary: "#2997ff",
    secondary: "#a1a1a6",
    accent: "#2997ff",
    success: "#30d158",
    warning: "#ffd60a",
    danger: "#ff453a",
  },
  light: {
    background: "#ffffff",
    surface: "#f5f5f7",
    card: "#ffffff",
    foreground: "#1d1d1f",
    muted: "#6e6e73",
    border: "#e5e5e5",
    primary: "#0071e3",
    secondary: "#6e6e73",
    accent: "#0071e3",
    success: "#1d8f3a",
    warning: "#9a6700",
    danger: "#d70015",
  },
} as const satisfies Record<ResolvedTheme, Record<string, string>>;

export type Palette = (typeof palette)[ResolvedTheme];

/** Browser chrome colour per theme, consumed by the metadata API. */
export const themeColors = [
  { media: "(prefers-color-scheme: dark)", color: palette.dark.background },
  { media: "(prefers-color-scheme: light)", color: palette.light.background },
] as const;
