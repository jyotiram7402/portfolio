import {
  ArrowUpRight,
  CalendarClock,
  FileText,
  Github,
  Info,
  Linkedin,
  Mail,
  Target,
} from "lucide-react";
import Link from "next/link";

import { Magnetic } from "@/components/animation/magnetic";
import { Reveal } from "@/components/animation/reveal";
import { BookingPanel } from "@/components/common/booking-panel";
import { Stagger, StaggerItem } from "@/components/animation/stagger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { GlassCard } from "@/components/ui/glass-card";
import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { ROUTES } from "@/constants/routes";
import { hiringProfile, recruiterFacts } from "@/data/recruiter";
import { cn } from "@/lib/utils";
import { externalLinkAttributes } from "@/utils/url";

/**
 * The recruiter dashboard.
 *
 * One screen that answers what a screening call opens with: how long, what have you built, when
 * could you start, where are you, what are you looking for.
 *
 * Three deliberate choices:
 *
 * **Every action is above the fold on desktop.** Résumé, calendar, email, GitHub, LinkedIn — a
 * recruiter who arrives from a job board should not have to scroll to find the thing they came
 * for.
 *
 * **The caveats are printed, not buried.** "Two years, not five." "Front-end is credible but is
 * not where the depth is." Stating those costs nothing — a recruiter finds out in twenty minutes
 * anyway — and it is the single thing that makes the rest of the page credible.
 *
 * **`BookingPanel` is reused, not copied.** It lives in `components/common/` precisely because two
 * slices need it, so the scheduling flow exists once and cannot behave differently here.
 *
 * A Server Component; the magnetic button and the booking panel are the client leaves.
 */
export function RecruiterDashboard() {
  const github = socialConfig.links.find((link) => link.id === "github");
  const linkedin = socialConfig.links.find((link) => link.id === "linkedin");

  return (
    <div className="flex flex-col gap-16">
      {/* ---------------------------------------------------------- actions -- */}
      <Reveal effect="up" distance={16} className="flex flex-wrap items-center gap-3">
        <Magnetic strength={0.2} maxDistance={9}>
          <Button asChild size="lg">
            <Link href={ROUTES.resume}>
              <FileText aria-hidden="true" className="size-4" />
              View résumé
            </Link>
          </Button>
        </Magnetic>

        <Button asChild size="lg" variant="secondary">
          <Link href={ROUTES.contact}>
            <CalendarClock aria-hidden="true" className="size-4" />
            Schedule a call
          </Link>
        </Button>

        <Button asChild size="lg" variant="outline">
          <a href={`mailto:${siteConfig.email}`}>
            <Mail aria-hidden="true" className="size-4" />
            Email
          </a>
        </Button>

        {github ? (
          <Button asChild size="lg" variant="ghost">
            <a href={github.href} {...externalLinkAttributes()}>
              <Github aria-hidden="true" className="size-4" />
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Button>
        ) : null}

        {linkedin ? (
          <Button asChild size="lg" variant="ghost">
            <a href={linkedin.href} {...externalLinkAttributes()}>
              <Linkedin aria-hidden="true" className="size-4" />
              LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Button>
        ) : null}
      </Reveal>

      {/* ------------------------------------------------------------ facts -- */}
      <section aria-labelledby="facts-heading" className="flex flex-col gap-6">
        <h2 id="facts-heading" className="eyebrow">
          The summary
        </h2>

        <Stagger
          as="ul"
          gap={0.05}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {recruiterFacts.map((fact) => {
            const Icon = fact.icon;

            return (
              <StaggerItem as="li" key={fact.id} className="h-full">
                <GlassCard
                  padding="md"
                  radius="2xl"
                  glow={false}
                  className="flex h-full flex-col gap-3"
                >
                  <span className="flex items-center gap-2 font-mono text-2xs tracking-widest text-subtle uppercase">
                    <Icon aria-hidden="true" className="size-3.5" />
                    {fact.label}
                  </span>

                  <p
                    className={cn(
                      "text-xl leading-snug font-semibold tracking-tight",
                      fact.emphasis ? "text-gradient-brand" : "text-foreground",
                    )}
                  >
                    {fact.value}
                  </p>

                  <p className="mt-auto text-xs leading-relaxed text-subtle">
                    {fact.detail}
                  </p>
                </GlassCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* --------------------------------------------------- roles + notes -- */}
      <div className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:gap-12">
        <section aria-labelledby="roles-heading" className="flex flex-col gap-6">
          <h2 id="roles-heading" className="eyebrow flex items-center gap-2">
            <Target aria-hidden="true" className="size-3" />
            Roles I am a fit for
          </h2>

          <ul className="flex flex-col gap-4">
            {hiringProfile.preferredRoles.map((role, index) => (
              <Reveal
                key={role.title}
                as="li"
                effect="up"
                distance={14}
                delay={0.06 * index}
              >
                <GlassCard
                  interactive
                  padding="md"
                  radius="2xl"
                  className="flex flex-col gap-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      {role.title}
                    </h3>
                    <Badge tone="outline" size="sm">
                      {role.level}
                    </Badge>
                  </div>

                  <p className="text-sm leading-relaxed text-muted">{role.rationale}</p>
                </GlassCard>
              </Reveal>
            ))}
          </ul>

          <Divider fade />

          <div className="flex flex-col gap-4">
            <h2 className="eyebrow flex items-center gap-2">
              <Info aria-hidden="true" className="size-3" />
              Worth knowing up front
            </h2>

            <ul className="flex flex-col gap-3">
              {hiringProfile.notes.map((note) => (
                <li
                  key={note}
                  className="flex gap-3 text-sm leading-relaxed text-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1 shrink-0 rounded-full bg-warning/70"
                  />
                  {note}
                </li>
              ))}
            </ul>

            <p className="max-w-xl text-xs leading-relaxed text-subtle">
              Printed rather than buried. You would find all of it out in the first twenty
              minutes, and saying it now is the point.
            </p>
          </div>
        </section>

        {/* -------------------------------------------------------- logistics -- */}
        <div className="flex flex-col gap-6">
          <GlassCard padding="lg" radius="3xl" glow={false}>
            <dl className="flex flex-col divide-y divide-border">
              {[
                { label: "Availability", value: hiringProfile.availabilityLabel },
                { label: "Notice period", value: hiringProfile.noticePeriod },
                { label: "Location", value: hiringProfile.location },
                { label: "Work preference", value: hiringProfile.workPreference },
                { label: "Time zone", value: hiringProfile.timezoneOverlap },
                { label: "Response time", value: hiringProfile.responseTime },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0">
                  <dt className="font-mono text-2xs tracking-widest text-subtle uppercase">
                    {row.label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          </GlassCard>

          <BookingPanel />

          <GlassCard padding="md" radius="2xl" glow={false}>
            <Link
              href={ROUTES.home}
              className="group/link flex items-center justify-between gap-4 rounded-[inherit] focus-ring"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold tracking-tight text-foreground">
                  See the work itself
                </p>
                <p className="text-xs leading-relaxed text-muted">
                  Projects, the stack, the roadmap and the writing — all on one page.
                </p>
              </div>

              <ArrowUpRight
                aria-hidden="true"
                className={cn(
                  "size-4 shrink-0 text-subtle transition-transform",
                  "duration-[var(--duration-normal)] ease-[var(--ease-out-back)]",
                  "group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5",
                  "group-hover/link:text-primary",
                )}
              />
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
