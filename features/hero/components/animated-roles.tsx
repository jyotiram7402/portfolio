"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { ease } from "@/animations/easings";
import { DURATION } from "@/config/animations";
import { roles } from "@/data/profile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface AnimatedRolesProps {
  /** Milliseconds each role is held. */
  interval?: number;
  /**
   * `lg` sits directly under the hero name and has to hold its own against display type.
   * `sm` is the original quiet mono line, kept for any caller that wants a footnote.
   */
  size?: "sm" | "lg";
  className?: string;
}

const FALLBACK_ROLE = roles[0]?.label ?? "";

/** Row height per size. Fixed, so a longer role can never shift what sits below it. */
const ROW_HEIGHT = {
  sm: "h-6",
  lg: "h-8 sm:h-10",
} as const;

const TEXT_STYLE = {
  sm: "font-mono text-sm text-foreground",
  lg: "text-xl font-semibold tracking-tight text-primary sm:text-3xl",
} as const;

/**
 * The rotating role line under the hero name.
 *
 * Accessibility drives the whole design:
 *
 * • **The full list is always in the DOM**, visually hidden. A screen reader gets
 *   every role in one readable sentence instead of a single word that changes out
 *   from under it.
 * • **The animated node is `aria-hidden` with `aria-live` off.** Announcing a
 *   swap every few seconds would interrupt whatever the user was reading.
 * • **Reduced motion stops the rotation entirely** and shows the primary role.
 *   Auto-changing content is exactly what WCAG 2.2.2 is about, and a decorative
 *   carousel with no pause control has no business overriding that preference.
 *
 * The row reserves its height from the line-height rather than from measurement,
 * so a longer role cannot shift the buttons below it.
 */
export function AnimatedRoles({
  interval = 2800,
  size = "sm",
  className,
}: AnimatedRolesProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || roles.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((previous) => (previous + 1) % roles.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval, reduceMotion]);

  const current = roles[index]?.label ?? FALLBACK_ROLE;

  return (
    <p className={cn("flex items-center gap-3", className)}>
      {/* The rule is a lead-in on the small variant. At display size it would read as a
          strikethrough sitting beside the word, so it is dropped. */}
      {size === "sm" ? (
        <span aria-hidden="true" className="h-px w-8 shrink-0 bg-border-strong" />
      ) : null}

      <span className="sr-only">
        Roles: {roles.map((role) => role.label).join(", ")}.
      </span>

      {reduceMotion ? (
        <span aria-hidden="true" className={TEXT_STYLE[size]}>
          {FALLBACK_ROLE}
        </span>
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "relative block flex-1 overflow-hidden",
            ROW_HEIGHT[size],
            TEXT_STYLE[size],
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: DURATION.slow, ease: ease.outExpo }}
              className="absolute inset-0 flex items-center whitespace-nowrap"
            >
              {current}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </p>
  );
}
