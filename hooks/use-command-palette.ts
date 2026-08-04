"use client";

import { useContext } from "react";

import {
  type CommandPaletteApi,
  CommandPaletteContext,
} from "@/components/providers/command-palette-context";

/**
 * Access to the global command palette.
 *
 * Safe to call anywhere — outside the provider it returns an inert API rather than
 * throwing, so a search button in a footer that is rendered in isolation degrades to
 * doing nothing instead of breaking the page.
 */
export function useCommandPalette(): CommandPaletteApi {
  return useContext(CommandPaletteContext);
}
