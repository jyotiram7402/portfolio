import { STORAGE_KEYS } from "@/constants/storage-keys";
import type { ResolvedTheme, ThemeMode } from "@/types/theme";

/**
 * Theme behaviour, and the palette in a form JavaScript can read.
 *
 * CSS gets its colours from `styles/themes.css`. This file exists for the
 * consumers that cannot read a custom property: three.js materials, the OG
 * image renderer (Satori has no CSS variable support) and `<meta name="theme-color">`.
 * The two must stay in sync — treat this as the mirror, not the source.
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
    background: "#030712",
    surface: "#0F172A",
    card: "#111827",
    foreground: "#FFFFFF",
    muted: "#94A3B8",
    border: "#1E293B",
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    accent: "#06B6D4",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  light: {
    background: "#FFFFFF",
    surface: "#F8FAFC",
    card: "#FFFFFF",
    foreground: "#030712",
    muted: "#475569",
    border: "#E2E8F0",
    primary: "#2563EB",
    secondary: "#7C3AED",
    accent: "#0891B2",
    success: "#059669",
    warning: "#B45309",
    danger: "#DC2626",
  },
} as const satisfies Record<ResolvedTheme, Record<string, string>>;

export type Palette = (typeof palette)[ResolvedTheme];

/** Browser chrome colour per theme, consumed by the metadata API. */
export const themeColors = [
  { media: "(prefers-color-scheme: dark)", color: palette.dark.background },
  { media: "(prefers-color-scheme: light)", color: palette.light.background },
] as const;
