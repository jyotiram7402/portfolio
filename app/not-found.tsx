import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AnimatedHeading } from "@/components/animation/animated-heading";
import { Reveal } from "@/components/animation/reveal";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Page not found",
  description: "The page you were looking for does not exist.",
  // A 404 must never be indexed, or it competes with the real pages in search.
  noIndex: true,
});

export default function NotFound() {
  return (
    <Section
      spacing="none"
      ariaLabelledBy="not-found-heading"
      className="flex min-h-[calc(100dvh-var(--header-height))] items-center py-24"
      innerClassName="flex max-w-2xl flex-col gap-8"
    >
      <p className="eyebrow" aria-hidden="true">
        Error 404
      </p>

      <AnimatedHeading
        id="not-found-heading"
        as="h1"
        size="lg"
        immediate
        description="The page you were looking for has either moved or never existed. The links in the header will get you back on track."
      >
        This page could not be found.
      </AnimatedHeading>

      <Reveal effect="up" distance={16} delay={0.25}>
        <Button asChild variant="secondary">
          <Link href={ROUTES.home}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to home
          </Link>
        </Button>
      </Reveal>
    </Section>
  );
}
