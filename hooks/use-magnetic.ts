"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

import { MAGNETIC, SPRING } from "@/config/animations";
import { useIsPointerFine } from "@/hooks/use-is-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { clamp } from "@/utils/math";

export interface UseMagneticOptions {
  /** 0–1. How far the element follows the pointer, as a fraction of the offset. */
  strength?: number;
  /** Pixels of dead zone around the element that still attract. */
  padding?: number;
  /** Caps travel so a large hit area cannot fling the element across the layout. */
  maxDistance?: number;
  disabled?: boolean;
}

/**
 * Magnetic hover: the element leans towards the pointer while it is over it.
 *
 * Returns a ref to attach and `x`/`y` MotionValues to feed a `motion` element's
 * `style`. Automatically inert on touch devices and under reduced motion — the
 * effect is decorative, and a coarse pointer cannot express it anyway.
 */
export function useMagnetic<TElement extends HTMLElement = HTMLElement>(
  options: UseMagneticOptions = {},
) {
  const {
    strength = MAGNETIC.strength,
    padding = MAGNETIC.padding,
    maxDistance = 24,
    disabled = false,
  } = options;

  const ref = useRef<TElement | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, SPRING.responsive);
  const y = useSpring(rawY, SPRING.responsive);

  const pointerFine = useIsPointerFine();
  const reduceMotion = useReducedMotion();
  const isEnabled = pointerFine && !reduceMotion && !disabled;

  const reset = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !isEnabled) {
      reset();
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Bail out early when the pointer is outside the padded hit area, so a
      // window-level listener stays cheap.
      if (
        event.clientX < rect.left - padding ||
        event.clientX > rect.right + padding ||
        event.clientY < rect.top - padding ||
        event.clientY > rect.bottom + padding
      ) {
        reset();
        return;
      }

      rawX.set(
        clamp((event.clientX - centerX) * strength, -maxDistance, maxDistance),
      );
      rawY.set(
        clamp((event.clientY - centerY) * strength, -maxDistance, maxDistance),
      );
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", reset);
      reset();
    };
  }, [isEnabled, maxDistance, padding, rawX, rawY, reset, strength]);

  return { ref, x, y, isEnabled, reset } as const;
}
