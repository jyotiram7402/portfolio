import { AnimatedHeading } from "@/components/animation/animated-heading";
import { Reveal } from "@/components/animation/reveal";
import { BookingPanel } from "@/components/common/booking-panel";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { GlassCard } from "@/components/ui/glass-card";
import { ROUTES } from "@/constants/routes";
import { contactCopy } from "@/data/contact";
import { ChannelCards } from "@/features/contact/components/channel-cards";
import { ContactForm } from "@/features/contact/components/contact-form";
import { MapPanel } from "@/features/contact/components/map-panel";
import { SocialGrid } from "@/features/contact/components/social-grid";

/**
 * The full contact page.
 *
 * A Server Component composing five client leaves, so the copy, the headings and the channel
 * information are all in the initial HTML — which matters here more than anywhere else on the
 * site, because this is the page someone lands on to find an email address.
 *
 * The order is deliberate and is about reducing effort, not showcasing components. Channels
 * first, because most visitors want an address and nothing else. Then the form for people with
 * something specific to say. Then booking, then the wider social footprint. Someone who only
 * needed the email never has to scroll past a form to find it.
 *
 * The ambient wash is a single blurred layer rather than the full background stack: this page
 * already carries a form, a map and a calendar, and three animated gradient layers behind them
 * would be noise competing with the thing the visitor came to do.
 */
export function ContactExperience() {
  return (
    <>
      {/* ---------------------------------------------------------- header -- */}
      <Section
        as="div"
        spacing="none"
        containerSize="page"
        className="pt-16 pb-14 lg:pt-20"
        innerClassName="flex flex-col gap-10"
      >
        <Breadcrumbs
          items={[
            { label: "Home", href: ROUTES.home },
            { label: "Contact", href: ROUTES.contact },
          ]}
        />

        <div className="flex flex-col gap-6">
          <Badge tone="outline" size="sm" dot className="w-fit">
            Contact
          </Badge>

          <AnimatedHeading
            id="contact-heading"
            as="h1"
            size="lg"
            immediate
            description="Email is the fastest route and I read it properly. If you would rather talk, there is a calendar below. If you have something specific, the form asks the questions I would have asked anyway."
            descriptionClassName="max-w-2xl text-lg"
          >
            Start a conversation.
          </AnimatedHeading>
        </div>
      </Section>

      {/* -------------------------------------------------------- channels -- */}
      <Section
        as="section"
        spacing="none"
        ariaLabel="Ways to get in touch"
        containerSize="page"
        className="pb-20"
      >
        <ChannelCards />
      </Section>

      {/* ------------------------------------------------- form + location -- */}
      <Section
        as="section"
        spacing="none"
        ariaLabelledBy="contact-form-heading"
        containerSize="page"
        className="pb-24"
        innerClassName="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-12"
      >
        <GlassCard padding="lg" radius="3xl" surface="elevated" glow={false}>
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-2">
              <h2
                id="contact-form-heading"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                {contactCopy.formTitle}
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted">
                {contactCopy.formSubtitle}
              </p>
            </div>

            <ContactForm />
          </div>
        </GlassCard>

        <div className="flex flex-col gap-6">
          <MapPanel />
          <BookingPanel />
        </div>
      </Section>

      {/* ---------------------------------------------------------- social -- */}
      <Section
        as="section"
        spacing="none"
        ariaLabelledBy="social-heading"
        containerSize="page"
        className="pb-28"
        innerClassName="flex flex-col gap-10"
      >
        <Reveal effect="fade">
          <Divider fade />
        </Reveal>

        <div className="flex flex-col gap-3">
          <h2
            id="social-heading"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            Elsewhere
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            The accounts that are actually active. Everything the site is wired for is listed —
            the ones without a link are honestly marked rather than pointed at a guess.
          </p>
        </div>

        <SocialGrid />
      </Section>
    </>
  );
}
