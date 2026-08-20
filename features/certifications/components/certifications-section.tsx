import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/animation/reveal";
import { Stagger, StaggerItem } from "@/components/animation/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SECTIONS } from "@/constants/sections";
import { certifications, getFeaturedCertifications } from "@/data/certifications";
import { CertificateCard } from "@/features/certifications/components/certificate-card";

/**
 * Certifications, on the homepage.
 *
 * A strip of three and a link out, following the same rule the projects showcase does: the
 * homepage is for impact, the dedicated page is for exploration. A wall of twenty
 * certificate cards on the front page reads as padding, however real each one is.
 *
 * The link only renders when there is genuinely more to see, so a portfolio with exactly
 * three certificates does not send a reader to a page identical to the strip they just read.
 *
 * `spacing="md"`, not `lg` — this sits between two heavier sections and does not need a
 * chapter break's worth of air.
 *
 * A Server Component. Each card owns its own viewer state and is the only client leaf.
 */
export function CertificationsSection() {
  const featured = getFeaturedCertifications();
  if (featured.length === 0) return null;

  const hasMore = certifications.length > featured.length;

  return (
    <Section
      id={SECTIONS.certifications}
      spacing="md"
      ariaLabelledBy="certifications-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-10 lg:gap-12"
    >
      <SectionHeader
        badge="Certifications"
        headingId="certifications-heading"
        title="Paper that backs the practice"
        description="Courses and credentials I actually finished, each one tied to work that shipped afterwards. Every certificate is viewable, and verifiable where the issuer provides a link."
      />

      <Stagger as="ul" gap={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((certification, index) => (
          <StaggerItem as="li" key={certification.id} className="h-full">
            <CertificateCard
              certification={certification}
              // Only the first can be anywhere near the fold; the rest stay lazy.
              priority={index === 0}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
            />
          </StaggerItem>
        ))}
      </Stagger>

      {hasMore ? (
        <Reveal effect="up" distance={12} className="flex justify-center">
          <Button asChild size="lg" variant="outline">
            <Link href={ROUTES.certifications}>
              View all {certifications.length} certifications
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </Reveal>
      ) : null}
    </Section>
  );
}
