"use client";

import { ErrorState } from "@/components/common/error-state";
import { ROUTES } from "@/constants/routes";

/** Error boundary for the recruiter dashboard. */
export default function RecruitersError({
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
      scope="The recruiter summary"
      backHref={ROUTES.resume}
      backLabel="View the résumé"
    />
  );
}
