"use client";

import { ArrowLeft, RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  /** The boundary's error. Logged in development, never rendered in production. */
  error: Error & { digest?: string };
  /** Re-renders the failed segment. Provided by Next to every `error.tsx`. */
  reset: () => void;
  /** What failed, in the reader's terms — "this article", not "the RSC payload". */
  scope: string;
  /** Where "back" goes. Defaults to the home page. */
  backHref?: string;
  backLabel?: string;
}

/**
 * The shared body of every route error boundary.
 *
 * Extracted so each `error.tsx` is four lines and they cannot drift apart in tone or in what they
 * disclose. Four decisions carried across all of them:
 *
 * • **The message is scoped, not global.** "This article failed to load" tells the reader the rest
 *   of the site is fine; "Something went wrong" implies it is not.
 * • **Retry first, navigate second.** A route error is very often transient, and `reset()` is
 *   cheaper for the reader than a full reload.
 * • **Nothing internal is disclosed in production.** Stack traces and digests go to the console,
 *   and only in development. An error page that prints internals is both a poor experience and
 *   an information leak.
 * • **The digest is shown when one exists**, because it is the one string that makes a report
 *   actionable — and it is an opaque hash, not a stack trace.
 */
export function ErrorState({
  error,
  reset,
  scope,
  backHref = ROUTES.home,
  backLabel = "Back to home",
}: ErrorStateProps) {
  useEffect(() => {
    if (env.isProduction) return;
    // eslint-disable-next-line no-console
    console.error(`[${scope}]`, error);
  }, [error, scope]);

  return (
    <Section
      as="div"
      spacing="none"
      className="flex min-h-[calc(100dvh-var(--header-height))] items-center py-24"
      innerClassName="flex max-w-2xl flex-col gap-7"
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-12 place-items-center rounded-2xl",
          "border border-danger/30 bg-danger/10 text-danger",
        )}
      >
        <TriangleAlert className="size-5" />
      </span>

      <div className="flex flex-col gap-3">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground">
          {scope} failed to load.
        </h1>
        <p className="text-lg leading-relaxed text-muted">
          The rest of the site is unaffected. Try again — and if it keeps happening, the
          problem is on my side rather than yours.
        </p>
      </div>

      {env.isDevelopment ? (
        <pre
          className={cn(
            "max-w-full overflow-x-auto rounded-xl border border-danger/30",
            "bg-danger/8 p-4 font-mono text-xs leading-relaxed text-danger",
          )}
        >
          {error.message}
        </pre>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={reset}>
          <RotateCcw aria-hidden="true" className="size-4" />
          Try again
        </Button>

        <Button asChild variant="secondary">
          <Link href={backHref}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            {backLabel}
          </Link>
        </Button>
      </div>

      {error.digest ? (
        <p className="font-mono text-2xs text-subtle">
          Reference: {error.digest}
        </p>
      ) : null}
    </Section>
  );
}
