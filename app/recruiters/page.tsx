import type { Metadata } from "next";

import { AnimatedHeading } from "@/components/animation/animated-heading";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { StructuredData } from "@/components/common/structured-data";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { hiringProfile, recruiterCopy } from "@/data/recruiter";
import { RecruiterDashboard } from "@/features/recruiters";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, faqSchema, profilePageSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "For recruiters",
  description: `${recruiterCopy.title} Availability, notice period, preferred roles, résumé and the caveats worth knowing before a first call.`,
  path: ROUTES.recruiters,
  keywords: [
    "hire java developer india",
    "spring boot engineer available",
    "backend engineer notice period",
    "software engineer open to work",
  ],
});

/**
 * The recruiter dashboard.
 *
 * A Server Component. Every figure, every role and every caveat is in the HTML, which is the
 * point: a recruiter arriving from a job board or a search result should get the whole answer from
 * the first paint, with no JavaScript required.
 *
 * The FAQ schema mirrors the three questions a screening call always opens with, and every answer
 * appears verbatim on the page — which is both the honest way to use FAQ markup and the only way
 * Google will keep it.
 */
const RECRUITER_FAQ = [
  {
    question: "Is Jyotiram Kamble available for new opportunities?",
    answer: `${hiringProfile.availabilityLabel}. Notice period is ${hiringProfile.noticePeriod.toLowerCase()}. Based in ${hiringProfile.location}.`,
  },
  {
    question: "What roles is he looking for?",
    answer: hiringProfile.preferredRoles
      .map((role) => `${role.title} (${role.level})`)
      .join("; "),
  },
  {
    question: "What is his level of experience?",
    answer:
      "Two years of professional delivery on production systems since 2024 — commerce platforms, payment integrations, search relevance and internal AI tooling. Strongest on backend and integrations; front-end work is credible but is not where the depth is.",
  },
] as const;

export default function RecruitersPage() {
  return (
    <Section
      as="div"
      spacing="lg"
      containerSize="page"
      innerClassName="flex flex-col gap-14 lg:gap-16"
    >
      <StructuredData
        data={[
          profilePageSchema(ROUTES.recruiters),
          faqSchema(RECRUITER_FAQ),
          breadcrumbSchema([
            { name: "Home", path: ROUTES.home },
            { name: "For recruiters", path: ROUTES.recruiters },
          ]),
        ]}
      />

      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: ROUTES.home },
            { label: "For recruiters", href: ROUTES.recruiters },
          ]}
        />

        <div className="flex flex-col gap-6">
          <Badge
            tone={hiringProfile.availability === "open" ? "success" : "outline"}
            size="sm"
            dot
            pulse={hiringProfile.availability === "open"}
            className="w-fit"
          >
            {recruiterCopy.eyebrow}
          </Badge>

          <AnimatedHeading
            id="recruiters-heading"
            as="h1"
            size="lg"
            immediate
            description={recruiterCopy.description}
            descriptionClassName="max-w-2xl text-lg"
          >
            {recruiterCopy.title}
          </AnimatedHeading>
        </div>
      </div>

      <RecruiterDashboard />
    </Section>
  );
}
