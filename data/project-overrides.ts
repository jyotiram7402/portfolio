import { projects } from "@/data/projects";
import type { ProjectOverride } from "@/types/projects";

/**
 * Per-repository curation for **discovered** projects.
 *
 * Automatic discovery gets the facts — name, description, language, stars, last push. It
 * cannot get the one thing a reader wants: what was hard, and what was decided.
 *
 * **This file no longer holds copy.** It used to, and that was a bug waiting to surface:
 * `data/projects.ts` described the same three projects, and `toProject()` in
 * `services/projects.service.ts` reads its copy from *here*. So the moment
 * `GITHUB_USERNAME` was set and discovery started working, the richer curated copy would
 * have been silently discarded for exactly the repositories that are publicly
 * discoverable — the ones a visitor is most likely to look at.
 *
 * Instead the overrides are derived from the curated list. Copy is written once, in
 * `data/projects.ts`, and a project keeps the same description whether the GitHub API
 * answered or not. The only entries a curated project needs to carry for this to work
 * are its exact repository name as `id` and a link of kind `repo`.
 *
 * `MANUAL` is the escape hatch: a repository that is not in the curated list but still
 * needs its inferred metadata corrected, or hiding outright. It wins over the derived
 * entry, so a one-off fix does not require editing the curated copy.
 *
 * `repo` is matched case-insensitively. An override for a repository that does not exist
 * is silently ignored, so a typo cannot break the section.
 */

/**
 * Curated entries that correspond to a real repository.
 *
 * The `repo` link is the test. Work with no public repository — the payment integrations,
 * the DevContainer — has an empty `links` array and is therefore never a candidate: there
 * is no repository for discovery to match it against.
 */
const DERIVED: readonly ProjectOverride[] = projects
  .filter((project) => project.links.some((link) => link.kind === "repo"))
  .map((project) => ({
    repo: project.id,
    name: project.name,
    tagline: project.tagline,
    summary: project.summary,
    domains: project.domains,
    stack: project.stack,
    highlights: project.highlights,
    status: project.status,
    featured: project.featured,
  }));

/**
 * Hand-written overrides, applied on top of the derived set.
 *
 * Empty by design. Everything currently worth curating is in `data/projects.ts`, which is
 * where new copy should go — an entry here only earns its place if the repository should
 * *not* appear in the curated list but still needs correcting or hiding.
 */
const MANUAL: readonly ProjectOverride[] = [];

export const projectOverrides: readonly ProjectOverride[] = [...DERIVED, ...MANUAL];

/** Manual entries are inserted last, so they replace the derived entry for the same repo. */
const overridesByRepo = new Map(
  projectOverrides.map((override) => [override.repo.toLowerCase(), override]),
);

export function getProjectOverride(repo: string): ProjectOverride | undefined {
  return overridesByRepo.get(repo.toLowerCase());
}
