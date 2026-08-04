import { cn } from "@/lib/utils";

export interface LogoMarkProps {
  className?: string;
  /** Renders the mark in the brand gradient instead of `currentColor`. */
  gradient?: boolean;
}

/**
 * The brand mark: a diamond aperture with a solid core.
 *
 * The gradient id is a fixed string rather than a generated one. This component
 * renders in Server Components, where `useId` is unavailable, and because every
 * instance defines an identical gradient, a repeated id resolves to the same
 * paint — there is nothing to collide over.
 */
export function LogoMark({ className, gradient = true }: LogoMarkProps) {
  const stroke = gradient ? "url(#pf-logo-gradient)" : "currentColor";

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("size-8", className)}
    >
      {gradient ? (
        <defs>
          <linearGradient
            id="pf-logo-gradient"
            x1="2"
            y1="2"
            x2="30"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--primary)" />
            <stop offset="0.55" stopColor="var(--secondary)" />
            <stop offset="1" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
      ) : null}

      <path
        d="M16 2.5 29.5 16 16 29.5 2.5 16Z"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path
        d="M16 9.25 22.75 16 16 22.75 9.25 16Z"
        fill={stroke}
      />
    </svg>
  );
}
