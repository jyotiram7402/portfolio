import { Mail } from "lucide-react";

import { Reveal } from "@/components/animation/reveal";
import { Section } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/glass-card";
import { SECTIONS } from "@/constants/sections";
import { renderablePosts } from "@/services/content.service";
import { SubscribeForm } from "@/features/newsletter/components/subscribe-form";
import { cn } from "@/lib/utils";

/**
 * Newsletter.
 *
 * The last section before the footer, which is the right place for it — a subscribe prompt
 * earns its ask only after the visitor has seen the work.
 *
 * Deliberately not a `SectionHeader`: this is a single card with one job, and the standard
 * badge/title/description block would make it read as another content section rather than
 * as a call to action.
 *
 * The frequency claim is derived from the number of published articles rather than promised
 * as a cadence. "Roughly one a month" from someone with three posts is a promise that will
 * be broken; a count is a fact.
 *
 * A Server Component; the form is the client boundary.
 */
export function NewsletterSection() {
  return (
    <Section
      id={SECTIONS.newsletter}
      spacing="lg"
      ariaLabelledBy="newsletter-heading"
      containerSize="content"
    >
      <Reveal effect="up" distance={18}>
        <GlassCard
          padding="none"
          radius="3xl"
          surface="elevated"
          className="overflow-hidden"
        >
          <div className="relative flex flex-col gap-8 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            {/* Ambient wash. Decorative, and removed under reduced motion by the
                global rule in styles/base.css. */}
            <span
              aria-hidden="true"
              data-motion-decorative
              className={cn(
                "pointer-events-none absolute -top-1/2 -right-1/4 size-[28rem] rounded-full blur-3xl",
                "bg-[radial-gradient(circle_at_center,var(--aurora-1),transparent_70%)]",
              )}
            />

            <div className="relative flex max-w-lg flex-col gap-4">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-11 place-items-center rounded-xl",
                  "border border-primary/30 bg-primary/12 text-primary",
                )}
              >
                <Mail className="size-5" />
              </span>

              <h2
                id="newsletter-heading"
                className="text-3xl font-semibold tracking-tight text-balance text-foreground"
              >
                New writing, when there is something worth saying.
              </h2>

              <p className="text-sm leading-relaxed text-muted">
                {renderablePosts.length} articles so far — long-form notes on backend
                engineering, applied AI and the things that broke in production. No
                cadence promised, because a schedule is how writing gets padded.
              </p>
            </div>

            <div className="relative shrink-0">
              <SubscribeForm />
            </div>
          </div>
        </GlassCard>
      </Reveal>
    </Section>
  );
}
