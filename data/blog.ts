import type { BlogCategory, PostMeta } from "@/types/blog";

/**
 * The blog registry.
 *
 * Post metadata lives here as typed TypeScript rather than as YAML frontmatter.
 * The trade-off is deliberate:
 *
 *   • It is type-checked at build time. A malformed date or an unknown category is
 *     a compile error, not a runtime surprise on the listing page.
 *   • It needs no parser dependency and no filesystem read, so the blog index works
 *     identically in a Node runtime, on the edge, and in a static export.
 *   • Listing, search, related posts and the sitemap all read one array.
 *
 * The cost is one extra edit per post. Adding an article is therefore two steps:
 *   1. Create `content/blog/<slug>.mdx`
 *   2. Add an entry here and a line in `content/blog/index.ts`
 */

export const blogCategories: readonly BlogCategory[] = [
  { id: "java", label: "Java", description: "The language and the platform underneath it." },
  {
    id: "spring-boot",
    label: "Spring Boot",
    description: "Service design, configuration and the parts of Spring worth learning properly.",
  },
  { id: "react", label: "React", description: "Composition, state and rendering behaviour." },
  {
    id: "nextjs",
    label: "Next.js",
    description: "App Router, server components and the rendering model.",
  },
  { id: "ai", label: "AI", description: "Shipping model-backed features that can be evaluated." },
  { id: "llm", label: "LLM", description: "Context, tokens, structured output and failure modes." },
  {
    id: "langchain",
    label: "LangChain",
    description: "Orchestration, kept thin enough to debug.",
  },
  { id: "docker", label: "Docker", description: "Images, layers and reproducible environments." },
  {
    id: "devops",
    label: "DevOps",
    description: "Pipelines that gate on the checks that catch regressions.",
  },
  {
    id: "system-design",
    label: "System Design",
    description: "Trade-offs stated explicitly instead of assumed away.",
  },
  {
    id: "career",
    label: "Career",
    description: "Notes on getting better at the job, not at interviewing for it.",
  },
  {
    id: "interview",
    label: "Interview",
    description: "Questions worth being able to answer, and why.",
  },
  { id: "magento", label: "Magento", description: "Platform work on a live catalogue." },
  {
    id: "sfmc",
    label: "SFMC",
    description: "Salesforce Marketing Cloud, journeys and the SQL behind them.",
  },
];

export const posts: readonly PostMeta[] = [
  {
    slug: "idempotency-is-a-design-decision",
    title: "Idempotency is a design decision, not a retry flag",
    description:
      "A retried checkout that charges twice is not a networking problem. It is a modelling problem, and it has to be solved in three places.",
    date: "2026-06-18",
    category: "system-design",
    tags: ["payments", "api-design", "reliability", "java"],
    readingMinutes: 9,
    featured: true,
  },
  {
    slug: "reading-the-query-plan-first",
    title: "Read the query plan before you blame the ORM",
    description:
      "Most Hibernate performance complaints are really index complaints. Here is the order I check things in, and why EXPLAIN comes before any annotation.",
    date: "2026-05-02",
    category: "java",
    tags: ["hibernate", "mysql", "performance", "jpa"],
    readingMinutes: 11,
    featured: true,
  },
  {
    slug: "rag-that-refuses-to-guess",
    title: "Building RAG that refuses to guess",
    description:
      "A retrieval pipeline is only useful if it can decline. How mandatory citations, hybrid retrieval and a fixed evaluation set turned a demo into a feature.",
    date: "2026-03-27",
    category: "ai",
    tags: ["rag", "llm", "evaluation", "spring-boot"],
    readingMinutes: 13,
    featured: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Derived views                                                             */
/* -------------------------------------------------------------------------- */

/** Newest first. Drafts are excluded in production but visible while developing. */
export const publishedPosts: readonly PostMeta[] = posts
  .filter((post) => !post.draft || process.env.NODE_ENV !== "production")
  .toSorted((a, b) => b.date.localeCompare(a.date));

export const featuredPosts = publishedPosts.filter((post) => post.featured);

/** Only categories that have at least one post, so no filter tab is ever empty. */
export const activeCategories = blogCategories.filter((category) =>
  publishedPosts.some((post) => post.category === category.id),
);

export function getCategory(id: string): BlogCategory | undefined {
  return blogCategories.find((category) => category.id === id);
}

export function getPost(slug: string): PostMeta | undefined {
  return posts.find((post) => post.slug === slug);
}
