import type { Metadata } from "next";

import { StructuredData } from "@/components/common/structured-data";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { ROUTES } from "@/constants/routes";
import { certificationsByDate, getIssuerCounts } from "@/data/certifications";
import { CertificationsLibrary } from "@/features/certifications";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Certifications",
  description:
    "Every certification and course credential, viewable and verifiable — Java and Spring Boot, microservices, cloud and DevOps, and applied AI.",
  path: ROUTES.certifications,
  keywords: [
    "java certification",
    "spring boot certification",
    "udemy certificates",
    "backend developer credentials",
  ],
});

/**
 * The certification library.
 *
 * The homepage carries a strip of three; this is everything, with search and subject
 * filters. Certificates are viewed in a dialog rather than on their own routes — a
 * certificate is one image and six fields, which does not justify a page each, and a
 * lightbox keeps a reader comparing several of them in the flow they were already in.
 *
 * A Server Component. The library below it owns the filter state.
 *
 * The issuer summary is rendered from `getIssuerCounts()` rather than written out, so it can
 * never disagree with the grid underneath it.
 */
export default function CertificationsPage() {
  const issuers = getIssuerCounts();

  return (
    <>
      <StructuredData
        data={[
          breadcrumbSchema([
            { name: "Home", path: ROUTES.home },
            { name: "Certifications", path: ROUTES.certifications },
          ]),
        ]}
      />

      <Section
        spacing="md"
        ariaLabelledBy="certifications-library-heading"
        containerSize="page"
        innerClassName="flex flex-col gap-10 lg:gap-12"
      >
        <Breadcrumbs
          items={[
            { label: "Home", href: ROUTES.home },
            { label: "Certifications", href: ROUTES.certifications },
          ]}
        />

        <SectionHeader
          badge="Credentials"
          headingId="certifications-library-heading"
          // This block is the page title, so it owns the document's `h1`.
          as="h1"
          title="Certifications"
          description="Every credential, with the scan attached. Each one is here because the material turned into work afterwards — the entries say what they covered rather than what the course promised."
          size="lg"
        />

        {/* A one-line breakdown by issuer. Useful because "eight from Udemy" and "eight from
            eight different bodies" are very different claims, and a reader forms that
            impression anyway — better to state it. */}
        {issuers.length > 0 ? (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {issuers.map((issuer) => (
              <li
                key={issuer.id}
                className={cn(
                  "inline-flex items-baseline gap-1.5 font-mono text-2xs",
                  "tracking-wider text-subtle uppercase",
                )}
              >
                <span className="text-foreground">{issuer.count}</span>
                {issuer.label}
              </li>
            ))}
          </ul>
        ) : null}

        <CertificationsLibrary certifications={certificationsByDate} />
      </Section>
    </>
  );
}
