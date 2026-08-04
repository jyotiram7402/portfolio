import type { Metadata } from "next";

import { AnimatedHeading } from "@/components/animation/animated-heading";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { StructuredData } from "@/components/common/structured-data";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { ROUTES, blogPostPath } from "@/constants/routes";
import { BlogBrowser } from "@/features/blog";
import { buildMetadata } from "@/lib/metadata";
import { blogSchema } from "@/lib/structured-data";
import { renderablePosts } from "@/services/content.service";

export const metadata: Metadata = buildMetadata({
  title: "Writing",
  description:
    "Long-form notes on backend engineering, applied AI and system design — idempotency, query plans, retrieval pipelines and the things that broke in production.",
  path: ROUTES.blog,
  keywords: [
    "java blog",
    "spring boot articles",
    "system design writing",
    "rag engineering",
    "backend engineering blog",
  ],
});

/**
 * The article index.
 *
 * A Server Component; `BlogBrowser` is the one client boundary and it holds the search and
 * filter state. The heading, the count and the schema are all server-rendered.
 *
 * `Blog` structured data is emitted here rather than per-post so the index is understood as
 * a collection. Individual `BlogPosting` nodes live on the article pages, where they belong.
 */
export default function BlogIndexPage() {
  return (
    <Section
      spacing="lg"
      ariaLabelledBy="blog-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-12 lg:gap-14"
    >
      <StructuredData
        data={blogSchema(
          renderablePosts.map((post) => ({
            title: post.title,
            description: post.description,
            path: blogPostPath(post.slug),
            date: post.date,
          })),
        )}
      />

      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: ROUTES.home },
            { label: "Writing", href: ROUTES.blog },
          ]}
        />

        <div className="flex flex-col gap-5">
          <Badge tone="outline" size="sm" dot className="w-fit">
            Writing
          </Badge>

          <AnimatedHeading
            id="blog-heading"
            as="h1"
            size="lg"
            immediate
            description="Notes on problems I had to solve properly — not topics I read about. Search by title, tag or topic, or filter by category."
            descriptionClassName="max-w-2xl text-lg"
          >
            Long-form, technical, and specific.
          </AnimatedHeading>
        </div>
      </div>

      <BlogBrowser />
    </Section>
  );
}
