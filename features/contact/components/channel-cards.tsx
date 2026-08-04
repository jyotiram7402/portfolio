"use client";

import { ArrowUpRight } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/animation/stagger";
import { CopyButton } from "@/components/ui/copy-button";
import { GlassCard } from "@/components/ui/glass-card";
import { contactChannels } from "@/data/contact";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface ChannelCardsProps {
  /** Limits the grid to the channels that are actual routes, for the compact home section. */
  actionableOnly?: boolean;
  className?: string;
}

/**
 * The contact channel grid.
 *
 * Seven cards covering both kinds of information a visitor needs: where to send something, and
 * what to expect once they have. Mixing them is deliberate — "response time: within two working
 * days" beside the email address is what turns an address into a commitment.
 *
 * Cards with an `href` are the whole card, one link, one tab stop. Cards without one are plain
 * containers rather than disabled links, because location and time zone are facts, not actions.
 *
 * The email card carries a copy button as well as the mailto, because a visitor on a desktop
 * without a configured mail client needs the string, not a dead protocol handler.
 */
export function ChannelCards({ actionableOnly = false, className }: ChannelCardsProps) {
  const channels = actionableOnly
    ? contactChannels.filter((channel) => channel.href !== undefined)
    : contactChannels;

  return (
    <Stagger
      as="ul"
      gap={0.06}
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {channels.map((channel) => {
        const Icon = channel.icon;
        const isLink = channel.href !== undefined;

        const body = (
          <>
            <div className="flex items-start justify-between gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl",
                  "border border-border bg-elevated text-muted",
                  "transition-[color,border-color,transform] duration-[var(--duration-slow)]",
                  "ease-[var(--ease-out-back)]",
                  isLink &&
                    "group-hover/channel:-translate-y-0.5 group-hover/channel:border-primary/40 group-hover/channel:text-primary",
                  "[&_svg]:size-4",
                )}
              >
                <Icon />
              </span>

              {/* The copy button occupies this corner on copyable cards, so the
                  affordance arrow is suppressed there rather than stacked under it. */}
              {isLink && !channel.copyable ? (
                <ArrowUpRight
                  aria-hidden="true"
                  className={cn(
                    "size-3.5 shrink-0 text-subtle transition-transform",
                    "duration-[var(--duration-normal)] ease-[var(--ease-out-back)]",
                    "group-hover/channel:-translate-y-0.5 group-hover/channel:translate-x-0.5",
                  )}
                />
              ) : channel.live ? (
                <span
                  aria-hidden="true"
                  className="relative mt-1.5 flex size-1.5 shrink-0"
                >
                  <span
                    data-motion-decorative
                    className="absolute inset-0 animate-ping rounded-full bg-success opacity-70"
                  />
                  <span className="relative size-1.5 rounded-full bg-success" />
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-mono text-2xs tracking-widest text-subtle uppercase">
                {channel.label}
              </p>
              <p className="text-sm leading-snug font-semibold break-words text-foreground">
                {channel.value}
              </p>
            </div>

            <p className="mt-auto text-xs leading-relaxed text-muted">{channel.hint}</p>
          </>
        );

        return (
          <StaggerItem as="li" key={channel.id} className="h-full">
            <GlassCard
              padding="md"
              radius="2xl"
              interactive={isLink || undefined}
              className="group/channel relative flex h-full flex-col gap-4"
            >
              {isLink ? (
                <a
                  href={channel.href}
                  {...(channel.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  onClick={() =>
                    trackEvent("social_click", {
                      channel: channel.id,
                      surface: "contact",
                    })
                  }
                  className="flex h-full flex-col gap-4 rounded-[inherit] focus-ring"
                >
                  {body}
                  {channel.external ? (
                    <span className="sr-only">(opens in a new tab)</span>
                  ) : null}
                </a>
              ) : (
                body
              )}

              {/* Sits outside the anchor: a button inside a link is not reachable by
                  keyboard and is invalid markup. */}
              {channel.copyable ? (
                <div className="absolute top-3 right-3">
                  <CopyButton value={channel.value} label={`Copy ${channel.label}`} />
                </div>
              ) : null}
            </GlassCard>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
