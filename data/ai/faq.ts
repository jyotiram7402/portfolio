import {
  Award,
  Boxes,
  Brain,
  Briefcase,
  Cpu,
  Download,
  FileText,
  Github,
  Layers,
  Linkedin,
  Mail,
  MonitorSmartphone,
  Route,
  Server,
  Sparkles,
  User,
} from "lucide-react";

import { identity, knowledge } from "@/data/ai/knowledge";
import type { FaqEntry, Intent } from "@/types/ai";

/**
 * Every question the assistant can answer.
 *
 * Intents are data, not code. Adding a question means adding an entry here and a
 * matching builder in `responses.ts` — there is no branching logic anywhere else, and
 * no `if (query.includes("java"))` buried in a component.
 *
 * `patterns` are scored with the shared fuzzy matcher rather than matched with
 * regexes, so "show me the java stuff" and "any java work?" both resolve to
 * `projects.java`. Include the words a real visitor would type, including the sloppy
 * ones.
 *
 * `weight` breaks ties. `skills.all` is deliberately light so that a query mentioning
 * "backend" resolves to the specific intent rather than the general one.
 */
export const intents: readonly Intent[] = [
  /* ---------------------------------------------------------------- about -- */
  {
    id: "about.who",
    label: `Who is ${identity.firstName}?`,
    group: "about",
    icon: User,
    weight: 1.2,
    patterns: [
      `who is ${identity.firstName.toLowerCase()}`,
      "who is he",
      "who are you",
      "tell me about him",
      "introduce",
      "introduction",
      "about",
      "background",
      "bio",
    ],
  },
  {
    id: "about.experience",
    label: "Tell me about his experience",
    group: "about",
    icon: Briefcase,
    weight: 1.1,
    patterns: [
      "experience",
      "work history",
      "where does he work",
      "current job",
      "employment",
      "career",
      "southco",
      "how many years",
    ],
  },
  {
    id: "about.ai-leadership",
    label: "What is his AI leadership role?",
    group: "about",
    icon: Sparkles,
    weight: 1.3,
    patterns: [
      "ai board",
      "board member",
      "ai team",
      "ai leadership",
      "ai first",
      "ai adoption",
      "claude code",
      "devcontainer",
      "leading ai",
    ],
  },
  {
    id: "about.focus",
    label: "What is he working on now?",
    group: "about",
    icon: Sparkles,
    patterns: [
      "what is he working on",
      "current focus",
      "right now",
      "these days",
      "latest work",
      "focus",
    ],
  },
  {
    id: "about.roadmap",
    label: "What is he learning next?",
    group: "about",
    icon: Route,
    patterns: [
      "learning",
      "roadmap",
      "what next",
      "studying",
      "improving",
      "kafka",
      "kubernetes",
      "goals",
    ],
  },

  /* ------------------------------------------------------------- projects -- */
  {
    id: "projects.all",
    label: "Show latest projects",
    group: "projects",
    icon: Boxes,
    weight: 1.1,
    patterns: [
      "projects",
      "show projects",
      "latest projects",
      "recent projects",
      "what has he built",
      "portfolio work",
      "show me his work",
    ],
  },
  {
    id: "projects.java",
    label: "Show Java projects",
    group: "projects",
    icon: Layers,
    weight: 1.3,
    patterns: ["java projects", "java work", "java", "jvm projects"],
  },
  {
    id: "projects.spring",
    label: "Show Spring Boot work",
    group: "projects",
    icon: Server,
    weight: 1.3,
    patterns: [
      "spring boot work",
      "spring projects",
      "spring boot",
      "spring",
      "microservices projects",
    ],
  },
  {
    id: "projects.ai",
    label: "Show AI projects",
    group: "projects",
    icon: Brain,
    weight: 1.3,
    patterns: [
      "ai projects",
      "ai work",
      "llm projects",
      "rag project",
      "machine learning work",
      "ai",
    ],
  },
  {
    id: "projects.microservices",
    label: "Show microservices work",
    group: "projects",
    icon: Layers,
    weight: 1.3,
    patterns: [
      "microservices projects",
      "microservices",
      "kafka",
      "event driven",
      "distributed",
    ],
  },
  {
    id: "projects.mern",
    label: "Show MERN projects",
    group: "projects",
    icon: MonitorSmartphone,
    weight: 1.3,
    patterns: [
      "mern projects",
      "mern stack",
      "react projects",
      "node projects",
      "full stack projects",
      "javascript projects",
    ],
  },

  /* --------------------------------------------------------------- skills -- */
  {
    id: "skills.all",
    label: "What technologies does he know?",
    group: "skills",
    icon: Cpu,
    weight: 0.9,
    patterns: [
      "what technologies",
      "tech stack",
      "technologies",
      "skills",
      "what does he know",
      "stack",
      "tools he uses",
    ],
  },
  {
    id: "skills.backend",
    label: "Show backend skills",
    group: "skills",
    icon: Server,
    weight: 1.3,
    patterns: [
      "backend skills",
      "backend",
      "server side",
      "api skills",
      "database skills",
    ],
  },
  {
    id: "skills.frontend",
    label: "Show frontend skills",
    group: "skills",
    icon: MonitorSmartphone,
    weight: 1.3,
    patterns: ["frontend skills", "frontend", "front end", "ui skills", "css react"],
  },
  {
    id: "skills.ai",
    label: "Show AI skills",
    group: "skills",
    icon: Brain,
    weight: 1.2,
    patterns: ["ai skills", "llm skills", "prompt engineering", "vector database"],
  },

  /* ---------------------------------------------------------- credentials -- */
  {
    id: "credentials.certifications",
    label: "Show certifications",
    group: "credentials",
    icon: Award,
    patterns: [
      "certifications",
      "certificates",
      "courses",
      "qualifications",
      "education",
      "degree",
    ],
  },
  {
    id: "credentials.achievements",
    label: "Show achievements",
    group: "credentials",
    icon: Award,
    patterns: ["achievements", "accomplishments", "wins", "awards", "highlights"],
  },
  {
    id: "credentials.writing",
    label: "Show his writing",
    group: "credentials",
    icon: FileText,
    patterns: ["writing", "blog", "articles", "posts", "does he write"],
  },

  /* ---------------------------------------------------------------- links -- */
  {
    id: "links.resume",
    label: "Download résumé",
    group: "links",
    icon: Download,
    weight: 1.2,
    patterns: ["resume", "cv", "download resume", "download cv", "curriculum vitae"],
  },
  {
    id: "links.github",
    label: "Open GitHub",
    group: "links",
    icon: Github,
    weight: 1.2,
    patterns: ["github", "open github", "repositories", "repos", "source code"],
  },
  {
    id: "links.linkedin",
    label: "Open LinkedIn",
    group: "links",
    icon: Linkedin,
    weight: 1.2,
    patterns: ["linkedin", "open linkedin", "professional profile"],
  },

  /* -------------------------------------------------------------- contact -- */
  {
    id: "contact.how",
    label: "How can I contact him?",
    group: "contact",
    icon: Mail,
    weight: 1.2,
    patterns: [
      "contact",
      "how can i contact",
      "get in touch",
      "email",
      "reach him",
      "hire",
      "available for work",
      "opportunities",
    ],
  },
];

