"use client";

import { motion } from "framer-motion";
import { type PointerEvent as ReactPointerEvent, type ReactNode, useCallback } from "react";

import { useMouseGlow } from "@/hooks/use-mouse-glow";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

export interface TiltCardProps {
  children: ReactNode;
  /** Maximum rotation in degrees at the corners. */
  maxRotation?: number;
  /** Adds a highlight that tracks the pointer across the surface. */
  glare?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Gives its children a subtle 3D tilt under the pointer.
 *
 * A perspective on the wrapper plus `preserve-3d` is what makes the rotation
 * read as depth rather than a skew, and the spring damping is what makes the
 * card settle instead of snapping when the pointer leaves.
 *
 * The rotation comes from `useTilt` (MotionValues) and the highlight from
 * `useMouseGlow` (CSS custom properties). Both are pointer-driven but neither
 * touches React state, so a grid of these costs no re-renders while hovered.
 *
 * On touch devices and under reduced motion this renders a plain div and the
 * motion runtime is never engaged.
 */
export function TiltCard({
  children,
  maxRotation,
  glare = true,
  disabled = false,
  className,
}: TiltCardProps) {
  const { rotateX, rotateY, scale, isEnabled, handlers, perspective } = useTilt({
    maxRotation,
    disabled,
  });

  const glow = useMouseGlow<HTMLDivElement>({ disabled: !glare || disabled });

  // One handler drives both effects, so the pointer is only sampled once.
  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      handlers.onPointerMove(event);
      glow.handlers.onPointerMove(event);
    },
    [glow.handlers, handlers],
  );

  const onPointerEnter = useCallback(() => {
    handlers.onPointerEnter();
    glow.handlers.onPointerEnter();
  }, [glow.handlers, handlers]);

  const onPointerLeave = useCallback(() => {
    handlers.onPointerLeave();
    glow.handlers.onPointerLeave();
  }, [glow.handlers, handlers]);

  if (!isEnabled) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={glow.ref}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={{ perspective, rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
      className={cn("relative isolate will-change-transform", className)}
    >
      {glare && glow.isEnabled ? (
        <span
          aria-hidden="true"
          className="spotlight pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
        />
      ) : null}
      {children}
    </motion.div>
  );
}
