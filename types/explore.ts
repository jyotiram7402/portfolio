import type { LucideIcon } from "lucide-react";

/**
 * Types for the exploratory sections: roadmap, achievements, resources, speaking.
 *
 * Grouped in one module because they share a shape — a labelled, iconed,
 * status-bearing entry — and splitting four near-identical files across the type
 * layer would obscure that rather than clarify it.
 */

/* -------------------------------------------------------------------------- */
/*  Learning roadmap                                                          */
/* -------------------------------------------------------------------------- */

export type RoadmapStatus = "completed" | "learning" | "planned";

export interface RoadmapNode {
  id: string;
  label: string;
  /** What "done" means for this node. Shown when the node is expanded. */
  detail: string;
  status: RoadmapStatus;
  /** Concrete sub-steps. The expandable content. */
  milestones: readonly string[];
  /** Technology names that back this node up, matched to `data/skills.ts`. */
  stack?: readonly string[];
  icon: LucideIcon;
}

export interface RoadmapTrack {
  id: string;
  label: string;
  summary: string;
  icon: LucideIcon;
  nodes: readonly RoadmapNode[];
}

/* -------------------------------------------------------------------------- */
/*  Achievements                                                              */
/* -------------------------------------------------------------------------- */

export type AchievementKind =
  | "certificate"
  | "course"
  | "work"
  | "open-source"
  | "hackathon"
  | "speaking"
  | "college";

export interface Achievement {
  id: string;
  title: string;
  /** Awarding body, employer, or event. */
  issuer: string;
  /** Year, or a short range. */
  period: string;
  kind: AchievementKind;
  description: string;
  /** Verification or write-up link, when one exists. */
  href?: string;
  icon: LucideIcon;
}

/* -------------------------------------------------------------------------- */
/*  Resources                                                                 */
/* -------------------------------------------------------------------------- */

export interface Resource {
  id: string;
  name: string;
  /** Why it earns a place on the list. Never a description of what it is. */
  note: string;
  href: string;
  /** Author, publisher or vendor. */
  by?: string;
}

export interface ResourceGroup {
  id: string;
  label: string;
  summary: string;
  icon: LucideIcon;
  items: readonly Resource[];
}

/* -------------------------------------------------------------------------- */
/*  Speaking                                                                  */
/* -------------------------------------------------------------------------- */

export type TalkKind = "talk" | "workshop" | "podcast" | "video" | "demo";

export interface Talk {
  id: string;
  title: string;
  /** Conference, meetup, channel or show. */
  venue: string;
  /** Human-readable date or "Upcoming". */
  date: string;
  kind: TalkKind;
  abstract: string;
  href?: string;
  /** Renders the "upcoming" treatment instead of a recording link. */
  upcoming?: boolean;
}
