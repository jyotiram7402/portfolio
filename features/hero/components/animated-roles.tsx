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
  className?: string;
}

const FALLBACK_ROLE = roles[0]?.label ?? "";

/**
 * The rotating role line under the hero subtitle.
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
export function AnimatedRoles({ interval = 2800, className }: AnimatedRolesProps) {
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
    <p className={cn("flex items-center gap-3 text-sm", className)}>
      <span aria-hidden="true" className="h-px w-8 shrink-0 bg-border-strong" />

      <span className="sr-only">
        Roles: {roles.map((role) => role.label).join(", ")}.
      </span>

      {reduceMotion ? (
        <span aria-hidden="true" className="font-mono text-foreground">
          {FALLBACK_ROLE}
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="relative block h-6 flex-1 overflow-hidden font-mono"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: DURATION.slow, ease: ease.outExpo }}
              className="absolute inset-0 flex items-center whitespace-nowrap text-foreground"
            >
              {current}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </p>
  );
}
