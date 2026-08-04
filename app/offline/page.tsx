import type { Metadata } from "next";
import { CloudOff } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Offline",
  description: "You are offline. Pages already visited remain available.",
  path: ROUTES.offline,
  // Never indexed. A page saying "you are offline" in search results would be absurd.
  noIndex: true,
});

/**
 * The service worker's navigation fallback.
 *
 * Precached on install and served only when a navigation fails with no cached copy of the target.
 * It is never linked from anywhere, which is why it is in `UNINDEXED_ROUTES` and excluded from the
 * sitemap.
 *
 * Deliberately dependency-free and static. This page has to render from cache with no network, so
 * it uses nothing that could need a runtime fetch — no client hooks, no dynamic imports, no
 * images. The retry is a plain `Link` back to the home page rather than a `router.refresh()`,
 * because the router itself may not be able to reach the server.
 *
 * The honest framing matters here too: it says which pages *are* available rather than only that
 * something is wrong.
 */
export default function OfflinePage() {
  return (
    <Section
      as="div"
      spacing="none"
      className="flex min-h-[calc(100dvh-var(--header-height))] items-center py-24"
      innerClassName="flex max-w-xl flex-col gap-7"
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-12 place-items-center rounded-2xl",
          "border border-border bg-elevated text-muted",
        )}
      >
        <CloudOff className="size-5" />
      </span>

      <div className="flex flex-col gap-3">
        <p className="eyebrow">No connection</p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground">
          You are offline.
        </h1>
        <p className="text-lg leading-relaxed text-muted">
          This page could not be reached. Anything you have already visited is still available —
          the assets are cached, so those pages will load exactly as they did before.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href={ROUTES.home}>Back to home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href={ROUTES.blog}>Cached articles</Link>
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-subtle">
        Reconnecting is all that is needed — nothing was lost, and no state was discarded.
      </p>
    </Section>
  );
}
