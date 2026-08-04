import { Braces, Brain, Layers } from "lucide-react";

import { currentExperience, experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { allTechnologies, skillCategories } from "@/data/skills";
import type { AtsCheck, ResumeRevision, ResumeVariant } from "@/types/hiring";

/**
 * The résumé centre's content.
 *
 * Three variants of the same history, each ordered for a different reader. `files` is absent on
 * all three because the PDFs are not committed yet — the UI reads that and offers the on-page
 * preview plus an email route instead of a download that 404s. Committing
 * `public/resume/backend.pdf` and adding the path here is the whole activation step.
 */
export const resumeVariants: readonly ResumeVariant[] = [
  {
    id: "backend",
    label: "Backend",
    positioning:
      "For Java and Spring Boot roles. Leads with service design, data modelling and the payment and search work.",
    emphasis: [
      "Payment gateway integration, including idempotency and reconciliation",
      "OpenSearch relevance tuning on a large catalogue",
      "Spring Boot, Security and Data JPA with an eye on generated SQL",
      "MySQL and PostgreSQL schema design, index strategy and query plans",
    ],
    headlineStack: [
      "Java",
      "Spring Boot",
      "Spring Data JPA",
      "REST API",
      "MySQL",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
    icon: Braces,
  },
  {
    id: "full-stack",
    label: "Full stack",
    positioning:
      "For product teams where the same person ships the endpoint and the interface. Backend first, front end credible.",
    emphasis: [
      "End-to-end delivery on a live commerce stack",
      "Next.js App Router, server components and Core Web Vitals discipline",
      "Magento storefront and module work under real traffic",
      "Azure delivery with containerised builds and environment parity",
    ],
    headlineStack: [
      "Java",
      "Spring Boot",
      "TypeScript",
      "Next.js",
      "React",
      "Tailwind CSS",
      "MySQL",
      "Azure",
    ],
    icon: Layers,
  },
  {
    id: "ai",
    label: "AI engineering",
    positioning:
      "For teams putting models into production. Leads with retrieval, evaluation and the parts that have to be defensible.",
    emphasis: [
      "Retrieval-augmented assistant with mandatory citations",
      "Hybrid retrieval, reranking and chunking tuned to document structure",
      "Prompts under version control with a gating evaluation set",
      "Spring Boot services behind the model, not notebooks in front of it",
    ],
    headlineStack: [
      "Java",
      "Spring Boot",
      "RAG",
      "Vector Databases",
      "OpenAI API",
      "Claude API",
      "Prompt Engineering",
      "Python-adjacent tooling",
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
 * Published because a résumé with a visible changelog is a résumé someone believes is current —
 * and because it commits me to keeping it so.
 */
export const resumeRevisions: readonly ResumeRevision[] = [
  {
    version: "2026.3",
    date: "2026-07-14",
    summary:
      "Split into three audience-specific variants. Added the retrieval assistant and the evaluation-set detail.",
    variants: ["backend", "full-stack", "ai"],
  },
  {
    version: "2026.2",
    date: "2026-04-02",
    summary:
      "Reordered the backend variant to lead with the payment integration. Removed every unsourceable percentage.",
    variants: ["backend"],
  },
  {
    version: "2026.1",
    date: "2026-01-20",
    summary:
      "Added OpenSearch relevance work and the Azure delivery pipeline. Trimmed to one page.",
    variants: ["backend", "full-stack"],
  },
];

/**
 * ATS readiness, as a checklist rather than a score.
 *
 * A single number out of 100 would be unsourceable — no applicant tracking system publishes its
 * rubric — while each of these is a property of the file that anyone can verify by opening it.
 * That is the difference between a claim and a demonstration.
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
      "Exported from the source document rather than scanned, so every word is extractable.",
    status: "pass",
  },
  {
    id: "standard-headings",
    label: "Standard section headings",
    detail:
      "Experience, Skills, Education, Projects. Creative headings are what a parser silently skips.",
    status: "pass",
  },
  {
    id: "no-tables",
    label: "No tables or graphics for content",
    detail: "Skills are a comma-separated list, not a grid of rating bars.",
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
      "Each variant leads with the stack that role screens for, which is the entire reason there are three.",
    status: "pass",
  },
  {
    id: "file-naming",
    label: "Predictable file naming",
    detail: "jyotiram-kamble-backend.pdf — name, then variant. Never `resume_final_v3`.",
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
 * Derived from the same modules the rest of the site renders, so the preview cannot claim a
 * different project count from the projects section.
 */
export const resumeSummary = {
  role: currentExperience?.role ?? "",
  company: currentExperience?.company ?? "",
  period: currentExperience?.period ?? "",
  positions: experience.length,
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
