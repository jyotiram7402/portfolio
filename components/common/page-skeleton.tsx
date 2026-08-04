import { Section } from "@/components/layout/section";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface PageSkeletonProps {
  /**
   * Which layout to mirror. The point of a skeleton is that the real content lands in the same
   * geometry, so each variant matches a page shape rather than being a generic grey block.
   */
  variant?: "article" | "listing" | "dashboard";
  className?: string;
}

/**
 * Route-level loading state.
 *
 * Streamed in while a segment's server work is pending. Every variant reserves the same space
 * the real content will occupy, which is what makes the transition shift-free — a skeleton that
 * does not match its page trades a blank screen for a jump, which is worse.
 *
 * `aria-busy` on the region announces the pending state once. The individual bars are hidden from
 * assistive tech by `Skeleton` itself, so there is no stream of meaningless announcements.
 *
 * A Server Component, so this costs the client bundle nothing.
 */
export function PageSkeleton({ variant = "listing", className }: PageSkeletonProps) {
  return (
    <Section
      as="div"
      spacing="lg"
      ariaLabel="Loading"
      containerSize={variant === "article" ? "content" : "page"}
      className={className}
      innerClassName="flex w-full flex-col gap-12"
    >
      <div aria-busy="true" className="flex w-full flex-col gap-12">
        {/* Header — shared by every variant. */}
        <div className="flex flex-col gap-5">
          <Skeleton shape="line" className="h-6 w-28 rounded-full" />
          <Skeleton className="h-12 w-full max-w-2xl sm:h-14" />
          <SkeletonText lines={2} className="max-w-xl" />
        </div>

        {variant === "article" ? (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
            <div className="flex flex-col gap-6">
              <SkeletonText lines={5} />
              <Skeleton className="h-40 rounded-xl" />
              <SkeletonText lines={6} />
              <Skeleton className="h-32 rounded-xl" />
              <SkeletonText lines={4} />
            </div>
            <div className="hidden flex-col gap-3 lg:flex">
              <Skeleton shape="line" className="w-24" />
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} shape="line" className="w-full" />
              ))}
            </div>
          </div>
        ) : null}

        {variant === "listing" ? (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-12 max-w-xl rounded-xl" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton
                  key={index}
                  className={cn("h-52 rounded-3xl", index === 0 && "sm:col-span-2")}
                />
              ))}
            </div>
          </div>
        ) : null}

        {variant === "dashboard" ? (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton key={index} className="h-28 rounded-2xl" />
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-[7fr_5fr]">
              <Skeleton className="h-72 rounded-3xl" />
              <Skeleton className="h-72 rounded-3xl" />
            </div>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
