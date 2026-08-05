import type { Project, ProjectDomain } from "@/types/projects";

/**
 * Projects.
 *
 * These are the real repositories from the résumé, and the `id` of each one is its exact GitHub
 * repository name. That matters: `services/projects.service.ts` fetches repositories from the API
 * and de-duplicates against this list by id, so a repository that is both tagged on GitHub and
 * listed here appears once, with the live figures attached.
 *
 * So this file serves two purposes:
 *   • It is the fallback when GitHub is unconfigured or unreachable.
 *   • It is what the AI assistant and the ⌘K palette index, because both run in the browser and
 *     cannot reach a server-only service.
 *
 * Tagging these repositories `portfolio-project` on GitHub adds stars, language and last-push date
 * on top of the copy below. Nothing needs to change here when you do.
 */
export const projects: readonly Project[] = [
  {
    id: "Foodies--Food_Delivery_Application",
    slug: "foodies-food-delivery-microservices",
    name: "Foodies — Food Delivery Microservices",
    tagline:
      "Event-driven microservices backend with independent driver, merchant and notification services.",
    summary:
      "A microservices backend for food delivery: independent Driver, Merchant and Notification services communicating over REST and Apache Kafka event streams for real-time order updates, with stateless JWT authentication enforced across every service and client endpoint.",
    domains: ["java", "spring", "microservices", "backend"],
    stack: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "Apache Kafka",
      "MySQL",
      "JWT",
      "REST API",
    ],
    highlights: [
      "Service boundaries drawn around data ownership — driver, merchant and notification each own their own state rather than sharing a schema.",
      "Kafka event streams for real-time order updates, so a slow notification never blocks an order being accepted.",
      "Stateless authentication with Spring Security and JWT, applied at the service boundary rather than at the gateway alone.",
    ],
    status: "shipped",
    period: "2024",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/Foodies--Food_Delivery_Application",
        kind: "repo",
      },
    ],
    source: "curated",
    featured: true,
  },
  {
    id: "MusicON--MusicApplication",
    slug: "musicon-streaming-backend",
    name: "MusicON — Music Streaming Backend",
    tagline: "Media upload, storage and streaming APIs with Redis caching on the hot path.",
    summary:
      "A streaming backend built on Spring Boot: REST APIs for media upload, storage and playback backed by AWS S3 and MySQL, with Redis in-memory caching added to cut repeated database reads and hold API response times steady under load.",
    domains: ["java", "spring", "backend"],
    stack: ["Java", "Spring Boot", "MySQL", "Redis", "AWS S3", "REST API"],
    highlights: [
      "S3 for media and MySQL for metadata — the split that keeps a streaming path off the database.",
      "Redis caching with deliberate invalidation, measured against repeated-read latency rather than added by reflex.",
      "REST APIs designed around the streaming access pattern instead of exposing the table shape.",
    ],
    status: "shipped",
    period: "2024",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/MusicON--MusicApplication",
        kind: "repo",
      },
    ],
    source: "curated",
    featured: true,
  },
  {
    id: "FirstReview-Full-Stack-Movie-Review-Application",
    slug: "firstreview-full-stack",
    name: "FirstReview — Full Stack Movie Reviews",
    tagline: "React frontend against a Spring Boot and MongoDB backend, loosely coupled.",
    summary:
      "A full-stack application pairing a React frontend with a Spring Boot and MongoDB backend over REST. Built deliberately loosely coupled, so the frontend talks to a documented API rather than to the database's shape.",
    domains: ["java", "spring", "fullstack", "mern"],
    stack: ["React", "Spring Boot", "MongoDB", "REST API", "JavaScript"],
    highlights: [
      "A documented REST contract between the two halves, so either side can be rebuilt without the other.",
      "MongoDB document modelling chosen for genuinely flexible review data rather than by default.",
    ],
    status: "shipped",
    period: "2024",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/FirstReview-Full-Stack-Movie-Review-Application",
        kind: "repo",
      },
    ],
    source: "curated",
  },
  {
    id: "ai-devcontainer",
    slug: "secure-agentic-ai-devcontainer",
    name: "Secure Agentic AI DevContainer",
    tagline: "Isolated environment that made agentic AI safe to adopt across 20 developers.",
    summary:
      "Work at Southco, not a public repository. Agentic AI tooling could read legacy customer data on developer machines. I identified the risk, presented findings to the CTO, and engineered a Docker-based DevContainer giving a fully isolated environment — adopted as the standard workflow by all 20 developers.",
    domains: ["ai", "backend"],
    stack: ["Docker", "DevContainers", "Claude Code", "MCP", "Secure AI Tooling"],
    highlights: [
      "The security question was answered before rollout rather than after — which is why adoption was possible at all.",
      "Full isolation from legacy customer data, so an agentic tool cannot read what it has no business reading.",
      "Adopted by all 20 developers as the standard workflow, not offered as an option nobody took.",
    ],
    status: "shipped",
    period: "2025",
    links: [],
    source: "curated",
    featured: true,
  },
  {
    id: "cable-part-configurator",
    slug: "cable-part-number-configurator",
    name: "Cable Part Number Configurator",
    tagline: "Containerised rules engine with role-separated public and admin services.",
    summary:
      "Work at Southco, not a public repository. A containerised FastAPI application with a rules-based configuration engine over a JSON-backed catalog, split into role-separated public and admin services and embedded into the storefront through a CSP-secured iframe.",
    domains: ["backend", "ai"],
    stack: ["Python", "FastAPI", "Docker", "REST API", "JSON"],
    highlights: [
      "Public and admin split into separate services, so the write surface is not reachable from the read one.",
      "A rules engine over a JSON catalog, so a configuration change is data rather than a deploy.",
      "Embedded via a CSP-secured iframe rather than an inline script, keeping the host page's policy intact.",
    ],
    status: "shipped",
    period: "2025",
    links: [],
    source: "curated",
  },
  {
    id: "payment-gateway-integrations",
    slug: "payment-gateway-integrations",
    name: "Payment Gateway Integrations",
    tagline: "PayPal, Stripe and AsiaPay — owned end to end, including the failure paths.",
    summary:
      "Work at Southco, not a public repository. End-to-end ownership of three payment gateways on an enterprise platform, and the single point of contact for every payment issue in production. The interesting part is not the happy path — it is transaction validation, webhook and callback processing, retries and failure handling.",
    domains: ["backend", "java", "microservices"],
    stack: ["Java", "REST API", "Webhooks", "MySQL", "Production Support"],
    highlights: [
      "Three gateways including AsiaPay for China and APAC, each with its own settlement and callback semantics.",
      "Webhook and callback processing built for replay and duplication, because both happen in production.",
      "Resolved a critical PayPal failure during a midnight incident with zero downtime — Spot Award.",
    ],
    status: "shipped",
    period: "2024 — Present",
    links: [],
    source: "curated",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id || project.slug === id);
}

/** Used by the assistant to answer domain-scoped questions. */
export function getProjectsByDomain(domain: ProjectDomain): readonly Project[] {
  return projects.filter((project) => project.domains.includes(domain));
}

/**
 * Every filterable domain, in display order — hiring priority, not alphabetical.
 *
 * `as const satisfies` rather than a type annotation: an annotation on a filtered result does not
 * reach the array literal, so each `id` would widen to `string` and no longer satisfy
 * `ProjectDomain`.
 */
export const projectDomains = [
  { id: "java", label: "Java" },
  { id: "spring", label: "Spring Boot" },
  { id: "microservices", label: "Microservices" },
  { id: "backend", label: "Backend" },
  { id: "ai", label: "AI" },
  { id: "fullstack", label: "Full Stack" },
  { id: "mern", label: "MERN" },
] as const satisfies readonly { id: ProjectDomain; label: string }[];
