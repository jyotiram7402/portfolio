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

import { siteConfig } from "@/config/site";
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
 * Hero headline: the name, one entry per visual line.
 *
 * Derived from `siteConfig.name` rather than written out again, so the site has one place a
 * name is spelled. Split on whitespace because the reveal masks each line separately — the
 * break points are a design decision, not something to leave to the browser.
 *
 * The headline used to be the tagline ("Java backends built to survive production."). That
 * line has not gone anywhere — it is still `siteConfig.tagline`, and it still carries the
 * footer and the social card. But a portfolio's `h1` is the person, and the rotating role
 * beneath it now does the positioning work the tagline was doing.
 */
export const heroLines: readonly string[] = siteConfig.name.split(" ");

/**
 * Index of the line that receives the gradient treatment.
 *
 * The surname, so the first name stays at full contrast and the second falls away — which
 * reads as one deliberate mark rather than as two words at different opacities.
 */
export const HERO_ACCENT_LINE = heroLines.length - 1;

export const heroSubtitle =
  "Software engineer with two years on enterprise backend systems. Java and Spring Boot are where I work and where I go deepest; I also pick up the React, JavaScript and Node work when it lands on my desk. I sit on Southco's AI board, leading the AI-first approach to how we build.";

/* -------------------------------------------------------------------------- */
/*  The statement band                                                        */
/* -------------------------------------------------------------------------- */

/**
 * The argument the site is actually making, stated once and plainly.
 *
 * It sits directly under the hero because it reframes everything below it: the projects
 * are not a gallery, they are evidence of things that got adopted. Authored as a lead
 * plus supporting paragraphs so the component can give the lead display weight without
 * shouting the whole block.
 *
 * Two claims, both defensible:
 *
 * 1. R&D only counts when it ships. The DevContainer is the proof — a security risk
 *    found, an implementation built, and 20 developers moved onto it.
 * 2. Backend engineering is principles, not a language. SmartShield is the proof — a
 *    production bot attack answered in Python and machine learning, because that was
 *    what the problem needed.
 */
export const heroStatement = {
  lead: "This is not a portfolio. It is a record of what got adopted.",
  body: [
    "Anyone can run an R&D spike and write it up. What counts is walking into the room with a working implementation, and having the organisation accept it and put it into production. That is the difference between an interesting experiment and engineering.",
    "And backend work is not a language. Knowing Java does not mean I only belong on Java. Name the vertical and the stack — if I understand the boundaries, the data model and the failure paths, the language is an implementation detail. The bot-mitigation system on this page is written in Python for exactly that reason: that is what the problem needed.",
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Rotating roles                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The rotating line under the name.
 *
 * Ordered by hiring priority, and the order is the message: the name is the `h1`, so this
 * list is what tells a visitor what to hire me as. Whoever reads only the first entry — and
 * a crawler reads exactly that, since the rotation is client-side — should come away with
 * "Java backend".
 *
 * Kept to titles a job posting would actually use. "AI-First Development Lead" was accurate
 * about the board role but is not a role anyone searches for; "AI Engineer" is.
 */
export const roles: readonly Role[] = [
  { id: "java-backend", label: "Java Backend Engineer" },
  { id: "java-fullstack", label: "Java Full Stack Developer" },
  { id: "backend", label: "Backend Engineer" },
  { id: "spring", label: "Spring Boot Developer" },
  { id: "ai", label: "AI Engineer" },
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
    value: 4,
    label: "Payment gateways owned",
    detail: "PayPal, Stripe, AsiaPay and CCAvenue — end to end, including the failure paths",
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
    body: "I led the R&D on agentic AI tooling and found the risk nobody had asked about — that these tools could reach files outside the project boundary. The DevContainer I built to isolate them is how all 20 developers now work, and the Playwright MCP setup I researched next was taken up by QA. Two things carried from research to adoption.",
    icon: Sparkles,
  },
  {
    id: "focus",
    kicker: "Current focus",
    title: "Java, Spring Boot and event-driven design",
    body: "Java and Spring Boot are where I go deepest — JPA, Kafka, service boundaries drawn around data ownership, and async messaging where a synchronous call would turn one outage into three. Day to day that work is integration-shaped, and I take the React, JavaScript and Node requests too when they land.",
    icon: Compass,
  },
  {
    id: "shipping",
    kicker: "How I ship",
    title: "From scratch, or with AI — whichever is the right trade",
    body: "I can build a service from an empty directory, and I can get a working product out in days with AI assistance on Next.js, Supabase and Vercel, wired through Git. Knowing which of the two a problem deserves is the actual skill; the interesting part is never the scaffolding.",
    icon: GitBranch,
  },
  {
    id: "range",
    kicker: "Range",
    title: "Backend principles travel — syntax does not",
    body: "Java and Spring are my depth. But the bot-mitigation system on this site is Python and machine learning, the streaming work leaned on Redis and S3, and the full-stack work is React, Node and MongoDB. Boundaries, data modelling and failure paths are the same argument in every language.",
    icon: Layers,
  },
  {
    id: "next",
    kicker: "Where next",
    title: "A Java backend team worth learning from",
    body: "Looking for a Java backend, Java full-stack or backend role where the architecture is discussed rather than inherited, and where owning a service end to end is expected rather than exceptional. Not looking to be boxed into a single language.",
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
