import type { Project, ProjectDomain } from "@/types/projects";

/**
 * Curated projects — work with no public repository.
 *
 * Since Sprint 5 the Projects section is driven by GitHub discovery
 * (`services/projects.service.ts`). Repositories tagged with the discovery topic are fetched live,
 * so this file is no longer the main source.
 *
 * What stays here is the work discovery can never find: client projects at an employer, where the
 * code is not public. These are always appended to the discovered set.
 *
 * If a project *does* have a repository, it does not belong here — tag the repository instead, and
 * add an entry to `data/project-overrides.ts` if you want to write a better tagline for it.
 *
 * This list is also what the AI assistant and the command palette index, because both run in the
 * browser and cannot reach a server-only service. Promoting a discovered repository into search
 * therefore means adding an override entry, not editing this file.
 */
export const projects: readonly Project[] = [
  {
    id: "payments-gateway",
    slug: "payment-gateway-integration",
    name: "Payment Gateway Integration",
    tagline: "Idempotent checkout and settlement reconciliation for a live storefront.",
    summary:
      "End-to-end gateway integration for a production commerce platform: sandbox certification, idempotent order creation, webhook verification, and a reconciliation job that keeps orders and payment records in agreement even when a callback arrives twice or not at all.",
    domains: ["backend", "commerce", "java"],
    stack: ["Java", "Magento", "MySQL", "REST API", "Redis", "Azure"],
    highlights: [
      "Idempotency keys on order creation, so a retried request settles once rather than twice.",
      "Webhook signature verification with replay protection and a dead-letter path for unverifiable events.",
      "Nightly reconciliation that diffs gateway settlements against orders and reports the delta rather than silently correcting it.",
    ],
    status: "shipped",
    period: "2025",
    links: [],
    source: "curated",
    featured: true,
  },
  {
    id: "catalogue-search",
    slug: "catalogue-search-relevance",
    name: "Catalogue Search Relevance",
    tagline: "OpenSearch relevance tuning for a large product catalogue.",
    summary:
      "Replaced keyword matching with a tuned analyser chain, synonym set and field boosting so catalogue search returns what customers meant rather than what they typed. Index mappings and analysers are versioned, and reindexing is a zero-downtime alias swap.",
    domains: ["backend", "commerce"],
    stack: ["OpenSearch", "Java", "Magento", "MySQL", "Docker"],
    highlights: [
      "Custom analyser chain with stemming and a curated synonym set for domain vocabulary.",
      "Field boosting tuned against a fixed set of real queries, so a change can be judged rather than guessed at.",
      "Alias-based reindexing, making a mapping change a deploy rather than an outage.",
    ],
    status: "shipped",
    period: "2025",
    links: [],
    source: "curated",
    featured: true,
  },
  {
    id: "commerce-toolkit",
    slug: "magento-module-toolkit",
    name: "Magento Module Toolkit",
    tagline:
      "Custom storefront modules for a catalogue where a careless query is felt by everyone.",
    summary:
      "A set of custom Magento modules covering storefront features, admin tooling and catalogue performance work. The recurring theme is query discipline: every listing page has a bounded query plan, and none of them fan out per product.",
    domains: ["commerce", "backend", "frontend"],
    stack: ["Magento", "MySQL", "JavaScript", "Redis"],
    highlights: [
      "Eliminated per-product query fan-out on listing pages by collapsing to a single bounded query.",
      "Admin tooling that surfaces the data an operator actually needs to resolve a customer issue.",
      "Cache invalidation scoped to what changed, rather than a full flush on every save.",
    ],
    status: "shipped",
    period: "2024 — 2025",
    links: [],
    source: "curated",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id || project.slug === id);
}

/** Used by the assistant to answer domain-scoped questions. */
export function getProjectsByDomain(domain: ProjectDomain): readonly Project[] {
  return projects.filter((project) => project.domains.includes(domain));
}

/**
 * Every filterable domain, in display order.
 *
 * `as const satisfies` rather than a type annotation, and the distinction matters: an annotation on
 * a filtered result does not reach the array literal, so each `id` would widen to `string` and no
 * longer satisfy `ProjectDomain`.
 *
 * Not filtered by whether entries exist any more — the grid builds its own tab list from the
 * projects it was actually given, which now includes discovered repositories.
 */
export const projectDomains = [
  { id: "backend", label: "Backend" },
  { id: "java", label: "Java" },
  { id: "spring", label: "Spring" },
  { id: "ai", label: "AI" },
  { id: "commerce", label: "Commerce" },
  { id: "frontend", label: "Frontend" },
  { id: "mern", label: "MERN" },
] as const satisfies readonly { id: ProjectDomain; label: string }[];
