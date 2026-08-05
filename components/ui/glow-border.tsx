import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface GlowBorderProps extends HTMLAttributes<HTMLDivElement> {
  /** Corner radius token. Must match the child's radius or the ring will clip. */
  radius?: "lg" | "xl" | "2xl" | "3xl" | "full";
  /** Shows the ring unconditionally instead of only on hover and focus. */
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
 * Hairline highlight ring around its children.
 *
 * This was a rotating conic gradient — a light source travelling the border on
 * hover. It went with the rest of the decorative layer: the ring's job is to
 * tell you an element is interactive, and a brightening hairline does that
 * without asking for attention. What remains is a one-property opacity
 * transition, so there is nothing left for reduced motion to suppress.
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
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-px -z-10 bg-border-strong",
          radiusClass[radius],
          "opacity-0 transition-opacity duration-[var(--duration-normal)]",
          always
            ? "opacity-100"
            : "group-hover/glow:opacity-100 group-focus-within/glow:opacity-100",
        )}
      />

      {/* Masks the centre of the ring layer, leaving only the hairline visible. */}
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
