import type { LucideIcon } from "lucide-react";

/** Broad buckets the AI assistant and the project filter both query by. */
export type ProjectDomain =
  | "java"
  | "spring"
  | "ai"
  | "mern"
  | "backend"
  | "frontend"
  | "commerce";

export type ProjectStatus = "shipped" | "active" | "prototype";

export interface ProjectLink {
  label: string;
  href: string;
  kind: "repo" | "live" | "case-study" | "docs";
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  /** One line. Shown in cards, chat results and search. */
  tagline: string;
  /** Two or three sentences. Shown on the card back and in the assistant. */
  summary: string;
  /** Buckets this project answers for, e.g. "Show Java projects". */
  domains: readonly ProjectDomain[];
  /** Technology names, matched against `data/skills.ts` where they overlap. */
  stack: readonly string[];
  /** What was actually hard. The part that makes a project worth reading about. */
  highlights: readonly string[];
  status: ProjectStatus;
  /** Year or range, e.g. "2025". */
  period: string;
  links: readonly ProjectLink[];
  icon: LucideIcon;
  /** Promotes the project to the home preview and the assistant's default set. */
  featured?: boolean;
}
