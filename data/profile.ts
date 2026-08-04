import {
  Brain,
  Cloud,
  Compass,
  Cpu,
  GitBranch,
  Gauge,
  Layers,
  Puzzle,
  Rocket,
  Server,
  Sparkles,
  Target,
} from "lucide-react";

import { skillCategories } from "@/data/skills";
import type { Highlight, Role, Stat, StoryCard } from "@/types/profile";

/**
 * Hero, statistics and About copy.
 *
 * This is authored content, not configuration — edit it freely. The one rule:
 * nothing here should be a number nobody could verify or defend. Where a figure
 * can be derived from the codebase it is derived, not typed.
 */

/* -------------------------------------------------------------------------- */
/*  Hero copy                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Hero headline, one entry per visual line.
 *
 * Authored as lines rather than a sentence because the reveal masks each one
 * separately — the break points are a design decision, not something to leave to
 * the browser. The final line is rendered in the brand gradient.
 */
export const heroLines = ["Engineering the", "layer you never see,", "and always feel."] as const;

/** Index of the line that receives the gradient treatment. */
export const HERO_ACCENT_LINE = heroLines.length - 1;

export const heroSubtitle =
  "I build Spring Boot services, payment and search integrations, and AI features that hold up in production — the kind of work that stays quiet at 3am and fast under load.";

/* -------------------------------------------------------------------------- */
/*  Rotating roles                                                            */
/* -------------------------------------------------------------------------- */

export const roles: readonly Role[] = [
  { id: "java", label: "Java Backend Engineer" },
  { id: "spring", label: "Spring Boot Developer" },
  { id: "ai", label: "AI Application Engineer" },
  { id: "fullstack", label: "Full Stack Developer" },
  { id: "integrations", label: "Systems Integrator" },
  { id: "oss", label: "Open Source Builder" },
];

/* -------------------------------------------------------------------------- */
/*  Statistics                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Derived rather than hardcoded, so the claim can never drift from the skills
 * grid immediately below it.
 */
const technologyCount = skillCategories.reduce(
  (total, category) => total + category.technologies.length,
  0,
);

export const stats: readonly Stat[] = [
  {
    id: "projects",
    value: 20,
    suffix: "+",
    label: "Projects shipped",
    detail: "Client work, internal tools and things built to find out how they work",
    icon: Layers,
  },
  {
    id: "experience",
    value: 2,
    suffix: "+",
    label: "Years building",
    detail: "Professional delivery on production systems people depend on",
    icon: Gauge,
  },
  {
    id: "technologies",
    // Rounded down to the nearest five so the figure reads as a claim, not a count.
    value: Math.floor(technologyCount / 5) * 5,
    suffix: "+",
    label: "Technologies",
    detail: "In active rotation across backend, cloud, AI and the front end",
    icon: Cpu,
  },
  {
    id: "commits",
    value: 500,
    suffix: "+",
    label: "Commits pushed",
    detail: "Small, reviewable changes over large, unreviewable ones",
    icon: GitBranch,
  },
];

/* -------------------------------------------------------------------------- */
/*  About — story cards                                                       */
/* -------------------------------------------------------------------------- */

export const aboutIntro =
  "I started where most backend engineers do — fixing something that was already broken in production. That turned into a habit: read the system, find the seam, make it simpler than it was before.";

export const storyCards: readonly StoryCard[] = [
  {
    id: "mission",
    kicker: "Mission",
    title: "Make the invisible layer dependable",
    body: "Nobody thanks you for an API that stays up. That is exactly the point. I build services that behave predictably under load, fail loudly rather than silently, and are boring to operate.",
    icon: Target,
  },
  {
    id: "passion",
    kicker: "Passion",
    title: "The seam between systems",
    body: "The interesting problems live where two systems meet — a payment gateway and an order pipeline, a search index and a catalogue, a model and a product. Integration is where correctness is actually decided.",
    icon: Puzzle,
  },
  {
    id: "focus",
    kicker: "Current focus",
    title: "Java, Spring Boot and applied AI",
    body: "Deepening Spring Boot and JPA on the backend, while shipping AI features that earn their place: retrieval that cites its sources, prompts under version control, evaluation before deployment.",
    icon: Compass,
  },
  {
    id: "next",
    kicker: "Where next",
    title: "From features to products",
    body: "Moving from delivering tickets to owning outcomes — architecture, data modelling and the operational side of a SaaS product, not just the endpoint that serves it.",
    icon: Rocket,
  },
];

/* -------------------------------------------------------------------------- */
/*  About — highlight grid                                                    */
/* -------------------------------------------------------------------------- */

export const highlights: readonly Highlight[] = [
  {
    id: "backend",
    title: "Backend architecture",
    body: "Domain-first modelling, clean layering, and REST surfaces that stay stable while the internals change.",
    icon: Server,
  },
  {
    id: "spring",
    title: "Spring & microservices",
    body: "Spring Boot, Security and Data JPA — service boundaries drawn around ownership, not around convenience.",
    icon: Layers,
  },
  {
    id: "cloud",
    title: "Cloud & delivery",
    body: "Azure and AWS with containerised builds and CI that gates on the checks that actually catch regressions.",
    icon: Cloud,
  },
  {
    id: "ai",
    title: "Applied AI",
    body: "RAG pipelines, prompt engineering and vector search wired into real products, with evaluation before rollout.",
    icon: Brain,
  },
  {
    id: "performance",
    title: "Performance",
    body: "Measure, then change one thing. Query plans, indexing strategy, caching layers and payload discipline.",
    icon: Gauge,
  },
  {
    id: "problems",
    title: "Problem solving",
    body: "Reproduce it, isolate it, write the failing test, then fix the cause instead of the symptom.",
    icon: Sparkles,
  },
];
