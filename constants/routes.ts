/**
 * Every internal path in one object.
 *
 * Referencing `ROUTES.resume` instead of the string `"/resume"` means a route rename is a
 * compile error rather than a silent dead link.
 */
export const ROUTES = {
  home: "/",
  about: "/about",
  work: "/work",
  blog: "/blog",
  contact: "/contact",
  resume: "/resume",
  recruiters: "/recruiters",
  /** PWA fallback. Reachable only from the service worker, never linked. */
  offline: "/offline",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type Route = (typeof ROUTES)[RouteKey];

/**
 * Routes that exist as real pages today. The navigation renders anything absent from this
 * list as "soon" rather than linking to a 404.
 *
 * Add a key here the moment its page lands.
 */
export const IMPLEMENTED_ROUTES: readonly Route[] = [
  ROUTES.home,
  ROUTES.blog,
  ROUTES.contact,
  ROUTES.resume,
  ROUTES.recruiters,
];

/**
 * Routes excluded from the sitemap and from search indexes.
 *
 * `/offline` exists only as a service-worker fallback. Indexing it would put a page saying
 * "you are offline" into search results.
 */
export const UNINDEXED_ROUTES: readonly Route[] = [ROUTES.offline];

export function isRouteImplemented(href: string): boolean {
  return IMPLEMENTED_ROUTES.includes(href as Route);
}

export function isRouteIndexable(href: string): boolean {
  return !UNINDEXED_ROUTES.includes(href as Route);
}

/** True when `href` is the active route, treating nested paths as active. */
export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === ROUTES.home) return pathname === ROUTES.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Canonical path for a blog post. */
export function blogPostPath(slug: string): string {
  return `${ROUTES.blog}/${slug}`;
}
