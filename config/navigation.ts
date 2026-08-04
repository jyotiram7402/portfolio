import {
  Award,
  Boxes,
  Brain,
  Briefcase,
  FileSignature,
  FileText,
  FolderGit2,
  Github,
  Library,
  Mail,
  Mic,
  Route as RouteIcon,
  Send,
  Sparkles,
  User,
  UserSearch,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { ROUTES, isRouteImplemented } from "@/constants/routes";
import { SECTIONS, type SectionId } from "@/constants/sections";
import type { FooterColumn, NavItem } from "@/types/navigation";

/**
 * Primary navigation.
 *
 * Two kinds of entry coexist:
 *
 * • **Section links** — anchors into the home page (`/#projects`). Real anchors, so they work
 *   without JavaScript, deep-link correctly and open in a new tab. `NavLink` upgrades the
 *   click to a Lenis-eased scroll when the reader is already on the home page.
 *
 * • **Route links** — real pages. `soon` is derived from `IMPLEMENTED_ROUTES` rather than
 *   hand-maintained, so shipping a page turns its entry into a live link with no edit here.
 *
 * The navbar carries five entries out of thirteen sections. That is the point: a navbar with
 * every section in it is a directory. The rest are reachable by scrolling, from the footer,
 * and through the command palette — which is why ⌘K is advertised in the header.
 */
function routeItem(item: Omit<NavItem, "soon">): NavItem {
  return { ...item, soon: !isRouteImplemented(item.href) };
}

function sectionItem(
  sectionId: SectionId,
  item: Omit<NavItem, "href" | "sectionId" | "soon">,
): NavItem {
  return { ...item, sectionId, href: `${ROUTES.home}#${sectionId}` };
}

export const mainNav: readonly NavItem[] = [
  sectionItem(SECTIONS.about, {
    label: "About",
    icon: User,
    description: "Background, principles and the journey so far",
  }),
  sectionItem(SECTIONS.projects, {
    label: "Projects",
    icon: Boxes,
    description: "Selected build work, filterable by area",
  }),
  sectionItem(SECTIONS.assistant, {
    label: "Assistant",
    icon: Sparkles,
    description: "Ask about the work instead of reading all of it",
  }),
  sectionItem(SECTIONS.skills, {
    label: "Skills",
    icon: Brain,
    description: "The technology explorer",
  }),
  routeItem({
    label: "Writing",
    href: ROUTES.blog,
    icon: FileText,
    description: "Long-form notes on backend engineering and applied AI",
  }),
];

/**
 * The one action that stays visually promoted in the navbar.
 *
 * Falls back to a `mailto:` until the contact page ships, so the primary call to action is
 * never a dead link. Adding `/contact` to `IMPLEMENTED_ROUTES` flips it to the internal route
 * with no other change.
 */
export const navCta: NavItem = isRouteImplemented(ROUTES.contact)
  ? { label: "Get in touch", href: ROUTES.contact }
  : { label: "Get in touch", href: `mailto:${siteConfig.email}` };

/**
 * The footer is where the full section list lives.
 *
 * Three columns rather than two, because there are now thirteen sections and a single column
 * would be a scroll of its own.
 */
export const footerNav: readonly FooterColumn[] = [
  {
    id: "explore",
    title: "Explore",
    items: [
      sectionItem(SECTIONS.about, { label: "About", icon: User }),
      sectionItem(SECTIONS.experience, { label: "Experience", icon: Briefcase }),
      sectionItem(SECTIONS.projects, { label: "Projects", icon: Boxes }),
      sectionItem(SECTIONS.skills, { label: "Skills", icon: Brain }),
      sectionItem(SECTIONS.assistant, { label: "AI Assistant", icon: Sparkles }),
    ],
  },
  {
    id: "more",
    title: "More",
    items: [
      routeItem({ label: "Writing", href: ROUTES.blog, icon: FileText }),
      sectionItem(SECTIONS.roadmap, { label: "Roadmap", icon: RouteIcon }),
      sectionItem(SECTIONS.achievements, { label: "Achievements", icon: Award }),
      sectionItem(SECTIONS.github, { label: "GitHub activity", icon: Github }),
      sectionItem(SECTIONS.resources, { label: "Resources", icon: Library }),
    ],
  },
  {
    id: "hiring",
    title: "Hiring",
    items: [
      routeItem({ label: "Résumé", href: ROUTES.resume, icon: FileSignature }),
      routeItem({ label: "For recruiters", href: ROUTES.recruiters, icon: UserSearch }),
      routeItem({ label: "Contact", href: ROUTES.contact, icon: Mail }),
      sectionItem(SECTIONS.speaking, { label: "Speaking", icon: Mic }),
      sectionItem(SECTIONS.newsletter, { label: "Newsletter", icon: Send }),
      // `soon` is derived, so this becomes a live link the moment the page ships.
      routeItem({ label: "Case studies", href: ROUTES.work, icon: FolderGit2 }),
    ],
  },
];

export const navigationConfig = {
  mainNav,
  navCta,
  footerNav,
  /** Skip-link target. Must match the `id` on the `<main>` element. */
  mainContentId: "main-content",
} as const;
