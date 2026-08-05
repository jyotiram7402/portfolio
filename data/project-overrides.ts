import type { ProjectOverride } from "@/types/projects";

/**
 * Per-repository curation.
 *
 * Automatic discovery gets the facts — name, description, language, stars, last push. It cannot get
 * the one thing a reader wants: what was hard, and what was decided.
 *
 * The three entries below match the repositories in `data/projects.ts` by exact name, so tagging
 * them `portfolio-project` on GitHub attaches live figures to this copy rather than replacing it.
 * Adding a new repository needs nothing here — it appears with its GitHub description until you
 * decide it deserves a better one.
 *
 * `repo` is matched case-insensitively. An override for a repository that does not exist is silently
 * ignored, so a typo cannot break the section.
 */
export const projectOverrides: readonly ProjectOverride[] = [
  {
    repo: "Foodies--Food_Delivery_Application",
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
    featured: true,
  },
  {
    repo: "MusicON--MusicApplication",
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
    featured: true,
  },
  {
    repo: "FirstReview-Full-Stack-Movie-Review-Application",
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
  },
];

const overridesByRepo = new Map(
  projectOverrides.map((override) => [override.repo.toLowerCase(), override]),
);

export function getProjectOverride(repo: string): ProjectOverride | undefined {
  return overridesByRepo.get(repo.toLowerCase());
}
