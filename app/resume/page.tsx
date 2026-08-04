import type { Metadata } from "next";

import { AnimatedHeading } from "@/components/animation/animated-heading";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { StructuredData } from "@/components/common/structured-data";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { resumeVariants } from "@/data/resume";
import { ResumeCenter } from "@/features/resume";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, profilePageSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Résumé",
  description:
    "Three versions of the same history — backend, full stack and AI engineering — with a readable on-page preview, an ATS readiness checklist and a published revision history.",
  path: ROUTES.resume,
  keywords: [
    "java backend engineer resume",
    "spring boot cv",
    "ai engineer resume",
    "ats friendly resume",
  ],
});

/**
 * The résumé centre.
 *
 * A Server Component wrapping one client leaf. The preview inside `ResumeCenter` is itself a
 * Server Component, so the document's content is server-rendered and indexable — which is the
 * reason to render a résumé as HTML rather than embed a PDF. A crawler can read this page; it
 * cannot read a PDF in an iframe.
 *
 * `ProfilePage` schema tells a crawler the page is *about* a person rather than merely mentioning
 * one, which is what makes the availability and role details eligible for enrichment.
 */
export default function ResumePage() {
  return (
    <Section
      as="div"
      spacing="lg"
      containerSize="page"
      innerClassName="flex flex-col gap-12 lg:gap-14"
    >
      <StructuredData
        data={[
          profilePageSchema(ROUTES.resume),
          breadcrumbSchema([
            { name: "Home", path: ROUTES.home },
            { name: "Résumé", path: ROUTES.resume },
          ]),
        ]}
      />

      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: ROUTES.home },
            { label: "Résumé", href: ROUTES.resume },
          ]}
        />

        <div className="flex flex-col gap-6">
          <Badge tone="outline" size="sm" dot className="w-fit">
            Résumé
          </Badge>

          <AnimatedHeading
            id="resume-heading"
            as="h1"
            size="lg"
            immediate
            description={`Three versions of the same history, each ordered for a different reader. Rendered as a page rather than trapped in a PDF — it reflows on a phone, it is searchable, and a screen reader can read it.`}
            descriptionClassName="max-w-2xl text-lg"
          >
            {`${resumeVariants.length} versions, one history.`}
          </AnimatedHeading>
        </div>
      </div>

      <ResumeCenter />
    </Section>
  );
}
