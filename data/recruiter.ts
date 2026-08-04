import {
  Boxes,
  CalendarClock,
  Clock,
  Cpu,
  Gauge,
  Globe2,
  MapPin,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { RESPONSE_TIME } from "@/data/contact";
import { projects } from "@/data/projects";
import { allTechnologies } from "@/data/skills";
import type { HiringProfile, RecruiterFact } from "@/types/hiring";

/**
 * The recruiter dashboard's content.
 *
 * Written to answer, in one screen, the five questions every screening call opens with: how long
 * have you been doing this, what have you built, when could you start, where are you, and what
 * are you looking for.
 *
 * Stating the deal-breakers up front is not a risk — it saves a call that was going to end the
 * same way, and it is the single thing a good recruiter appreciates most.
 */

export const hiringProfile: HiringProfile = {
  availability: siteConfig.availability.open ? "open" : "closed",
  availabilityLabel: siteConfig.availability.open
    ? siteConfig.availability.label
    : "Not currently looking",
  noticePeriod: "60 days from acceptance",
  location: `${siteConfig.location} — on-site, hybrid or remote`,
  workPreference:
    "Hybrid preferred. Fully remote works if the team is already remote-first rather than remote-tolerant.",
  timezoneOverlap:
    "IST. Comfortable overlapping into European mornings and the first half of a US East Coast day.",
  responseTime: RESPONSE_TIME,

  preferredRoles: [
    {
      title: "Backend Engineer — Java / Spring Boot",
      level: "Mid-level, or a junior role with a clear path",
      rationale:
        "Where the depth already is. Service design, data modelling, integrations and the operational side of keeping them up.",
    },
    {
      title: "Software Engineer — Platform or Integrations",
      level: "Mid-level",
      rationale:
        "The work I keep gravitating towards: the seam between two systems, where correctness is actually decided.",
    },
    {
      title: "AI Engineer — applied, product-facing",
      level: "Mid-level, with mentorship on the ML side",
      rationale:
        "Retrieval, evaluation and putting models behind a real API. Honest about the gap: I build the plumbing, I do not train models.",
    },
  ],

  notes: [
    "Two years of professional delivery, not five. Everything on this site is work I can walk through line by line.",
    "Strongest on backend and integrations. Front-end work is credible but is not where the depth is.",
    "Not looking for a role that is purely maintenance on a system nobody is allowed to change.",
    "Happy to do a technical exercise. Would rather walk through the payment integration than solve a puzzle.",
  ],
};

/**
 * The summary grid.
 *
 * Two figures are derived from `data/` rather than typed, so they cannot drift from the sections
 * a recruiter scrolls to next.
 */
export const recruiterFacts: readonly RecruiterFact[] = [
  {
    id: "experience",
    label: "Experience",
    value: "2+ years",
    detail: "Professional delivery on production systems, since 2024",
    icon: Gauge,
    emphasis: true,
  },
  {
    id: "projects",
    label: "Projects",
    value: String(projects.length),
    detail: "Documented on this site, with the hard part described",
    icon: Boxes,
  },
  {
    id: "technologies",
    label: "Technologies",
    value: `${Math.floor(allTechnologies.length / 5) * 5}+`,
    detail: "Marked core, working or exploring — no percentages",
    icon: Cpu,
  },
  {
    id: "availability",
    label: "Availability",
    value: hiringProfile.availabilityLabel,
    detail: `Notice period: ${hiringProfile.noticePeriod}`,
    icon: CalendarClock,
    emphasis: true,
  },
  {
    id: "location",
    label: "Location",
    value: siteConfig.location,
    detail: hiringProfile.workPreference.split(".")[0] ?? "",
    icon: MapPin,
  },
  {
    id: "timezone",
    label: "Time zone",
    value: siteConfig.timezone.replace("_", " "),
    detail: "Meaningful overlap with EU and US-East mornings",
    icon: Globe2,
  },
  {
    id: "response",
    label: "Response time",
    value: RESPONSE_TIME,
    detail: "If it has been longer, the message went astray",
    icon: Clock,
  },
];

export const recruiterCopy = {
  eyebrow: "For recruiters and hiring managers",
  title: "Everything a first call would cover, on one page.",
  description:
    "The figures, the availability, the roles I am actually a fit for, and the things worth knowing before we spend half an hour finding them out. No gatekeeping and no pitch.",
} as const;
