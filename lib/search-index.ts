import {
  Award,
  Briefcase,
  Cpu,
  FileText,
  Hash,
  Layers,
  Library,
} from "lucide-react";

import { blogPostPath } from "@/constants/routes";
import { SECTION_INDEX } from "@/constants/sections";
import { achievements } from "@/data/achievements";
import { getCategory } from "@/data/blog";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { resourceGroups } from "@/data/resources";
import { allTechnologies, skillCategories } from "@/data/skills";
import { getProjectIcon } from "@/lib/project-icon";
import { renderablePosts } from "@/services/content.service";
import type { SearchDocument, SearchResult } from "@/types/search";
import { fuzzyMatchFields } from "@/utils/fuzzy";

/**
 * The global search index.
 *
 * One index, built once at module scope, serving the command palette and the global
 * search overlay. Built from the same `data/` modules the sections render, so anything
 * that appears on the page is findable by construction — there is no separate manifest
 * to forget to update.
 *
 * Everything is a `SearchDocument` with a title, a description, an href and extra
 * keywords. Ranking is the shared fuzzy scorer, weighted so a title hit beats a
 * keyword hit. Roughly 120 documents, which is small enough that scoring the whole set
 * per keystroke costs nothing measurable — no index structure or worker needed.
 */

function sectionDocuments(): SearchDocument[] {
  return SECTION_INDEX.map((section) => ({
    id: `section:${section.id}`,
    kind: "section",
    title: section.label,
    description: section.hint,
    href: `/#${section.id}`,
    keywords: ["jump", "section", "navigate", section.id],
    icon: Hash,
  }));
}

/**
 * Indexes the curated projects only.
 *
 * The palette runs in the browser and cannot reach `services/projects.service.ts`, which is
 * server-only. Discovered repositories therefore appear in the Projects section but not in search —
 * adding an entry to `data/project-overrides.ts` is what promotes one into both.
 */
function projectDocuments(): SearchDocument[] {
  return projects.map((project) => ({
    id: `project:${project.id}`,
    kind: "project",
    title: project.name,
    description: project.tagline,
    href: "/#projects",
    keywords: [...project.stack, ...project.domains, project.status, "project"],
    icon: getProjectIcon(project),
  }));
}

function postDocuments(): SearchDocument[] {
  return renderablePosts.map((post) => ({
    id: `post:${post.slug}`,
    kind: "post",
    title: post.title,
    description: post.description,
    href: blogPostPath(post.slug),
    keywords: [
      ...post.tags,
      getCategory(post.category)?.label ?? post.category,
      "article",
      "blog",
      "writing",
    ],
    icon: FileText,
  }));
}

function skillDocuments(): SearchDocument[] {
  const categories = skillCategories.map(
    (category): SearchDocument => ({
      id: `skill-category:${category.id}`,
      kind: "skill",
      title: category.label,
      description: category.summary,
      href: "/#skills",
      keywords: [
        "skills",
        "category",
        ...category.technologies.map((technology) => technology.name),
      ],
      icon: Layers,
    }),
  );

  const technologies = allTechnologies.map(
    (technology): SearchDocument => ({
      id: `technology:${technology.id}`,
      kind: "skill",
      title: technology.name,
      description: technology.description,
      href: "/#skills",
      keywords: ["technology", "stack", technology.proficiency],
      icon: Cpu,
    }),
  );

  return [...categories, ...technologies];
}

function experienceDocuments(): SearchDocument[] {
  return experience.map((entry) => ({
    id: `experience:${entry.id}`,
    kind: "experience",
    title: `${entry.role} — ${entry.company}`,
    description: entry.summary,
    href: "/#experience",
    keywords: [entry.company, entry.period, ...entry.technologies, "experience", "work"],
    icon: Briefcase,
  }));
}

function achievementDocuments(): SearchDocument[] {
  return achievements.map((entry) => ({
    id: `achievement:${entry.id}`,
    kind: "achievement",
    title: entry.title,
    description: `${entry.issuer} · ${entry.period}`,
    href: "/#achievements",
    keywords: [entry.kind, entry.issuer, "achievement", "certificate"],
    icon: Award,
  }));
}

function resourceDocuments(): SearchDocument[] {
  return resourceGroups.flatMap((group) =>
    group.items.map(
      (item): SearchDocument => ({
        id: `resource:${item.id}`,
        kind: "resource",
        title: item.name,
        description: item.note,
        href: "/#resources",
        keywords: [group.label, item.by ?? "", "resource", "recommendation"],
        icon: Library,
      }),
    ),
  );
}

export const searchIndex: readonly SearchDocument[] = [
  ...sectionDocuments(),
  ...projectDocuments(),
  ...postDocuments(),
  ...skillDocuments(),
  ...experienceDocuments(),
  ...achievementDocuments(),
  ...resourceDocuments(),
];

/**
 * Relative weight per kind, applied after fuzzy scoring.
 *
 * Without this, a query for "java" surfaces the technology chip above the Java article
 * and the Java projects, because a one-word title is a tighter fuzzy match than a
 * sentence. The weights encode what a visitor is more likely to have meant.
 */
const KIND_WEIGHT: Record<SearchDocument["kind"], number> = {
  page: 1.1,
  section: 1.05,
  project: 1,
  post: 0.98,
  experience: 0.92,
  skill: 0.88,
  achievement: 0.85,
  resource: 0.8,
};

export interface SearchOptions {
  limit?: number;
  /** Restricts results to these kinds. */
  kinds?: readonly SearchDocument["kind"][];
}

/**
 * Ranks the index against a query.
 *
 * An empty query returns the highest-weighted documents rather than nothing, so the
 * palette opens with useful suggestions instead of a blank panel.
 */
export function searchDocuments(
  query: string,
  options: SearchOptions = {},
): readonly SearchResult[] {
  const { limit = 8, kinds } = options;
  const pool = kinds
    ? searchIndex.filter((document) => kinds.includes(document.kind))
    : searchIndex;

  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return pool
      .filter((document) => document.kind === "section" || document.kind === "post")
      .slice(0, limit)
      .map((document) => ({ document, score: 1, matches: [] }));
  }

  return pool
    .map((document) => {
      const match = fuzzyMatchFields(trimmed, [
        { value: document.title, weight: 1 },
        { value: document.description, weight: 0.6 },
        { value: document.keywords.join(" "), weight: 0.55 },
      ]);

      return {
        document,
        score: match.score * KIND_WEIGHT[document.kind],
        // Re-scored against the title alone so highlighting only marks characters
        // that are actually in the string being rendered.
        matches: fuzzyMatchFields(trimmed, [{ value: document.title, weight: 1 }])
          .matches,
      };
    })
    .filter((result) => result.score > 0)
    .toSorted((a, b) => b.score - a.score)
    .slice(0, limit);
}
