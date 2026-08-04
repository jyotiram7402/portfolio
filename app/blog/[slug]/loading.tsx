import { PageSkeleton } from "@/components/common/page-skeleton";

/**
 * Streamed in while an article's MDX chunk resolves.
 *
 * The `article` variant reserves the two-column reading layout — body plus the table of contents
 * rail — so the real article lands in the same geometry rather than pushing the sidebar into place.
 */
export default function BlogPostLoading() {
  return <PageSkeleton variant="article" />;
}
