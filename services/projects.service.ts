import "server-only";

import { DOMAIN_SIGNALS, TOPIC_LABELS, projectsConfig } from "@/config/projects";
import { getProjectOverride } from "@/data/project-overrides";
import { projects as curatedProjects } from "@/data/projects";
import { githubService } from "@/services/github.service";
import type { GitHubRepository } from "@/types/github";
import type { Project, ProjectDomain, ProjectLink } from "@/types/projects";

/**
 * Project discovery.
 *
 * Turns GitHub repositories into the same `Project` shape the curated list uses, so the grid, the
 * filter and the schema generator do not care where an entry came from.
 *
 * The resolution order, and why:
 *
 *   1. **Repositories carrying the discovery topic.** The explicit signal. Tag a repo, it appears.
 *   2. **Most recently pushed repositories**, if nothing carries the topic yet. Without this the
 *      section is empty until you have gone and tagged something, which makes the feature look
 *      broken on the first deploy rather than merely unconfigured.
 *   3. **The curated list**, if GitHub is not configured or the API fails. Client work with no
 *      public repository lives there permanently and is always appended.
 *
 * Server-only: it reads the GitHub token through `githubService`.
 */

export type ProjectsResolution = "topic" | "recent" | "curated";

export interface ProjectsResult {
  projects: readonly Project[];
  /** Which path produced the list. Rendered as a one-line note under the grid. */
  resolution: ProjectsResolution;
  /** True when the API answered, whether or not anything matched. */
  live: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Inference                                                                 */
/* -------------------------------------------------------------------------- */

/** Title-cases an unrecognised topic so `event-sourcing` renders as `Event Sourcing`. */
function labelTopic(topic: string): string {
  const known = TOPIC_LABELS[topic.toLowerCase()];
  if (known) return known;

  return topic
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Infers domain buckets from topics and language.
 *
 * Falls back to `backend` rather than returning an empty array: a project with no domain is
 * invisible to every filter, which is worse than being filed slightly wrong.
 */
function inferDomains(repository: GitHubRepository): readonly ProjectDomain[] {
  const topics = new Set(repository.topics.map((topic) => topic.toLowerCase()));
  const language = repository.language?.toLowerCase();

  const matched = DOMAIN_SIGNALS.filter(
    (signal) =>
      signal.topics.some((topic) => topics.has(topic)) ||
      (language !== undefined && signal.languages?.includes(language) === true),
  ).map((signal) => signal.domain);

  return matched.length > 0 ? [...new Set(matched)] : ["backend"];
}

/**
 * Builds the technology chips.
 *
 * Language first because it is the one fact GitHub is never wrong about, then topics that read as
 * technologies. The discovery topic itself is excluded — it is site plumbing, not a technology.
 */
function inferStack(repository: GitHubRepository): readonly string[] {
  const stack: string[] = [];
  if (repository.language) stack.push(repository.language);

  for (const topic of repository.topics) {
    if (topic.toLowerCase() === projectsConfig.discoveryTopic) continue;
    const label = labelTopic(topic);
    if (!stack.includes(label)) stack.push(label);
  }

  return stack.slice(0, 8);
}

/**
 * Human-readable period from the repository's own dates.
 *
 * A single year when created and last pushed in the same one, a range otherwise, and
 * "— Present" when it has been touched within six months, which is the honest signal for
 * "still being worked on".
 */
function inferPeriod(repository: GitHubRepository): string {
  const created = new Date(repository.createdAt).getFullYear();
  const pushed = new Date(repository.pushedAt);
  const pushedYear = pushed.getFullYear();

  const sixMonthsAgo = Date.now() - 1000 * 60 * 60 * 24 * 182;
  const isActive = pushed.getTime() > sixMonthsAgo;

  if (isActive) {
    return created === pushedYear ? `${created} — Present` : `${created} — Present`;
  }
  return created === pushedYear ? String(created) : `${created} — ${pushedYear}`;
}

function inferStatus(repository: GitHubRepository): Project["status"] {
  const sixMonthsAgo = Date.now() - 1000 * 60 * 60 * 24 * 182;
  if (new Date(repository.pushedAt).getTime() > sixMonthsAgo) return "active";
  // A repository with no description was never finished being explained, let alone built.
  return repository.description ? "shipped" : "prototype";
}

/** Turns `payment-gateway-integration` into `Payment Gateway Integration`. */
function humaniseRepoName(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/* -------------------------------------------------------------------------- */
/*  Mapping                                                                   */
/* -------------------------------------------------------------------------- */

function toProject(repository: GitHubRepository): Project | null {
  const override = getProjectOverride(repository.name);
  if (override?.hidden) return null;

  const links: ProjectLink[] = [
    { label: "Repository", href: repository.htmlUrl, kind: "repo" },
  ];

  if (repository.homepage) {
    links.push({ label: "Live", href: repository.homepage, kind: "live" });
  }
  if (override?.links) links.push(...override.links);

  const description =
    override?.tagline ??
    repository.description ??
    "No description on the repository yet.";

  return {
    id: repository.name,
    slug: repository.name,
    name: override?.name ?? humaniseRepoName(repository.name),
    tagline: description,
    summary: override?.summary ?? description,
    domains: override?.domains ?? inferDomains(repository),
    stack: override?.stack ?? inferStack(repository),
    // Highlights cannot be inferred — an empty array renders as nothing rather than as filler.
    highlights: override?.highlights ?? [],
    status: override?.status ?? inferStatus(repository),
    period: inferPeriod(repository),
    links,
    featured:
      override?.featured ?? repository.stars >= projectsConfig.featuredStarThreshold,

    source: override ? "merged" : "github",
    stars: repository.stars,
    forks: repository.forks,
    language: repository.language,
    updatedAt: repository.pushedAt,
    topics: repository.topics,
  };
}

/* -------------------------------------------------------------------------- */
/*  Resolution                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Featured first, then by stars, then by recency.
 *
 * Stars before recency because a starred repository is one someone else found useful, which is a
 * stronger signal than "I pushed a README fix yesterday".
 */
function sortProjects(a: Project, b: Project): number {
  if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
  if ((b.stars ?? 0) !== (a.stars ?? 0)) return (b.stars ?? 0) - (a.stars ?? 0);
  return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
}

export async function getProjects(): Promise<ProjectsResult> {
  const result = await githubService.getRepositories({
    // Fetch the full page and filter locally: the REST API cannot filter by topic, and one
    // request for 100 repositories is cheaper than the alternatives.
    limit: 100,
    includeForks: projectsConfig.includeForks,
    includeArchived: projectsConfig.includeArchived,
    sort: "pushed",
  });

  if (!result.ok) {
    return { projects: curatedProjects, resolution: "curated", live: false };
  }

  const excluded = new Set(
    projectsConfig.excludedRepos.map((name) => name.toLowerCase()),
  );

  const candidates = result.data.filter(
    (repository) => !excluded.has(repository.name.toLowerCase()),
  );

  const tagged = candidates.filter((repository) =>
    repository.topics.some(
      (topic) => topic.toLowerCase() === projectsConfig.discoveryTopic,
    ),
  );

  let resolution: ProjectsResolution = "topic";
  let selected = tagged.slice(0, projectsConfig.maxRepos);

  if (selected.length === 0) {
    if (!projectsConfig.fallbackToRecent) {
      return { projects: curatedProjects, resolution: "curated", live: true };
    }
    resolution = "recent";
    selected = candidates.slice(0, projectsConfig.fallbackCount);
  }

  const discovered = selected
    .map(toProject)
    .filter((project): project is Project => project !== null)
    .toSorted(sortProjects);

  // Curated entries are always appended. They exist precisely because they have no public
  // repository, so discovery can never find them.
  const discoveredIds = new Set(discovered.map((project) => project.id.toLowerCase()));
  const extras = curatedProjects.filter(
    (project) => !discoveredIds.has(project.id.toLowerCase()),
  );

  return {
    projects: [...discovered, ...extras],
    resolution,
    live: true,
  };
}

export const projectsService = {
  getProjects,
  discoveryTopic: projectsConfig.discoveryTopic,
} as const;
