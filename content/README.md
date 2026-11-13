# `content/`

Long-form MDX. Three articles ship today in `content/blog/`.

## What lives here

Article and case-study **bodies**. Anything that is prose first and data second.

- `content/blog/*.mdx` — writing
- `content/work/*.mdx` — reserved for long-form case studies (not created yet)

Structured records (a project's stack, links, dates) belong in `data/`, not here.
Keep the split: MDX for prose, TypeScript for fields the UI needs to filter,
sort or render into a layout.

## Adding an article

Post metadata is typed TypeScript in [`data/blog.ts`](../data/blog.ts), not frontmatter.
Four edits, and the type system catches a mismatch between the middle two:

1. `content/blog/<slug>.mdx` — the body
2. [`content/blog/loaders.ts`](blog/loaders.ts) — a static `import()` for it
3. [`content/blog/index.ts`](blog/index.ts) — the slug in `postSlugs`. Keep this file
   import-free: the client-side search index reads it.
4. [`data/blog.ts`](../data/blog.ts) — the registry entry (`PostMeta` in `types/blog.ts`)

`draft: true` on the registry entry hides a post from listings in production; it still shows
in development.

## How it renders

- `@next/mdx` compiles it. Configured in [`next.config.mjs`](../next.config.mjs)
  with `remark-gfm` (tables, strikethrough, task lists), `rehype-slug` (heading
  ids) and `rehype-autolink-headings` (anchor links).
- Element overrides come from [`mdx-components.tsx`](../mdx-components.tsx) —
  anchors route through `next/link`, images through `next/image`.
- Typography comes from the `.prose-content` class in
  [`styles/prose.css`](../styles/prose.css). Wrap the compiled body in it.

- [`services/content.service.ts`](../services/content.service.ts) is the read model:
  listing, search, related and adjacent posts, and loading a body through `loaders.ts`.
