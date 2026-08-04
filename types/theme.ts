/** What the user chose. `system` defers to the OS. */
export type ThemeMode = "dark" | "light" | "system";

/** What is actually painted. Never `system`. */
export type ResolvedTheme = Exclude<ThemeMode, "system">;

export interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
  isDark: boolean;
  /** False until the client has hydrated — guard theme-dependent renders with it. */
  isReady: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  cycleTheme: () => void;
}
