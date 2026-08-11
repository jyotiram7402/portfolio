import type { Project, ProjectDomain } from "@/types/projects";
import { fuzzyMatch } from "@/utils/fuzzy";

/**
 * Selection and search over a resolved project list.
 *
 * Pure functions that take the list rather than importing it. That is the whole point:
 * projects are resolved on the server by `services/projects.service.ts` — from the GitHub
 * API, with curated entries appended — and a selector that imported `data/projects.ts`
 * directly would silently ignore everything discovery found. Whoever has the list passes
 * it in.
 *
 * Being pure also means these run unchanged on the server (the homepage, the detail page)
 * and in the client (the `/projects` search box), which is why there is one copy of the
 * ranking rule instead of two.
 */

/** How many projects the homepage shows. Three is the brief: a showcase, not a library. */
export const HOMEPAGE_PROJECT_COUNT = 3;

/**
 * Homepage ordering.
 *
 * `order` wins outright where it is set, because it is the one signal a human wrote
 * deliberately. Everything without an explicit order falls back to the service's existing
 * sort — featured, then stars, then recency — by keeping its incoming position, so this
 * function never re-litigates a decision the service already made.
 */
function byOrderThenIncoming(a: Project, b: Project): number {
  const left = a.order;
  const right = b.order;

  if (left !== undefined && right !== undefined) return left - right;
  if (left !== undefined) return -1;
  if (right !== undefined) return 1;
  return 0;
}

/**
 * The projects the homepage shows.
 *
 * Featured entries only, in `order`, capped. If fewer than `limit` are marked featured the
 * result is short rather than padded out with unfeatured work — a showcase that quietly
 * includes whatever was next is not a showcase.
 *
 * `toSorted` rather than `sort`: the input is a `readonly` list owned by the caller, and
 * sorting it in place would reorder the full library as a side effect of rendering three
 * cards.
 */
export function getFeaturedProjects(
  projects: readonly Project[],
  limit: number = HOMEPAGE_PROJECT_COUNT,
): readonly Project[] {
  return projects
    .filter((project) => project.featured === true)
    .toSorted(byOrderThenIncoming)
    .slice(0, limit);
}

export function getProjectBySlug(
  projects: readonly Project[],
  slug: string,
): Project | undefined {
  const wanted = slug.toLowerCase();
  return projects.find(
    (project) =>
      project.slug.toLowerCase() === wanted || project.id.toLowerCase() === wanted,
  );
}

/**
 * Other projects worth reading after this one.
 *
 * Ranked by how many domains they share with the current project, so "related" means
 * something. Ties fall back to the incoming order, which is already the service's
 * featured-then-stars ranking.
 */
export function getRelatedProjects(
  projects: readonly Project[],
  current: Project,
  limit = 3,
): readonly Project[] {
  const domains = new Set(current.domains);

  return projects
    .filter((project) => project.id !== current.id)
    .map((project) => ({
      project,
      shared: project.domains.filter((domain) => domains.has(domain)).length,
    }))
    .filter((entry) => entry.shared > 0)
    .toSorted((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map((entry) => entry.project);
}

export interface ProjectQuery {
  /** Free text. Matched against name, tagline and stack. */
  search?: string;
  /** `undefined` means every domain. */
  domain?: ProjectDomain;
  /** Restricts to featured entries. */
  featuredOnly?: boolean;
}

/**
 * Filters and ranks the library for the `/projects` page.
 *
 * Search reuses `fuzzyMatch` — the same matcher behind the command palette and the blog
 * search — so typing `sprbt` finds Spring Boot in all three places. One ranking rule for
 * the whole site is worth more than a marginally better one here.
 *
 * The name is weighted above the tagline, and the tagline above the stack: matching a
 * project's name is a much stronger signal of intent than matching one chip on it.
 */
export function queryProjects(
  projects: readonly Project[],
  { search, domain, featuredOnly }: ProjectQuery,
): readonly Project[] {
  let result = projects;

  if (featuredOnly === true) {
    result = result.filter((project) => project.featured === true);
  }

  if (domain !== undefined) {
    result = result.filter((project) => project.domains.includes(domain));
  }

  const term = search?.trim();
  if (term === undefined || term.length === 0) return result;

  return result
    .map((project) => {
      const name = fuzzyMatch(term, project.name).score * 3;
      const tagline = fuzzyMatch(term, project.tagline).score * 2;
      const stack = Math.max(
        0,
        ...project.stack.map((technology) => fuzzyMatch(term, technology).score),
      );

      return { project, score: name + tagline + stack };
    })
    .filter((entry) => entry.score > 0)
    .toSorted((a, b) => b.score - a.score)
    .map((entry) => entry.project);
}
