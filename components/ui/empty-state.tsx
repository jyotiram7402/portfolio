import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** A single action. More than one and it is not an empty state, it is a menu. */
  action?: ReactNode;
  className?: string;
}

/**
 * Nothing to show here.
 *
 * Used where a section is genuinely empty — a speaking category with no entries, a
 * search with no results, a filter that excludes everything. The point is that an honest
 * empty state looks deliberate, while a grid of filler cards looks broken.
 *
 * The copy is always specific about *why* it is empty and what to do next. "No results"
 * on its own is a dead end.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border",
        "bg-surface/40 px-6 py-14 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-11 place-items-center rounded-xl",
          "border border-border bg-elevated text-subtle",
          "[&_svg]:size-5",
        )}
      >
        <Icon />
      </span>

      <div className="flex max-w-sm flex-col gap-1.5">
        <p className="text-sm font-semibold tracking-tight text-foreground">{title}</p>
        <p className="text-sm leading-relaxed text-muted">{description}</p>
      </div>

      {action}
    </div>
  );
}
