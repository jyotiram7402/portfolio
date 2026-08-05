"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import type { CSSProperties } from "react";

import { LogoMark } from "@/components/icons/logo-mark";
import { SPRING } from "@/config/animations";
import { useIsPointerFine } from "@/hooks/use-is-mobile";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * The hero's interactive visual: a technology orbit.
 *
 * Chosen over a portrait or a WebGL scene for three reasons — it says what the
 * work is, it costs nothing but composited transforms, and it degrades to a
 * static diagram that still looks designed.
 *
 * Entirely decorative. Every technology named here also appears in the Skills
 * section, so the assembly is `aria-hidden` rather than announced twice.
 *
 * Three implementation notes:
 *
 * • Geometry lives in the `orbit-node` / `orbit-upright` utilities, with radii in
 *   `cqw` against the `@container` below — the orbit scales with its own box and
 *   needs no breakpoint overrides.
 * • The spin animates the independent `rotate` property, not `transform`, so it
 *   cannot clobber the positioning transform on the same element.
 * • Each label counter-spins with an identical reversed animation, which keeps
 *   text level without any per-frame JavaScript.
 */

interface OrbitRing {
  id: string;
  /** Node distance from centre, in container-query width units. */
  radiusClass: string;
  /** Inset that sizes the visible ring. */
  insetClass: string;
  /** Ring rotation. Must be mirrored exactly by `labelSpinClass`. */
  spinClass: string;
  /** The reverse of `spinClass`, applied to each label. */
  labelSpinClass: string;
  /** Degrees of offset, so the rings do not line up into spokes. */
  offset: number;
  items: readonly string[];
}

const RINGS: readonly OrbitRing[] = [
  {
    id: "outer",
    radiusClass: "[--orbit-radius:43cqw]",
    insetClass: "inset-[7%]",
    spinClass: "animate-[orbit-spin_52s_linear_infinite]",
    labelSpinClass: "animate-[orbit-spin_52s_linear_infinite_reverse]",
    offset: 0,
    items: ["Java", "Spring Boot", "Kafka", "MySQL", "Docker", "React"],
  },
  {
    id: "middle",
    radiusClass: "[--orbit-radius:29cqw]",
    insetClass: "inset-[21%]",
    spinClass: "animate-[orbit-spin_38s_linear_infinite_reverse]",
    labelSpinClass: "animate-[orbit-spin_38s_linear_infinite]",
    offset: 36,
    items: ["REST API", "JPA", "Redis", "AWS", "Spring Security"],
  },
  {
    id: "inner",
    radiusClass: "[--orbit-radius:16cqw]",
    insetClass: "inset-[34%]",
    spinClass: "animate-[orbit-spin_26s_linear_infinite]",
    labelSpinClass: "animate-[orbit-spin_26s_linear_infinite_reverse]",
    offset: 45,
    items: ["Claude Code", "MCP", "CI/CD", "Git"],
  },
];

export interface TechOrbitProps {
  className?: string;
}

export function TechOrbit({ className }: TechOrbitProps) {
  const pointerFine = useIsPointerFine();
  const reduceMotion = useReducedMotion();
  const interactive = pointerFine && !reduceMotion;

  const { normalizedX, normalizedY } = useMousePosition({ enabled: interactive });

  // Window-level rather than element-level: the orbit should acknowledge the
  // cursor anywhere in the hero, not only when it is over the rings.
  const rotateY = useSpring(
    useTransform(normalizedX, [-1, 1], [-14, 14]),
    SPRING.gentle,
  );
  const rotateX = useSpring(
    useTransform(normalizedY, [-1, 1], [10, -10]),
    SPRING.gentle,
  );

  const assembly = (
    <>
      <span
        data-motion-decorative={reduceMotion ? undefined : true}
        className={cn(
          "absolute inset-[12%] rounded-full blur-3xl",
          "bg-[radial-gradient(circle_at_center,var(--aurora-1),transparent_68%)]",
          !reduceMotion && "animate-glow",
        )}
      />

      {RINGS.map((ring) => (
        <div key={ring.id} className={cn("absolute", ring.insetClass)}>
          <div
            className={cn(
              "absolute inset-0 rounded-full border border-border",
              ring.id === "outer" && "border-dashed opacity-70",
            )}
          />

          <div
            className={cn(
              "absolute inset-0",
              ring.radiusClass,
              !reduceMotion && ring.spinClass,
            )}
          >
            {ring.items.map((item, index) => (
              <span
                key={item}
                className="orbit-node"
                // Computed geometry, not styling: the angle depends on the item's
                // index, which no static class can express.
                style={
                  {
                    "--orbit-angle": `${ring.offset + (360 / ring.items.length) * index}deg`,
                  } as CSSProperties
                }
              >
                <span className="orbit-upright">
                  <span className={cn("block", !reduceMotion && ring.labelSpinClass)}>
                    <span
                      className={cn(
                        "block rounded-full border border-glass-border px-2.5 py-1",
                        "bg-glass shadow-sm backdrop-blur-md",
                        "font-mono text-2xs whitespace-nowrap text-muted",
                      )}
                    >
                      {item}
                    </span>
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className={cn(
            "border-gradient grid size-20 place-items-center rounded-3xl sm:size-24",
            "glass shadow-xl",
          )}
        >
          <LogoMark className="size-9 sm:size-10" />
        </div>
      </div>
    </>
  );

  return (
    <div
      aria-hidden="true"
      className={cn(
        "@container relative mx-auto aspect-square w-full max-w-[30rem] select-none",
        // Perspective must sit on the parent of the rotated element, not on it.
        interactive && "[perspective:1200px]",
        className,
      )}
    >
      {interactive ? (
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="absolute inset-0 will-change-transform"
        >
          {assembly}
        </motion.div>
      ) : (
        <div className="absolute inset-0">{assembly}</div>
      )}
    </div>
  );
}
