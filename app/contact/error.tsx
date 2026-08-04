"use client";

import { ErrorState } from "@/components/common/error-state";
import { ROUTES } from "@/constants/routes";

/**
 * Error boundary for the contact page.
 *
 * Scoped copy matters most here: a visitor whose contact page failed needs to know the email address
 * still works, and `ErrorState`'s "the rest of the site is unaffected" plus a route home is what
 * carries that. A generic "something went wrong" on the page someone came to in order to reach you
 * is the worst possible place for it.
 */
export default function ContactError({
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
      scope="The contact page"
      backHref={ROUTES.home}
    />
  );
}
