"use client";

import dynamic from "next/dynamic";

import { useIsDesktop } from "@/hooks/use-is-mobile";
import { useMounted } from "@/hooks/use-mounted";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getPerformanceTier } from "@/utils/dom";

/**
 * three.js is ~150 kB gzipped. It is loaded only after the checks below pass, so
 * a phone, a low-power laptop or a reduced-motion visitor never downloads it.
 */
const ParticleFieldScene = dynamic(
  () =>
    import("@/components/background/scene/particle-field").then(
      (module) => module.ParticleFieldScene,
    ),
  { ssr: false },
);

export interface WebglBackdropProps {
  className?: string;
}

/**
 * Gate in front of the WebGL layer.
 *
 * Four conditions must hold before three.js is fetched at all:
 *   • the client has mounted (there is no WebGL context on the server);
 *   • the viewport is desktop-sized;
 *   • the device tier is not `low`;
 *   • the user has not asked for reduced motion.
 *
 * When any fails this renders nothing, and the CSS background layers carry the
 * whole visual on their own — the WebGL field is an enhancement, never the
 * baseline.
 */
export function WebglBackdrop({ className }: WebglBackdropProps) {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();

  if (!mounted || !isDesktop || reduceMotion) return null;
  if (getPerformanceTier() === "low") return null;

  return <ParticleFieldScene className={className} />;
}
