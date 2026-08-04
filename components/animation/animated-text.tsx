"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import {
  characterFade,
  textRevealChild,
  textRevealContainer,
} from "@/animations/variants";
import { type MotionTag, motionTags } from "@/components/animation/motion-tags";
import { STAGGER, VIEWPORT } from "@/config/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export type SplitBy = "word" | "character";
export type TextEffect = "mask" | "fade";

/**
 * Non-breaking space, built from its code point rather than pasted as a literal
 * so it stays visible in a diff. Needed because an ordinary space inside an
 * `inline-block` collapses to nothing.
 */
const NBSP = String.fromCharCode(160);

export interface AnimatedTextProps {
  /** Plain text. Splitting requires a string, not arbitrary nodes. */
  text: string;
  as?: MotionTag;
  /** Unit of animation. Per-character on long copy is expensive and gaudy. */
  splitBy?: SplitBy;
  /** `mask` rises each unit out of a clipped line; `fade` is lighter. */
  effect?: TextEffect;
  /** Seconds between units. Defaults to a value tuned per split unit. */
  stagger?: number;
  delay?: number;
  /** Animates on mount rather than on scroll — for above-the-fold copy. */
  immediate?: boolean;
  /** Needed when another element references this one via `aria-labelledby`. */
  id?: string;
  className?: string;
}

/**
 * Splits text and animates each unit in.
 *
 * Accessibility is the constraint that shapes this component. A per-character
 * split turns one readable string into dozens of sibling elements, which some
 * screen readers announce letter by letter. So the split output is
 * `aria-hidden`, and the original string is rendered once into a visually hidden
 * span: assistive tech reads the sentence, sighted users see the animation.
 *
 * Under reduced motion the split is skipped entirely and the text renders as
 * plain markup — there is no reason to build forty DOM nodes for an animation
 * that will not play.
 */
export function AnimatedText({
  text,
  as = "p",
  splitBy = "word",
  effect = "mask",
  stagger,
  delay = 0,
  immediate = false,
  id,
  className,
}: AnimatedTextProps) {
  const Component = motionTags[as];
  const reduceMotion = useReducedMotion();

  const units = useMemo(
    () => (splitBy === "character" ? Array.from(text) : text.split(" ")),
    [text, splitBy],
  );

  const container = useMemo(
    () =>
      textRevealContainer(
        stagger ?? (splitBy === "character" ? STAGGER.character : STAGGER.word),
        delay,
      ),
    [stagger, splitBy, delay],
  );

  if (reduceMotion) {
    return (
      <Component id={id} className={cn(className)}>
        {text}
      </Component>
    );
  }

  const child = effect === "mask" ? textRevealChild : characterFade;
  const animateProp = immediate
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: VIEWPORT.eager };

  return (
    <Component
      id={id}
      variants={container}
      initial="hidden"
      {...animateProp}
      className={cn(className)}
    >
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {units.map((unit, index) => (
          <span key={`${unit}-${index}`} className="inline-block">
            <span
              className={cn(
                "inline-block",
                // The mask effect needs a clipping context per unit. A little
                // bottom padding keeps descenders from being shaved off.
                effect === "mask" && "overflow-hidden pb-[0.1em] align-bottom",
              )}
            >
              <motion.span variants={child} className="inline-block">
                {unit.length === 0 ? NBSP : unit}
              </motion.span>
            </span>

            {/* Word separator, placed outside the clipping span where a space
                still renders. */}
            {splitBy === "word" && index < units.length - 1 ? NBSP : null}
          </span>
        ))}
      </span>
    </Component>
  );
}
