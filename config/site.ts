import { env } from "@/lib/env";

/**
 * Single source of truth for identity.
 *
 * Nothing in `components/` or `app/` hardcodes a name, a URL or a tagline —
 * they all read from here, which means rebranding the site is a one-file edit.
 */
export const siteConfig = {
  /** Full name, used in titles, structured data and the copyright line. */
  name: "Jyotiram Kamble",
  /** First name. The assistant answers in the third person about it. */
  firstName: "Jyotiram",
  /** Compact form for the logo lockup and the PWA short name. */
  shortName: "JK",
  /** Appended to every page title: "About — Jyotiram Kamble". */
  titleTemplate: "%s — Jyotiram Kamble",
  /** Title of the home page, where the template is not applied. */
  defaultTitle: "Jyotiram Kamble — Java Backend Engineer",
  role: "Java Backend Engineer",
  tagline: "Engineering the layer you never see, and always feel.",
  description:
    "Java backend engineer building Spring Boot services, payment and search integrations, and AI features that earn their place in production.",

  url: env.siteUrl,
  locale: "en_US",
  language: "en",
  timezone: "Asia/Kolkata",

  /** Contact address surfaced in the footer and structured data. */
  email: "jyotiramkamble7402@gmail.com",
  location: "Pune, India",

  /** Path to the OG image route handled by `app/opengraph-image.tsx`. */
  ogImage: "/opengraph-image",
  /** Rendered inside the footer's "built with" line. */
  repository: "https://github.com/jyotiram7402/portfolio",

  keywords: [
    "java backend engineer",
    "spring boot developer",
    "rest api",
    "microservices",
    "ai engineer",
    "rag",
    "full stack developer",
    "magento developer",
    "salesforce marketing cloud",
    "next.js",
    "typescript",
    "portfolio",
  ],

  /** Drives the "available for work" affordance. Flip when that changes. */
  availability: {
    open: true,
    label: "Open to new work",
  },
} as const;

export type SiteConfig = typeof siteConfig;
