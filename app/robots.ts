import type { MetadataRoute } from "next";

import { seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { UNINDEXED_ROUTES } from "@/constants/routes";
import { env } from "@/lib/env";

/**
 * `/robots.txt`.
 *
 * Preview deployments are disallowed wholesale. Without this, Vercel's preview URLs get indexed and
 * compete with production for the same content — the single most common SEO own-goal on this stack.
 *
 * The disallow list is derived from config rather than typed: `seoConfig.excludedPaths` covers API
 * routes and the generated image endpoints, and `UNINDEXED_ROUTES` covers `/offline`, which exists
 * only as a service-worker fallback and would be absurd in a search result.
 */
export default function robots(): MetadataRoute.Robots {
  const isPreview = process.env.VERCEL_ENV === "preview";

  if (isPreview) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...seoConfig.excludedPaths, ...UNINDEXED_ROUTES],
      },
      // The service worker is a static asset, not a document. Crawling it is harmless
      // but pointless, and excluding it keeps the crawl budget on pages.
      { userAgent: "*", disallow: "/sw.js" },
    ],
    sitemap: `${env.siteUrl}/sitemap.xml`,
    host: siteConfig.url,
  };
}
