import type { LucideIcon } from "lucide-react";

/** A counted claim rendered in the statistics band. */
export interface Stat {
  id: string;
  /** The number to count up to. Formatting is decided at render time. */
  value: number;
  /** Appended after the formatted number, e.g. `+`. */
  suffix?: string;
  label: string;
  /** One line of context, shown beneath the label. */
  detail: string;
  icon: LucideIcon;
  /** Renders the value with `Intl` compact notation (100000 → 100K). */
  compact?: boolean;
}

/** One rotating role in the hero. */
export interface Role {
  id: string;
  label: string;
}

/** A card in the About story column. */
export interface StoryCard {
  id: string;
  /** Short mono label above the title. */
  kicker: string;
  title: string;
  body: string;
  icon: LucideIcon;
}

/** A capability tile in the About highlight grid. */
export interface Highlight {
  id: string;
  title: string;
  body: string;
  icon: LucideIcon;
}

/** One node on the About journey timeline. */
export interface JourneyEntry {
  id: string;
  /** Year or period, rendered as the timeline's left rail label. */
  period: string;
  title: string;
  body: string;
  icon: LucideIcon;
  /** Marks the present-day node, which gets a live indicator. */
  current?: boolean;
}

export type ExperienceKind = "work" | "education";

/** A professional or educational position. */
export interface ExperienceEntry {
  id: string;
  kind: ExperienceKind;
  company: string;
  /** Two or three letters for the monogram tile. */
  monogram: string;
  role: string;
  /** Human-readable range, e.g. "2024 — Present". */
  period: string;
  location: string;
  /** One sentence framing the position. */
  summary: string;
  responsibilities: readonly string[];
  achievements: readonly string[];
  /** Technology names, matched against `data/skills.ts` where possible. */
  technologies: readonly string[];
  current?: boolean;
  icon: LucideIcon;
}
