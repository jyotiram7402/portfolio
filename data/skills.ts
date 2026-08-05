import {
  Braces,
  Brain,
  Cloud,
  Database,
  MonitorSmartphone,
  Server,
  Terminal,
  Wrench,
} from "lucide-react";

import type {
  Proficiency,
  ProficiencyMeta,
  SkillCategory,
} from "@/types/skills";

/**
 * The technology explorer's content.
 *
 * Ordered by positioning, not alphabetically: Core Java first, then the Spring backend, then data
 * and messaging — because those are what a Java backend screen asks about. AI comes next because it
 * is the differentiator, and the JavaScript stack last because it is real but secondary.
 *
 * Two rules held throughout:
 *
 * 1. **No percentages.** Depth is a three-band `proficiency`, and each band means something
 *    specific. "Exploring" is used honestly — a grid where everything is "core" tells a reader
 *    nothing.
 * 2. **Descriptions say what it is used for**, not what it is. A reader already knows what Kafka is;
 *    what they want to know is what was built with it.
 */

export const PROFICIENCY_META = {
  core: {
    label: "Core",
    dots: 3,
    description: "Used daily, in production",
  },
  working: {
    label: "Working",
    dots: 2,
    description: "Shipped with, comfortable",
  },
  exploring: {
    label: "Exploring",
    dots: 1,
    description: "Actively learning",
  },
} as const satisfies Record<Proficiency, ProficiencyMeta>;

