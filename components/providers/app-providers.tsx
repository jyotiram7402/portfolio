"use client";

import type { ReactNode } from "react";

import { CommandPaletteProvider } from "@/components/providers/command-palette-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Every client-side provider, in one component.
 *
 * The root layout stays a Server Component and mounts exactly one client
 * boundary. Nesting order matters: theme is outermost because everything below it
 * may read the resolved theme, and Lenis is innermost because it is the only one
 * with a per-frame cost.
 *
 * `delayDuration` on the tooltip provider is set globally so hover intent feels
 * identical everywhere rather than being re-specified per call site.
 *
 * The command palette sits innermost of the three context providers because it consumes both
 * of the others — its theme command reads the resolved theme, and its navigation commands
 * scroll through Lenis. Its own panel is behind a dynamic import, so being mounted here costs
 * nothing until ⌘K is pressed.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={280} skipDelayDuration={400}>
        <LenisProvider>
          <CommandPaletteProvider>{children}</CommandPaletteProvider>
        </LenisProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
