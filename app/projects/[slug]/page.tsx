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
 * Prerendered from the resolved list so the common paths are static HTML. Deliberately not
 * `dynamicParams: false`: the list is discovered from GitHub and revalidates hourly, so a
 * repository tagged after this build has to be reachable on demand rather than 404. Next
 * renders an unlisted slug on first request and caches it from then on.
 */
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
