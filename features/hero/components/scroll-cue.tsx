"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { fadeOnly } from "@/animations/variants";
import { SECTIONS } from "@/constants/sections";
import { useMotionVariants } from "@/hooks/use-motion-variants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { scrollToElement } from "@/utils/scroll";

/** Built once at module scope — a fresh object per render would defeat the memo
 *  inside `useMotionVariants`. */
const CUE_VARIANTS = fadeOnly();

export interface ScrollCueProps {
  /** Section to scroll to. Defaults to the one after the hero. */
  targetId?: string;
  className?: string;
}

/**
 * Bottom-centre scroll affordance.
 *
 * A real `<button>`, not a decorative chevron: it is the fastest way past the
 * hero for a keyboard or switch user, and it routes through Lenis so the motion
 * matches the rest of the site.
 *
 * It hides as soon as the reader has scrolled at all — a cue that persists after
 * being acted on stops being a cue and becomes clutter. The bounce is a `y`
 * keyframe loop, which is composited, and is dropped entirely under reduced
 * motion while the button itself remains.
 */
export function ScrollCue({ targetId = SECTIONS.about, className }: ScrollCueProps) {
  const { isAtTop } = useScroll({ threshold: 8 });
  const reduceMotion = useReducedMotion();
  const variants = useMotionVariants(CUE_VARIANTS);

  return (
    <AnimatePresence>
      {isAtTop ? (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-8 flex justify-center",
            className,
          )}
        >
          <button
            type="button"
            onClick={() => scrollToElement(targetId)}
            className={cn(
              "pointer-events-auto group/cue inline-flex flex-col items-center gap-2",
              "rounded-full px-4 py-2 text-subtle transition-colors",
              "hover:text-foreground focus-ring",
            )}
          >
            <span className="font-mono text-2xs tracking-widest uppercase">
              Scroll
            </span>

            <motion.span
              aria-hidden="true"
              animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
              }
              className={cn(
                "grid size-8 place-items-center rounded-full border border-border",
                "bg-glass backdrop-blur-md",
                "transition-colors group-hover/cue:border-border-strong",
              )}
            >
              <ChevronDown className="size-3.5" />
            </motion.span>

            <span className="sr-only">Skip to the About section</span>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
