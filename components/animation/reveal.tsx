"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";

import { fade, fadeOnly, scale } from "@/animations/variants";
import { transition, withDelay } from "@/animations/transitions";
import { type MotionTag, motionTags } from "@/components/animation/motion-tags";
import { DISTANCE, VIEWPORT } from "@/config/animations";
import { useMotionVariants } from "@/hooks/use-motion-variants";
import { cn } from "@/lib/utils";

export type RevealEffect = "fade" | "up" | "down" | "left" | "right" | "scale";

export interface RevealProps {
  children: ReactNode;
  /** Element to render. Pick the one that is semantically right for the slot. */
  as?: MotionTag;
  effect?: RevealEffect;
  /** Seconds before the animation starts. */
  delay?: number;
  /** Travel distance in pixels. Ignored by `fade` and `scale`. */
  distance?: number;
  /** Re-animate every time the element re-enters the viewport. */
  repeat?: boolean;
  /** Fraction of the element that must be visible to trigger. */
  amount?: number;
  className?: string;
}

/**
 * Scroll-triggered entrance for a single block.
 *
 * `once: true` is the default because a portfolio is read top-to-bottom:
 * re-animating on the way back up draws attention to the effect rather than to
 * the content.
 *
 * Reduced motion is handled by `useMotionVariants`, which strips the travel and
 * keeps the opacity change — so nothing can ever fail to appear.
 */
export function Reveal({
  children,
  as = "div",
  effect = "up",
  delay = 0,
  distance = DISTANCE.md,
  repeat = false,
  amount,
  className,
}: RevealProps) {
  const Component = motionTags[as];

  const baseVariants = useMemo(() => {
    const tween =
      delay > 0 ? withDelay(transition.slow, delay) : transition.slow;
    const spring =
      delay > 0
        ? withDelay(transition.springSmooth, delay)
        : transition.springSmooth;

    switch (effect) {
      case "fade":
        return fadeOnly(tween);
      case "scale":
        return scale(0.94, spring);
      case "up":
      case "down":
      case "left":
      case "right":
        return fade(effect, distance, tween);
    }
  }, [effect, distance, delay]);

  const variants = useMotionVariants(baseVariants);

  const viewport = useMemo(
    () => ({
      ...(repeat ? VIEWPORT.repeat : VIEWPORT.once),
      ...(amount !== undefined ? { amount } : {}),
    }),
    [repeat, amount],
  );

  return (
    <Component
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
