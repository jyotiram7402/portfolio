"use client";

import { ErrorState } from "@/components/common/error-state";
import { ROUTES } from "@/constants/routes";

/** Error boundary for the résumé centre. */
export default function ResumeError({
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
      scope="The résumé"
      backHref={ROUTES.recruiters}
      backLabel="Recruiter summary"
    />
  );
}
