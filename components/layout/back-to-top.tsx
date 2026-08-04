"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { popIn } from "@/animations/variants";
import { IconButton } from "@/components/ui/icon-button";
import { useMotionVariants } from "@/hooks/use-motion-variants";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { scrollToTop } from "@/utils/scroll";

export interface BackToTopProps {
  /** Pixels scrolled before the button appears. */
  threshold?: number;
  className?: string;
}

/**
 * Return-to-top control.
 *
 * Appears after a meaningful scroll rather than immediately, so it does not
 * occupy the corner of the first screen. It is a real `<button>` inside a
 * `<nav>`-free landmark-neutral wrapper, so keyboard users reach it in document
 * order at the end of the page — where they would want it.
 *
 * `scrollToTop` routes through Lenis when it is running, so the return uses the
 * same easing as the rest of the page's scrolling.
 */
export function BackToTop({ threshold = 720, className }: BackToTopProps) {
  const { offsetRef, isScrolled, direction } = useScroll({ threshold });
  const variants = useMotionVariants(popIn);

  // `isScrolled` is the only piece of scroll state that re-renders this, and
  // `direction` keeps the button out of the way while the user reads downward.
  const visible = isScrolled && (direction === "up" || offsetRef.current > 2400);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "fixed right-6 bottom-6 z-[var(--z-sticky)] lg:right-10 lg:bottom-10",
            className,
          )}
        >
          <IconButton
            label="Back to top"
            variant="glass"
            onClick={() => scrollToTop()}
            className="shadow-lg"
          >
            <ArrowUp />
          </IconButton>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
