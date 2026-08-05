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
    topics: ["java", "jvm", "maven", "gradle", "junit"],
    languages: ["java", "kotlin"],
  },
  {
    domain: "spring",
    topics: [
      "spring",
      "spring-boot",
      "springboot",
      "spring-security",
      "spring-mvc",
      "spring-data",
      "jpa",
      "hibernate",
    ],
  },
  {
    domain: "microservices",
    topics: [
      "microservices",
      "microservice",
      "kafka",
      "event-driven",
      "rabbitmq",
      "grpc",
      "service-discovery",
    ],
  },
  {
    domain: "ai",
    topics: [
      "ai",
      "genai",
      "llm",
      "rag",
      "openai",
      "anthropic",
      "claude",
      "langchain",
      "mcp",
      "embeddings",
      "vector-database",
      "machine-learning",
      "opensearch",
      "elasticsearch",
    ],
  },
  {
    domain: "mern",
    topics: ["mern", "mongodb", "express", "expressjs", "node", "nodejs"],
  },
  {
    domain: "fullstack",
    topics: [
      "fullstack",
      "full-stack",
      "react",
      "nextjs",
      "next-js",
      "tailwind",
      "tailwindcss",
      "frontend",
    ],
    languages: ["typescript", "javascript"],
  },
  {
    domain: "backend",
    topics: [
      "backend",
      "api",
      "rest",
      "rest-api",
      "postgresql",
      "mysql",
      "redis",
      "docker",
      "kubernetes",
      "fastapi",
      "aws",
      "jwt",
      "oauth2",
    ],
    languages: ["python", "go", "rust", "csharp"],
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
  kafka: "Apache Kafka",
  opensearch: "OpenSearch",
  llm: "LLMs",
  rag: "RAG",
  genai: "GenAI",
  mcp: "MCP",
  openai: "OpenAI API",
  anthropic: "Claude API",
  claude: "Claude Code",
  langchain: "LangChain",
  fastapi: "FastAPI",
  jwt: "JWT",
  oauth2: "OAuth2",
  "spring-mvc": "Spring MVC",
  "spring-data": "Spring Data JPA",
  junit: "JUnit",
  devcontainers: "DevContainers",
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
