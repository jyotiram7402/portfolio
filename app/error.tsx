"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

/**
 * Route-level error boundary.
 *
 * Must be a Client Component — `reset()` re-renders the segment on the client.
 *
 * The user is shown a recovery action and nothing else. Stack traces and digests
 * are for the console, and only in development: a production error page that
 * leaks internals is both a poor experience and an information disclosure.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (env.isProduction) return;
    // eslint-disable-next-line no-console
    console.error("[route error]", error);
  }, [error]);

  return (
    <Section
      spacing="none"
      ariaLabelledBy="error-heading"
      className="flex min-h-[calc(100dvh-var(--header-height))] items-center py-24"
      innerClassName="flex max-w-2xl flex-col gap-6"
    >
      <p className="eyebrow" aria-hidden="true">
        Something went wrong
      </p>

      <h1
        id="error-heading"
        className="text-4xl font-semibold tracking-tight text-balance text-foreground"
      >
        This section failed to load.
      </h1>

      <p className="text-lg text-muted">
        The rest of the site is unaffected. Try again, and if it keeps happening
        the problem is on my side rather than yours.
      </p>

      {env.isDevelopment ? (
        <pre className="max-w-full overflow-x-auto rounded-xl border border-danger/30 bg-danger/8 p-4 font-mono text-xs text-danger">
          {error.message}
        </pre>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button onClick={reset}>
          <RotateCcw aria-hidden="true" className="size-4" />
          Try again
        </Button>
      </div>
    </Section>
  );
}
