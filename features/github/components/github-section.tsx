import { Suspense } from "react";

import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { SECTIONS } from "@/constants/sections";
import { GithubDashboard } from "@/features/github/components/github-dashboard";

/**
 * Skeleton that mirrors the dashboard's real geometry.
 *
 * The point of matching it closely is that streaming in the real panel causes no layout
 * shift — the tiles, the repository grid and the sidebar all occupy the same space before
 * and after.
 */
function DashboardSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-[6.5rem] rounded-2xl" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[7fr_5fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * The GitHub section.
 *
 * `Suspense` around the dashboard is what keeps a third-party API off the critical path:
 * the heading and the skeleton are in the initial HTML, and the panel streams in when
 * GitHub answers. A slow or rate-limited upstream delays this section and nothing else.
 */
export function GithubSection() {
  return (
    <Section
      id={SECTIONS.github}
      spacing="lg"
      ariaLabelledBy="github-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-12 lg:gap-14"
    >
      <SectionHeader
        badge="GitHub"
        headingId="github-heading"
        title="Live from the source, not a screenshot."
        description="Repositories, stars and language distribution pulled from the GitHub API on the server and cached for an hour. Where a figure needs an API this integration does not use, it says so rather than inventing one."
        size="lg"
      />

      <Suspense fallback={<DashboardSkeleton />}>
        <GithubDashboard />
      </Suspense>
    </Section>
  );
}
