"use client";

import type { ReactNode } from "react";

import { AnimatedText } from "@/components/animation/animated-text";
import { Reveal } from "@/components/animation/reveal";
import { cn } from "@/lib/utils";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4";

export interface AnimatedHeadingProps {
  children: string;
  /** Heading level. Choose from document outline, not from desired size. */
  as?: HeadingLevel;
  /** Visual size, decoupled from the level so semantics stay correct. */
  size?: "display" | "xl" | "lg" | "md" | "sm";
  /** Small mono label rendered above the heading. */
  eyebrow?: string;
  /** Supporting copy rendered below. */
  description?: ReactNode;
  align?: "left" | "center";
  /** Animate on mount instead of on scroll — for the first screen. */
  immediate?: boolean;
  /** Applied to the heading element, for `aria-labelledby` on the section. */
  id?: string;
  className?: string;
  descriptionClassName?: string;
}

const sizeClass = {
  display: "text-display font-semibold tracking-tightest",
  xl: "text-6xl font-semibold tracking-tighter",
  lg: "text-5xl font-semibold tracking-tighter",
  md: "text-4xl font-semibold tracking-tight",
  sm: "text-3xl font-semibold tracking-tight",
} as const;

/**
 * Section heading with an optional eyebrow and description.
 *
 * The eyebrow, heading and description enter as one choreographed group with a
 * short offset between them, which is what makes a section feel composed rather
 * than three independently animated elements that happen to be adjacent.
 */
export function AnimatedHeading({
  children,
  as = "h2",
  size = "md",
  eyebrow,
  description,
  align = "left",
  immediate = false,
  id,
  className,
  descriptionClassName,
}: AnimatedHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
      )}
    >
      {eyebrow ? (
        <Reveal
          effect="fade"
          delay={0.05}
          className={cn("eyebrow flex items-center gap-2.5")}
        >
          <span aria-hidden="true" className="h-px w-6 bg-border-strong" />
          {eyebrow}
        </Reveal>
      ) : null}

      <AnimatedText
        id={id}
        as={as}
        text={children}
        splitBy="word"
        effect="mask"
        immediate={immediate}
        delay={eyebrow ? 0.1 : 0}
        className={cn(
          "text-balance text-foreground",
          sizeClass[size],
          align === "center" && "mx-auto",
          className,
        )}
      />

      {description ? (
        <Reveal
          effect="up"
          distance={16}
          delay={0.22}
          className={cn(
            "max-w-prose text-lg text-muted",
            align === "center" && "mx-auto",
            descriptionClassName,
          )}
        >
          {description}
        </Reveal>
      ) : null}
    </div>
  );
}
