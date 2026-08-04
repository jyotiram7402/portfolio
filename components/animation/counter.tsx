"use client";

import { animate, useInView, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef } from "react";

import { ease } from "@/animations/easings";
import { DURATION, VIEWPORT } from "@/config/animations";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/utils/format";

export interface CounterProps {
  /** The final value. Rendered as-is on the server. */
  value: number;
  /** Appended after the number, e.g. `+` or `%`. */
  suffix?: string;
  /** `Intl` compact notation: 100000 → 100K. */
  compact?: boolean;
  /** Seconds. */
  duration?: number;
  className?: string;
}

/**
 * Counts up to a number when it scrolls into view.
 *
 * Three details make this production-safe rather than decorative:
 *
 * 1. **The server renders the final value.** So the figure is in the HTML for
 *    crawlers and for anyone without JavaScript, and the element is already its
 *    final width — the count-up cannot cause layout shift. The client resets the
 *    text to zero in a layout effect, before the browser paints, so there is no
 *    visible flash of the answer.
 *
 * 2. **Zero re-renders while animating.** The value lives in a MotionValue and is
 *    written straight to `textContent`. A `useState` version would re-render the
 *    whole statistics band sixty times a second.
 *
 * 3. **Reduced motion skips it entirely** — the number is simply correct from the
 *    first frame, which is what someone who asked for less motion wants.
 */
export function Counter({
  value,
  suffix,
  compact = false,
  duration = DURATION.slowest * 1.4,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, VIEWPORT.once);

  const format = (input: number) =>
    compact ? formatCompactNumber(Math.round(input)) : String(Math.round(input));

  useMotionValueEvent(motionValue, "change", (latest) => {
    if (ref.current) ref.current.textContent = format(latest);
  });

  // Runs before paint, so the reset from the server-rendered final value to zero
  // is never visible.
  useIsomorphicLayoutEffect(() => {
    if (reduceMotion || !ref.current) return;
    ref.current.textContent = format(0);
    // `format` is derived from props that are already dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, compact]);

  useEffect(() => {
    if (reduceMotion || !isInView) return;

    const controls = animate(motionValue, value, {
      duration,
      ease: ease.outExpo,
    });

    return () => controls.stop();
  }, [duration, isInView, motionValue, reduceMotion, value]);

  return (
    <span className={cn("tabular-nums", className)}>
      {/* `aria-hidden` on the animating node, with the true value announced once —
          otherwise a screen reader narrates every intermediate number. */}
      <span ref={ref} aria-hidden="true">
        {format(value)}
      </span>
      {suffix ? <span aria-hidden="true">{suffix}</span> : null}
      <span className="sr-only">
        {format(value)}
        {suffix}
      </span>
    </span>
  );
}
