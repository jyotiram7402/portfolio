"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { getPerformanceTier } from "@/utils/dom";
import { randomBetween } from "@/utils/math";
import { readCssVariable } from "@/utils/theme";

export interface ParticlesProps {
  /** Upper bound on particle count. Scaled down on weaker devices. */
  count?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  /** Pixels per second. */
  velocityX: number;
  velocityY: number;
  opacity: number;
}

/**
 * Drifting particle field on a 2D canvas.
 *
 * Canvas rather than DOM nodes: 60 absolutely-positioned divs each with their
 * own composited transform is far more expensive than one canvas the compositor
 * treats as a single texture.
 *
 * Three deliberate performance decisions:
 *
 *   • The rAF loop is driven by delta time, so the drift covers the same
 *     distance per second at 60 Hz and at 144 Hz.
 *   • The canvas is backed at `devicePixelRatio` capped to 2 — beyond that the
 *     fill cost doubles for a texture nobody can resolve.
 *   • The loop is suspended when the tab is hidden and when the element scrolls
 *     out of view, so a background tab burns nothing.
 */
export function Particles({ count = 48, className }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const tier = getPerformanceTier();
    if (tier === "low") return;

    const particleCount = Math.round(count * (tier === "medium" ? 0.55 : 1));
    const color = readCssVariable("--muted", "#94a3b8");

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let lastTime = 0;
    let visible = true;

    const seed = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: randomBetween(0.5, 1.6),
        velocityX: randomBetween(-6, 6),
        velocityY: randomBetween(-14, -3),
        opacity: randomBetween(0.12, 0.42),
      }));
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      // Draw in CSS pixels; the transform handles the backing-store scale.
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      seed();
    };

    const step = (time: number) => {
      frame = requestAnimationFrame(step);
      if (!visible) {
        lastTime = time;
        return;
      }

      const delta = lastTime === 0 ? 0 : Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.x += particle.velocityX * delta;
        particle.y += particle.velocityY * delta;

        // Wrap rather than respawn, so density stays constant.
        if (particle.y < -8) particle.y = height + 8;
        if (particle.x < -8) particle.x = width + 8;
        if (particle.x > width + 8) particle.x = -8;

        context.globalAlpha = particle.opacity;
        context.fillStyle = color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
    };

    const onVisibilityChange = () => {
      visible = document.visibilityState === "visible";
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              visible = entries[0]?.isIntersecting ?? true;
            },
            { threshold: 0 },
          );

    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);

    resize();
    observer?.observe(canvas);
    resizeObserver?.observe(canvas);
    document.addEventListener("visibilitychange", onVisibilityChange);
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resizeObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [count, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      data-decorative="true"
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
