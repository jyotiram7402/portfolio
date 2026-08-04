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
    answer: `He works across ${knowledge.skillCategories.length} areas — backend, frontend, AI, cloud, DevOps, databases, commerce platforms and tooling — covering ${knowledge.technologyCount} technologies. Java, Spring Boot, TypeScript, MySQL, Magento and Salesforce Marketing Cloud are the daily ones.`,
  },
  {
    intentId: "skills.backend",
    question: `What backend technologies does ${identity.firstName} use?`,
    answer:
      "Java and Spring Boot as the core, with Spring Security and Spring Data JPA, REST API design, Hibernate, and MySQL, PostgreSQL, MongoDB and Redis on the data side.",
  },
  {
    intentId: "projects.all",
    question: `What has ${identity.firstName} built?`,
    answer: `${knowledge.projectCount} selected projects, including a production payment gateway integration, OpenSearch catalogue search relevance, a retrieval-augmented internal assistant, and an opinionated Spring Boot service template.`,
  },
  {
    intentId: "projects.ai",
    question: `Has ${identity.firstName} worked on AI projects?`,
    answer:
      "Yes — a retrieval-augmented internal assistant built on Spring Boot that answers from company documents with mandatory citations, versioned prompts and an evaluation set gating every change.",
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
