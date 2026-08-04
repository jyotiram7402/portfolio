"use client";

import { ErrorState } from "@/components/common/error-state";
import { ROUTES } from "@/constants/routes";

/**
 * Error boundary for the blog segment — the index and every article beneath it.
 *
 * Must be a Client Component: `reset()` re-renders the segment on the client.
 *
 * Four lines, because the entire body lives in `ErrorState`. That is deliberate — five route
 * boundaries written independently drift apart in tone and in what they disclose, and the one that
 * accidentally prints a stack trace is the one nobody notices.
 */
export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      error={error}
      reset={reset}
      scope="This article"
      backHref={ROUTES.blog}
      backLabel="All articles"
    />
  );
}
