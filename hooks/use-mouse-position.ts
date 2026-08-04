"use client";

import { type MotionValue, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { SPRING } from "@/config/animations";

export interface UseMousePositionOptions {
  /** Set false to detach the listener entirely — e.g. on touch devices. */
  enabled?: boolean;
  /** Spring config for the smoothed values. */
  spring?: { stiffness: number; damping: number; mass: number };
}

export interface MousePosition {
  /** Viewport coordinates, updated on every pointer event. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Spring-followed coordinates, for trailing elements. */
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  /** −1 → 1 across the viewport, for parallax and light direction. */
  normalizedX: MotionValue<number>;
  normalizedY: MotionValue<number>;
  /** True once the pointer has been seen inside the window. */
  isActive: boolean;
}

/**
 * Tracks the pointer as MotionValues.
 *
 * Returning MotionValues instead of state is the whole point: `pointermove`
 * fires up to once per frame, and a `useState` version would re-render every
 * consumer at that rate. Only `isActive` is state, because it changes twice per
 * session.
 */
export function useMousePosition(
  options: UseMousePositionOptions = {},
): MousePosition {
  const { enabled = true, spring = SPRING.responsive } = options;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isActive, setIsActive] = useState(false);
  // Mirrors `isActive` so the move handler can skip the setState call entirely
  // rather than relying on React's bail-out on every frame.
  const isActiveRef = useRef(false);

  const smoothX = useSpring(x, spring);
  const smoothY = useSpring(y, spring);

  // Viewport size is read inside the transform rather than stored, so a resize
  // needs no listener and no extra render.
  const normalizedX = useTransform(x, (value) =>
    typeof window === "undefined" ? 0 : (value / window.innerWidth) * 2 - 1,
  );
  const normalizedY = useTransform(y, (value) =>
    typeof window === "undefined" ? 0 : (value / window.innerHeight) * 2 - 1,
  );

  useEffect(() => {
    if (!enabled) return;

    const onPointerMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      if (!isActiveRef.current) {
        isActiveRef.current = true;
        setIsActive(true);
      }
    };

    const onPointerLeave = () => {
      isActiveRef.current = false;
      setIsActive(false);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [enabled, x, y]);

  return { x, y, smoothX, smoothY, normalizedX, normalizedY, isActive };
}
