import type { LucideIcon } from "lucide-react";

/**
 * Qualitative depth instead of a percentage.
 *
 * A progress bar claiming "Java 87%" is unverifiable and reads as filler. Three
 * honest bands communicate more and can actually be defended in an interview.
 */
export type Proficiency = "core" | "working" | "exploring";

export interface Technology {
  id: string;
  name: string;
  /** One line on what it is actually used for here. Never generic marketing copy. */
  description: string;
  proficiency: Proficiency;
}

export interface SkillCategory {
  id: string;
  label: string;
  /** Sentence shown beside the tab list once the category is active. */
  summary: string;
  icon: LucideIcon;
  technologies: readonly Technology[];
}

/** Presentation metadata for a proficiency band. Values live in `data/skills.ts`. */
export interface ProficiencyMeta {
  label: string;
  /** Filled indicators out of three. */
  dots: number;
  description: string;
}
