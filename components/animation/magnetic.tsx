"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { MAGNETIC } from "@/config/animations";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

export interface MagneticProps {
  children: ReactNode;
  /** 0–1 fraction of the pointer offset the element follows. */
  strength?: number;
  /** Pixels of surrounding area that still attracts. */
  padding?: number;
  /** Cap on travel, so a wide target cannot displace the layout. */
  maxDistance?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Wraps a control so it leans towards the pointer.
 *
 * Purely decorative, so it is inert on touch devices and under reduced motion.
 * The hook decides that, which is why this component never branches on
 * capabilities itself — it only branches on the answer.
 *
 * The wrapper is `inline-flex` so it does not disturb the layout of whatever it
 * wraps, and the non-magnetic path renders a plain span rather than a motion
 * component, keeping the animation runtime out of the mobile render path.
 */
export function Magnetic({
  children,
  strength = MAGNETIC.strength,
  padding = MAGNETIC.padding,
  maxDistance = 24,
  disabled = false,
  className,
}: MagneticProps) {
  const { ref, x, y, isEnabled } = useMagnetic<HTMLSpanElement>({
    strength,
    padding,
    maxDistance,
    disabled,
  });

  if (!isEnabled) {
    return <span className={cn("inline-flex", className)}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      className={cn("inline-flex will-change-transform", className)}
    >
      {children}
    </motion.span>
  );
}
