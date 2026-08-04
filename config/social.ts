import {
  Code2,
  Github,
  Linkedin,
  Mail,
  PenLine,
  Swords,
  Terminal,
  Trophy,
  Twitter,
  Youtube,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import type { SocialLink } from "@/types/navigation";

/**
 * Every platform, in one place.
 *
 * Handles live in one object so changing an account is a single-line edit and every URL below
 * follows.
 *
 * `planned` is the important field. All ten platforms the site is built to support are
 * declared here, but a link is only rendered as live when its handle is confirmed — an
 * invented profile URL that 404s is the single most checkable mistake a portfolio can make.
 * Filling in a handle and removing `planned` is the whole activation step.
 */
/**
 * Handles, not URLs.
 *
 * Each value is the bare identifier — the platform's base URL is added by the entry below. Pasting
 * a full profile URL here produces a doubled address like
 * `linkedin.com/in/https://linkedin.com/in/name`, which is a live-looking 404.
 *
 * An empty string marks a platform as `planned`: it appears in the social grid as a muted chip
 * rather than a link, and is excluded from the `sameAs` structured data. Filling in the handle is
 * the whole activation step.
 */
const HANDLES = {
  github: "jyotiram7402",
  linkedin: "jyotiram-kamble",
  leetcode: "jyotiramkamble7402",
  /** Confirm before filling in — an unverified handle is a 404 in the footer. */
  x: "",
  youtube: "",
  medium: "",
  devto: "",
  hackerrank: "",
  codechef: "",
} as const;

/**
 * Extended link shape.
 *
 * Adds `planned` and `category` to Sprint 0's `SocialLink` without changing it — the navbar
 * and footer keep consuming the narrower type, and the Sprint 4 social grid reads the extras.
 */
export interface PlatformLink extends SocialLink {
  /** No confirmed handle yet. Rendered as a muted "soon" chip rather than a live link. */
  planned?: boolean;
  category: "professional" | "writing" | "video" | "practice";
}

export const platformLinks: readonly PlatformLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: `https://github.com/${HANDLES.github}`,
    handle: HANDLES.github,
    icon: Github,
    primary: true,
    category: "professional",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: `https://www.linkedin.com/in/${HANDLES.linkedin}`,
    handle: HANDLES.linkedin,
    icon: Linkedin,
    primary: true,
    category: "professional",
  },
  {
    id: "email",
    label: "Email",
    href: `mailto:${siteConfig.email}`,
    handle: siteConfig.email,
    icon: Mail,
    primary: true,
    category: "professional",
  },
  {
    id: "x",
    label: "X",
    href: HANDLES.x ? `https://x.com/${HANDLES.x}` : "#",
    handle: HANDLES.x,
    icon: Twitter,
    primary: true,
    // Follows the same rule as every other platform now, so blanking the handle
    // removes the link rather than leaving a broken one.
    planned: HANDLES.x.length === 0,
    category: "writing",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: HANDLES.youtube ? `https://youtube.com/@${HANDLES.youtube}` : "#",
    handle: HANDLES.youtube,
    icon: Youtube,
    planned: HANDLES.youtube.length === 0,
    category: "video",
  },
  {
    id: "medium",
    label: "Medium",
    href: HANDLES.medium ? `https://medium.com/@${HANDLES.medium}` : "#",
    handle: HANDLES.medium,
    icon: PenLine,
    planned: HANDLES.medium.length === 0,
    category: "writing",
  },
  {
    id: "devto",
    label: "Dev.to",
    href: HANDLES.devto ? `https://dev.to/${HANDLES.devto}` : "#",
    handle: HANDLES.devto,
    icon: Terminal,
    planned: HANDLES.devto.length === 0,
    category: "writing",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    href: HANDLES.leetcode ? `https://leetcode.com/u/${HANDLES.leetcode}` : "#",
    handle: HANDLES.leetcode,
    icon: Code2,
    planned: HANDLES.leetcode.length === 0,
    category: "practice",
  },
  {
    id: "hackerrank",
    label: "HackerRank",
    href: HANDLES.hackerrank
      ? `https://www.hackerrank.com/profile/${HANDLES.hackerrank}`
      : "#",
    handle: HANDLES.hackerrank,
    icon: Trophy,
    planned: HANDLES.hackerrank.length === 0,
    category: "practice",
  },
  {
    id: "codechef",
    label: "CodeChef",
    href: HANDLES.codechef ? `https://www.codechef.com/users/${HANDLES.codechef}` : "#",
    handle: HANDLES.codechef,
    icon: Swords,
    planned: HANDLES.codechef.length === 0,
    category: "practice",
  },
];

/** Live platforms only. What the footer and navbar have always consumed. */
export const socialLinks: readonly SocialLink[] = platformLinks.filter(
  (link) => !link.planned,
);

/** Declared but not yet live. Rendered as a muted row in the social grid. */
export const plannedLinks: readonly PlatformLink[] = platformLinks.filter(
  (link) => link.planned === true,
);

export const socialConfig = {
  links: socialLinks,
  platforms: platformLinks,
  planned: plannedLinks,
  handles: HANDLES,
  /** `sameAs` for the Person structured data — live profile URLs only, no mailto. */
  sameAs: socialLinks
    .filter((link) => link.id !== "email")
    .map((link) => link.href),
  /**
   * Used by the Twitter card. Undefined when there is no handle — an empty `@` in a
   * `twitter:creator` tag is worse than omitting the tag, which `buildMetadata` handles.
   */
  twitterHandle: HANDLES.x ? `@${HANDLES.x}` : undefined,
} as const;
