import { ArrowDown, ArrowUpRight, MessageCircle } from "lucide-react";

import { Magnetic } from "@/components/animation/magnetic";
import { Parallax } from "@/components/animation/parallax";
import { Reveal } from "@/components/animation/reveal";
import { TextReveal } from "@/components/animation/text-reveal";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { SECTIONS } from "@/constants/sections";
import { HERO_ACCENT_LINE, heroLines, heroSubtitle } from "@/data/profile";
import { AnimatedRoles } from "@/features/hero/components/animated-roles";
import { ScrollCue } from "@/features/hero/components/scroll-cue";
import { TechOrbit } from "@/features/hero/components/tech-orbit";
import { cn } from "@/lib/utils";

/**
 * The first screen.
 *
 * A Server Component. Everything interactive — the rotating role, the orbit, the
 * scroll cue, the magnetic button — is a client leaf, so the copy that matters for
 * SEO and for the largest contentful paint is rendered on the server.
 *
 * Layout: one column below `lg`, a 6/5 split above it. Content comes first in the
 * DOM on every breakpoint. That is the right reading order, it keeps the headline
 * as the LCP element on mobile, and it means a keyboard user reaches the call to
 * action before a decorative visual.
 *
 * Height is `100dvh` minus the header rather than `100vh`, so collapsing mobile
 * browser chrome cannot push the buttons below the fold.
 */
export function HeroSection() {
  return (
    <Section
      id={SECTIONS.hero}
      spacing="none"
      ariaLabelledBy="hero-heading"
      className={cn(
        "relative flex min-h-[calc(100dvh-var(--header-height))] items-center",
        "py-20 sm:py-24",
      )}
      containerSize="page"
      innerClassName="grid items-center gap-14 lg:grid-cols-[6fr_5fr] lg:gap-12"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Left: content                                                    */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col gap-8">
        <Reveal effect="fade" className="flex flex-wrap items-center gap-3">
          {siteConfig.availability.open ? (
            <Badge tone="success" dot pulse>
              {siteConfig.availability.label}
            </Badge>
          ) : null}
          <Badge tone="outline" size="sm">
            {siteConfig.location}
          </Badge>
        </Reveal>

        <TextReveal
          as="h1"
          id="hero-heading"
          immediate
          delay={0.1}
          stagger={0.11}
          className="text-display font-semibold tracking-tightest text-balance text-foreground"
          lines={heroLines.map((line, index) =>
            index === HERO_ACCENT_LINE ? (
              <span key={line} className="text-gradient-brand">
                {line}
              </span>
            ) : (
              line
            ),
          )}
        />

        <Reveal
          effect="up"
          distance={16}
          delay={0.45}
          as="p"
          className="max-w-xl text-lg leading-relaxed text-muted"
        >
          {heroSubtitle}
        </Reveal>

        <Reveal effect="up" distance={12} delay={0.55}>
          <AnimatedRoles />
        </Reveal>

        <Reveal
          effect="up"
          distance={16}
          delay={0.65}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <Magnetic strength={0.22} maxDistance={10} className="w-full sm:w-auto">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={`#${SECTIONS.skills}`}>
                Explore the stack
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            </Button>
          </Magnetic>

          <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
            <a href={`#${SECTIONS.experience}`}>
              <ArrowDown aria-hidden="true" className="size-4" />
              See the work
            </a>
          </Button>

          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <a href={`mailto:${siteConfig.email}`}>
              <MessageCircle aria-hidden="true" className="size-4" />
              Let&rsquo;s connect
            </a>
          </Button>
        </Reveal>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Right: interactive visual                                        */}
      {/* ---------------------------------------------------------------- */}
      <Reveal effect="scale" delay={0.3}>
        <Parallax strength={0.08}>
          <TechOrbit />
        </Parallax>
      </Reveal>

      <ScrollCue />
    </Section>
  );
}
