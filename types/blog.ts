/**
 * Blog types.
 *
 * Post metadata lives in a typed registry (`data/blog.ts`) rather than in YAML
 * frontmatter. The trade-off is deliberate: a registry is type-checked at build
 * time, needs no parser dependency, and cannot ship a post with a malformed date.
 * The cost is one extra edit per post, which the registry documents.
 */

export interface BlogCategory {
  id: string;
  label: string;
  /** Sentence shown when the category is the active filter. */
  description: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  /** One or two sentences. Used for cards, search and the meta description. */
  description: string;
  /** ISO-8601 date. Validated by the registry's own type. */
  date: string;
  updated?: string;
  /** Must match a `BlogCategory` id. */
  category: string;
  tags: readonly string[];
  /** Author-declared, because the author knows what is skimmable. */
  readingMinutes: number;
  featured?: boolean;
  /** Hidden from listings, sitemap and search while true. */
  draft?: boolean;
}

/** A heading extracted from the rendered article, for the table of contents. */
export interface TocEntry {
  id: string;
  title: string;
  /** 2 or 3. Deeper headings are ignored — a four-level TOC is a document map. */
  level: 2 | 3;
}

/** Adjacent posts for the previous/next control. */
export interface PostNeighbours {
  previous?: PostMeta;
  next?: PostMeta;
}
