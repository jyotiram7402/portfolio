import { cn } from "@/lib/utils";

export interface GridOverlayProps {
  className?: string;
  /** Dot matrix instead of ruled lines. */
  variant?: "lines" | "dots";
}

/**
 * Faint engineering grid.
 *
 * The detail that reads as "built by an engineer" rather than "designed in a
 * template". Radially masked so it is only visible in the centre of the
 * viewport — a grid that runs edge to edge fights the content instead of sitting
 * behind it.
 *
 * Static and `fixed`, so it costs one composited layer and nothing per frame.
 */
export function GridOverlay({ className, variant = "lines" }: GridOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0",
        variant === "lines" ? "bg-grid" : "bg-dots",
        "mask-radial",
        className,
      )}
    />
  );
}
