"use client";

import { Clock, Globe2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { GlassCard } from "@/components/ui/glass-card";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface MapPanelProps {
  className?: string;
}

/**
 * Location panel with a map placeholder.
 *
 * Deliberately not a real map. Embedding Mapbox or Google Maps costs 200–500 kB of third-party
 * JavaScript, an API key, and a cookie banner in most jurisdictions — to show a pin on a city
 * nobody is going to navigate to. So this is a stylised grid with a marker: the same information,
 * none of the cost, and it matches the site's own visual language instead of Google's.
 *
 * The geometry is reserved exactly, so dropping a real embed in later shifts nothing.
 *
 * The clock is the part that earns its place. A recruiter three time zones away wants to know
 * whether it is a reasonable hour before they call, and a live local time answers that instantly.
 * It renders as a dash until mounted, because the server has no way to know the visitor's clock
 * and a mismatch would be a hydration error.
 */
export function MapPanel({ className }: MapPanelProps) {
  const reduceMotion = useReducedMotion();
  const [localTime, setLocalTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () => {
      try {
        setLocalTime(
          new Intl.DateTimeFormat("en-GB", {
            timeZone: siteConfig.timezone,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date()),
        );
      } catch {
        // An unrecognised time zone should not take the panel down.
        setLocalTime(null);
      }
    };

    format();
    // Ticks on the minute rather than the second: a seconds display is motion nobody
    // asked for, and 60 updates a minute for a static panel is wasted work.
    const timer = window.setInterval(format, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <GlassCard
      padding="none"
      radius="3xl"
      className={cn("flex flex-col overflow-hidden", className)}
    >
      {/* ------------------------------------------------------------- map -- */}
      <div className="relative h-52 overflow-hidden border-b border-border bg-surface">
        <span aria-hidden="true" className="absolute inset-0 bg-grid opacity-70" />

        <span
          aria-hidden="true"
          data-motion-decorative={reduceMotion ? undefined : true}
          className={cn(
            "absolute inset-0",
            "bg-[radial-gradient(circle_at_50%_55%,var(--aurora-1),transparent_62%)]",
            !reduceMotion && "animate-glow",
          )}
        />

        {/* Marker. Concentric rings rather than a pin graphic — it reads as a location
            without importing an icon set's idea of one. */}
        <div
          role="img"
          aria-label={`Approximate location: ${siteConfig.location}`}
          className="absolute inset-0 grid place-items-center"
        >
          <span className="relative grid place-items-center">
            {reduceMotion ? null : (
              <>
                <span
                  data-motion-decorative
                  className="absolute size-24 animate-ping rounded-full border border-primary/30"
                />
                <span
                  data-motion-decorative
                  className="absolute size-16 animate-ping rounded-full border border-primary/40"
                />
              </>
            )}

            <span
              className={cn(
                "relative grid size-10 place-items-center rounded-full",
                "border border-primary/50 bg-primary/15 text-primary backdrop-blur-sm",
              )}
            >
              <MapPin aria-hidden="true" className="size-4" />
            </span>
          </span>
        </div>

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card to-transparent"
        />

        <p className="absolute bottom-3 left-4 font-mono text-2xs tracking-widest text-subtle uppercase">
          Map placeholder
        </p>
      </div>

      {/* ------------------------------------------------------------ facts -- */}
      <dl className="grid grid-cols-2 gap-5 p-6">
        <div className="flex flex-col gap-1.5">
          <dt className="flex items-center gap-2 font-mono text-2xs tracking-widest text-subtle uppercase">
            <MapPin aria-hidden="true" className="size-3" />
            Based in
          </dt>
          <dd className="text-sm font-semibold text-foreground">
            {siteConfig.location}
          </dd>
        </div>

        <div className="flex flex-col gap-1.5">
          <dt className="flex items-center gap-2 font-mono text-2xs tracking-widest text-subtle uppercase">
            <Clock aria-hidden="true" className="size-3" />
            Local time
          </dt>
          <dd className="text-sm font-semibold text-foreground tabular-nums">
            {localTime ?? "—"}
          </dd>
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <dt className="flex items-center gap-2 font-mono text-2xs tracking-widest text-subtle uppercase">
            <Globe2 aria-hidden="true" className="size-3" />
            Time zone
          </dt>
          <dd className="text-sm text-muted">
            <span className="font-semibold text-foreground">
              {siteConfig.timezone.replace("_", " ")}
            </span>
            <span className="ml-2">
              — comfortable overlapping into European mornings and the first half of a US
              East Coast day.
            </span>
          </dd>
        </div>
      </dl>
    </GlassCard>
  );
}