export function getIntent(id: string): Intent | undefined {
  return intents.find((intent) => intent.id === id);
}

/**
 * Plain-text answers, used for `FAQPage` structured data.
 *
 * Deliberately a separate, shorter surface from the rich block responses: schema
 * markup wants one self-contained sentence per question, and Google penalises
 * FAQ markup that does not match visible page content — so every entry here is
 * something the assistant genuinely says.
 */
export const faqEntries: readonly FaqEntry[] = [
  {
    intentId: "about.who",
    question: `Who is ${identity.name}?`,
    answer: knowledge.narrative.introduction,
  },
  {
    intentId: "about.experience",
    question: `What is ${identity.firstName}'s professional experience?`,
    answer: knowledge.narrative.experienceSummary,
  },
  {
    intentId: "skills.all",
    question: `What technologies does ${identity.firstName} work with?`,
    answer: `He works across ${knowledge.skillCategories.length} areas — Core Java, Spring and backend, data and messaging, AI, cloud and DevOps, frontend, practices and tooling — covering ${knowledge.technologyCount} technologies. Java 8/17, Spring Boot, Spring Security, Hibernate, MySQL, Redis and Docker are the daily ones.`,
  },
  {
    intentId: "skills.backend",
    question: `What backend technologies does ${identity.firstName} use?`,
    answer:
      "Java 8/17 and Spring Boot as the core, with Spring MVC, Spring Security (JWT and OAuth2), Hibernate and JPA, REST API design and microservices over Apache Kafka. On the data side: MySQL, PostgreSQL, MongoDB and Redis, with query optimisation and HikariCP tuning.",
  },
  {
    intentId: "about.ai-leadership",
    question: `What is ${identity.firstName}'s role on the AI team?`,
    answer:
      "He is a board member of the AI team at Southco, leading the AI-first approach to development. He led the R&D on Claude Code, presented findings to the CTO, identified that agentic tooling could read legacy customer data, and engineered a Docker DevContainer that became the standard workflow for all 20 developers.",
  },
  {
    intentId: "projects.all",
    question: `What has ${identity.firstName} built?`,
    answer: `${knowledge.projectCount} selected projects. The one to ask about is SmartShield — an adaptive bot-mitigation system in Python and machine learning, built after bots took our production site down in the 2024 Christmas peak and IP blocking failed. On the Java side: LedgerCore (an event-driven double-entry ledger in Java 21, Spring Boot and Kafka), Foodies (Kafka-based food-delivery microservices), BookShowHere (seat booking under concurrency), Kafka With Java Microservices, and MusicON (streaming with Redis and S3). Then full stack and MERN: OneClick, DevSync, Roadmap Tracker and TrackFit. Plus work with no public repository — the payment gateway integrations and the secure AI DevContainer adopted by 20 developers.`,
  },
  {
    intentId: "projects.ai",
    question: `Has ${identity.firstName} worked on AI projects?`,
    answer:
      "Yes, and one of them came out of a production incident. SmartShield is an adaptive bot-mitigation and traffic-intelligence system in Python, using an ensemble of machine-learning and deep-learning models to score traffic on behaviour rather than on IP reputation — built after a bot flood took the site down in the 2024 Christmas peak and blocking source ranges simply moved the attack to another country. He also co-developed an AI-powered search service on OpenSearch that shipped in one month with zero post-release defects, engineered the secure DevContainer that made agentic AI adoption possible across 20 developers, and built KnowledgePulse AI, a RAG service with hybrid retrieval and cited answers. He is a board member of Southco's AI team.",
  },
  {
    intentId: "projects.java",
    question: `What Java projects has ${identity.firstName} built?`,
    answer:
      "LedgerCore, an event-driven wallet and double-entry ledger in Java 21, Spring Boot, Kafka and PostgreSQL, built around financial correctness; Foodies, a microservices food-delivery backend with Kafka event streams and JWT authentication; BookShowHere, a ticket booking system whose whole difficulty is seat locking under concurrency; Kafka With Java Microservices, a working reference for partitioning, consumer groups and idempotent consumption; MusicON, a streaming backend with AWS S3 and Redis caching; and OneClick, a React frontend against Spring Boot and MongoDB.",
  },
  {
    intentId: "about.roadmap",
    question: `What is ${identity.firstName} learning next?`,
    answer: `Currently working through microservices boundaries, system design and RAG evaluation, with Kafka, Kubernetes and agentic AI queued next. ${knowledge.roadmapTotals.completed} roadmap nodes are complete, ${knowledge.roadmapTotals.learning} in progress.`,
  },
  {
    intentId: "contact.how",
    question: `How can I contact ${identity.firstName}?`,
    answer: `Email is the fastest route: ${identity.email}. He is also on GitHub and LinkedIn, and is ${identity.availability.open ? "currently open to new opportunities" : "not currently looking for new work"}.`,
  },
];
