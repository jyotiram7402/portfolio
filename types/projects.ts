/**
 * Broad buckets the AI assistant, the project filter and the domain inference all query by.
 */
/**
 * Ordered by hiring priority: Java and Spring first, then the backend disciplines, then AI, then
 * the JavaScript stack. The filter renders them in this order too.
 */
export type ProjectDomain =
  | "java"
  | "spring"
  | "microservices"
  | "backend"
  | "ai"
  | "fullstack"
  | "mern";

export type ProjectStatus = "shipped" | "active" | "prototype";

export interface ProjectLink {
  label: string;
  href: string;
  kind: "repo" | "live" | "case-study" | "docs";
}

/**
 * Where an entry came from.
 *
 * `github` was discovered from the API; `curated` is hand-written in `data/projects.ts` for work
 * that has no public repository — client projects, mostly. `merged` is a discovered repo that also
 * has an override, which is the best case: live figures plus a written story.
 */
export type ProjectSource = "github" | "curated" | "merged";

/**
 * The long-form blocks on `/projects/[slug]`.
 *
 * Every field is optional and every block renders only when present. That is deliberate:
 * a case study is written, not generated, and a "Challenges" heading above an empty div
 * is worse than no heading. A project with none of this still gets a complete page from
 * `summary`, `highlights`, `stack` and its live GitHub figures.
 */
export interface ProjectCaseStudy {
  /** The situation before the work existed. */
  problem?: string;
  /** What was built, and the shape of the approach. */
  solution?: string;
  /** What it does, as short phrases. Not a feature matrix. */
  features?: readonly string[];
  /** How it is put together. Prose, because a diagram per project is not maintainable. */
  architecture?: string;
  /** What went wrong and what it cost to fix. The most-read section on any case study. */
  challenges?: readonly string[];
  /** What would be done differently. Honest, not humble-bragging. */
  lessons?: readonly string[];
  /** Known next steps. Absent means "no plans", which is a legitimate answer. */
  future?: readonly string[];
}

export interface Project {
  /** Repository name for discovered entries, a hand-chosen id for curated ones. */
  id: string;
  slug: string;
  name: string;
  /** One line. Shown in cards, chat results and search. */
  tagline: string;
  /** Two or three sentences. Shown on featured cards and in the assistant. */
  summary: string;
  /**
   * Cover image, served from `/public/projects/`.
   *
   * Leave it **undefined** unless the file actually exists — `ProjectCover` renders a
   * generated visual in that case, and a path to a missing file renders a broken image
   * instead. Undefined is the safe default, not a missing feature.
   */
  image?: string;
  /**
   * Homepage ordering. Lower comes first; entries without one sort after those with one.
   *
   * Separate from `featured` on purpose. `featured` says "this is good enough for the
   * homepage", which discovery can infer from stars. `order` says "this is the one I want
   * read first", which only a human can decide.
   */
  order?: number;
  /** Long-form content for the detail page. Absent for most entries. */
  caseStudy?: ProjectCaseStudy;
  /** Buckets this project answers for, e.g. "Show Java projects". */
  domains: readonly ProjectDomain[];
  /** Technology names, matched against `data/skills.ts` where they overlap. */
  stack: readonly string[];
  /** What was actually hard. The part an API cannot know, so it comes from an override. */
  highlights: readonly string[];
  status: ProjectStatus;
  /** Year or range, e.g. "2025". Derived from repo dates when discovered. */
  period: string;
  links: readonly ProjectLink[];
  /** Promotes the project to the top of the grid and the assistant's default set. */
  featured?: boolean;

  source: ProjectSource;

  /* --- Live figures. Present only on discovered entries. ------------------ */
  stars?: number;
  forks?: number;
  language?: string | null;
  /** ISO-8601 of the last push. Drives the "updated" line and the default sort. */
  updatedAt?: string;
  topics?: readonly string[];
}

/**
 * Note the absence of an `icon` field.
 *
 * Icons are Lucide components, and a component cannot cross a server-to-client boundary as a prop.
 * Since discovered projects are fetched on the server and rendered by a client grid, the icon is
 * derived from `domains` at render time instead — see `lib/project-icon.ts`.
 */

/** Per-repository curation. Everything is optional; anything absent falls back to the API. */
export interface ProjectOverride {
  /** Must match the GitHub repository name exactly, case-insensitively. */
  repo: string;
  name?: string;
  tagline?: string;
  summary?: string;
  domains?: readonly ProjectDomain[];
  /** Replaces the inferred stack rather than adding to it. */
  stack?: readonly string[];
  highlights?: readonly string[];
  status?: ProjectStatus;
  featured?: boolean;
  /** Homepage ordering. See `Project.order`. */
  order?: number;
  /** Cover image path. See `Project.image` — only set it if the file exists. */
  image?: string;
  caseStudy?: ProjectCaseStudy;
  /** Extra links beyond the repository itself — a live URL, a case study. */
  links?: readonly ProjectLink[];
  /** Keeps a repository out of the grid without untagging it on GitHub. */
  hidden?: boolean;
}
