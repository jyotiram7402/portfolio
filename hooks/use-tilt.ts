"use client";

import { type MotionValue, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { SPRING, TILT } from "@/config/animations";
import { useIsPointerFine } from "@/hooks/use-is-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface UseTiltOptions {
  /** Maximum rotation in degrees, reached at the corners. */
  maxRotation?: number;
  /** CSS perspective in pixels. Lower is more dramatic. */
  perspective?: number;
  scaleOnHover?: number;
  /** Inverts the axis so the card tilts away from the pointer. */
  invert?: boolean;
  disabled?: boolean;
}

export interface TiltResult {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  scale: MotionValue<number>;
  isEnabled: boolean;
  handlers: {
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
  };
  perspective: number;
}

/**
 * 3D tilt driven by pointer position within the element.
 *
 * Handlers are element-scoped rather than window-scoped — a card only needs to
 * know about the pointer while it is over it — which keeps the cost proportional
 * to the number of *hovered* cards, not rendered ones.
 */
export function useTilt(options: UseTiltOptions = {}): TiltResult {
  const {
    maxRotation = TILT.maxRotation,
    perspective = TILT.perspective,
    scaleOnHover = TILT.scaleOnHover,
    invert = false,
    disabled = false,
  } = options;

  const pointerFine = useIsPointerFine();
  const reduceMotion = useReducedMotion();
  const isEnabled = pointerFine && !reduceMotion && !disabled;

  // −0.5 → 0.5 relative to the element's centre.
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const hovered = useMotionValue(0);

  const direction = invert ? -1 : 1;

  const rotateY = useSpring(
    useTransform(offsetX, (value) => value * maxRotation * 2 * direction),
    SPRING.smooth,
  );
  const rotateX = useSpring(
    useTransform(offsetY, (value) => -value * maxRotation * 2 * direction),
    SPRING.smooth,
  );
  const scale = useSpring(
    useTransform(hovered, [0, 1], [1, scaleOnHover]),
    SPRING.smooth,
  );

  const frame = useRef(0);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!isEnabled) return;
      const element = event.currentTarget;
      const { clientX, clientY } = event;

      // `getBoundingClientRect` forces layout; batching to one read per frame
      // keeps a fast pointer from thrashing it.
      if (frame.current !== 0) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        offsetX.set((clientX - rect.left) / rect.width - 0.5);
        offsetY.set((clientY - rect.top) / rect.height - 0.5);
      });
    },
    [isEnabled, offsetX, offsetY],
  );

  const onPointerEnter = useCallback(() => {
    if (isEnabled) hovered.set(1);
  }, [hovered, isEnabled]);

  const onPointerLeave = useCallback(() => {
    if (frame.current !== 0) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    hovered.set(0);
    offsetX.set(0);
    offsetY.set(0);
  }, [hovered, offsetX, offsetY]);

  // Memoised so the object identity is stable for consumers that compose these
  // with their own handlers inside a `useCallback`.
  const handlers = useMemo(
    () => ({ onPointerMove, onPointerEnter, onPointerLeave }),
    [onPointerMove, onPointerEnter, onPointerLeave],
  );

  return { rotateX, rotateY, scale, isEnabled, perspective, handlers };
}
