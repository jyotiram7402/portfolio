"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { type ReactNode, useRef } from "react";

import { SPRING } from "@/config/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-drawn vertical timeline.
 *
 * The rail is two stacked elements: a static hairline spanning the full height,
 * and a gradient fill whose `scaleY` tracks the container's scroll progress.
 * Scaling a fixed-height element is composited; animating `height` would force
 * layout on every frame.
 *
 * Geometry is the contract between `Timeline` and `TimelineItem`: markers are
 * 28px wide at `left-0`, so the rail sits at `left-3.5` (14px) to pass through
 * their centre. Change one and the other must follow.
 */

export interface TimelineProps {
  children: ReactNode;
  /** Accessible name for the ordered list. */
  label: string;
  className?: string;
}

export function Timeline({ children, label, className }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Begins drawing as the list reaches the lower quarter of the viewport and
    // completes before it leaves, so the line is never static mid-read.
    offset: ["start 78%", "end 60%"],
  });

  const smoothed = useSpring(scrollYProgress, {
    stiffness: SPRING.smooth.stiffness,
    damping: SPRING.smooth.damping,
    mass: SPRING.smooth.mass,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <span
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-3.5 w-px bg-border"
      />

      {/* Reduced motion renders the rail complete rather than removing it: the
          line is structural, and one frozen half-drawn would read as broken. */}
      {reduceMotion ? (
        <span
          aria-hidden="true"
          className="absolute top-3 bottom-3 left-3.5 w-px bg-linear-to-b from-foreground/60 to-foreground/20"
        />
      ) : (
        <motion.span
          aria-hidden="true"
          style={{ scaleY: smoothed }}
          className={cn(
            "absolute top-3 bottom-3 left-3.5 w-px origin-top",
            "bg-linear-to-b from-foreground/60 to-foreground/20",
          )}
        />
      )}

      <ol aria-label={label} className="relative flex flex-col">
        {children}
      </ol>
    </div>
  );
}

export interface TimelineItemProps {
  children: ReactNode;
  /** Icon for the marker tile. Sized by the marker, not by the caller. */
  marker?: ReactNode;
  /** Short rail label — a year or a period. */
  period?: string;
  /** Adds the live indicator used for the present-day entry. */
  current?: boolean;
  /** Drops the trailing spacing on the final item. */
  last?: boolean;
  className?: string;
}

export function TimelineItem({
  children,
  marker,
  period,
  current = false,
  last = false,
  className,
}: TimelineItemProps) {
  return (
    <li
      className={cn(
        "relative pl-12 sm:pl-14",
        last ? "pb-0" : "pb-10 sm:pb-14",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0 left-0 grid size-7 place-items-center rounded-lg",
          "border transition-colors duration-[var(--duration-normal)]",
          current
            ? "border-primary/50 bg-primary/15 text-primary"
            : "border-border bg-elevated text-muted",
          "[&_svg]:size-3.5",
        )}
      >
        {current ? (
          <span
            data-motion-decorative
            className="absolute inset-0 animate-ping rounded-lg bg-primary/25"
          />
        ) : null}
        <span className="relative">
          {marker ?? <span className="block size-1.5 rounded-full bg-current" />}
        </span>
      </span>

      {period ? (
        <p className="eyebrow mb-2 flex items-center gap-2">
          <span>{period}</span>
          {current ? (
            <span className="text-primary lowercase">· now</span>
          ) : null}
        </p>
      ) : null}

      {children}
    </li>
  );
}
