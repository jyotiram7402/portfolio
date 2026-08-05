import type { ProjectDomain } from "@/types/projects";

/**
 * How projects are discovered from GitHub.
 *
 * The contract: tag a repository with `discoveryTopic` and it appears on the site within
 * `revalidateSeconds`. No code change, no deploy.
 *
 * `fallbackToRecent` is the detail that makes this usable on day one. Before any repository carries
 * the topic, the section would otherwise be empty — so it shows the most recently pushed
 * repositories instead, and quietly switches to the curated set the moment you start tagging.
 */
export const projectsConfig = {
  /**
   * Add this as a topic on any repository you want featured.
   * GitHub → repository → About → ⚙ → Topics.
   */
  discoveryTopic: "portfolio-project",

  /** Upper bound on discovered repositories. The grid stops being scannable past this. */
  maxRepos: 9,

  /** Show most-recent repositories when nothing carries the topic yet. */
  fallbackToRecent: true,
  /** How many to show in that fallback state. Deliberately fewer than `maxRepos`. */
  fallbackCount: 6,

  includeForks: false,
  includeArchived: false,

  /**
   * Never shown, regardless of topics. The portfolio's own repository is here because it is already
   * described by the site it builds — listing it is circular.
   */
  excludedRepos: ["portfolio", "jyotiram7402"],

  /**
   * Below this star count a repository is not marked featured automatically. Curation via
   * `data/project-overrides.ts` always wins over this.
   */
  featuredStarThreshold: 5,

  /** Matches the fetch cache in `services/github.service.ts`. One hour. */
  revalidateSeconds: 3600,
} as const;

/**
 * Maps GitHub signals onto the site's domain buckets.
 *
 * Checked against a repository's topics *and* its primary language, so a repo tagged `spring-boot`
 * and a repo whose language is `Java` both land in the right filter without an override.
 *
 * Every project gets `backend` or `frontend` as a floor, because an entry with no domain is
 * invisible to every filter.
 */
export const DOMAIN_SIGNALS: readonly {
  domain: ProjectDomain;
  topics: readonly string[];
  languages?: readonly string[];
}[] = [
  {
    domain: "java",
    topics: ["java", "jvm", "maven", "gradle"],
    languages: ["java", "kotlin"],
  },
  {
    domain: "spring",
    topics: ["spring", "spring-boot", "springboot", "spring-security", "jpa", "hibernate"],
  },
  {
    domain: "ai",
    topics: [
      "ai",
      "llm",
      "rag",
      "openai",
      "anthropic",
      "langchain",
      "embeddings",
      "vector-database",
      "machine-learning",
    ],
  },
  {
    domain: "mern",
    topics: ["mern", "mongodb", "express", "node", "nodejs", "react"],
  },
  {
    domain: "frontend",
    topics: ["frontend", "nextjs", "next-js", "react", "tailwind", "tailwindcss", "ui"],
    languages: ["typescript", "javascript", "css", "html", "svelte", "vue"],
  },
  {
    domain: "commerce",
    topics: ["magento", "ecommerce", "e-commerce", "commerce", "sfmc", "salesforce", "payments"],
    languages: ["php"],
  },
  {
    domain: "backend",
    topics: [
      "backend",
      "api",
      "rest",
      "rest-api",
      "microservices",
      "postgresql",
      "mysql",
      "redis",
      "docker",
      "kafka",
    ],
    languages: ["go", "rust", "python", "csharp"],
  },
];

/**
 * Topic → display name for the technology chips.
 *
 * GitHub topics are lowercase and hyphenated. Rendering `spring-boot` on a card looks like a slug;
 * this turns it into `Spring Boot`. Anything not listed is title-cased as a fallback.
 */
export const TOPIC_LABELS: Readonly<Record<string, string>> = {
  "spring-boot": "Spring Boot",
  springboot: "Spring Boot",
  "spring-security": "Spring Security",
  jpa: "Spring Data JPA",
  hibernate: "Hibernate",
  "rest-api": "REST API",
  api: "REST API",
  nextjs: "Next.js",
  "next-js": "Next.js",
  nodejs: "Node.js",
  node: "Node.js",
  tailwindcss: "Tailwind CSS",
  tailwind: "Tailwind CSS",
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  mongodb: "MongoDB",
  redis: "Redis",
  docker: "Docker",
  kubernetes: "Kubernetes",
  kafka: "Kafka",
  opensearch: "OpenSearch",
  llm: "LLMs",
  rag: "RAG",
  openai: "OpenAI API",
  anthropic: "Claude API",
  langchain: "LangChain",
  magento: "Magento",
  sfmc: "Salesforce Marketing Cloud",
  aws: "AWS",
  azure: "Azure",
  vercel: "Vercel",
  typescript: "TypeScript",
  javascript: "JavaScript",
  java: "Java",
  python: "Python",
  react: "React",
  express: "Express",
  microservices: "Microservices",
};
