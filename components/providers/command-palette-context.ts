"use client";

import { createContext } from "react";

export interface CommandPaletteApi {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  /** Opens the palette with the query pre-filled — used by the search affordances. */
  openWith: (query: string) => void;
  /** Set once the palette has been opened, so its chunk can stay unloaded until then. */
  query: string;
  setQuery: (query: string) => void;
}

/**
 * Extracted from the provider so `useCommandPalette` can import the context without
 * importing the provider — which would create a cycle and pull the palette's chunk into
 * every consumer.
 *
 * The default is inert rather than throwing: a `Kbd` hint or a search button rendered
 * outside the provider should degrade to doing nothing, not crash the page.
 */
export const CommandPaletteContext = createContext<CommandPaletteApi>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
  openWith: () => {},
  query: "",
  setQuery: () => {},
});
