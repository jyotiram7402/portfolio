"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, type Points as ThreePoints } from "three";

import { useIntersection } from "@/hooks/use-intersection";
import { cn } from "@/lib/utils";
import { getPerformanceTier } from "@/utils/dom";
import { readCssVariable } from "@/utils/theme";

interface FieldProps {
  count: number;
  color: string;
}

/**
 * A single `Points` object holding every particle.
 *
 * One draw call for the whole field — the reason to reach for WebGL here at all.
 * Positions are generated once and never mutated; the drift is a rotation of the
 * parent object, which costs one matrix update per frame instead of re-uploading
 * a buffer.
 */
function Field({ count, color }: FieldProps) {
  const ref = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      // Rejection-free spherical distribution: uniform in volume, so the field
      // does not clump at the poles the way naive angle sampling does.
      const radius = 2.2 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      array[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      array[index * 3 + 2] = radius * Math.cos(phi);
    }
    return array;
  }, [count]);

  useFrame((state, delta) => {
    const points = ref.current;
    if (!points) return;
    points.rotation.y += delta * 0.024;
    points.rotation.x = Math.sin(state.clock.elapsedTime * 0.06) * 0.09;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.014}
        sizeAttenuation
        color={color}
        transparent
        opacity={0.55}
        // Depth writes are pointless for additive sprites and cause sorting
        // artefacts where particles overlap.
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

export interface ParticleFieldSceneProps {
  className?: string;
}

/**
 * WebGL particle field.
 *
 * Loaded through a dynamic import with `ssr: false` (see `WebglBackdrop`), so
 * three.js is never in the initial bundle and never runs on the server.
 *
 * The frame loop is bound to viewport intersection: scrolled out of view, the
 * canvas stops rendering entirely rather than spinning a GPU on something nobody
 * can see.
 */
export function ParticleFieldScene({ className }: ParticleFieldSceneProps) {
  const { ref, isIntersecting } = useIntersection<HTMLDivElement>({
    once: false,
    threshold: 0,
  });

  const tier = getPerformanceTier();
  const count = tier === "high" ? 1400 : 700;
  const color = readCssVariable("--primary", "#3b82f6");

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <Canvas
        frameloop={isIntersecting ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.2], fov: 55 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "low-power",
        }}
      >
        <Field count={count} color={color} />
      </Canvas>
    </div>
  );
}

export default ParticleFieldScene;
