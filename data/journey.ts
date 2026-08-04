import {
  Blocks,
  Brain,
  Braces,
  CreditCard,
  GraduationCap,
  Mail,
  Rocket,
  Sparkles,
} from "lucide-react";

import type { JourneyEntry } from "@/types/profile";

/**
 * The About timeline.
 *
 * Ordered oldest to newest, which is the direction the reader scrolls. Each entry
 * is one step with one sentence — a timeline that needs paragraphs is a blog post
 * wearing the wrong component.
 */
export const journey: readonly JourneyEntry[] = [
  {
    id: "graduation",
    period: "2024",
    title: "Graduated into engineering",
    body: "Left university with the fundamentals and no illusions about how much of the job is learned in production.",
    icon: GraduationCap,
  },
  {
    id: "southco",
    period: "2024",
    title: "Joined Southco",
    body: "Started as a Junior Web Developer on live commerce systems, with real users and real consequences from week one.",
    icon: Rocket,
  },
  {
    id: "sfmc",
    period: "2024",
    title: "Salesforce Marketing Cloud",
    body: "Built and maintained customer journeys, data extensions and templated email — my first lesson in data modelling under someone else's constraints.",
    icon: Mail,
  },
  {
    id: "magento",
    period: "2024",
    title: "Magento development",
    body: "Storefront and module work on a large catalogue, where a careless query is felt by every visitor at once.",
    icon: Blocks,
  },
  {
    id: "payments",
    period: "2025",
    title: "Payment integrations",
    body: "Shipped gateway integrations end to end — sandbox certification, idempotency, webhook reconciliation and failure paths.",
    icon: CreditCard,
  },
  {
    id: "ai",
    period: "2025",
    title: "AI applications",
    body: "Moved from prompting to plumbing: retrieval pipelines, vector search and evaluated LLM features inside internal tooling.",
    icon: Brain,
  },
  {
    id: "java",
    period: "2025",
    title: "The Java backend turn",
    body: "Committed to Java and Spring Boot as the core craft — typed domains, layered services and APIs designed to outlive their first consumer.",
    icon: Braces,
  },
  {
    id: "saas",
    period: "Now",
    title: "Building SaaS products",
    body: "Taking ideas the whole distance: schema, service, interface, deployment and the operational tail that follows a launch.",
    icon: Sparkles,
    current: true,
  },
];
