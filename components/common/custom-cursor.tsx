"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { CURSOR } from "@/config/animations";
import { useIsPointerFine } from "@/hooks/use-is-mobile";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Elements that should enlarge the ring. Opt in elsewhere with `data-cursor`. */
const INTERACTIVE_SELECTOR =
  'a[href], button, [role="button"], input, textarea, select, summary, [data-cursor="hover"]';

/**
 * Custom cursor: an instant dot with a trailing ring.
 *
 * Only mounts where it makes sense — a fine pointer, motion allowed. On touch
 * there is no cursor to replace, and under reduced motion a spring-trailing ring
 * is precisely the kind of movement the preference is asking us to drop. In both
 * cases the native cursor is left alone and nothing renders.
 *
 * Hiding the native cursor is done by setting `data-cursor="custom"` on `<html>`
 * from this component, so the CSS rule that hides it can only ever apply while a
 * replacement is actually on screen. Text inputs keep their caret cursor, because
 * a dot gives no indication of where text will land.
 *
 * `pointer-events: none` on both layers is non-negotiable: without it the cursor
 * would swallow every click on the page.
 */
export function CustomCursor() {
  const pointerFine = useIsPointerFine();
  const reduceMotion = useReducedMotion();
  const enabled = pointerFine && !reduceMotion;

  const { x, y, smoothX, smoothY, isActive } = useMousePosition({
    enabled,
    spring: {
      stiffness: 520,
      damping: 34,
      mass: 0.45,
    },
  });

  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.dataset.cursor = "custom";

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      setIsHovering(target.closest(INTERACTIVE_SELECTOR) !== null);
    };

    const onPointerDown = () => setIsPressed(true);
    const onPointerUp = () => setIsPressed(false);

    document.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("blur", onPointerUp);

    return () => {
      delete root.dataset.cursor;
      document.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("blur", onPointerUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringScale = isPressed
    ? CURSOR.ringPressScale
    : isHovering
      ? CURSOR.ringHoverScale
      : 1;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[var(--z-cursor)]"
    >
      {/* Trailing ring. Positioned by the outer element, centred by the inner one,
          so Framer Motion's transform never fights a Tailwind translate. */}
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className={cn(
          "absolute top-0 left-0 will-change-transform",
          isActive ? "opacity-100" : "opacity-0",
          "transition-opacity duration-[var(--duration-normal)]",
        )}
      >
        <motion.div
          animate={{ scale: ringScale }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className={cn(
            "-translate-x-1/2 -translate-y-1/2 rounded-full border",
            isHovering ? "border-primary/70 bg-primary/8" : "border-border-strong",
            "size-9",
          )}
        />
      </motion.div>

      {/* Leading dot, unsmoothed so the pointer never feels laggy. */}
      <motion.div
        style={{ x, y }}
        className={cn(
          "absolute top-0 left-0 will-change-transform",
          isActive ? "opacity-100" : "opacity-0",
          "transition-opacity duration-[var(--duration-fast)]",
        )}
      >
        <div
          className={cn(
            "size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
            isHovering ? "bg-primary" : "bg-foreground",
          )}
        />
      </motion.div>
    </div>
  );
}
