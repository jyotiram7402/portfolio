import { Braces, Brain, Layers } from "lucide-react";

import { currentExperience, experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { allTechnologies, skillCategories } from "@/data/skills";
import type { AtsCheck, ResumeRevision, ResumeVariant } from "@/types/hiring";

/**
 * The résumé centre's content.
 *
 * Three variants of the same history, each ordered for a different reader — and ordered here by
 * priority, so Backend is the default a recruiter lands on.
 *
 * `files` is absent on all three because no PDF is committed yet. The UI reads that and offers the
 * on-page preview plus an email route rather than a download that 404s. Committing
 * `public/resume/backend.pdf` and adding the path here is the whole activation step.
 */
export const resumeVariants: readonly ResumeVariant[] = [
  {
    id: "backend",
    label: "Java Backend",
    positioning:
      "The default, and the one to send for Java and Spring Boot roles. Leads with Core Java, the Spring ecosystem, payments and event-driven design.",
    emphasis: [
      "Core Java — Collections, Streams, Optional, concurrency, JVM and GC",
      "Spring Boot, Spring MVC, Spring Security with JWT and OAuth2, Hibernate and JPA",
      "Three payment gateways owned end to end, including webhooks, retries and failure paths",
      "Microservices over REST and Apache Kafka event streams",
      "MySQL and PostgreSQL schema design, index strategy and query plans",
    ],
    headlineStack: [
      "Java 8/17",
      "Spring Boot",
      "Spring Security",
      "Hibernate / JPA",
      "REST API",
      "Apache Kafka",
      "MySQL",
      "Redis",
      "Docker",
    ],
    icon: Braces,
  },
  {
    id: "full-stack",
    label: "Java Full Stack",
    positioning:
      "For teams where the same person ships the endpoint and the interface. Backend first, front end credible — not the other way round.",
    emphasis: [
      "Spring Boot services with a documented REST contract at the boundary",
      "React frontends against Spring Boot and MongoDB, deliberately loosely coupled",
      "End-to-end feature ownership on a live enterprise platform",
      "Next.js, TypeScript and Tailwind — this portfolio is the working example",
      "Docker and CI/CD delivery with environment parity between staging and production",
    ],
    headlineStack: [
      "Java",
      "Spring Boot",
      "React",
      "TypeScript",
      "Next.js",
      "MongoDB",
      "MySQL",
      "REST API",
      "Docker",
    ],
    icon: Layers,
  },
  {
    id: "ai",
    label: "AI Engineering",
    positioning:
      "For teams putting models into production. Leads with the AI board role, the secure tooling work and the search service that shipped.",
    emphasis: [
      "Board member of the AI team at Southco, leading the AI-first development approach",
      "Secure agentic AI — the isolation risk found, and the DevContainer adopted by 20 developers",
      "Claude Code and MCP in daily production use, presented to the CTO",
      "AI-powered search on OpenSearch, in production within one month with zero defects",
      "Java and Spring Boot services behind the model, not notebooks in front of it",
    ],
    headlineStack: [
      "Claude Code",
      "MCP",
      "Prompt Engineering",
      "LLM APIs",
      "OpenSearch",
      "Python",
      "FastAPI",
      "Docker",
      "Java",
    ],
    icon: Brain,
  },
];

export const DEFAULT_RESUME_VARIANT = resumeVariants[0]?.id ?? "backend";

export function getResumeVariant(id: string): ResumeVariant | undefined {
  return resumeVariants.find((variant) => variant.id === id);
}

/**
 * Revision history, newest first.
 *
 * Published because a résumé with a visible changelog is one someone believes is current — and
 * because it commits me to keeping it so.
 */
export const resumeRevisions: readonly ResumeRevision[] = [
  {
    version: "2026.3",
    date: "2026-08-05",
    summary:
      "Repositioned for Java backend roles. Promoted the AI board role and the DevContainer adoption; removed platform-specific commerce framing.",
    variants: ["backend", "full-stack", "ai"],
  },
  {
    version: "2026.2",
    date: "2026-05-20",
    summary:
      "Added the AI-powered search service and the Cable Part Number Configurator. Removed every unsourceable percentage.",
    variants: ["backend", "ai"],
  },
  {
    version: "2026.1",
    date: "2026-02-11",
    summary:
      "Split into three audience-specific variants and trimmed each to one page.",
    variants: ["backend", "full-stack", "ai"],
  },
];

/**
 * ATS readiness, as a checklist rather than a score.
 *
 * A single number out of 100 would be unsourceable — no applicant tracking system publishes its
 * rubric — while each of these is a property of the file anyone can verify by opening it. That is
 * the difference between a claim and a demonstration.
 */
export const atsChecks: readonly AtsCheck[] = [
  {
    id: "single-column",
    label: "Single-column layout",
    detail:
      "No text boxes, no side columns. Multi-column PDFs are the most common reason a parser reads a résumé out of order.",
    status: "pass",
  },
  {
    id: "selectable-text",
    label: "Selectable text, not an image",
    detail:
      "Typeset in LaTeX and exported from source, so every word is extractable rather than scanned.",
    status: "pass",
  },
  {
    id: "standard-headings",
    label: "Standard section headings",
    detail:
      "Professional Summary, Technical Skills, Experience, Projects, Education, Certifications. Creative headings are what a parser silently skips.",
    status: "pass",
  },
  {
    id: "no-tables",
    label: "No tables or graphics for content",
    detail: "Skills are comma-separated lists, not a grid of rating bars.",
    status: "pass",
  },
  {
    id: "dates",
    label: "Unambiguous dates",
    detail: "MMM YYYY throughout, with no gaps left implicit.",
    status: "pass",
  },
  {
    id: "keywords",
    label: "Keywords match the target role",
    detail:
      "Each variant leads with the stack that role screens for — Java and Spring first on the backend version. That is the entire reason there are three.",
    status: "pass",
  },
  {
    id: "file-naming",
    label: "Predictable file naming",
    detail:
      "jyotiram-kamble-java-backend.pdf — name, then variant. Never `resume_final_v3`.",
    status: "partial",
  },
  {
    id: "docx",
    label: "DOCX alongside PDF",
    detail:
      "Some older trackers parse DOCX more reliably. Not yet exported — the PDF is the priority.",
    status: "todo",
  },
];

/* -------------------------------------------------------------------------- */
/*  Derived summaries                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Figures for the résumé preview.
 *
 * Derived from the same modules the rest of the site renders, so the preview cannot claim a different
 * project count from the projects section.
 */
export const resumeSummary = {
  role: currentExperience?.role ?? "",
  company: currentExperience?.company ?? "",
  period: currentExperience?.period ?? "",
  positions: experience.filter((entry) => entry.kind === "work").length,
  projectCount: projects.length,
  technologyCount: allTechnologies.length,
  categoryCount: skillCategories.length,
  /** Core technologies across every category, which is what a screener scans for. */
  coreStack: skillCategories
    .flatMap((category) => category.technologies)
    .filter((technology) => technology.proficiency === "core")
    .map((technology) => technology.name),
} as const;

export const atsSummary = {
  passing: atsChecks.filter((check) => check.status === "pass").length,
  total: atsChecks.length,
} as const;
