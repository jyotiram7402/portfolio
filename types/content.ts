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

export interface TechStackItem {
  name: string;
  href: string;
  /** Short reason this dependency earns its place in the bundle. */
  role: string;
  category: TechCategory;
}

export type TechCategory =
  | "framework"
  | "language"
  | "styling"
  | "motion"
  | "3d"
  | "content"
  | "platform";
