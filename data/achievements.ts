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
 * Awards and the wins worth recording.
 *
 * **Certificates are no longer here.** The Udemy and GeeksforGeeks entries moved to
 * `data/certifications.ts`, which is the dedicated feature: a certificate has a scan, a
 * credential id, an issuer identity and a verification URL, and modelling that as five
 * optional fields on `Achievement` — fields that only ever applied to two of nine entries —
 * was the point at which a shared type stopped being shared. This file is now what it always
 * described best: recognition that has no document to show.
 *
 * Every entry is from the résumé and every figure is one that can be sourced — 20 developers,
 * one month, zero downtime, CGPA 8.88. Nothing here is a percentage without a baseline, which
 * is the one thing an interviewer always picks apart.
 *
 * None of these carries a link, and that is correct rather than an omission: internal
 * recognition is not linkable, and a "Verify" control that goes nowhere is the most checkable
 * claim on the page.
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
    id: "playwright-mcp-qa",
    title: "Playwright MCP adopted by the QA team",
    issuer: "Southco QA",
    period: "2025",
    kind: "work",
    description:
      "Researched MCP-based browser automation, built the Docker and YAML setup for AI-driven testing workflows, demonstrated it to the manager and the QA team, and saw it taken into their process. The second thing I took from research to adoption — and the one that landed outside my own team.",
    icon: Rocket,
  },
  {
    id: "cto-presentation",
    title: "Presented agentic AI findings to engineering leadership",
    issuer: "Southco",
    period: "2025",
    kind: "speaking",
    description:
      "Took an R&D spike on Claude Code to a leadership decision — including the security risk that had not been raised, and the isolation strategy that answered it. Demonstrated live on real development scenarios rather than slides, to the IT Director, managers and team leads.",
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
