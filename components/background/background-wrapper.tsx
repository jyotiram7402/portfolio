"use client";

import { Aurora } from "@/components/background/aurora";
import { GradientOrbs } from "@/components/background/gradient-orbs";
import { GridOverlay } from "@/components/background/grid-overlay";
import { MeshGradient } from "@/components/background/mesh-gradient";
import { Noise } from "@/components/background/noise";
import { Particles } from "@/components/background/particles";
import { WebglBackdrop } from "@/components/background/webgl-backdrop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface BackgroundWrapperProps {
  /** Drops the WebGL and particle layers. For dense pages such as an article. */
  minimal?: boolean;
  className?: string;
}

/**
 * Composes the ambient background.
 *
 * Layer order, back to front:
 *   1. mesh gradient  — low-frequency colour, stops large areas banding
 *   2. aurora         — the top-of-page wash
 *   3. gradient orbs  — keeps the deep scroll region from going flat
 *   4. WebGL field    — desktop, capable devices, motion allowed
 *   5. particles      — the 2D fallback for everything else
 *   6. grid           — the engineering detail
 *   7. noise          — grain over the whole stack
 *
 * `fixed inset-0` with a negative z-index puts the entire stack in its own
 * stacking context behind the content, and `pointer-events-none` guarantees no
 * layer can ever intercept a click. Under reduced motion every layer still
 * renders — the composition is part of the design — but nothing animates.
 */
export function BackgroundWrapper({
  minimal = false,
  className,
}: BackgroundWrapperProps) {
  const reduceMotion = useReducedMotion();
  const still = reduceMotion;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-[var(--z-behind)] overflow-hidden",
        className,
      )}
    >
      <MeshGradient still={still} />
      <Aurora still={still} />
      <GradientOrbs still={still} />

      {minimal ? null : (
        <>
          <WebglBackdrop />
          <Particles count={44} />
        </>
      )}

      <GridOverlay />
      <Noise />
    </div>
  );
}
