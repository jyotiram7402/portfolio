import { Bot, Boxes, CreditCard, Search, Server, ShoppingCart } from "lucide-react";

import type { Project, ProjectDomain } from "@/types/projects";

/**
 * Selected build work.
 *
 * Backfilled here because Sprint 3 needs it: the AI assistant answers "show Java
 * projects", the command palette indexes projects, and global search ranks them.
 * Treat this file as the Sprint 2 deliverable it belongs to — the shape is final,
 * the entries are yours to expand.
 *
 * `links` are intentionally sparse. A card with a dead "Live demo" button is worse
 * than a card with no button, so only links that exist are listed.
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
    icon: CreditCard,
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
    icon: Search,
    featured: true,
  },
  {
    id: "rag-assistant",
    slug: "retrieval-augmented-assistant",
    name: "Retrieval-Augmented Assistant",
    tagline: "An internal assistant that answers from company documents, with citations.",
    summary:
      "A retrieval pipeline over internal documentation: chunking tuned to document structure, hybrid retrieval with reranking, and answers that cite the source they came from. Prompts are versioned in the repository and every change runs against a fixed evaluation set before it ships.",
    domains: ["ai", "backend"],
    stack: ["Java", "Spring Boot", "OpenAI API", "Claude API", "Vector Databases", "RAG"],
    highlights: [
      "Citations are mandatory — an answer with no retrieved source is refused rather than hallucinated.",
      "Prompts under version control with a regression set, so a prompt edit is reviewable like code.",
      "Hybrid retrieval combining keyword and vector search, reranked before it reaches the model.",
    ],
    status: "active",
    period: "2025 — Present",
    links: [],
    icon: Bot,
    featured: true,
  },
  {
    id: "spring-service-template",
    slug: "spring-service-template",
    name: "Spring Service Template",
    tagline: "The Spring Boot starting point I reach for, with the boring parts already right.",
    summary:
      "An opinionated Spring Boot template: layered package structure, Spring Security with JWT, Flyway migrations, testcontainers-backed integration tests, actuator health checks, and a CI pipeline that gates on the checks that actually catch regressions.",
    domains: ["java", "spring", "backend"],
    stack: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "Spring Data JPA",
      "PostgreSQL",
      "Docker",
      "GitHub Actions",
    ],
    highlights: [
      "Migrations run before the code that needs them, so a deploy is reversible.",
      "Integration tests against a real database in a container, not against an in-memory imitation of one.",
      "Method-level authorisation rather than controller-level, so a new endpoint is closed by default.",
    ],
    status: "active",
    period: "2025 — Present",
    links: [],
    icon: Server,
    featured: true,
  },
  {
    id: "commerce-toolkit",
    slug: "magento-module-toolkit",
    name: "Magento Module Toolkit",
    tagline: "Custom storefront modules for a catalogue where a careless query is felt by everyone.",
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
    icon: ShoppingCart,
  },
  {
    id: "portfolio-platform",
    slug: "portfolio-platform",
    name: "This Portfolio Platform",
    tagline: "A Next.js platform with a design system, motion layer and a local AI assistant.",
    summary:
      "Built in sprints as a real product rather than a template: tokens as CSS custom properties, a motion layer split across Framer Motion, GSAP and Lenis by responsibility, and an assistant whose engine is swappable for an LLM without touching the interface.",
    domains: ["frontend", "mern", "ai"],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js"],
    highlights: [
      "Pointer effects write to MotionValues and CSS custom properties, so hovering a grid of cards costs zero re-renders.",
      "The assistant's engine is an async-iterable interface, so a local knowledge base and an SSE endpoint are interchangeable.",
      "WebGL is gated on device tier, viewport and motion preference, so a phone never downloads three.js.",
    ],
    status: "active",
    period: "2026 — Present",
    links: [],
    icon: Boxes,
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
 * the *filtered* result does not reach the array literal, so each `id` widens to `string` and no
 * longer satisfies `ProjectDomain`. `satisfies` validates the literal in place while keeping its
 * narrow types.
 */
const ALL_PROJECT_DOMAINS = [
  { id: "backend", label: "Backend" },
  { id: "java", label: "Java" },
  { id: "spring", label: "Spring" },
  { id: "ai", label: "AI" },
  { id: "commerce", label: "Commerce" },
  { id: "frontend", label: "Frontend" },
  { id: "mern", label: "MERN" },
] as const satisfies readonly { id: ProjectDomain; label: string }[];

/** Used by the project filter, which offers only domains that have entries. */
export const projectDomains: readonly { id: ProjectDomain; label: string }[] =
  ALL_PROJECT_DOMAINS.filter(
    (domain) => getProjectsByDomain(domain.id).length > 0,
  );
