import type { Metadata } from "next";

import { StructuredData } from "@/components/common/structured-data";
import { ROUTES } from "@/constants/routes";
import { RESPONSE_TIME } from "@/data/contact";
import { ContactExperience } from "@/features/contact";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Get in touch about backend, Spring Boot and applied AI work. Email, LinkedIn, a scheduling calendar and a project brief form — replies ${RESPONSE_TIME.toLowerCase()}.`,
  path: ROUTES.contact,
  keywords: [
    "hire java backend engineer",
    "spring boot contractor",
    "contact software engineer",
    "ai engineering consultant",
  ],
});

/**
 * The contact page.
 *
 * A Server Component. Everything interactive — the form, the map panel, the booking embed, the
 * social grid — is a client leaf, so the address, the response-time commitment and the headings
 * are all in the HTML. That matters more on this page than anywhere else: it is the one someone
 * lands on specifically to find a way to reach me.
 *
 * Two schema nodes, both mirroring visible content. The FAQ answers the three questions this page
 * exists to answer, and the breadcrumb matches the trail rendered at the top.
 */
const CONTACT_FAQ = [
  {
    question: "What is the fastest way to get in touch?",
    answer: `Email. It is read properly rather than skimmed, and replies come ${RESPONSE_TIME.toLowerCase()}. LinkedIn works for introductions, and there is a scheduling calendar for a 30-minute call.`,
  },
  {
    question: "What kind of work is a good fit?",
    answer:
      "Backend services in Java and Spring Boot, payment and search integrations, and AI features that need to be evaluated rather than demoed. Also open to a role on a team building any of those.",
  },
  {
    question: "How quickly can a project start?",
    answer:
      "Consulting and review work can usually start within a couple of weeks. A full-time role is subject to a 60-day notice period from acceptance.",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <StructuredData
        data={[
          faqSchema(CONTACT_FAQ),
          breadcrumbSchema([
            { name: "Home", path: ROUTES.home },
            { name: "Contact", path: ROUTES.contact },
          ]),
        ]}
      />

      <ContactExperience />
    </>
  );
}
