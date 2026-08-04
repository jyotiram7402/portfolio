import { env } from "@/lib/env";

/**
 * URL helpers.
 *
 * These read the origin from `env` rather than `siteConfig` so that `config/`
 * can depend on `utils/` without creating a cycle.
 */

/** Removes a trailing slash, except from the bare root. */
export function stripTrailingSlash(value: string): string {
  return value.length > 1 ? value.replace(/\/+$/, "") : value;
}

export function ensureLeadingSlash(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Resolves a site-relative path to an absolute URL. Absolute inputs and
 * `mailto:` / `tel:` schemes are returned untouched.
 */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(pathOrUrl)) return pathOrUrl;
  return `${stripTrailingSlash(env.siteUrl)}${ensureLeadingSlash(pathOrUrl)}`;
}

/** `mailto:` and `tel:` must bypass `next/link`, which expects a route. */
export function isProtocolLink(href: string): boolean {
  return /^(mailto:|tel:)/i.test(href);
}

export function isExternalUrl(href: string): boolean {
  return /^(https?:)?\/\//i.test(href) && !href.startsWith(env.siteUrl);
}

/** `https://github.com/user` → `github.com` */
export function getHostname(href: string): string {
  try {
    return new URL(href, env.siteUrl).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

/** Attributes an external anchor must carry. Spread onto the element. */
export function externalLinkAttributes(): {
  target: "_blank";
  rel: string;
} {
  return { target: "_blank", rel: "noopener noreferrer" };
}
