import { env } from "@/lib/env";

/**
 * Single source of truth for identity.
 *
 * Nothing in `components/` or `app/` hardcodes a name, a role or a tagline — they all read from
 * here, which means repositioning the site is a one-file edit.
 *
 * Positioning, in priority order: Java backend, then Java full stack, then MERN. Every string below
 * leads with the first and mentions the others without diluting it.
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
  /** Secondary framing, for the résumé header and the OG card. */
  roleLine: "Java · Spring Boot · Microservices · REST APIs · React · GenAI",
  tagline: "Java backends built to survive production.",
  description:
    "Java backend engineer in Pune building Spring Boot microservices, payment integrations, Kafka pipelines and AI-powered search — plus React, Node and MongoDB when a feature needs the whole stack. Board member of Southco's AI team, leading an AI-first approach to development.",

  url: env.siteUrl,
  locale: "en_US",
  language: "en",
  timezone: "Asia/Kolkata",

  /** Contact address surfaced in the footer and structured data. */
  email: "jyotiramkamble7402@gmail.com",
  phone: "+91 93225 02514",
  location: "Pune, India",

  /** Path to the OG image route handled by `app/opengraph-image.tsx`. */
  ogImage: "/opengraph-image",
  repository: "https://github.com/jyotiram7402/portfolio",

  /**
   * Ordered for search intent: the roles being targeted come first, the technologies that qualify
   * for them second, and the secondary stack last.
   */
  keywords: [
    "java backend engineer",
    "java backend developer",
    "spring boot developer",
    "java full stack developer",
    "backend engineer pune",
    "microservices engineer",
    "rest api developer",
    "spring security",
    "apache kafka",
    "agentic ai developer",
    "mern stack developer",
    "react developer",
    "software engineer pune",
  ],

  /** Drives the "available for work" affordance. Flip when that changes. */
  availability: {
    open: true,
    label: "Open to Java & backend roles",
  },
} as const;

export type SiteConfig = typeof siteConfig;
