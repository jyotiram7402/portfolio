import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Fades the line out at both ends — softer than a hard hairline. */
  fade?: boolean;
  /** Optional centred label, e.g. "or". */
  label?: string;
}

/**
 * Rule between sections.
 *
 * Rendered as a `separator` only when it is decorative-free; a labelled divider
 * conveys structure, so it keeps the role and its accessible name.
 */
export function Divider({
  className,
  orientation = "horizontal",
  fade = false,
  label,
  ...props
}: DividerProps) {
  const isVertical = orientation === "vertical";

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label={label}
        className={cn("flex items-center gap-4", className)}
        {...props}
      >
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-border" />
        <span className="text-2xs tracking-widest text-subtle uppercase">
          {label}
        </span>
        <span className="h-px flex-1 bg-linear-to-l from-transparent to-border" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0",
        isVertical ? "w-px self-stretch" : "h-px w-full",
        fade
          ? isVertical
            ? "bg-linear-to-b from-transparent via-border to-transparent"
            : "bg-linear-to-r from-transparent via-border to-transparent"
          : "bg-border",
        className,
      )}
      {...props}
    />
  );
}
