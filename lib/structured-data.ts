import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { currentExperience } from "@/data/experience";
import { allTechnologies } from "@/data/skills";
import { absoluteUrl } from "@/utils/url";

/**
 * JSON-LD builders.
 *
 * Returned as plain objects and serialised by `<StructuredData />`, so a schema
 * change is a typed edit here rather than a hand-edited string in a template.
 */

const PERSON_ID = `${siteConfig.url}/#person`;
const SITE_ID = `${siteConfig.url}/#website`;
const ORGANIZATION_ID = `${siteConfig.url}/#organization`;

/**
 * Reads from `data/` as well as `config/`, which is the one place this module
 * reaches across that line. The payoff is that `knowsAbout` and `worksFor` are
 * generated from the same content the Skills and Experience sections render, so
 * the markup a crawler sees can never contradict the page.
 */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    description: siteConfig.description,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.ogImage),
    email: `mailto:${siteConfig.email}`,
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.location,
    },
    sameAs: socialConfig.sameAs,
    // Specific technology names rather than the page's marketing keywords —
    // these are what the Skills section actually claims.
    knowsAbout: allTechnologies.map((technology) => technology.name),
    ...(currentExperience
      ? {
          worksFor: {
            "@type": "Organization",
            name: currentExperience.company,
          },
          hasOccupation: {
            "@type": "Occupation",
            name: currentExperience.role,
            occupationLocation: {
              "@type": "Country",
              name: siteConfig.location,
            },
          },
        }
      : {}),
  } as const;
}

/**
 * `WebSite`, including the `SearchAction` that describes the site's own search.
 *
 * The action points at the command palette's deep-link form. Google may or may not surface a
 * sitelinks searchbox for a personal site, but declaring it costs nothing and is the correct
 * description of a site that genuinely has global search.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  } as const;
}

/**
 * `Organization` for the practice, distinct from the `Person`.
 *
 * Worth declaring even for an individual: it is what a knowledge panel attaches contact
 * details and a logo to, and `ProfessionalService` describes availability for engagements more
 * accurately than `Person` alone.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    image: absoluteUrl(siteConfig.ogImage),
    logo: absoluteUrl("/icons/icon.svg"),
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
    areaServed: { "@type": "Place", name: "Worldwide" },
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.location,
    },
    knowsLanguage: ["en"],
    sameAs: socialConfig.sameAs,
    serviceType: [
      "Backend engineering",
      "Spring Boot development",
      "API design",
      "AI feature engineering",
      "Systems integration",
    ],
  } as const;
}

/**
 * `ProfilePage`, for the recruiter dashboard.
 *
 * Tells a crawler that the page is *about* a person rather than merely mentioning one, which is
 * what makes the résumé and availability details eligible for enrichment.
 */
export function profilePageSchema(path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl(path),
    mainEntity: { "@id": PERSON_ID },
    inLanguage: siteConfig.language,
    isPartOf: { "@id": SITE_ID },
  } as const;
}

export interface ProjectSchemaInput {
  name: string;
  description: string;
  /** Technology names. */
  stack: readonly string[];
  /** Repository or live URL, when one is public. */
  url?: string;
  /** Year or range. */
  period: string;
}

/**
 * `SoftwareSourceCode` per project.
 *
 * Chosen over `CreativeWork` because it carries `programmingLanguage`, which is the one field a
 * crawler can actually use to relate a project to a technology. Emitted as an `ItemList` so the
 * set is understood as a portfolio rather than as unrelated works.
 */
export function projectListSchema(projects: readonly ProjectSchemaInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name} — Selected projects`,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: project.name,
        description: project.description,
        programmingLanguage: project.stack,
        ...(project.url ? { codeRepository: project.url } : {}),
        dateCreated: project.period,
        author: { "@id": PERSON_ID },
      },
    })),
  } as const;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: readonly BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  } as const;
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
  tags?: readonly string[];
}

export function articleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(input.path) },
    image: absoluteUrl(input.image ?? siteConfig.ogImage),
    datePublished: input.publishedTime,
    dateModified: input.modifiedTime ?? input.publishedTime,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    keywords: input.tags?.join(", "),
    inLanguage: siteConfig.language,
  } as const;
}

/**
 * `FAQPage` markup for the assistant's questions.
 *
 * Google requires FAQ markup to correspond to content visible on the page, which it
 * does here — every entry is a question the assistant answers in the interface. Emitted
 * only on the home page, because the assistant lives there.
 */
export function faqSchema(
  entries: readonly { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  } as const;
}

/**
 * `Blog` markup for the index page, listing its posts.
 *
 * A separate node from the individual `BlogPosting` entries so the index can be
 * understood as a collection rather than as a page that happens to mention articles.
 */
export function blogSchema(
  posts: readonly { title: string; description: string; path: string; date: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteConfig.url}/#blog`,
    name: `${siteConfig.name} — Writing`,
    description: "Long-form notes on backend engineering, applied AI and system design.",
    url: absoluteUrl("/blog"),
    inLanguage: siteConfig.language,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: absoluteUrl(post.path),
      datePublished: post.date,
      author: { "@id": PERSON_ID },
    })),
  } as const;
}

/**
 * The graph rendered on every page.
 *
 * Three nodes cross-referenced by `@id`, which is what lets a crawler resolve
 * `author: { "@id": "…#person" }` on an article back to the full Person without the details
 * being repeated on every page.
 */
export function rootSchemaGraph() {
  return [personSchema(), websiteSchema(), organizationSchema()];
}
