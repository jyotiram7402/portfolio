import { ArrowUpRight, CalendarClock, Mail } from "lucide-react";
import Link from "next/link";

import { Magnetic } from "@/components/animation/magnetic";
import { Reveal } from "@/components/animation/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { SECTIONS } from "@/constants/sections";
import { RESPONSE_TIME } from "@/data/contact";
import { ChannelCards } from "@/features/contact/components/channel-cards";

/**
 * The home page's contact section.
 *
 * Deliberately not the form. The full experience lives at `/contact`, and duplicating a
 * seven-field form at the bottom of a fifteen-section page would mean two implementations of the
 * same validation drifting apart — and would ask for a lot of effort from someone who has just
 * finished reading.
 *
 * What this does instead is the three things a visitor at the end of the page actually wants: the
 * routes that are one click (email, LinkedIn, GitHub), the expectation that comes with them, and a
 * door to the full page. `ChannelCards` is the same component the contact page uses, filtered to
 * the actionable channels.
 *
 * A Server Component; the cards and the magnetic button are the client leaves.
 */
export function ContactSection() {
  return (
    <Section
      id={SECTIONS.contact}
      spacing="lg"
      ariaLabelledBy="contact-section-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-12 lg:gap-14"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          badge="Contact"
          headingId="contact-section-heading"
          title="If any of this is useful, say so."
          description={`Email is the fastest route and gets a reply ${RESPONSE_TIME.toLowerCase()}. There is a form and a calendar on the contact page if either is easier.`}
          size="lg"
        />

        <Reveal
          effect="up"
          distance={14}
          delay={0.1}
          className="flex shrink-0 flex-wrap items-center gap-3"
        >
          <Magnetic strength={0.22} maxDistance={10}>
            <Button asChild size="lg">
              <a href={`mailto:${siteConfig.email}`}>
                <Mail aria-hidden="true" className="size-4" />
                Email directly
              </a>
            </Button>
          </Magnetic>

          <Button asChild size="lg" variant="secondary">
            <Link href={ROUTES.contact}>
              <CalendarClock aria-hidden="true" className="size-4" />
              Form and calendar
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </Reveal>
      </div>

      <ChannelCards actionableOnly />
    </Section>
  );
}
