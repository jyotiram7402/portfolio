import type { LucideIcon } from "lucide-react";

/**
 * Types for the two hiring surfaces: the résumé centre and the recruiter dashboard.
 *
 * Grouped in one module because they answer the same question from two directions — "can I
 * work with this person, and how soon" — and splitting them would separate types that are
 * always read together.
 */

/* -------------------------------------------------------------------------- */
/*  Résumé centre                                                             */
/* -------------------------------------------------------------------------- */

export type ResumeVariantId = "backend" | "full-stack" | "ai";

export interface ResumeVariant {
  id: ResumeVariantId;
  label: string;
  /** One sentence on who this version is aimed at. */
  positioning: string;
  /** What is emphasised, in the order it appears on the document. */
  emphasis: readonly string[];
  /** Technology names pulled forward for this audience. */
  headlineStack: readonly string[];
  /**
   * Paths under `public/resume/`. Absent means the file has not been committed yet, and the
   * UI says so rather than offering a download that 404s.
   */
  files?: {
    pdf?: string;
    docx?: string;
  };
  icon: LucideIcon;
}

/** One entry in the résumé's revision history. */
export interface ResumeRevision {
  version: string;
  /** ISO-8601. */
  date: string;
  summary: string;
  /** Which variants this revision touched. */
  variants: readonly ResumeVariantId[];
}

/**
 * One ATS readiness check.
 *
 * Deliberately a checklist rather than a score out of 100. A single number would be
 * unsourceable — no public ATS publishes its rubric — while a list of properties a parser
 * actually depends on is verifiable by opening the file.
 */
export interface AtsCheck {
  id: string;
  label: string;
  detail: string;
  status: "pass" | "partial" | "todo";
}

/* -------------------------------------------------------------------------- */
/*  Recruiter dashboard                                                       */
/* -------------------------------------------------------------------------- */

export type AvailabilityState = "open" | "selective" | "closed";

/** A single figure on the recruiter summary grid. */
export interface RecruiterFact {
  id: string;
  label: string;
  value: string;
  /** One line of context. Prevents a bare number from being read wrongly. */
  detail: string;
  icon: LucideIcon;
  /** Renders the value in the brand gradient — reserve for one or two. */
  emphasis?: boolean;
}

export interface RoleTarget {
  title: string;
  /** Why this role is a fit, in the candidate's own words. */
  rationale: string;
  /** Seniority band being targeted, stated honestly. */
  level: string;
}

export interface HiringProfile {
  availability: AvailabilityState;
  availabilityLabel: string;
  noticePeriod: string;
  location: string;
  /** On-site, hybrid, remote — and which is preferred. */
  workPreference: string;
  /** Time zones with meaningful overlap for synchronous work. */
  timezoneOverlap: string;
  /** Typical time to a first reply. */
  responseTime: string;
  preferredRoles: readonly RoleTarget[];
  /** Deal-breakers and preferences, stated up front to save everyone time. */
  notes: readonly string[];
}
