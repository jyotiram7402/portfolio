import { Building2, GraduationCap } from "lucide-react";

import type { ExperienceEntry } from "@/types/profile";

/**
 * Professional history, newest first.
 *
 * Achievements are written without invented metrics. A percentage nobody can
 * source is worse than no percentage: it is the first thing a good interviewer
 * asks about, and the answer has to hold.
 */
export const experience: readonly ExperienceEntry[] = [
  {
    id: "southco",
    kind: "work",
    company: "Southco",
    monogram: "SC",
    role: "Junior Web Developer",
    period: "2024 — Present",
    location: "India · On-site",
    summary:
      "Delivery across a live commerce stack — storefront, marketing automation, payments and search — while moving the team's newer work towards Java services and AI-assisted tooling.",
    responsibilities: [
      "Build and maintain Magento storefront features and custom modules against a large product catalogue.",
      "Own Salesforce Marketing Cloud journeys, data extensions and templated email, including the SQL that feeds them.",
      "Integrate payment gateways end to end: sandbox certification, idempotent order handling, webhook reconciliation and failure paths.",
      "Tune OpenSearch indexing and relevance so catalogue search returns what customers actually meant.",
      "Ship to Azure through containerised builds and CI, with environment parity between staging and production.",
      "Prototype internal AI tooling — retrieval over company documents, with citations and an evaluation step before rollout.",
    ],
    achievements: [
      "Took a payment integration from sandbox to live settlement without a rollback, including the reconciliation job that keeps orders and payments in agreement.",
      "Rebuilt catalogue search relevance on OpenSearch, replacing keyword matching with a tuned analyser and synonym set.",
      "Introduced the team's first retrieval-augmented internal assistant, scoped so every answer cites the document it came from.",
    ],
    technologies: [
      "Magento",
      "SFMC",
      "MySQL",
      "OpenSearch",
      "Azure",
      "JavaScript",
      "React",
      "Java",
      "Spring Boot",
      "Git",
      "Bitbucket",
      "Docker",
    ],
    current: true,
    icon: Building2,
  },
  {
    id: "graduation",
    kind: "education",
    company: "Engineering degree",
    monogram: "ED",
    role: "Computer engineering graduate",
    period: "2024",
    location: "India",
    summary:
      "Graduated with the fundamentals that still do the heavy lifting day to day: data structures, databases, networking and operating systems.",
    responsibilities: [
      "Coursework across data structures and algorithms, DBMS, computer networks and operating systems.",
      "Final-year project delivered as a working application rather than a report.",
    ],
    achievements: [
      "Left with a working knowledge of relational modelling and concurrency that transferred directly to production work.",
    ],
    technologies: ["Java", "MySQL", "HTML", "CSS", "JavaScript"],
    icon: GraduationCap,
  },
];

/** The position rendered as the featured card. */
export const currentExperience = experience.find((entry) => entry.current);
