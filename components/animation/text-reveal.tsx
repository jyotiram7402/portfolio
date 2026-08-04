"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { textRevealChild, textRevealContainer } from "@/animations/variants";
import { type MotionTag, motionTags } from "@/components/animation/motion-tags";
import { VIEWPORT } from "@/config/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface TextRevealProps {
  /**
   * One entry per visual line. Lines are authored explicitly rather than
   * measured: a mask reveal needs to know where the line breaks are *before* it
   * animates, and measuring after layout would cause a visible reflow.
   */
  lines: readonly ReactNode[];
  /**
   * Element to render. Use `h1`/`h2` for headings — the line wrappers are
   * `span`s, which is phrasing content and therefore valid inside a heading.
   */
  as?: MotionTag;
  /** Seconds between lines. */
  stagger?: number;
  delay?: number;
  immediate?: boolean;
  /** Needed when a `<Section>` references this heading via `aria-labelledby`. */
  id?: string;
  className?: string;
  lineClassName?: string;
}

/**
 * Line-by-line mask reveal for rich content.
 *
 * Use this when the lines contain markup — a gradient span, a link, an icon —
 * which `AnimatedText` cannot handle because it splits a plain string. For
 * ordinary copy, prefer `AnimatedText`.
 */
export function TextReveal({
  lines,
  as = "div",
  stagger = 0.09,
  delay = 0,
  immediate = false,
  id,
  className,
  lineClassName,
}: TextRevealProps) {
  const Component = motionTags[as];
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Static = as;
    return (
      <Static id={id} className={cn(className)}>
        {lines.map((line, index) => (
          <span key={index} className={cn("block", lineClassName)}>
            {line}
          </span>
        ))}
      </Static>
    );
  }

  const animateProp = immediate
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: VIEWPORT.eager };

  return (
    <Component
      id={id}
      variants={textRevealContainer(stagger, delay)}
      initial="hidden"
      {...animateProp}
      className={cn(className)}
    >
      {lines.map((line, index) => (
        <span
          key={index}
          className={cn("block overflow-hidden pb-[0.1em]", lineClassName)}
        >
          <motion.span variants={textRevealChild} className="block">
            {line}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
