/**
 * Which articles have a body.
 *
 * Deliberately just an array of strings, with no imports at all. This module is reached from
 * the client bundle — `lib/search-index.ts` needs to know which posts are renderable, and it
 * runs in the command palette — so it must not pull the MDX loader map along with it.
 *
 * The loaders live in `./loaders.ts` and are only ever reached through a dynamic import
 * inside `contentService.loadPostBody`, which keeps the compiled articles entirely out of the
 * client graph.
 *
 * Adding an article is three steps, and the type system catches two of them:
 *   1. `content/blog/<slug>.mdx`      — the body
 *   2. `content/blog/loaders.ts`      — the import
 *   3. this array, plus an entry in `data/blog.ts`
 */
export const postSlugs = [
  "idempotency-is-a-design-decision",
  "reading-the-query-plan-first",
  "rag-that-refuses-to-guess",
] as const;

export type PostSlug = (typeof postSlugs)[number];

export function hasPostBody(slug: string): boolean {
  return (postSlugs as readonly string[]).includes(slug);
}
