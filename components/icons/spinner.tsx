import { cn } from "@/lib/utils";

export interface SpinnerProps {
  className?: string;
  /** Announced to assistive tech. Pass `null` when a parent already announces. */
  label?: string | null;
}

/**
 * Indeterminate progress ring.
 *
 * Hand-drawn rather than a Lucide icon so the arc weight matches the site's
 * hairline borders, and so it can inherit `currentColor` at any size.
 *
 * Exempt from the reduced-motion policy on purpose: this communicates state,
 * and freezing it would leave the user staring at a static ring.
 */
export function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className={cn("size-4 animate-spin", className)}
      >
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.2"
        />
        <path
          d="M21.5 12A9.5 9.5 0 0 0 12 2.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
    </>
  );
}
