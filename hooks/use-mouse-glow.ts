"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { useIsPointerFine } from "@/hooks/use-is-mobile";

export interface UseMouseGlowOptions {
  /** Custom property names, in case an element hosts two glow layers. */
  xVariable?: string;
  yVariable?: string;
  opacityVariable?: string;
  disabled?: boolean;
}

/**
 * Pointer-tracked spotlight, written straight to CSS custom properties.
 *
 * No React state and no MotionValues: the only consumer is a `radial-gradient`
 * whose centre is `var(--glow-x) var(--glow-y)`, so writing the properties on
 * the node is both the cheapest path and the one that survives re-renders. The
 * component stays completely out of the render loop while the pointer moves.
 *
 * Deliberately not gated on reduced motion — a gradient following the cursor
 * has no vestibular effect, and removing it would strip the affordance rather
 * than calm it.
 */
export function useMouseGlow<TElement extends HTMLElement = HTMLDivElement>(
  options: UseMouseGlowOptions = {},
) {
  const {
    xVariable = "--glow-x",
    yVariable = "--glow-y",
    opacityVariable = "--glow-opacity",
    disabled = false,
  } = options;

  const ref = useRef<TElement | null>(null);
  const frame = useRef(0);
  const pointerFine = useIsPointerFine();
  const isEnabled = pointerFine && !disabled;

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<TElement>) => {
      if (!isEnabled) return;
      const element = ref.current ?? event.currentTarget;
      const { clientX, clientY } = event;

      if (frame.current !== 0) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const rect = element.getBoundingClientRect();
        element.style.setProperty(xVariable, `${clientX - rect.left}px`);
        element.style.setProperty(yVariable, `${clientY - rect.top}px`);
      });
    },
    [isEnabled, xVariable, yVariable],
  );

  const onPointerEnter = useCallback(() => {
    if (!isEnabled) return;
    ref.current?.style.setProperty(opacityVariable, "1");
  }, [isEnabled, opacityVariable]);

  const onPointerLeave = useCallback(() => {
    if (frame.current !== 0) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    ref.current?.style.setProperty(opacityVariable, "0");
  }, [opacityVariable]);

  // Memoised so the object identity is stable — consumers spread it into JSX and
  // may list it as an effect or callback dependency.
  const handlers = useMemo(
    () => ({ onPointerMove, onPointerEnter, onPointerLeave }),
    [onPointerMove, onPointerEnter, onPointerLeave],
  );

  return { ref, isEnabled, handlers } as const;
}
