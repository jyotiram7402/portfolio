"use client";

import { ArrowUpRight } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/animation/stagger";
import { TiltCard } from "@/components/animation/tilt-card";
import { plannedLinks, socialLinks } from "@/config/social";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface SocialGridProps {
  className?: string;
}

/**
 * Every platform, in one grid.
 *
 * All ten the site supports are declared in `config/social.ts`. Only the ones with a confirmed
 * handle render as live cards; the rest appear as a muted row of chips.
 *
 * That split is the whole design decision. Rendering six cards pointing at invented profile URLs
 * would be the single most checkable mistake on the site — a recruiter clicks one, gets a 404, and
 * everything else becomes suspect. A short row of "not yet" is honest, still shows the intent, and
 * activating one is a handle in a config object.
 *
 * `TiltCard` supplies the lean and the pointer highlight, and no-ops on touch and under reduced
 * motion, so there are no capability checks here.
 */
export function SocialGrid({ className }: SocialGridProps) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <Stagger
        as="ul"
        gap={0.05}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {socialLinks.map((link) => {
          const Icon = link.icon;
          const isMail = link.href.startsWith("mailto:");

          return (
            <StaggerItem as="li" key={link.id} className="h-full">
              <TiltCard maxRotation={6} className="h-full">
                <a
                  href={link.href}
                  {...(isMail
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  onClick={() =>
                    trackEvent("social_click", {
                      channel: link.id,
                      surface: "social-grid",
                    })
                  }
                  className={cn(
                    "group/social flex h-full flex-col justify-between gap-6",
                    "rounded-2xl border border-border bg-card/60 p-4",
                    "transition-colors duration-[var(--duration-normal)]",
                    "hover:border-primary/40 focus-ring",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl",
                        "border border-border bg-elevated text-muted",
                        "transition-[color,border-color,transform]",
                        "duration-[var(--duration-slow)] ease-[var(--ease-out-back)]",
                        "group-hover/social:-translate-y-0.5",
                        "group-hover/social:border-primary/40 group-hover/social:text-primary",
                        "[&_svg]:size-4",
                      )}
                    >
                      <Icon />
                    </span>

                    <ArrowUpRight
                      aria-hidden="true"
                      className={cn(
                        "size-3.5 shrink-0 text-subtle transition-transform",
                        "duration-[var(--duration-normal)] ease-[var(--ease-out-back)]",
                        "group-hover/social:-translate-y-0.5 group-hover/social:translate-x-0.5",
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold tracking-tight text-foreground">
                      {link.label}
                    </p>
                    <p className="truncate font-mono text-2xs text-subtle">
                      {link.handle}
                    </p>
                  </div>

                  {isMail ? null : (
                    <span className="sr-only">(opens in a new tab)</span>
                  )}
                </a>
              </TiltCard>
            </StaggerItem>
          );
        })}
      </Stagger>

      {plannedLinks.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="font-mono text-2xs tracking-widest text-subtle uppercase">
            Wired up, not yet live
          </p>

          <ul className="flex flex-wrap gap-2">
            {plannedLinks.map((link) => {
              const Icon = link.icon;

              return (
                <li key={link.id}>
                  <span
                    className={cn(
                      "inline-flex h-8 items-center gap-2 rounded-full",
                      "border border-dashed border-border bg-input/60 px-3",
                      "text-xs text-subtle",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-3.5" />
                    {link.label}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="max-w-xl text-2xs leading-relaxed text-subtle">
            Each of these is defined in config and one handle away from going live. Nothing here
            links anywhere yet, because a profile URL that 404s is worse than none at all.
          </p>
        </div>
      ) : null}
    </div>
  );
}
