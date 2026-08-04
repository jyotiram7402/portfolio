"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useCallback } from "react";

import { useMounted } from "@/hooks/use-mounted";
import type { ResolvedTheme, ThemeMode, ThemeState } from "@/types/theme";
import { getNextTheme, getOppositeTheme } from "@/utils/theme";

/**
 * Typed wrapper over `next-themes`.
 *
 * Adds three things the raw hook lacks: a narrowed `ThemeMode` union instead of
 * `string | undefined`, an `isReady` flag so consumers never render a theme
 * before hydration, and the toggle/cycle actions the UI actually needs.
 */
export function useTheme(): ThemeState {
  const { theme, resolvedTheme, systemTheme, setTheme } = useNextTheme();
  const isReady = useMounted();

  const mode = (theme ?? "dark") as ThemeMode;
  const resolved = (resolvedTheme ?? "dark") as ResolvedTheme;
  const system = (systemTheme ?? "dark") as ResolvedTheme;

  const set = useCallback(
    (next: ThemeMode) => {
      setTheme(next);
    },
    [setTheme],
  );

  /** Binary flip against what is currently painted. */
  const toggleTheme = useCallback(() => {
    setTheme(getOppositeTheme(resolved));
  }, [resolved, setTheme]);

  /** dark → light → system → dark. */
  const cycleTheme = useCallback(() => {
    setTheme(getNextTheme(mode));
  }, [mode, setTheme]);

  return {
    theme: mode,
    resolvedTheme: resolved,
    systemTheme: system,
    isDark: resolved === "dark",
    isReady,
    setTheme: set,
    toggleTheme,
    cycleTheme,
  };
}