export const skillCategories: readonly SkillCategory[] = [
  {
    id: "core-java",
    label: "Core Java",
    summary:
      "The language itself, not just the frameworks on top of it. This is what a backend interview actually probes, so it is held to the highest standard here.",
    icon: Braces,
    technologies: [
      {
        id: "java",
        name: "Java 8 / 17",
        description:
          "Primary language. Records, sealed types and pattern matching used where they remove a class of bug rather than for their own sake.",
        proficiency: "core",
      },
      {
        id: "collections",
        name: "Collections",
        description:
          "Choosing the structure for the access pattern — and knowing the cost of the one already in the code.",
        proficiency: "core",
      },
      {
        id: "streams",
        name: "Streams & Lambda",
        description:
          "Collectors and pipelines where they clarify intent, and a plain loop where they would not.",
        proficiency: "core",
      },
      {
        id: "optional",
        name: "Optional",
        description:
          "Used at API boundaries to make absence explicit, not sprinkled through fields where null was the honest answer.",
        proficiency: "core",
      },
      {
        id: "concurrency",
        name: "Multithreading & Concurrency",
        description:
          "Executors, futures and CompletableFuture — and the understanding that shared mutable state is the actual problem.",
        proficiency: "working",
      },
      {
        id: "jvm",
        name: "JVM & GC",
        description:
          "Enough of the memory model and collector behaviour to read a heap profile and know which knob matters.",
        proficiency: "working",
      },
      {
        id: "dsa",
        name: "Data Structures & Algorithms",
        description:
          "Complexity reasoned about before the code is written, which is when it is cheap.",
        proficiency: "core",
      },
    ],
  },
  {
    id: "backend",
    label: "Spring & Backend",
    summary:
      "Where most of my time goes. Typed domains, explicit boundaries, and APIs designed to outlive their first consumer.",
    icon: Server,
    technologies: [
      {
        id: "spring-boot",
        name: "Spring Boot",
        description:
          "Service scaffolding, configuration profiles, actuator health checks and dependency injection without the XML era.",
        proficiency: "core",
      },
      {
        id: "spring-mvc",
        name: "Spring MVC",
        description:
          "Controller design, validation and exception handling that returns a useful body rather than a stack trace.",
        proficiency: "core",
      },
      {
        id: "spring-security",
        name: "Spring Security",
        description:
          "Filter chains, JWT and OAuth2, with authorisation at the method boundary so a new endpoint is closed by default.",
        proficiency: "core",
      },
      {
        id: "rest-api",
        name: "REST API Design",
        description:
          "Resource modelling, correct status codes, pagination, idempotency keys and versioning that does not break clients.",
        proficiency: "core",
      },
      {
        id: "hibernate-jpa",
        name: "Hibernate & JPA",
        description:
          "Entity mapping, fetch strategies and closing the N+1 queries an ORM makes easy to write by accident.",
        proficiency: "core",
      },
      {
        id: "microservices",
        name: "Microservices",
        description:
          "Boundaries drawn around data ownership. Built independent driver, merchant and notification services talking over REST and Kafka.",
        proficiency: "working",
      },
      {
        id: "event-driven",
        name: "Event-Driven Architecture",
        description:
          "Async messaging where a synchronous call would turn one outage into three.",
        proficiency: "working",
      },
      {
        id: "fastapi",
        name: "FastAPI",
        description:
          "Python services where the workload suited it — the AI search layer and a containerised rules engine.",
        proficiency: "working",
      },
    ],
  },
  {
    id: "data",
    label: "Data & Messaging",
    summary:
      "The schema is the architecture. Most performance problems are decided here, long before a profiler runs.",
    icon: Database,
    technologies: [
      {
        id: "mysql",
        name: "MySQL",
        description:
          "Normalised schemas, composite indexes and reading `EXPLAIN` before blaming the ORM.",
        proficiency: "core",
      },
      {
        id: "sql",
        name: "SQL",
        description:
          "Joins, window functions and aggregation written by hand when the generated query is the problem.",
        proficiency: "core",
      },
      {
        id: "kafka",
        name: "Apache Kafka",
        description:
          "Event streams for real-time order updates across services, with key design that preserves the ordering the domain needs.",
        proficiency: "working",
      },
      {
        id: "redis",
        name: "Redis",
        description:
          "Caching with deliberate invalidation — cut repeated database reads on a streaming API under load.",
        proficiency: "working",
      },
      {
        id: "postgresql",
        name: "PostgreSQL",
        description:
          "JSONB, window functions and constraints used to make the database enforce the invariants.",
        proficiency: "working",
      },
      {
        id: "mongodb",
        name: "MongoDB",
        description:
          "Document modelling for genuinely schema-flexible data, with aggregation pipelines for reporting.",
        proficiency: "working",
      },
      {
        id: "query-optimisation",
        name: "Query Optimisation",
        description:
          "Execution plans read first, indexes added second, and the migration written in the same pull request as the query.",
        proficiency: "working",
      },
      {
        id: "hikaricp",
        name: "HikariCP",
        description:
          "Pool sizing set from measurement rather than from a default that happened to work locally.",
        proficiency: "working",
      },
    ],
  },
  {
    id: "ai",
    label: "AI & GenAI",
    summary:
      "The differentiator. I lead the AI-first initiative at Southco as a board member of the AI team — this is applied engineering, not prompt collecting.",
    icon: Brain,
    technologies: [
      {
        id: "claude-code",
        name: "Claude Code",
        description:
          "Agentic development. Led the R&D, presented findings to the CTO, and made it the standard workflow for 20 developers.",
        proficiency: "core",
      },
      {
        id: "mcp",
        name: "MCP",
        description:
          "Model Context Protocol for wiring tools to models with typed inputs and bounded permissions.",
        proficiency: "working",
      },
      {
        id: "secure-ai-tooling",
        name: "Secure AI Tooling",
        description:
          "Isolating agentic tools from legacy customer data — the risk I found, and the DevContainer that answered it.",
        proficiency: "core",
      },
      {
        id: "prompt-engineering",
        name: "Prompt Engineering",
        description:
          "Prompts treated as code: versioned, diffed and regression-tested rather than tuned by feel.",
        proficiency: "core",
      },
      {
        id: "llm-apis",
        name: "LLM API Integration",
        description:
          "Function calling, structured output and streaming behind a typed service boundary.",
        proficiency: "working",
      },
      {
        id: "ai-search",
        name: "AI-Powered Search",
        description:
          "Built a search service on OpenSearch and ElasticSuite for relevance, shipped to production in a month.",
        proficiency: "working",
      },
      {
        id: "rag",
        name: "RAG",
        description:
          "Chunking, hybrid retrieval and reranking — with citations, so an answer can be checked.",
        proficiency: "exploring",
      },
    ],
  },
  {
    id: "cloud-devops",
    label: "Cloud & DevOps",
    summary:
      "Deploy it, observe it, and be able to explain the bill. Infrastructure as a consequence of the architecture.",
    icon: Cloud,
    technologies: [
      {
        id: "docker",
        name: "Docker",
        description:
          "Multi-stage builds and containerised services. The isolated AI DevContainer is the one 20 developers use daily.",
        proficiency: "core",
      },
      {
        id: "devcontainers",
        name: "DevContainers",
        description:
          "Reproducible development environments — the mechanism behind the secure agentic AI rollout.",
        proficiency: "core",
      },
      {
        id: "aws",
        name: "AWS",
        description:
          "EC2 and S3 for compute and media storage on a streaming backend.",
        proficiency: "working",
      },
      {
        id: "ci-cd",
        name: "CI/CD",
        description:
          "Pipelines that gate on the checks which actually catch regressions, and reversible deploys.",
        proficiency: "working",
      },
      {
        id: "jenkins",
        name: "Jenkins",
        description: "Build and deploy pipelines for JVM services.",
        proficiency: "working",
      },
      {
        id: "azure-devops",
        name: "Azure DevOps",
        description:
          "Repos, pipelines and boards on client delivery, with environment parity between staging and production.",
        proficiency: "working",
      },
      {
        id: "kubernetes",
        name: "Kubernetes",
        description:
          "Deployments, services and probes — learning where an orchestrator earns its operational cost.",
        proficiency: "exploring",
      },
      {
        id: "maven",
        name: "Maven",
        description: "Multi-module builds, dependency management and reproducible artefacts.",
        proficiency: "core",
      },
    ],
  },
  {
    id: "frontend",
    label: "Frontend & MERN",
    summary:
      "Real, and honestly secondary. Enough depth to ship a full-stack feature end to end and build the interface a backend deserves.",
    icon: MonitorSmartphone,
    technologies: [
      {
        id: "react",
        name: "React",
        description:
          "Full-stack work with a React frontend against Spring Boot and MongoDB in a loosely coupled architecture.",
        proficiency: "working",
      },
      {
        id: "javascript",
        name: "JavaScript",
        description:
          "The language underneath the frameworks: closures, promises, the event loop and the DOM as it really behaves.",
        proficiency: "working",
      },
      {
        id: "typescript",
        name: "TypeScript",
        description:
          "Strict mode, discriminated unions and no unchecked index access — types as the first test suite.",
        proficiency: "working",
      },
      {
        id: "nextjs",
        name: "Next.js",
        description:
          "App Router, server components and streaming. This site is the working example.",
        proficiency: "working",
      },
      {
        id: "tailwind",
        name: "Tailwind CSS",
        description:
          "Design tokens as CSS custom properties, so a whole theme is one file and zero runtime.",
        proficiency: "working",
      },
      {
        id: "html-css",
        name: "HTML & CSS",
        description:
          "Semantics first — landmarks, headings and native controls before a single ARIA attribute.",
        proficiency: "working",
      },
    ],
  },
  {
    id: "practices",
    label: "Practices",
    summary:
      "How the work actually gets done. Design discipline, tests that mean something, and review as the place bugs are cheapest.",
    icon: Wrench,
    technologies: [
      {
        id: "design-patterns",
        name: "Design Patterns",
        description:
          "Applied where they name a problem the code already has, not imposed up front.",
        proficiency: "core",
      },
      {
        id: "solid",
        name: "SOLID",
        description:
          "Mostly dependency direction and single responsibility, which are the two that keep paying.",
        proficiency: "core",
      },
      {
        id: "junit",
        name: "JUnit",
        description:
          "Unit and integration tests that assert behaviour, including the failure paths.",
        proficiency: "core",
      },
      {
        id: "mockito",
        name: "Mockito",
        description:
          "Mocking at the boundary only — a test that mocks the thing under test proves nothing.",
        proficiency: "working",
      },
      {
        id: "code-reviews",
        name: "Code Reviews",
        description:
          "Small, reviewable changes. Review is the cheapest place a bug can be caught.",
        proficiency: "core",
      },
      {
        id: "agile",
        name: "Agile / Scrum",
        description:
          "Sprint planning and delivery with client teams in Jira and Workfront.",
        proficiency: "core",
      },
      {
        id: "production-support",
        name: "Production Support",
        description:
          "On the hook for live payment issues. A midnight PayPal failure resolved with zero downtime.",
        proficiency: "core",
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    summary: "The daily surface. Chosen for how quickly they get me to the truth about a system.",
    icon: Terminal,
    technologies: [
      {
        id: "git",
        name: "Git",
        description:
          "Small, reviewable commits, interactive rebase for a readable history, and bisect when it matters.",
        proficiency: "core",
      },
      {
        id: "bitbucket",
        name: "Bitbucket",
        description:
          "Pull request review and branch policy on team delivery, with pipeline gates before merge.",
        proficiency: "core",
      },
      {
        id: "jira",
        name: "Jira & Workfront",
        description: "Sprint delivery and production support tracking with client teams.",
        proficiency: "core",
      },
      {
        id: "postman",
        name: "Postman",
        description:
          "Collections as living API documentation, with environments and tests beside the endpoints.",
        proficiency: "core",
      },
      {
        id: "python",
        name: "Python",
        description:
          "The second language. FastAPI services, the AI search layer and the configurator engine.",
        proficiency: "working",
      },
    ],
  },
];

export const DEFAULT_SKILL_CATEGORY = skillCategories[0]?.id ?? "core-java";

export function getSkillCategory(id: string): SkillCategory | undefined {
  return skillCategories.find((category) => category.id === id);
}

/** Flat list, for search or for counting. */
export const allTechnologies = skillCategories.flatMap(
  (category) => category.technologies,
);
