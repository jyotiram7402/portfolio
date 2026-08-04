import { cn } from "@/lib/utils";

export interface NoiseProps {
  className?: string;
}

/**
 * Film-grain overlay.
 *
 * The single cheapest thing that stops a dark gradient from looking like a flat
 * CSS gradient: a fixed, non-scrolling grain breaks up the banding that 8-bit
 * colour produces across a large blurred area.
 *
 * Static, so it is exempt from the reduced-motion rule — and `fixed` rather than
 * `absolute` so it never scrolls, which would turn the texture into visible
 * motion.
 */
export function Noise({ className }: NoiseProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "noise-layer pointer-events-none fixed inset-0 z-[var(--z-decoration)]",
        className,
      )}
    />
  );
}
