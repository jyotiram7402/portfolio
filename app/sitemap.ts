import type { MetadataRoute } from "next";

import {
  IMPLEMENTED_ROUTES,
  ROUTES,
  blogPostPath,
  isRouteIndexable,
} from "@/constants/routes";
import { renderablePosts } from "@/services/content.service";
import { projectsService } from "@/services/projects.service";
import { absoluteUrl } from "@/utils/url";

/**
 * `/sitemap.xml`.
 *
 * Three sources, all derived rather than listed: `IMPLEMENTED_ROUTES` for pages, the
 * renderable post set for articles, and the resolved project list for case studies. A page
 * that has not shipped, or a registry entry with no MDX body, cannot be submitted to a
 * crawler by accident.
 *
 * Article and project `lastModified` use the real thing — a post's `updated` or `date`, a
 * project's last push. Page entries fall back to build time, which for a statically
 * generated route genuinely is when it last changed.
 *
 * `async` because the project list is resolved from the GitHub API. It shares the service's
 * hourly cache with the pages that render it, so this adds no request of its own.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildTime = new Date();

  const pages: MetadataRoute.Sitemap = IMPLEMENTED_ROUTES.filter((route) =>
    // `/offline` is implemented but must never be submitted — it is a service-worker
    // fallback, not a destination.
    isRouteIndexable(route),
  ).map((route) => ({
    url: absoluteUrl(route),
    lastModified: buildTime,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));

  const articles: MetadataRoute.Sitemap = renderablePosts.map((post) => ({
    url: absoluteUrl(blogPostPath(post.slug)),
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly",
    priority: post.featured ? 0.8 : 0.6,
  }));

  const { projects } = await projectsService.getProjects();
  const caseStudies: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`${ROUTES.projects}/${project.slug}`),
    lastModified:
      project.updatedAt !== undefined ? new Date(project.updatedAt) : buildTime,
    changeFrequency: "monthly",
    priority: project.featured === true ? 0.8 : 0.6,
  }));

  return [...pages, ...articles, ...caseStudies];
}
