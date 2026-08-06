/** Frontmatter contract for MDX under `content/`. Enforced at read time. */
export interface ContentFrontmatter {
  title: string;
  description: string;
  /** ISO-8601 date string. */
  date: string;
  updated?: string;
  tags?: readonly string[];
  cover?: string;
  /** Excluded from listings and sitemaps while true. */
  draft?: boolean;
}

export interface ContentEntry<TMeta = ContentFrontmatter> {
  slug: string;
  meta: TMeta;
  /** Estimated reading time in minutes, rounded up. */
  readingTime: number;
}

