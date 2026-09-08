import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/common/structured-data";
import { ROUTES } from "@/constants/routes";
import { ProjectDetail } from "@/features/projects/components/project-detail";
import { buildMetadata } from "@/lib/metadata";
import { getProjectBySlug, getRelatedProjects } from "@/lib/project-selection";
import { breadcrumbSchema } from "@/lib/structured-data";
import { projectsService } from "@/services/projects.service";

interface ProjectPageProps {
  /** Async in Next 15 — params is a promise in both the page and `generateMetadata`. */
  params: Promise<{ slug: string }>;
}

/**
 * Case-study routes.
 *
 * Prerendered from the resolved list, so every real project is static HTML.
 *
 * **`dynamicParams = false`, and that is a correctness fix rather than a preference.**
 * With on-demand rendering allowed, an unknown slug was answered with HTTP **200** and a
 * "Project not found" body — a soft 404. Verified live: `/projects/does-not-exist` came
 * back 200 while a plain unknown path like `/definitely-not-a-page` correctly returned
 * 404. A search engine treats a 200 as a real page, so an unbounded space of nonsense
 * URLs was indexable.
 *
 * Turning it off makes Next answer anything outside this list with a genuine 404 before
 * the component runs. The cost is that a repository tagged after a build is not reachable
 * until the next deploy — acceptable, because the alternative is inviting a crawler to
 * index infinite pages, and a deploy is cheap.
 */
export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { projects } = await projectsService.getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await projectsService.getProjects();
  const project = getProjectBySlug(projects, slug);

  if (project === undefined) {
    // A slug with no project still needs valid metadata — `notFound()` in the page below
    // renders the 404, and this keeps the head from being built from `undefined`.
    return buildMetadata({
      title: "Project not found",
      path: `${ROUTES.projects}/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: project.name,
    description: project.tagline,
    path: `${ROUTES.projects}/${project.slug}`,
    keywords: [...project.stack, ...project.domains],
    image: project.image,
  });
}

/**
 * One project, in full.
 *
 * The third tier of the split: the homepage is impact, `/projects` is exploration, this is
 * technical depth. Everything the homepage card deliberately omits lives here.
 *
 * A Server Component reading the same `projectsService` resolution as the other two
 * surfaces, so a project's copy, stack and live figures cannot disagree between them.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const { projects } = await projectsService.getProjects();
  const project = getProjectBySlug(projects, slug);

  if (project === undefined) notFound();

  const related = getRelatedProjects(projects, project);

  return (
    <>
      <StructuredData
        data={[
          breadcrumbSchema([
            { name: "Home", path: ROUTES.home },
            { name: "Projects", path: ROUTES.projects },
            { name: project.name, path: `${ROUTES.projects}/${project.slug}` },
          ]),
        ]}
      />

      <ProjectDetail project={project} related={related} />
    </>
  );
}
