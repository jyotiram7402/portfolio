import type { Metadata } from "next";

import { OG_IMAGE_SIZE, seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";
import type { PageSeo } from "@/types/seo";
import { absoluteUrl } from "@/utils/url";

/**
 * Builds a complete `Metadata` object for a page.
 *
 * Every route exports `metadata` (or `generateMetadata`) through this helper,
 * which guarantees the canonical URL, OpenGraph payload, Twitter card and
 * robots directives can never be forgotten or drift apart.
 */
export function buildMetadata(page: PageSeo = {}): Metadata {
  const {
    title,
    description = seoConfig.defaultDescription,
    path = "/",
    keywords,
    image,
    type = "website",
    publishedTime,
    modifiedTime,
    noIndex = false,
  } = page;

  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image ?? seoConfig.openGraph.imagePath);
  const resolvedTitle = title ?? seoConfig.defaultTitle;

  const sharedOg = {
    url,
    siteName: siteConfig.name,
    title: resolvedTitle,
    description,
    locale: seoConfig.locale,
    images: [
      {
        url: imageUrl,
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        alt: seoConfig.openGraph.imageAlt,
      },
    ],
  };

  // Branched rather than spread so the OpenGraph discriminated union stays sound.
  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? { ...sharedOg, type: "article", publishedTime, modifiedTime }
      : type === "profile"
        ? { ...sharedOg, type: "profile" }
        : { ...sharedOg, type: "website" };

  return {
    title: { absolute: title ? `${title} — ${siteConfig.name}` : resolvedTitle },
    description,
    keywords: [...(keywords ?? seoConfig.keywords)],
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: { canonical: url },
    openGraph,
    twitter: {
      card: seoConfig.twitter.card,
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : seoConfig.robots,
    ...(seoConfig.verification.google
      ? { verification: { google: seoConfig.verification.google } }
      : {}),
  };
}

/**
 * Root metadata. Adds only what must not be repeated per page.
 *
 * Icons and the web manifest are intentionally absent: `app/icon.tsx`,
 * `app/apple-icon.tsx` and `app/manifest.ts` are file conventions that Next
 * injects automatically, and declaring them here would override those routes.
 */
export function buildRootMetadata(): Metadata {
  return {
    ...buildMetadata(),
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.defaultTitle,
      template: siteConfig.titleTemplate,
    },
    appleWebApp: {
      capable: true,
      title: siteConfig.shortName,
      statusBarStyle: "black-translucent",
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
  };
}
