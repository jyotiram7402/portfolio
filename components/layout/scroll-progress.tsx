"use client";

import { motion } from "framer-motion";

import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

export interface ScrollProgressProps {
  className?: string;
}

/**
 * Reading-progress bar pinned under the header.
 *
 * Driven by a MotionValue rather than React state, so the bar updates on the
 * compositor and the component itself renders exactly once. `scaleX` on a
 * full-width element is the cheapest way to express progress — animating `width`
 * would force layout on every frame.
 *
 * Purely decorative: the same information is already in the scrollbar, so it is
 * hidden from assistive tech rather than announced as a progressbar that cannot
 * be interacted with.
 */
export function ScrollProgress({ className }: ScrollProgressProps) {
  const { smoothProgress } = useScrollProgress();

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[var(--z-sticky)] h-px",
        className,
      )}
    >
      <motion.div
        style={{ scaleX: smoothProgress }}
        className={cn(
          "h-full w-full origin-left",
          "bg-linear-to-r from-primary via-secondary to-accent",
        )}
      />
    </div>
  );
}
