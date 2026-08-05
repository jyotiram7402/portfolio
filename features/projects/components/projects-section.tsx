import { Github, RefreshCw } from "lucide-react";
import { Suspense } from "react";

import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { projectsConfig } from "@/config/projects";
import { socialConfig } from "@/config/social";
import { SECTIONS } from "@/constants/sections";
import { ProjectGrid } from "@/features/projects/components/project-grid";
import { projectsService } from "@/services/projects.service";
import { cn } from "@/lib/utils";
import { externalLinkAttributes } from "@/utils/url";

/**
 * Mirrors the grid's geometry so the streamed-in content lands in the same space.
 *
 * A skeleton that does not match its content trades a blank area for a jump, which is worse.
 */
function GridSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton
            key={index}
            className={cn(
              "h-72 rounded-3xl",
              index === 0 && "sm:col-span-2 lg:col-span-2",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Fetches and renders the project list.
 *
 * Split from the section so `Suspense` has something to suspend on: the heading is in the initial
 * HTML and the grid streams in when GitHub answers. A slow or rate-limited API therefore delays this
 * grid and nothing else on the page.
 */
async function ProjectsPanel() {
  const { projects, resolution, live } = await projectsService.getProjects();
  const github = socialConfig.links.find((link) => link.id === "github");

  return (
    <div className="flex flex-col gap-6">
      <ProjectGrid projects={projects} />

      {/*
        A one-line note on where the list came from.

        Worth rendering because the three states mean genuinely different things, and a reader who
        knows the grid is live reads the stars differently from one who assumes it is hand-written.
      */}
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-2xs text-subtle">
        <RefreshCw aria-hidden="true" className="size-3" />

        {resolution === "topic" ? (
          <span>
            Pulled live from GitHub — repositories tagged{" "}
            <span className="text-muted">{projectsConfig.discoveryTopic}</span>, cached for
            an hour.
          </span>
        ) : null}

        {resolution === "recent" ? (
          <span>
            Pulled live from GitHub — most recently pushed repositories. Tag one{" "}
            <span className="text-muted">{projectsConfig.discoveryTopic}</span> to curate
            this list.
          </span>
        ) : null}

        {resolution === "curated" ? (
          <span>
            {live
              ? "GitHub returned nothing to show, so this is the curated list."
              : "GitHub is not connected, so this is the curated list."}
          </span>
        ) : null}

        {github ? (
          <a
            href={github.href}
            {...externalLinkAttributes()}
            className="inline-flex items-center gap-1 text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline focus-ring"
          >
            <Github aria-hidden="true" className="size-3" />
            All repositories
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
      </p>
    </div>
  );
}

/**
 * Projects.
 *
 * The list is discovered from the GitHub API rather than hardcoded: tag a repository with the
 * discovery topic and it appears here within the cache window, with no code change and no deploy.
 * `services/projects.service.ts` owns that resolution, including the fallbacks for an untagged or
 * unconfigured account.
 *
 * A Server Component. The grid below it is the client boundary, and it receives the resolved list as
 * a prop — which is why `Project` carries no icon field: components cannot cross that boundary.
 */
export function ProjectsSection() {
  return (
    <Section
      id={SECTIONS.projects}
      spacing="lg"
      ariaLabelledBy="projects-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-14 lg:gap-16"
    >
      <SectionHeader
        badge="Projects"
        headingId="projects-heading"
        title="Work where the hard part was correctness."
        description="Pulled straight from GitHub, so this list is never out of date. Payment flows that must settle exactly once, search that has to match intent, retrieval that refuses to guess. Filter by area, or ask the assistant to pull a set for you."
        size="lg"
      />

      <Suspense fallback={<GridSkeleton />}>
        <ProjectsPanel />
      </Suspense>
    </Section>
  );
}
