"use client";

import { ExternalLink, Github } from "lucide-react";

import { TiltCard } from "@/components/animation/tilt-card";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects";

export interface ProjectCardProps {
  project: Project;
  /** Featured cards span two columns and show their highlights. */
  featured?: boolean;
  className?: string;
}

const STATUS_TONE = {
  shipped: "success",
  active: "primary",
  prototype: "warning",
} as const;

/**
 * One project.
 *
 * Props-driven so the same card serves the home preview, the filtered grid and — later —
 * a `/work` index. `featured` is the only branch, and it controls whether the highlights
 * are shown; a grid where every card lists three bullet points is a wall.
 *
 * There are no links on most of these projects, and the card renders honestly when a
 * project has none rather than showing a disabled "Live demo" button. A dead affordance
 * costs more trust than a missing one.
 */
export function ProjectCard({ project, featured = false, className }: ProjectCardProps) {
  const Icon = project.icon;

  return (
    <TiltCard maxRotation={featured ? 4 : 6} className={cn("h-full", className)}>
      <GlassCard
        interactive
        padding="lg"
        radius="3xl"
        surface={featured ? "elevated" : "glass"}
        glow={false}
        className="group/project flex h-full flex-col gap-5"
      >
        <div className="flex items-start justify-between gap-4">
          <span
            aria-hidden="true"
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-xl",
              "border border-border bg-elevated text-muted",
              "transition-[color,border-color,transform] duration-[var(--duration-slow)]",
              "ease-[var(--ease-out-back)]",
              "group-hover/project:-translate-y-0.5 group-hover/project:border-primary/40",
              "group-hover/project:text-primary",
              "[&_svg]:size-5",
            )}
          >
            <Icon />
          </span>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge tone={STATUS_TONE[project.status]} size="sm">
              {project.status}
            </Badge>
            <Badge tone="default" size="sm" className="font-mono">
              {project.period}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {project.name}
          </h3>
          <p className="text-sm leading-relaxed text-muted">
            {featured ? project.summary : project.tagline}
          </p>
        </div>

        {featured ? (
          <ul className="flex flex-col gap-2.5">
            {project.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex gap-2.5 text-sm leading-relaxed text-muted"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/70"
                />
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-col gap-4">
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((technology) => (
              <li key={technology}>
                <span
                  className={cn(
                    "inline-flex h-6 items-center rounded-full border border-border",
                    "bg-input px-2.5 font-mono text-2xs text-muted",
                  )}
                >
                  {technology}
                </span>
              </li>
            ))}
          </ul>

          {project.links.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {project.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border border-border",
                      "bg-elevated px-3 py-1.5 text-xs font-medium text-foreground",
                      "transition-colors hover:border-border-strong focus-ring",
                    )}
                  >
                    {link.kind === "repo" ? (
                      <Github aria-hidden="true" className="size-3" />
                    ) : (
                      <ExternalLink aria-hidden="true" className="size-3" />
                    )}
                    {link.label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-2xs leading-relaxed text-subtle">
              Client work — the code is not public. Happy to walk through the design.
            </p>
          )}
        </div>
      </GlassCard>
    </TiltCard>
  );
}
