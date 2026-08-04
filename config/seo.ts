import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { env } from "@/lib/env";

/** Dimensions the OG route renders at, and that consumers expect to be declared. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const seoConfig = {
  titleTemplate: siteConfig.titleTemplate,
  defaultTitle: siteConfig.defaultTitle,
  defaultDescription: siteConfig.description,
  keywords: siteConfig.keywords,
  siteName: siteConfig.name,
  locale: siteConfig.locale,

  openGraph: {
    type: "website",
    imagePath: siteConfig.ogImage,
    imageAlt: `${siteConfig.name} — ${siteConfig.role}`,
    ...OG_IMAGE_SIZE,
  },

  twitter: {
    card: "summary_large_image",
    site: socialConfig.twitterHandle,
    creator: socialConfig.twitterHandle,
  },

  verification: {
    google: env.verification.google,
  },

  /** Applied to every page unless `noIndex` is set. */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /**
   * Paths kept out of the sitemap and disallowed for crawlers: API routes and
   * the generated image endpoints, which have no standalone value in search.
   */
  excludedPaths: ["/api/", "/opengraph-image", "/twitter-image"],
} as const;
