import type { LucideIcon } from "lucide-react";

export interface NavItem {
  /** Visible label. Keep it to one or two words. */
  label: string;
  /** Absolute path or in-page hash. */
  href: string;
  /**
   * Set when `href` targets a section on the home page. Drives the scroll-spy
   * active state and the smooth-scroll click handler; a plain route leaves it
   * undefined and falls back to pathname matching.
   */
  sectionId?: string;
  /** Shown to screen readers when the label alone is ambiguous. */
  description?: string;
  icon?: LucideIcon;
  /** Renders an external-link affordance and sets rel/target. */
  external?: boolean;
  /** Hidden from the UI but kept in config — used to stage unreleased routes. */
  disabled?: boolean;
  /** Marks a route that is not shipped yet, for a "soon" affordance. */
  soon?: boolean;
}

export interface NavSection {
  id: string;
  title: string;
  items: readonly NavItem[];
}

/** A footer column is structurally a nav section; the alias documents intent. */
export type FooterColumn = NavSection;

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  /** Handle without the leading `@`, used for `sameAs` structured data. */
  handle?: string;
  icon: LucideIcon;
  /** Excluded from the compact footer row when false. */
  primary?: boolean;
}
