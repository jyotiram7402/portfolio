import type { MetadataRoute } from "next";

import { IMPLEMENTED_ROUTES, blogPostPath, isRouteIndexable } from "@/constants/routes";
import { renderablePosts } from "@/services/content.service";
import { absoluteUrl } from "@/utils/url";

/**
 * `/sitemap.xml`.
 *
 * Two sources, both derived rather than listed: `IMPLEMENTED_ROUTES` for pages, and the
 * renderable post set for articles. A page that has not shipped, or a registry entry with no
 * MDX body, cannot be submitted to a crawler by accident.
 *
 * Article `lastModified` uses the post's own `updated` or `date` — the truth about when the
 * content changed. Page entries fall back to build time, which for a statically generated
 * route genuinely is when it last changed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
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

  return [...pages, ...articles];
}
