import { PageSkeleton } from "@/components/common/page-skeleton";

/**
 * Streamed in while the blog index's server work is pending.
 *
 * Uses the `listing` variant, which mirrors the index's geometry — search field, filter row, then a
 * two-column card grid with a full-width lead. Matching it is what makes the transition
 * shift-free; a generic grey block would trade a blank screen for a jump.
 */
export default function BlogLoading() {
  return <PageSkeleton variant="listing" />;
}
