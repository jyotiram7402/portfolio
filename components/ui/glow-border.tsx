import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface GlowBorderProps extends HTMLAttributes<HTMLDivElement> {
  /** Corner radius token. Must match the child's radius or the ring will clip. */
  radius?: "lg" | "xl" | "2xl" | "3xl" | "full";
  /** Runs the conic sweep continuously instead of only on hover. */
  always?: boolean;
  /** Ring thickness in pixels. */
  thickness?: 1 | 2;
}

const radiusClass = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
} as const;

/**
 * Animated conic border around its children.
 *
 * Implemented as a rotating conic gradient behind an inset child rather than an
 * animated `border-image`, because only the former can travel around a rounded
 * corner smoothly. The gradient layer is marked decorative so the reduced-motion
 * rule in `styles/base.css` removes it outright — a rotating light source is
 * exactly the kind of motion that setting exists for.
 */
export function GlowBorder({
  className,
  radius = "2xl",
  always = false,
  thickness = 1,
  children,
  ...props
}: GlowBorderProps) {
  return (
    <div
      className={cn(
        "group/glow relative isolate",
        radiusClass[radius],
        className,
      )}
      {...props}
    >
      <span
        data-motion-decorative
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-px -z-10 overflow-hidden",
          radiusClass[radius],
          "opacity-0 transition-opacity duration-[var(--duration-slow)]",
          always
            ? "opacity-100"
            : "group-hover/glow:opacity-100 group-focus-within/glow:opacity-100",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 left-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2",
            "animate-spin-slow",
            "bg-conic from-primary via-secondary to-accent",
          )}
        />
      </span>

      {/* Masks the centre of the sweep, leaving only the ring visible. */}
      <div
        className={cn(
          "relative h-full bg-card",
          radiusClass[radius],
          thickness === 2 ? "m-0.5" : "",
        )}
      >
        {children}
      </div>
    </div>
  );
}
