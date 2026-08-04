import { Section } from "@/components/layout/section";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

/**
 * Route-level loading state.
 *
 * Next streams this in while a segment's server work is still pending. It mirrors
 * the hero's proportions rather than showing a spinner, so the layout does not
 * jump when the real content lands.
 *
 * `aria-busy` on the region is what announces the pending state; the individual
 * skeletons are hidden from assistive tech to avoid a stream of meaningless
 * announcements.
 */
export default function Loading() {
  return (
    <Section
      spacing="none"
      ariaLabel="Loading"
      className="flex min-h-[calc(100dvh-var(--header-height))] items-center py-24"
      innerClassName="flex w-full flex-col gap-8"
    >
      <div aria-busy="true" className="flex w-full flex-col gap-8">
        <Skeleton shape="line" className="h-5 w-32" />

        <div className="flex flex-col gap-4">
          <Skeleton className="h-16 w-full max-w-3xl sm:h-20" />
          <Skeleton className="h-16 w-4/5 max-w-2xl sm:h-20" />
        </div>

        <SkeletonText lines={3} className="max-w-xl" />

        <div className="flex gap-3">
          <Skeleton className="h-13 w-48 rounded-full" />
          <Skeleton className="h-13 w-32 rounded-full" />
        </div>
      </div>
    </Section>
  );
}
