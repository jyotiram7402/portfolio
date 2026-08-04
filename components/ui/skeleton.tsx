import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Matches the shape of the content being replaced. */
  shape?: "line" | "block" | "circle";
}

/**
 * Loading placeholder.
 *
 * A travelling sheen rather than a pulsing opacity: the sweep reads as "content
 * is arriving", where a pulse reads as "something is wrong". Marked
 * `aria-hidden` with `role="presentation"` — the region it sits in should carry
 * `aria-busy`, so announcing the skeleton itself would be duplicate noise.
 */
export function Skeleton({ className, shape = "block", ...props }: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-input",
        shape === "line" && "h-4 rounded-full",
        shape === "block" && "rounded-xl",
        shape === "circle" && "aspect-square rounded-full",
        className,
      )}
      {...props}
    >
      <span
        data-motion-decorative
        className={cn(
          "absolute inset-0 animate-shimmer",
          "bg-linear-to-r from-transparent via-highlight to-transparent",
        )}
      />
    </div>
  );
}

/** Convenience stack for multi-line text placeholders. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          shape="line"
          // Ragged last line, so the block reads as prose rather than a table.
          className={index === lines - 1 ? "w-3/5" : "w-full"}
        />
      ))}
    </div>
  );
}
