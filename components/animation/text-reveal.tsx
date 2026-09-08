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

  /*
    Splitting a sentence into `block` spans puts no whitespace between them, so the
    element's text content runs the lines together — the hero's `h1` read
    "JyotiramKamble" to a screen reader, to a crawler and in a link preview.

    The fix is a trailing space inside every line but the last. Trailing whitespace at
    the end of a block box collapses to nothing, so this is invisible — but it lands in
    the text content, which is what both the accessibility tree and a crawler read.

    A hidden duplicate of the full string was the first attempt and was worse: `aria-hidden`
    keeps a node out of the accessibility tree but not out of `textContent`, so the `h1`
    became "Jyotiram KambleJyotiramKamble" for anything reading text rather than ARIA.
  */
  /** Collapses to nothing visually; present in the text content, which is the point. */
  const gap = (index: number) => (index < lines.length - 1 ? " " : null);

  if (reduceMotion) {
    const Static = as;
    return (
      <Static id={id} className={cn(className)}>
        {lines.map((line, index) => (
          <span key={index} className={cn("block", lineClassName)}>
            {line}
            {gap(index)}
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
            {gap(index)}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
