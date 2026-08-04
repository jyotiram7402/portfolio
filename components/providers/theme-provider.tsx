"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

import { themeConfig } from "@/config/theme";

export interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme wrapper.
 *
 * `next-themes` writes the resolved class onto `<html>` from a blocking inline
 * script, before first paint. That is the only way to avoid a flash of the wrong
 * theme, and it is why `<html>` carries `suppressHydrationWarning` in the root
 * layout — the class legitimately differs between the server render and the
 * hydrated DOM.
 *
 * All behaviour comes from `config/theme.ts` so the storage key, default and
 * available themes are declared in one place.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={themeConfig.attribute}
      defaultTheme={themeConfig.defaultTheme}
      enableSystem={themeConfig.enableSystem}
      storageKey={themeConfig.storageKey}
      themes={[...themeConfig.themes]}
      disableTransitionOnChange={themeConfig.disableTransitionOnChange}
    >
      {children}
    </NextThemesProvider>
  );
}
