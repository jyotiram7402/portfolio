import { Github, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { projectsConfig } from "@/config/projects";
import { socialConfig } from "@/config/social";
import { ROUTES } from "@/constants/routes";
import { ProjectGrid } from "@/features/projects/components/project-grid";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { projectsService } from "@/services/projects.service";
import { externalLinkAttributes } from "@/utils/url";

export const metadata: Metadata = buildMetadata({
  path: ROUTES.projects,
  title: "Projects",
  description:
    "The full project library — backend services, Java and Spring Boot work, AI systems and full-stack products. Discovered live from GitHub, searchable and filterable by area.",
});

function LibrarySkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-8">
      <Skeleton className="h-12 w-full rounded-full" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-11 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-[26rem] rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

/**
 * Fetches the resolved list and renders the library.
 *
 * The GitHub resolution note lives here rather than on the homepage. It says which of three
 * paths produced the list, and that genuinely changes how a reader interprets it — someone
 * who knows the grid is live reads the star counts differently from someone assuming it is
 * hand-written. It is plumbing commentary though, which is why the showcase does not carry
 * it.
 */
async function LibraryPanel() {
  const { projects, resolution, live } = await projectsService.getProjects();
  const github = socialConfig.links.find((link) => link.id === "github");

  return (
    <div className="flex flex-col gap-8">
      <ProjectGrid projects={projects} />

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-2xs text-subtle">
        <RefreshCw aria-hidden="true" className="size-3" />

        {resolution === "topic" ? (
          <span>
            Pulled live from GitHub — repositories tagged{" "}
            <span className="text-muted">{projectsConfig.discoveryTopic}</span>, cached
            for an hour.
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
            className={cn(
              "inline-flex items-center gap-1 text-muted underline-offset-2",
              "transition-colors hover:text-foreground hover:underline focus-ring",
            )}
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
 * The project library.
 *
 * The exploration surface, and the home of the GitHub integration. The homepage shows three
 * featured projects and links here; this page shows everything, with search and per-area
 * filters; `/projects/[slug]` carries the case study.
 *
 * Streamed behind `Suspense` for the same reason the homepage showcase is: the heading and
 * the breadcrumbs are in the initial HTML, and a rate-limited GitHub response delays the
 * grid rather than the page.
 */
export default function ProjectsPage() {
  return (
    <Section
      spacing="md"
      ariaLabelledBy="projects-library-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-10 lg:gap-12"
    >
      <Breadcrumbs
        items={[
          { label: "Home", href: ROUTES.home },
          { label: "Projects", href: ROUTES.projects },
        ]}
      />

      <SectionHeader
        badge="All work"
        headingId="projects-library-heading"
        // This block is the page title, so it owns the document's `h1`.
        as="h1"
        title="The full project library"
        description="Everything, not just the highlights. Search by name or technology, or filter by area — backend, Java and Spring, microservices, AI, full stack. The list is resolved from GitHub, so it does not go stale."
        size="lg"
      />

      <Suspense fallback={<LibrarySkeleton />}>
        <LibraryPanel />
      </Suspense>
    </Section>
  );
}
