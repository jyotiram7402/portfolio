import {
  Braces,
  Brain,
  CreditCard,
  GraduationCap,
  Network,
  Rocket,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";

import type { JourneyEntry } from "@/types/profile";

/**
 * The About timeline.
 *
 * Ordered oldest to newest, which is the direction the reader scrolls. One step, one sentence — a
 * timeline that needs paragraphs is a blog post wearing the wrong component.
 *
 * The arc is deliberate: fundamentals, then Java projects, then production backend work, then the AI
 * leadership role. It should read as depth accumulating, not as a list of jobs.
 */
export const journey: readonly JourneyEntry[] = [
  {
    id: "degree",
    period: "2021 — 2024",
    title: "B.E. Computer Engineering",
    body: "JSPM's Imperial College of Engineering and Research, Pune. Graduated with a CGPA of 8.88 and the fundamentals that still do the heavy lifting: data structures, DBMS, networks and operating systems.",
    icon: GraduationCap,
  },
  {
    id: "java-projects",
    period: "2024",
    title: "Learned Java by building backends",
    body: "Three projects, each chosen to force a different lesson — Kafka and service boundaries in Foodies, S3 and Redis caching in MusicON, a decoupled React and Spring Boot contract in FirstReview.",
    icon: Braces,
  },
  {
    id: "southco",
    period: "Sep 2024",
    title: "Joined Southco",
    body: "Started as a Junior Web Developer on backend and integrations, with live enterprise systems, real users and consequences from week one.",
    icon: Rocket,
  },
  {
    id: "payments",
    period: "2024 — 2025",
    title: "Took ownership of payments",
    body: "End-to-end integration of PayPal, Stripe and AsiaPay, and single point of contact for every payment issue in production — validation, webhooks, retries and the failure paths nobody wants to own.",
    icon: CreditCard,
  },
  {
    id: "integrations",
    period: "2025",
    title: "Enterprise integrations over REST",
    body: "Synchronised customer, product and campaign data between the web platform and enterprise CRM and marketing systems. My first real lesson in data modelling under someone else's constraints.",
    icon: Network,
  },
  {
    id: "ai-search",
    period: "2025",
    title: "Shipped AI-powered search",
    body: "Co-developed a search service in Python and FastAPI over OpenSearch for relevance rather than keyword matching. In production within a month, with zero post-release defects.",
    icon: Search,
  },
  {
    id: "devcontainer",
    period: "2025",
    title: "Made agentic AI safe to adopt",
    body: "Led the R&D on Claude Code, presented findings to the CTO, and found the risk nobody had raised — that the tooling could read legacy customer data. The isolated Docker DevContainer I built became the standard for all 20 developers.",
    icon: Terminal,
  },
  {
    id: "ai-board",
    period: "2025",
    title: "Board member, AI team",
    body: "Now leading the AI-first approach to development across the engineering organisation: which tools get adopted, what they are allowed to touch, and how the team actually moves onto them.",
    icon: Sparkles,
  },
  {
    id: "now",
    period: "Now",
    title: "Going deeper on the JVM",
    body: "Event-driven design, system design and the operational side of Java services — the things that separate someone who can build a service from someone who can be trusted with one.",
    icon: Brain,
    current: true,
  },
];
