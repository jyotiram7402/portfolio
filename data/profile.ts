import {
  Braces,
  Brain,
  Compass,
  Database,
  GitBranch,
  Gauge,
  Layers,
  Network,
  Rocket,
  Server,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { skillCategories } from "@/data/skills";
import type { Highlight, Role, Stat, StoryCard } from "@/types/profile";

/**
 * Hero, statistics and About copy.
 *
 * Positioned for Java backend roles first, Java full stack second, MERN third. Every string leads
 * with the first without pretending the others do not exist.
 *
 * Nothing here is a number that could not be defended in an interview. The one figure that carries
 * real weight — 20 developers on the DevContainer — is a count, not an estimate.
 */

/* -------------------------------------------------------------------------- */
/*  Hero copy                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Hero headline, one entry per visual line.
 *
 * Authored as lines rather than a sentence because the reveal masks each one separately — the break
 * points are a design decision, not something to leave to the browser. The final line is rendered in
 * the brand gradient.
 */
export const heroLines = [
  "Java backends",
  "built to survive",
  "production.",
] as const;

/** Index of the line that receives the gradient treatment. */
export const HERO_ACCENT_LINE = heroLines.length - 1;

export const heroSubtitle =
  "Software engineer with two years on enterprise backend systems — Spring Boot services, three payment gateways, Kafka event pipelines and AI-powered search. I sit on Southco's AI board, leading the AI-first approach to how we build.";

/* -------------------------------------------------------------------------- */
/*  Rotating roles                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Ordered by hiring priority, and the order is the message: a visitor who reads only the first two
 * should come away thinking Java backend.
 */
export const roles: readonly Role[] = [
  { id: "java-backend", label: "Java Backend Engineer" },
  { id: "spring", label: "Spring Boot Developer" },
  { id: "java-fullstack", label: "Java Full Stack Developer" },
  { id: "microservices", label: "Microservices Engineer" },
  { id: "ai", label: "AI-First Development Lead" },
  { id: "mern", label: "MERN Stack Developer" },
];

/* -------------------------------------------------------------------------- */
/*  Statistics                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Derived rather than hardcoded, so the claim can never drift from the skills grid below it.
 */
const technologyCount = skillCategories.reduce(
  (total, category) => total + category.technologies.length,
  0,
);

export const stats: readonly Stat[] = [
  {
    id: "experience",
    value: 2,
    suffix: "+",
    label: "Years building",
    detail: "Enterprise backend systems in production since September 2024",
    icon: Gauge,
  },
  {
    id: "ai-adoption",
    value: 20,
    label: "Developers on my AI workflow",
    detail: "The isolated DevContainer I built became the team standard",
    icon: Users,
  },
  {
    id: "gateways",
    value: 3,
    label: "Payment gateways owned",
    detail: "PayPal, Stripe and AsiaPay — end to end, including the failure paths",
    icon: Network,
  },
  {
    id: "technologies",
    // Rounded down to the nearest five so the figure reads as a claim, not a count.
    value: Math.floor(technologyCount / 5) * 5,
    suffix: "+",
    label: "Technologies",
    detail: "Marked core, working or exploring — no percentages anywhere",
    icon: GitBranch,
  },
];

/* -------------------------------------------------------------------------- */
/*  About — story cards                                                       */
/* -------------------------------------------------------------------------- */

export const aboutIntro =
  "I started where most backend engineers do — on the phone at midnight because a payment had failed in production. That turned into a habit: read the system, find the seam, make it simpler than it was before. These days I do that for Java services, and for how my team adopts AI.";

export const storyCards: readonly StoryCard[] = [
  {
    id: "mission",
    kicker: "Mission",
    title: "Make the invisible layer dependable",
    body: "Nobody thanks you for an API that stays up, and that is exactly the point. I build Spring Boot services that behave predictably under load, fail loudly rather than silently, and are boring to operate at three in the morning.",
    icon: Target,
  },
  {
    id: "ai-board",
    kicker: "AI board member",
    title: "Leading the AI-first approach at Southco",
    body: "I led the R&D on agentic AI tooling, presented findings to the CTO, and found the risk nobody had asked about — that these tools could read legacy customer data. The DevContainer I built to isolate them is now how all 20 developers work.",
    icon: Sparkles,
  },
  {
    id: "focus",
    kicker: "Current focus",
    title: "Java, Spring Boot and event-driven design",
    body: "Deepening Spring Boot, JPA and Kafka on the backend — service boundaries drawn around data ownership, and async messaging where a synchronous call would turn one outage into three.",
    icon: Compass,
  },
  {
    id: "next",
    kicker: "Where next",
    title: "A Java backend team worth learning from",
    body: "Looking for a Java backend or Java full-stack role where the architecture is discussed rather than inherited, and where owning a service end to end is expected rather than exceptional.",
    icon: Rocket,
  },
];

/* -------------------------------------------------------------------------- */
/*  About — highlight grid                                                    */
/* -------------------------------------------------------------------------- */

export const highlights: readonly Highlight[] = [
  {
    id: "core-java",
    title: "Core Java",
    body: "Collections, Streams, Optional and the concurrency model — plus enough of the JVM and GC to read a heap profile rather than guess at one.",
    icon: Braces,
  },
  {
    id: "spring",
    title: "Spring ecosystem",
    body: "Spring Boot, MVC, Security with JWT and OAuth2, Hibernate and JPA. Authorisation at the method boundary, so a new endpoint is closed by default.",
    icon: Layers,
  },
  {
    id: "microservices",
    title: "Microservices & Kafka",
    body: "Independent services over REST and Kafka event streams, with boundaries drawn around data ownership rather than around team structure.",
    icon: Network,
  },
  {
    id: "data",
    title: "Data & performance",
    body: "MySQL, PostgreSQL, MongoDB and Redis. Execution plans read before indexes are added, and the migration written in the same pull request as the query.",
    icon: Database,
  },
  {
    id: "ai",
    title: "Applied GenAI",
    body: "Claude Code, MCP and secure AI tooling in production use — plus an AI search service shipped in one month with zero post-release defects.",
    icon: Brain,
  },
  {
    id: "production",
    title: "Production ownership",
    body: "Single point of contact for payment issues on a live platform. Reproduce it, isolate it, write the failing test, then fix the cause rather than the symptom.",
    icon: Server,
  },
];
