import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/common/structured-data";
import { Section } from "@/components/layout/section";
import { ROUTES, blogPostPath } from "@/constants/routes";
import { PostFooter, PostLayout } from "@/features/blog";
import { buildMetadata } from "@/lib/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";
import { contentService } from "@/services/content.service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Every renderable post is prerendered at build time.
 *
 * `dynamicParams = false` closes the route to anything not in this list, so an unknown slug
 * is a 404 from the CDN rather than a server render that ends in `notFound()`.
 */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return contentService.renderablePosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = contentService.getPostMeta(slug);

  if (!post) {
    return buildMetadata({ title: "Article not found", noIndex: true });
  }

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: blogPostPath(post.slug),
    keywords: post.tags,
    type: "article",
    publishedTime: new Date(post.date).toISOString(),
    modifiedTime: post.updated ? new Date(post.updated).toISOString() : undefined,
  });
}

/**
 * One article.
 *
 * A Server Component. The MDX body is imported through `loadPostBody`, which resolves the
 * per-post chunk from the static import map — so the compiled article, its syntax
 * highlighting and its code blocks are all rendered on the server and none of it reaches the
 * client bundle.
 *
 * `PostLayout` is a client component only because the table of contents and the reading
 * progress rail need a ref to the rendered body. The body itself is passed to it as
 * `children`, already rendered, which keeps that split honest.
 *
 * Two schema nodes: `BlogPosting` for the article and `BreadcrumbList` for the trail. Both
 * mirror content that is visibly on the page.
 */
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = contentService.getPostMeta(slug);
  const Body = await contentService.loadPostBody(slug);

  // Both are required. A registry entry without a body, or the reverse, is a mistake
  // rather than a page.
  if (!post || !Body) notFound();

  const related = contentService.getRelatedPosts(slug);
  const neighbours = contentService.getPostNeighbours(slug);

  return (
    // `as="div"`: the article's own landmark structure comes from `PostLayout`, and an
    // extra unnamed `<section>` would put an anonymous region in the accessibility tree.
    <Section as="div" spacing="lg" containerSize="content">
      <StructuredData
        data={[
          articleSchema({
            title: post.title,
            description: post.description,
            path: blogPostPath(post.slug),
            publishedTime: new Date(post.date).toISOString(),
            modifiedTime: post.updated
              ? new Date(post.updated).toISOString()
              : undefined,
            tags: post.tags,
          }),
          breadcrumbSchema([
            { name: "Home", path: ROUTES.home },
            { name: "Writing", path: ROUTES.blog },
            { name: post.title, path: blogPostPath(post.slug) },
          ]),
        ]}
      />

      <PostLayout
        post={post}
        footer={<PostFooter neighbours={neighbours} related={related} />}
      >
        <Body />
      </PostLayout>
    </Section>
  );
}
