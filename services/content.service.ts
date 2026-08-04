import type { ComponentType } from "react";

import { hasPostBody } from "@/content/blog";
import {
  activeCategories,
  blogCategories,
  featuredPosts,
  getCategory,
  publishedPosts,
} from "@/data/blog";
import type { PostMeta, PostNeighbours } from "@/types/blog";
import { fuzzyMatchFields } from "@/utils/fuzzy";

/**
 * The blog's read model.
 *
 * Every list, filter and lookup the blog needs, in one place, so no route handler
 * re-derives "newest first, drafts excluded" and gets it subtly different.
 *
 * Not marked `server-only`: everything here is public content with no secrets, and the
 * blog's search input runs the same filter on the client. That is deliberate — one
 * implementation of "which posts match this query" rather than two that disagree.
 */

/**
 * Posts that have both a registry entry and a renderable body.
 *
 * A registry entry with no MDX file would otherwise appear in listings and 404 when
 * opened. Filtering here means that mistake shows up as a missing card during
 * development rather than as a broken link in production.
 */
export const renderablePosts: readonly PostMeta[] = publishedPosts.filter((post) =>
  hasPostBody(post.slug),
);

export function getPostMeta(slug: string): PostMeta | undefined {
  return renderablePosts.find((post) => post.slug === slug);
}

/**
 * Loads a post body.
 *
 * The loader map is behind a dynamic `import()` rather than a top-level one. That is what
 * keeps the compiled articles out of the client bundle: this module is imported by
 * `lib/search-index.ts`, which runs in the command palette, so a static import of the map
 * would pull every MDX chunk reference into the browser graph.
 *
 * Each article is still its own chunk, so one download is one article.
 */
export async function loadPostBody(
  slug: string,
): Promise<ComponentType | undefined> {
  if (!hasPostBody(slug)) return undefined;

  const { postModules } = await import("@/content/blog/loaders");
  const loader = postModules[slug as keyof typeof postModules];
  if (!loader) return undefined;

  const module = await loader();
  return module.default;
}

/* -------------------------------------------------------------------------- */
/*  Listing                                                                   */
/* -------------------------------------------------------------------------- */

export interface ListOptions {
  /** Category id. `undefined` or `"all"` means no filter. */
  category?: string;
  /** Free-text query, matched with the shared fuzzy scorer. */
  query?: string;
  limit?: number;
}

/**
 * Filtered, sorted list.
 *
 * Search matches title, description and tags with different weights — a title hit
 * outranks a tag hit even when the tag match is tighter, which is what a reader
 * expects. Ranking only kicks in when there is a query; otherwise the date order from
 * the registry is preserved.
 */
export function listPosts(options: ListOptions = {}): readonly PostMeta[] {
  const { category, query, limit } = options;

  let results = renderablePosts;

  if (category && category !== "all") {
    results = results.filter((post) => post.category === category);
  }

  const trimmed = query?.trim() ?? "";
  if (trimmed.length > 0) {
    results = results
      .map((post) => ({
        post,
        score: fuzzyMatchFields(trimmed, [
          { value: post.title, weight: 1 },
          { value: post.description, weight: 0.7 },
          { value: post.tags.join(" "), weight: 0.6 },
          { value: getCategory(post.category)?.label ?? "", weight: 0.5 },
        ]).score,
      }))
      .filter((entry) => entry.score > 0)
      .toSorted((a, b) => b.score - a.score)
      .map((entry) => entry.post);
  }

  return limit === undefined ? results : results.slice(0, limit);
}

/** Count per category, so a filter can show how much is behind each tab. */
export function countByCategory(): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const post of renderablePosts) {
    counts[post.category] = (counts[post.category] ?? 0) + 1;
  }
  return counts;
}

/* -------------------------------------------------------------------------- */
/*  Relationships                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Related posts, scored by shared tags then by shared category.
 *
 * Tag overlap is weighted above category because two posts in "system-design" may have
 * nothing to do with each other, while two posts tagged "payments" almost certainly do.
 * Falls back to the most recent posts so the section is never empty.
 */
export function getRelatedPosts(slug: string, limit = 2): readonly PostMeta[] {
  const current = getPostMeta(slug);
  if (!current) return renderablePosts.slice(0, limit);

  const currentTags = new Set(current.tags);

  const scored = renderablePosts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => currentTags.has(tag)).length;
      const sameCategory = post.category === current.category ? 1 : 0;
      return { post, score: sharedTags * 2 + sameCategory };
    })
    .toSorted((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.post);
}

/**
 * Adjacent posts in reading order.
 *
 * "Previous" means the older post, which is the direction a reader working through an
 * archive travels — not the previous array index.
 */
export function getPostNeighbours(slug: string): PostNeighbours {
  const index = renderablePosts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};

  return {
    next: renderablePosts[index - 1],
    previous: renderablePosts[index + 1],
  };
}

export const contentService = {
  renderablePosts,
  featuredPosts: featuredPosts.filter((post) => hasPostBody(post.slug)),
  categories: blogCategories,
  activeCategories,
  getPostMeta,
  loadPostBody,
  listPosts,
  countByCategory,
  getRelatedPosts,
  getPostNeighbours,
} as const;
