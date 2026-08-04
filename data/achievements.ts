import {
  Award,
  BookOpen,
  Code,
  GraduationCap,
  Mic,
  Rocket,
  Trophy,
} from "lucide-react";

import type { Achievement, AchievementKind } from "@/types/explore";

/**
 * Certificates, courses, work wins and everything else worth recording.
 *
 * Two rules. Nothing here is invented, and nothing carries a metric that could not
 * be sourced in an interview — a "40% faster" with no baseline is the first thing a
 * good interviewer picks apart.
 *
 * Entries without a `href` are simply unverifiable-by-link, which is normal for
 * internal work. That is better than linking somewhere that proves nothing.
 */
export const achievements: readonly Achievement[] = [
  {
    id: "payments-live",
    title: "Payment integration shipped to production",
    issuer: "Southco",
    period: "2025",
    kind: "work",
    description:
      "Took a gateway integration from sandbox certification to live settlement without a rollback, including the reconciliation job that keeps orders and payments in agreement.",
    icon: Rocket,
  },
  {
    id: "search-relevance",
    title: "Catalogue search rebuilt on OpenSearch",
    issuer: "Southco",
    period: "2025",
    kind: "work",
    description:
      "Replaced keyword matching with a tuned analyser chain and curated synonym set, and made reindexing an alias swap rather than an outage.",
    icon: Trophy,
  },
  {
    id: "internal-rag",
    title: "First retrieval-augmented assistant on the team",
    issuer: "Southco",
    period: "2025",
    kind: "work",
    description:
      "Introduced an internal assistant scoped so every answer cites the document it came from, with an evaluation step gating each prompt change.",
    icon: Rocket,
  },
  {
    id: "spring-certification",
    title: "Spring Boot & microservices specialisation",
    issuer: "Self-directed, project-assessed",
    period: "2025",
    kind: "course",
    description:
      "Worked through Spring Boot, Security, Data JPA and service decomposition, assessed by building the service template rather than by a multiple-choice exam.",
    icon: BookOpen,
  },
  {
    id: "java-foundations",
    title: "Java language and concurrency deep dive",
    issuer: "Self-directed",
    period: "2024 — 2025",
    kind: "course",
    description:
      "Language fundamentals through to the concurrency model — executors, futures, and why shared mutable state is the actual problem.",
    icon: BookOpen,
  },
  {
    id: "ai-engineering",
    title: "Applied LLM engineering",
    issuer: "Self-directed",
    period: "2025",
    kind: "course",
    description:
      "Prompt engineering, retrieval pipelines, evaluation sets and structured output — learned by shipping a feature that had to be correct, not by following a tutorial.",
    icon: Code,
  },
  {
    id: "open-source",
    title: "Open source contributions",
    issuer: "GitHub",
    period: "2025 — Present",
    kind: "open-source",
    description:
      "Small, reviewable pull requests to tools I use daily — documentation fixes, failing-test reproductions and the occasional bug fix.",
    icon: Code,
  },
  {
    id: "degree",
    title: "Engineering degree",
    issuer: "University",
    period: "2024",
    kind: "college",
    description:
      "Graduated with the fundamentals that still do the heavy lifting: data structures, databases, networking and operating systems.",
    icon: GraduationCap,
  },
  {
    id: "internal-talk",
    title: "Internal session on idempotent payment flows",
    issuer: "Southco engineering",
    period: "2025",
    kind: "speaking",
    description:
      "Walked the team through why a retried checkout must settle once, and the three places that guarantee has to be enforced.",
    icon: Mic,
  },
];

export const ACHIEVEMENT_KIND_META = {
  certificate: { label: "Certificates", icon: Award },
  course: { label: "Courses", icon: BookOpen },
  work: { label: "Work", icon: Rocket },
  "open-source": { label: "Open source", icon: Code },
  hackathon: { label: "Hackathons", icon: Trophy },
  speaking: { label: "Speaking", icon: Mic },
  college: { label: "College", icon: GraduationCap },
} as const satisfies Record<
  AchievementKind,
  { label: string; icon: typeof Award }
>;

/** Only kinds that actually have entries, so the filter never offers an empty tab. */
export const achievementKinds = (
  Object.keys(ACHIEVEMENT_KIND_META) as AchievementKind[]
).filter((kind) => achievements.some((entry) => entry.kind === kind));
