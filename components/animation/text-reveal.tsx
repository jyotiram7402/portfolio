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
  /**
   * The text as one continuous string, for assistive tech and crawlers.
   *
   * Supply it whenever the lines form a single sentence or name. Line wrappers are
   * `block` spans with no whitespace between them, so without this the text content
   * runs together — "Jyotiram" + "Kamble" reads as "JyotiramKamble". When set, this
   * becomes the element's accessible name and the visual lines are hidden from
   * assistive tech.
   */
  label?: string;
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
  label,
  className,
  lineClassName,
}: TextRevealProps) {
  const Component = motionTags[as];
  const reduceMotion = useReducedMotion();

  /*
    Splitting a sentence into `block` spans puts no whitespace between them, so the
    element's text content runs the lines together — the hero's `h1` read
    "JyotiramKamble" to a screen reader, to a crawler and in a link preview.

    When `label` is supplied it becomes the element's entire accessible name and the
    visual lines are hidden from assistive tech. `aria-labelledby` on the enclosing
    `<Section>` still resolves correctly, because it reads this element's accessible
    name rather than its markup.
  */
  const accessibleName = label !== undefined ? <span className="sr-only">{label}</span> : null;
  const hideVisual = label !== undefined ? { "aria-hidden": true as const } : {};

  if (reduceMotion) {
    const Static = as;
    return (
      <Static id={id} className={cn(className)}>
        {accessibleName}
        {lines.map((line, index) => (
          <span key={index} {...hideVisual} className={cn("block", lineClassName)}>
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
      {accessibleName}
      {lines.map((line, index) => (
        <span
          key={index}
          {...hideVisual}
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
