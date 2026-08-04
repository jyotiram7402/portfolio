"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";

import { staggerContainer, staggerItem } from "@/animations/variants";
import { type MotionTag, motionTags } from "@/components/animation/motion-tags";
import { STAGGER, VIEWPORT } from "@/config/animations";
import { useMotionVariants } from "@/hooks/use-motion-variants";
import { cn } from "@/lib/utils";

export interface StaggerProps {
  children: ReactNode;
  as?: MotionTag;
  /** Seconds between children. */
  gap?: number;
  /** Seconds before the first child starts. */
  delay?: number;
  repeat?: boolean;
  className?: string;
}

/**
 * Sequences the entrance of its children.
 *
 * The parent carries the timing and the children carry the motion, so a list can
 * be reordered or filtered without recalculating per-item delays — which is what
 * makes this safe to use with dynamic content.
 *
 * Children must be `StaggerItem`, or any `motion` element declaring `hidden` and
 * `visible` variants.
 */
export function Stagger({
  children,
  as = "div",
  gap = STAGGER.normal,
  delay = 0,
  repeat = false,
  className,
}: StaggerProps) {
  const Component = motionTags[as];
  const variants = useMemo(() => staggerContainer(gap, delay), [gap, delay]);

  return (
    <Component
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={repeat ? VIEWPORT.repeat : VIEWPORT.once}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}

export interface StaggerItemProps {
  children: ReactNode;
  as?: MotionTag;
  className?: string;
}

/** Child of `Stagger`. Inherits its delay from the parent's timing. */
export function StaggerItem({
  children,
  as = "div",
  className,
}: StaggerItemProps) {
  const Component = motionTags[as];
  const variants = useMotionVariants(staggerItem);

  return (
    <Component variants={variants} className={cn(className)}>
      {children}
    </Component>
  );
}
