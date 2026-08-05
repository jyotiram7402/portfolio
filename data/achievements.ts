import {
  Award,
  BookOpen,
  Code,
  GraduationCap,
  Mic,
  Rocket,
  Sparkles,
  Trophy,
} from "lucide-react";

import type { Achievement, AchievementKind } from "@/types/explore";

/**
 * Awards, certifications and the wins worth recording.
 *
 * Every entry is from the résumé and every figure is one that can be sourced — 20 developers, one
 * month, zero downtime, CGPA 8.88. Nothing here is a percentage without a baseline, which is the one
 * thing an interviewer always picks apart.
 *
 * The three Udemy and GeeksforGeeks certificates carry verification links because they exist; the
 * work awards do not, because internal recognition is not linkable and pretending otherwise would be
 * the most checkable claim on the page.
 */
export const achievements: readonly Achievement[] = [
  {
    id: "ai-board-member",
    title: "Board member — AI team",
    issuer: "Southco",
    period: "2025",
    kind: "work",
    description:
      "Appointed to the AI board to lead the AI-first approach to development across the engineering organisation — tooling standards, safe adoption, and getting agentic workflows into daily use.",
    icon: Sparkles,
  },
  {
    id: "employee-of-month",
    title: "Employee of the Month",
    issuer: "Southco",
    period: "2025",
    kind: "work",
    description:
      "Recognised for driving AI adoption across the team through the secure DevContainer environment now used by all 20 developers, and for shipping the AI search feature to production within one month with zero post-release defects.",
    icon: Trophy,
  },
  {
    id: "spot-award",
    title: "Spot Award",
    issuer: "Southco",
    period: "2025",
    kind: "work",
    description:
      "Resolved a critical PayPal payment failure in live production during a midnight incident, with zero downtime.",
    icon: Award,
  },
  {
    id: "devcontainer-adoption",
    title: "Secure agentic AI adopted org-wide",
    issuer: "Southco engineering",
    period: "2025",
    kind: "work",
    description:
      "Identified that agentic AI tooling could read legacy customer data, engineered a Docker-based DevContainer providing full isolation, and saw it adopted as the standard workflow by all 20 developers.",
    icon: Rocket,
  },
  {
    id: "gfg-java-backend",
    title: "Certified Java Backend Developer",
    issuer: "GeeksforGeeks",
    period: "2024",
    kind: "certificate",
    description:
      "Core Java, Spring Boot, REST API design and persistence, assessed by building rather than by multiple choice.",
    icon: BookOpen,
  },
  {
    id: "udemy-microservices",
    title: "Master Microservices with Spring Boot and Spring Cloud",
    issuer: "Udemy",
    period: "2024",
    kind: "course",
    description:
      "Service decomposition, inter-service communication and the Spring Cloud toolchain — applied directly in the Foodies microservices backend.",
    href: "https://www.udemy.com/certificate/UC-b8695f97-1df0-4f74-893c-b32fe23aa625/",
    icon: Code,
  },
  {
    id: "udemy-devops",
    title: "DevOps Tools and AWS for Java Microservice Developers",
    issuer: "Udemy",
    period: "2024",
    kind: "course",
    description:
      "Docker, CI/CD and AWS from a JVM developer's perspective — the groundwork for the DevContainer work that followed.",
    href: "https://www.udemy.com/certificate/UC-7fcd83c6-9c2c-4bb4-9e09-62aeb4492372/",
    icon: Code,
  },
  {
    id: "cto-presentation",
    title: "Presented agentic AI findings to the CTO",
    issuer: "Southco",
    period: "2025",
    kind: "speaking",
    description:
      "Took an R&D spike on Claude Code to an executive decision — including the security risk that had not been raised, and the isolation strategy that answered it.",
    icon: Mic,
  },
  {
    id: "degree",
    title: "B.E. Computer Engineering — CGPA 8.88",
    issuer: "JSPM's Imperial College of Engineering and Research",
    period: "2021 — 2024",
    kind: "college",
    description:
      "Graduated with the relational modelling, concurrency and networking fundamentals that transferred directly into production backend work.",
    icon: GraduationCap,
  },
];

export const ACHIEVEMENT_KIND_META = {
  certificate: { label: "Certifications", icon: Award },
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
