"use client";

import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { useMouseGlow } from "@/hooks/use-mouse-glow";
import { cn } from "@/lib/utils";

const glassCardVariants = cva("relative isolate overflow-hidden", {
  variants: {
    surface: {
      glass: "glass",
      solid: "border border-border bg-card",
      elevated: "border border-border bg-elevated shadow-lg",
      outline: "border border-border bg-transparent",
    },
    radius: {
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    interactive: {
      true: [
        "transition-[transform,border-color,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-out-quint)]",
        "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-xl",
        "focus-within:border-border-strong",
      ],
    },
  },
  defaultVariants: { surface: "glass", radius: "2xl", padding: "md" },
});

export interface GlassCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  /** Pointer-tracked spotlight across the surface. Inert on touch devices. */
  glow?: boolean;
  /** Adds the 1px inner top highlight that makes a dark surface read as physical. */
  sheen?: boolean;
}

/**
 * The standard content surface.
 *
 * Two details do most of the work: a hairline gradient highlight along the top
 * edge, and a spotlight that follows the pointer. The spotlight is driven by CSS
 * custom properties written directly to the node, so tracking the cursor across
 * a grid of these costs zero React renders.
 */
export function GlassCard({
  className,
  surface,
  radius,
  padding,
  interactive,
  glow = true,
  sheen = true,
  children,
  ...props
}: GlassCardProps) {
  const { ref, isEnabled, handlers } = useMouseGlow<HTMLDivElement>({
    disabled: !glow,
  });

  return (
    <div
      ref={ref}
      className={cn(
        glassCardVariants({ surface, radius, padding, interactive }),
        sheen && "surface-sheen",
        className,
      )}
      {...(isEnabled ? handlers : {})}
      {...props}
    >
      {isEnabled ? (
        <span
          aria-hidden="true"
          className="spotlight pointer-events-none absolute inset-0 -z-10"
        />
      ) : null}
      {children}
    </div>
  );
}

export { glassCardVariants };
