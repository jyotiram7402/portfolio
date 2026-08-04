import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full border",
    "font-medium whitespace-nowrap",
    "[&_svg]:size-3 [&_svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        default: "border-border bg-elevated text-muted",
        primary: "border-primary/25 bg-primary/12 text-primary",
        secondary: "border-secondary/25 bg-secondary/12 text-secondary",
        accent: "border-accent/25 bg-accent/12 text-accent",
        success: "border-success/25 bg-success/12 text-success",
        warning: "border-warning/25 bg-warning/12 text-warning",
        danger: "border-danger/25 bg-danger/12 text-danger",
        outline: "border-border-strong bg-transparent text-foreground",
      },
      size: {
        sm: "h-5 px-2 text-2xs tracking-wide uppercase",
        md: "h-6 px-2.5 text-xs",
      },
    },
    defaultVariants: { tone: "default", size: "md" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Renders a small status dot before the label. */
  dot?: boolean;
  /** Adds a slow pulse to the dot, for live status. */
  pulse?: boolean;
}

/**
 * Static status label. Never interactive — if it needs a click, it is a `Chip`.
 */
export function Badge({
  className,
  tone,
  size,
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props}>
      {dot ? (
        <span className="relative flex size-1.5 shrink-0">
          {pulse ? (
            <span
              data-motion-decorative
              className="absolute inset-0 animate-ping rounded-full bg-current opacity-60"
            />
          ) : null}
          <span className="relative size-1.5 rounded-full bg-current" />
        </span>
      ) : null}
      {children}
    </span>
  );
}

export { badgeVariants };
