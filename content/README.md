# `content/`

Long-form MDX. Empty in Sprint 0 — the pipeline is wired, the articles are not
written.

## What lives here

Article and case-study **bodies**. Anything that is prose first and data second.

- `content/blog/*.mdx` — writing
- `content/work/*.mdx` — case-study long form

Structured records (a project's stack, links, dates) belong in `data/`, not here.
Keep the split: MDX for prose, TypeScript for fields the UI needs to filter,
sort or render into a layout.

## Frontmatter contract

Every file must satisfy `ContentFrontmatter` in [`types/content.ts`](../types/content.ts):

```mdx
---
title: Interface latency is a design problem
description: Why perceived performance is decided in the design review, not the profiler.
date: 2026-03-14
updated: 2026-03-20
tags: [performance, design-engineering]
cover: /images/writing/latency.png
draft: false
---

Body starts here.
```

`draft: true` excludes an entry from listings and from `sitemap.xml`.

## How it renders

- `@next/mdx` compiles it. Configured in [`next.config.mjs`](../next.config.mjs)
  with `remark-gfm` (tables, strikethrough, task lists), `rehype-slug` (heading
  ids) and `rehype-autolink-headings` (anchor links).
- Element overrides come from [`mdx-components.tsx`](../mdx-components.tsx) —
  anchors route through `next/link`, images through `next/image`.
- Typography comes from the `.prose-content` class in
  [`styles/prose.css`](../styles/prose.css). Wrap the compiled body in it.

## Remaining work

Reading and validating these files is a Sprint 2 task: a `services/content.service.ts`
that reads the directory, validates frontmatter with Zod, computes reading time,
and filters drafts in production.
