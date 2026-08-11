import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Reveal } from "@/components/animation/reveal";
import { Stagger, StaggerItem } from "@/components/animation/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { SECTIONS } from "@/constants/sections";
import { ProjectShowcaseCard } from "@/features/projects/components/project-showcase-card";
import { HOMEPAGE_PROJECT_COUNT, getFeaturedProjects } from "@/lib/project-selection";
import { projectsService } from "@/services/projects.service";

/**
 * Mirrors the showcase's geometry so the streamed content lands in the same space.
 *
 * A skeleton that does not match its content trades a blank area for a jump, which is
 * worse. The aspect ratio here is the card's, not a guess.
 */
function ShowcaseSkeleton() {
  return (
    <div aria-busy="true" className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: HOMEPAGE_PROJECT_COUNT }, (_, index) => (
        <Skeleton
          key={index}
          className="h-[26rem] rounded-3xl lg:last:col-span-2 lg:last:h-[30rem]"
        />
      ))}
    </div>
  );
}

/**
 * Fetches the resolved list and renders the three the homepage shows.
 *
 * Split from the section so `Suspense` has something to suspend on: the heading is in the
 * initial HTML and the cards stream in when GitHub answers, so a slow or rate-limited API
 * delays this grid and nothing else on the page.
 *
 * The GitHub resolution note that used to sit under the grid has moved to `/projects`. It
 * is genuinely useful — knowing the list is live changes how you read it — but it is
 * plumbing commentary, and the homepage is a showcase.
 */
async function ShowcasePanel() {
  const { projects } = await projectsService.getProjects();
  const featured = getFeaturedProjects(projects);

  if (featured.length === 0) return null;

  return (
    <div className="flex flex-col gap-10">
      {/*
        Two columns, and the last card spans both when the count is odd.

        Three cards in a two-column grid would otherwise leave a hole; letting the third
        run full width turns that hole into the widest cover on the page. `lg:last:` does
        it without the component needing to know how many cards there are.
      */}
      <Stagger
        as="ul"
        gap={0.1}
        className="grid gap-6 lg:grid-cols-2 lg:[&>li:last-child:nth-child(odd)]:col-span-2"
      >
        {featured.map((project, index) => (
          <StaggerItem as="li" key={project.id} className="h-full">
            <ProjectShowcaseCard
              project={project}
              // Only the first card can be near the fold. The rest stay lazy.
              priority={index === 0}
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal effect="up" distance={12} className="flex justify-center">
        <Button asChild size="lg" variant="outline">
          <Link href={ROUTES.projects}>
            View all projects
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </Reveal>
    </div>
  );
}

/**
 * Selected work.
 *
 * A showcase, not a library. Three cards, a cover each, five words of technology and one
 * line of copy — then a link to `/projects`, which is where the full GitHub-resolved list,
 * the search and the filters live. `/projects/[slug]` carries the case study.
 *
 * That split is the point of this section. It previously rendered every discovered
 * repository with its summary, its highlight list, its live figures and a filter bar, which
 * made the homepage's longest section the one a visitor was least equipped to read that
 * early.
 *
 * `spacing="md"` rather than `lg`: the brief asked for less vertical space, and this is the
 * section that had the most to give back.
 *
 * A Server Component. The cards are server-rendered too — the hover treatment is pure CSS,
 * so the whole showcase ships no JavaScript beyond the reveal animation.
 */
export function ProjectsSection() {
  return (
    <Section
      id={SECTIONS.projects}
      spacing="md"
      ariaLabelledBy="projects-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-10 lg:gap-12"
    >
      <SectionHeader
        badge="Selected work"
        headingId="projects-heading"
        title="Things I've built"
        description="A curated collection of products, experiments and engineering projects across backend, full-stack, AI and modern web development."
      />

      <Suspense fallback={<ShowcaseSkeleton />}>
        <ShowcasePanel />
      </Suspense>
    </Section>
  );
}
