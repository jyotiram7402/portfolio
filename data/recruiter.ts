import {
  Boxes,
  CalendarClock,
  Clock,
  Cpu,
  Gauge,
  Globe2,
  MapPin,
  Users,
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
 * have you been doing this, what have you built, when could you start, where are you, and what are
 * you looking for.
 *
 * `preferredRoles` is ordered by priority and the order is the message — Java backend first, Java
 * full stack second, MERN last. A recruiter who reads only the first entry should still be reading
 * the right one.
 *
 * Stating the caveats up front is not a risk. It saves a call that was going to end the same way,
 * and it is the single thing a good recruiter appreciates most.
 */

export const hiringProfile: HiringProfile = {
  availability: siteConfig.availability.open ? "open" : "closed",
  availabilityLabel: siteConfig.availability.open
    ? siteConfig.availability.label
    : "Not currently looking",
  noticePeriod: "60 days from acceptance",
  location: "Pune, India — on-site, hybrid or remote",
  workPreference:
    "Hybrid preferred in Pune. Fully remote works if the team is already remote-first rather than remote-tolerant.",
  timezoneOverlap:
    "IST. Comfortable overlapping into European mornings and the first half of a US East Coast day.",
  responseTime: RESPONSE_TIME,

  preferredRoles: [
    {
      title: "Java Backend Engineer",
      level: "Mid-level, or a junior role with a clear path",
      rationale:
        "First priority, and where the depth is. Spring Boot services, REST API design, JPA and Hibernate, Kafka event streams, and the production ownership that comes with them.",
    },
    {
      title: "Java Full Stack Developer",
      level: "Mid-level",
      rationale:
        "Spring Boot on the back, React on the front. I have shipped both halves of that against a documented API contract, and I would rather own a feature end to end than half of one.",
    },
    {
      title: "Backend / Platform Engineer",
      level: "Mid-level",
      rationale:
        "The work I keep gravitating towards: the seam between two systems — payments, search, CRM synchronisation — where correctness is actually decided.",
    },
    {
      title: "AI Engineer — applied, product-facing",
      level: "Mid-level, with mentorship on the ML side",
      rationale:
        "I lead the AI-first initiative at Southco as a board member of the AI team. Honest about the gap: I build the plumbing, the tooling and the retrieval — I do not train models.",
    },
    {
      title: "MERN / React Developer",
      level: "Mid-level",
      rationale:
        "Genuine but secondary. React, Node, Express and MongoDB are real skills here — I would take this role, but Java is where I am strongest and where I want to grow.",
    },
  ],

  notes: [
    "Two years of professional delivery, not five. Everything on this site is work I can walk through line by line.",
    "Strongest on Java, Spring Boot and integrations. React and the MERN stack are real but are not where the depth is.",
    "I sit on the AI board at Southco — if AI-first development matters to your team, that is the conversation I am most useful in.",
    "Not looking for a role that is purely maintenance on a system nobody is allowed to change.",
    "Happy to do a technical exercise. Would rather walk through the payment integration or the Kafka design than solve a puzzle.",
  ],
};

/**
 * The summary grid.
 *
 * Two figures are derived from `data/` rather than typed, so they cannot drift from the sections a
 * recruiter scrolls to next.
 */
export const recruiterFacts: readonly RecruiterFact[] = [
  {
    id: "experience",
    label: "Experience",
    value: "2+ years",
    detail: "Enterprise backend systems in production since September 2024",
    icon: Gauge,
    emphasis: true,
  },
  {
    id: "ai-board",
    label: "AI leadership",
    value: "AI board member",
    detail: "Leading the AI-first development approach at Southco",
    icon: Users,
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
  },
  {
    id: "location",
    label: "Location",
    value: siteConfig.location,
    detail: "Hybrid preferred; remote works if the team is remote-first",
    icon: MapPin,
  },
  {
    id: "timezone",
    label: "Time zone",
    value: "IST (UTC+5:30)",
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
  title: "Java backend engineer, open to the right team.",
  description:
    "Everything a first call would cover, on one page: the figures, the availability, the roles I am actually a fit for, and the things worth knowing before we spend half an hour finding them out. No gatekeeping and no pitch.",
} as const;
