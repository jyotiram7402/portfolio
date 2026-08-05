import {
  Bot,
  Boxes,
  Braces,
  Layers,
  MonitorSmartphone,
  Server,
  ShoppingCart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ProjectDomain } from "@/types/projects";

/**
 * Derives a project's icon rather than storing one.
 *
 * A Lucide icon is a React component, and components cannot cross a server-to-client boundary as
 * props. Discovered projects are fetched on the server and rendered by a client grid, so an `icon`
 * field on `Project` would fail to serialise the moment a repository came from the API.
 *
 * Deriving it also means a newly tagged repository gets a sensible icon with no configuration —
 * which is the whole point of automatic discovery.
 *
 * Order matters: the first matching domain wins, so the list runs from most specific to least.
 */
const DOMAIN_ICONS: readonly (readonly [ProjectDomain, LucideIcon])[] = [
  ["ai", Bot],
  ["commerce", ShoppingCart],
  ["spring", Layers],
  ["java", Braces],
  ["backend", Server],
  ["mern", MonitorSmartphone],
  ["frontend", MonitorSmartphone],
];

/** Fallback by primary language, for a repository with no recognised domain. */
const LANGUAGE_ICONS: Readonly<Record<string, LucideIcon>> = {
  java: Braces,
  kotlin: Braces,
  typescript: MonitorSmartphone,
  javascript: MonitorSmartphone,
  python: Bot,
  php: ShoppingCart,
  go: Server,
  rust: Server,
};

export function getProjectIcon(project: {
  domains: readonly ProjectDomain[];
  language?: string | null;
}): LucideIcon {
  for (const [domain, icon] of DOMAIN_ICONS) {
    if (project.domains.includes(domain)) return icon;
  }

  const language = project.language?.toLowerCase();
  if (language && language in LANGUAGE_ICONS) {
    return LANGUAGE_ICONS[language] ?? Boxes;
  }

  return Boxes;
}
