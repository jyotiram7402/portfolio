import {
  Blocks,
  Brain,
  Cloud,
  Database,
  Server,
  Terminal,
  Wrench,
  MonitorSmartphone,
} from "lucide-react";

import type {
  Proficiency,
  ProficiencyMeta,
  SkillCategory,
} from "@/types/skills";

/**
 * The technology explorer's content.
 *
 * Two rules held throughout:
 *
 * 1. **No percentages.** Depth is a three-band `proficiency`, and each band means
 *    something specific (see `PROFICIENCY_META`). "Exploring" is used honestly —
 *    a grid where everything is "core" tells the reader nothing.
 *
 * 2. **Descriptions say what it is used for**, not what it is. A reader already
 *    knows what Docker is; what they want to know is what was built with it.
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
    id: "backend",
    label: "Backend",
    summary:
      "Where most of my time goes. Typed domains, explicit boundaries, and APIs designed to outlive their first consumer.",
    icon: Server,
    technologies: [
      {
        id: "java",
        name: "Java",
        description:
          "Primary language. Records, streams and the type system used to make invalid states unrepresentable.",
        proficiency: "core",
      },
      {
        id: "spring-boot",
        name: "Spring Boot",
        description:
          "Service scaffolding, configuration profiles, actuator health checks and dependency injection without the XML era.",
        proficiency: "core",
      },
      {
        id: "spring-data-jpa",
        name: "Spring Data JPA",
        description:
          "Repositories, projections and specifications — with an eye on the SQL each one actually generates.",
        proficiency: "core",
      },
      {
        id: "rest-api",
        name: "REST API",
        description:
          "Resource modelling, correct status codes, pagination, idempotency keys and versioning that does not break clients.",
        proficiency: "core",
      },
      {
        id: "hibernate",
        name: "Hibernate",
        description:
          "Entity mapping, fetch strategies and closing the N+1 queries an ORM makes easy to write by accident.",
        proficiency: "working",
      },
      {
        id: "spring-security",
        name: "Spring Security",
        description:
          "Filter chains, JWT and role-based authorisation wired at the method boundary rather than the controller.",
        proficiency: "working",
      },
      {
        id: "microservices",
        name: "Microservices",
        description:
          "Boundaries drawn around ownership. Async messaging where coupling would otherwise become a cascade.",
        proficiency: "working",
      },
      {
        id: "node",
        name: "Node.js",
        description:
          "Tooling, scripts and lightweight services where the event loop is the right shape for the workload.",
        proficiency: "working",
      },
      {
        id: "express",
        name: "Express",
        description:
          "Small HTTP surfaces and webhook receivers when a full framework would be more ceremony than value.",
        proficiency: "working",
      },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    summary:
      "Enough depth to build the interface a backend deserves — accessible, fast and free of layout shift.",
    icon: MonitorSmartphone,
    technologies: [
      {
        id: "react",
        name: "React",
        description:
          "Composition over configuration. Server Components by default, state pushed down to the leaf that needs it.",
        proficiency: "working",
      },
      {
        id: "nextjs",
        name: "Next.js",
        description:
          "App Router, streaming, metadata and image optimisation. This site is the working example.",
        proficiency: "working",
      },
      {
        id: "typescript",
        name: "TypeScript",
        description:
          "Strict mode, discriminated unions and no unchecked index access — types as the first test suite.",
        proficiency: "core",
      },
      {
        id: "javascript",
        name: "JavaScript",
        description:
          "The language underneath the frameworks: closures, promises, the event loop and the DOM as it really behaves.",
        proficiency: "core",
      },
      {
        id: "tailwind",
        name: "Tailwind CSS",
        description:
          "Design tokens as CSS custom properties, so a whole theme is one file and zero runtime.",
        proficiency: "core",
      },
      {
        id: "html",
        name: "HTML",
        description:
          "Semantics first. Landmarks, headings and native controls before a single ARIA attribute is reached for.",
        proficiency: "core",
      },
      {
        id: "css",
        name: "CSS",
        description:
          "Grid, container queries, custom properties and the cascade used deliberately instead of fought.",
        proficiency: "core",
      },
    ],
  },
  {
    id: "ai",
    label: "AI",
    summary:
      "Applied, not decorative. Retrieval that cites its sources, prompts under version control, evaluation before rollout.",
    icon: Brain,
    technologies: [
      {
        id: "llms",
        name: "LLMs",
        description:
          "Context windows, token budgets, structured output and the failure modes that only appear at scale.",
        proficiency: "working",
      },
      {
        id: "prompt-engineering",
        name: "Prompt Engineering",
        description:
          "Prompts treated as code: versioned, diffed and regression-tested against a fixed evaluation set.",
        proficiency: "working",
      },
      {
        id: "rag",
        name: "RAG",
        description:
          "Chunking strategy, hybrid retrieval and reranking — with citations, so an answer can be checked.",
        proficiency: "working",
      },
      {
        id: "langchain",
        name: "LangChain",
        description:
          "Orchestration for multi-step chains and tool calls, kept thin enough to debug when it misbehaves.",
        proficiency: "exploring",
      },
      {
        id: "openai",
        name: "OpenAI API",
        description:
          "Function calling, JSON mode and streaming responses behind a typed service boundary.",
        proficiency: "working",
      },
      {
        id: "claude",
        name: "Claude API",
        description:
          "Long-context reasoning and tool use, including agentic loops for internal developer tooling.",
        proficiency: "working",
      },
      {
        id: "vector-db",
        name: "Vector Databases",
        description:
          "Embedding pipelines, similarity search and the metadata filtering that makes results relevant, not just near.",
        proficiency: "exploring",
      },
    ],
  },
  {
    id: "cloud",
    label: "Cloud",
    summary:
      "Deploy it, observe it, and be able to explain the bill. Infrastructure as a consequence of the architecture.",
    icon: Cloud,
    technologies: [
      {
        id: "azure",
        name: "Azure",
        description:
          "App Service and container deployments with environment parity between staging and production.",
        proficiency: "working",
      },
      {
        id: "aws",
        name: "AWS",
        description:
          "EC2, S3 and RDS for the workloads where managed services remove more risk than they add.",
        proficiency: "exploring",
      },
      {
        id: "vercel",
        name: "Vercel",
        description:
          "Edge delivery, preview deployments per pull request, and Speed Insights read rather than ignored.",
        proficiency: "core",
      },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    summary:
      "A pipeline that gates on the checks that actually catch regressions, and nothing that merely looks thorough.",
    icon: Terminal,
    technologies: [
      {
        id: "docker",
        name: "Docker",
        description:
          "Multi-stage builds, small final images, and local environments that match what ships.",
        proficiency: "working",
      },
      {
        id: "github-actions",
        name: "GitHub Actions",
        description:
          "Typecheck, lint and build on every pull request, with caching that keeps the feedback loop under a minute.",
        proficiency: "working",
      },
      {
        id: "ci-cd",
        name: "CI/CD",
        description:
          "Trunk-based delivery, reversible deploys and migrations written to run before the code that needs them.",
        proficiency: "working",
      },
      {
        id: "kubernetes",
        name: "Kubernetes",
        description:
          "Deployments, services and probes — learning where an orchestrator earns its operational cost.",
        proficiency: "exploring",
      },
    ],
  },
  {
    id: "database",
    label: "Database",
    summary:
      "The schema is the architecture. Most performance problems are decided here, long before the profiler runs.",
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
        id: "redis",
        name: "Redis",
        description:
          "Caching with deliberate invalidation, rate limiting and short-lived locks around critical sections.",
        proficiency: "working",
      },
    ],
  },
  {
    id: "cms",
    label: "Commerce & CMS",
    summary:
      "Platform work on systems that were already live, already large, and already someone's revenue.",
    icon: Blocks,
    technologies: [
      {
        id: "magento",
        name: "Magento",
        description:
          "Custom modules, storefront work and catalogue performance on a store with real traffic behind it.",
        proficiency: "core",
      },
      {
        id: "sfmc",
        name: "Salesforce Marketing Cloud",
        description:
          "Journey Builder, data extensions, AMPscript and the SQL activities that feed them.",
        proficiency: "core",
      },
      {
        id: "opensearch",
        name: "OpenSearch",
        description:
          "Index mappings, analysers and synonym sets tuned so catalogue search matches intent, not spelling.",
        proficiency: "working",
      },
      {
        id: "optimizely",
        name: "Optimizely",
        description:
          "Experiment setup and content delivery, with results read as evidence rather than confirmation.",
        proficiency: "exploring",
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    summary:
      "The daily surface. Chosen for how quickly they let me find the truth about a system.",
    icon: Wrench,
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
          "Pull request review and branch policy on team delivery, including pipeline gates before merge.",
        proficiency: "core",
      },
      {
        id: "postman",
        name: "Postman",
        description:
          "Collections as living API documentation, with environments and tests kept alongside the endpoints.",
        proficiency: "core",
      },
      {
        id: "vscode",
        name: "VS Code",
        description:
          "Configured deliberately: workspace settings committed, so the whole team formats identically.",
        proficiency: "core",
      },
      {
        id: "claude-code",
        name: "Claude Code",
        description:
          "Agentic development for refactors, test scaffolding and reading unfamiliar codebases quickly.",
        proficiency: "working",
      },
    ],
  },
];

export const DEFAULT_SKILL_CATEGORY = skillCategories[0]?.id ?? "backend";

export function getSkillCategory(id: string): SkillCategory | undefined {
  return skillCategories.find((category) => category.id === id);
}

/** Flat list, for search or for counting. */
export const allTechnologies = skillCategories.flatMap(
  (category) => category.technologies,
);
