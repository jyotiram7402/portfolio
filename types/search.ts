import type { LucideIcon } from "lucide-react";

/**
 * Global search and command palette.
 *
 * One index serves both: the palette is the index plus commands, and the blog
 * filter is the index narrowed to one kind. A second index would be a second
 * thing to keep in sync.
 */

export type SearchKind =
  | "page"
  | "section"
  | "project"
  | "post"
  | "skill"
  | "experience"
  | "achievement"
  | "resource";

export interface SearchDocument {
  id: string;
  kind: SearchKind;
  title: string;
  /** One line of context, shown beneath the title. */
  description: string;
  /** Where selecting the result navigates to. */
  href: string;
  /** Extra terms to match against that are not in the title or description. */
  keywords: readonly string[];
  icon: LucideIcon;
}

export interface SearchResult {
  document: SearchDocument;
  /** 0–1. Higher is a better match. */
  score: number;
  /** Character indices in the title that matched, for highlighting. */
  matches: readonly number[];
}

/** An action rather than a destination — theme toggle, copy link, clear chat. */
export interface CommandItem {
  id: string;
  title: string;
  description: string;
  keywords: readonly string[];
  icon: LucideIcon;
  /** Displayed shortcut hint, e.g. `["⌘", "K"]`. Purely informational. */
  shortcut?: readonly string[];
  run: () => void;
}

export interface CommandGroup {
  id: string;
  label: string;
}
