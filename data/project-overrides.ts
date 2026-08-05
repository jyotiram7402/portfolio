import type { ProjectOverride } from "@/types/projects";

/**
 * Per-repository curation.
 *
 * Automatic discovery gets you the facts — name, description, language, stars, last push. It cannot
 * get you the one thing a reader actually wants: what was hard, and what you decided.
 *
 * So this file is optional and additive. A repository tagged with the discovery topic appears with
 * or without an entry here. Adding one lets you replace the GitHub description with a real tagline
 * and list the two or three decisions worth defending in an interview.
 *
 * `repo` must match the repository name exactly (case is ignored). Everything else is optional and
 * falls back to what the API returned.
 *
 * ---------------------------------------------------------------------------
 * The entries below are examples using plausible repository names. Rename `repo` to match your
 * actual repositories, or delete an entry — nothing breaks either way, and an override for a
 * repository that does not exist is silently ignored.
 * ---------------------------------------------------------------------------
 */
export const projectOverrides: readonly ProjectOverride[] = [
  {
    repo: "spring-boot-starter",
    name: "Spring Service Template",
    tagline: "The Spring Boot starting point I reach for, with the boring parts already right.",
    summary:
      "An opinionated Spring Boot template: layered package structure, Spring Security with JWT, Flyway migrations, testcontainers-backed integration tests, actuator health checks, and CI that gates on the checks which actually catch regressions.",
    domains: ["java", "spring", "backend"],
    highlights: [
      "Migrations run before the code that needs them, so a deploy is reversible.",
      "Integration tests against a real database in a container, not an in-memory imitation of one.",
      "Method-level authorisation rather than controller-level, so a new endpoint is closed by default.",
    ],
    status: "active",
    featured: true,
  },
  {
    repo: "rag-assistant",
    tagline: "An assistant that answers from documents, with citations — or declines.",
    summary:
      "A retrieval pipeline over internal documentation: chunking tuned to document structure, hybrid retrieval with reranking, and answers that cite their source. Prompts are versioned in the repository and every change runs against a fixed evaluation set before it ships.",
    domains: ["ai", "backend"],
    highlights: [
      "Citations are mandatory — an answer with no retrieved source is refused rather than hallucinated.",
      "Prompts under version control with a regression set, so a prompt edit is reviewable like code.",
      "Hybrid retrieval combining keyword and vector search, reranked before it reaches the model.",
    ],
    status: "active",
    featured: true,
  },
];

const overridesByRepo = new Map(
  projectOverrides.map((override) => [override.repo.toLowerCase(), override]),
);

export function getProjectOverride(repo: string): ProjectOverride | undefined {
  return overridesByRepo.get(repo.toLowerCase());
}
