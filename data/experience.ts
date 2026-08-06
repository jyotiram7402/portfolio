import { Building2, GraduationCap, Sparkles } from "lucide-react";

import type { ExperienceEntry } from "@/types/profile";

/**
 * Professional history, newest first.
 *
 * Written for Java backend and platform roles. The commerce platform the work sits on is described
 * by what it is — an enterprise commerce platform — rather than by its vendor name, because the
 * transferable engineering is the payment integration, the event handling and the search service,
 * not the CMS underneath.
 *
 * Achievements carry only figures that can be sourced: 20 developers on the DevContainer, three
 * gateways, one month to production. Nothing here is a percentage without a baseline.
 */
export const experience: readonly ExperienceEntry[] = [
  {
    id: "southco-ai-board",
    kind: "work",
    company: "Southco",
    monogram: "AI",
    role: "Board Member — AI Team",
    period: "2025 — Present",
    location: "Pune, India · On-site",
    summary:
      "Sit on the AI board driving an AI-first approach to how the engineering organisation builds software — tooling standards, safe adoption, and getting agentic workflows into daily use rather than into a slide deck.",
    responsibilities: [
      "Lead the AI-first development initiative across the engineering organisation, setting how agentic tooling is evaluated and adopted.",
      "Own the standards for safe AI usage — what a tool may read, where it runs, and what has to be isolated before it touches company data.",
      "Present findings and recommendations to the CTO, translating experiments into decisions the team can act on.",
      "Support engineers moving onto agentic workflows, so adoption is a capability rather than a mandate.",
    ],
    achievements: [
      "Identified that agentic AI tooling could read legacy customer data, and engineered a Docker-based DevContainer giving a fully isolated environment — adopted as the standard workflow by all 20 developers.",
      "Took Claude Code from an R&D spike to an organisation-wide standard, with the security question answered before rollout rather than after.",
    ],
    technologies: [
      "Claude Code",
      "MCP",
      "Docker",
      "DevContainers",
      "Prompt Engineering",
      "LLM APIs",
    ],
    current: true,
    icon: Sparkles,
  },
  {
    id: "southco",
    kind: "work",
    company: "Southco",
    monogram: "SC",
    role: "Junior Web Developer — Backend & Integrations",
    period: "Sep 2024 — Present",
    location: "Pune, India · On-site",
    summary:
      "Backend and integration ownership on an enterprise commerce platform: payment gateways, CRM and marketing data synchronisation over REST, an AI-powered search service, and a containerised configurator built from scratch.",
    responsibilities: [
      "Own end-to-end payment gateway integrations for PayPal, Stripe and AsiaPay (China/APAC), and act as the single point of contact for every payment issue in production.",
      "Build transaction workflows covering validation, webhook and callback processing, retries and failure handling — the paths that decide whether a payment settles once.",
      "Integrate enterprise CRM and marketing platforms over REST APIs, synchronising customer, product and campaign data across systems.",
      "Co-develop an AI-powered search service in Python and FastAPI over OpenSearch, for faster and more relevant product discovery.",
      "Build the Cable Part Number Configurator: a containerised FastAPI application with a rules-based configuration engine, JSON-backed catalog and role-separated public and admin services, embedded via a CSP-secured iframe.",
      "Deliver production support and fixes in an Agile environment (Jira, Workfront), through code review and sprint planning with client teams.",
      "Pick up the React, JavaScript and Node work when a request needs it — not the majority of my time, but the reason the integration work never has to wait for someone else's queue.",
    ],
    achievements: [
      "Resolved a critical PayPal payment failure in live production during a midnight incident with zero downtime — recognised with a Spot Award.",
      "Shipped the AI search feature to production within one month with zero post-release defects.",
      "Named Employee of the Month for driving AI adoption across the team and delivering the search feature.",
    ],
    technologies: [
      "Java",
      "Spring Boot",
      "REST API",
      "Python",
      "FastAPI",
      "OpenSearch",
      "MySQL",
      "Docker",
      "React",
      "JavaScript",
      "Node.js",
      "Azure DevOps",
      "Git",
      "Bitbucket",
      "Jira",
    ],
    current: true,
    icon: Building2,
  },
  {
    id: "education",
    kind: "education",
    company: "JSPM's Imperial College of Engineering and Research",
    monogram: "IC",
    role: "B.E. Computer Engineering — CGPA 8.88",
    period: "2021 — 2024",
    location: "Pune, India",
    summary:
      "Graduated with the fundamentals that still do the heavy lifting day to day: data structures and algorithms, DBMS, computer networks and operating systems.",
    responsibilities: [
      "Coursework across data structures and algorithms, DBMS, computer networks and operating systems.",
      "Final-year project delivered as a working application rather than a report.",
    ],
    achievements: [
      "Graduated with a CGPA of 8.88, with the relational modelling and concurrency fundamentals that transferred directly to production backend work.",
    ],
    technologies: ["Java", "SQL", "MySQL", "Data Structures", "OOP"],
    icon: GraduationCap,
  },
];

/** The position rendered as the featured card. */
export const currentExperience = experience.find((entry) => entry.current);

/** The AI board role, promoted separately because it is the headline differentiator. */
export const aiBoardRole = experience.find((entry) => entry.id === "southco-ai-board");
