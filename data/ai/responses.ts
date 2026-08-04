import { knowledge } from "@/data/ai/knowledge";
import { ACHIEVEMENT_KIND_META, achievements } from "@/data/achievements";
import { publishedPosts } from "@/data/blog";
import { getProjectsByDomain, projects } from "@/data/projects";
import { ROADMAP_STATUS_META, roadmapTracks } from "@/data/roadmap";
import { getSkillCategory } from "@/data/skills";
import { SECTIONS } from "@/constants/sections";
import { blogPostPath } from "@/constants/routes";
import type { ProjectDomain } from "@/types/projects";
import type { ResponseBlock } from "@/types/ai";

/**
 * Intent → response.
 *
 * Every answer is a list of typed blocks, which is the same shape a tool-calling LLM
 * would produce: prose plus structured attachments. That means the renderer written
 * for these responses is the renderer for a model's responses too — swapping engines
 * changes no component.
 *
 * Builders are functions, not constants, so figures like the project count are read at
 * call time from `data/` and cannot go stale.
 */

const NOT_FOUND_SUFFIX = "Nothing in that area yet.";

function projectBlocks(
  domain: ProjectDomain,
  lead: string,
  empty: string,
): ResponseBlock[] {
  const matching = getProjectsByDomain(domain);

  if (matching.length === 0) {
    return [{ type: "text", value: `${empty} ${NOT_FOUND_SUFFIX}` }];
  }

  return [
    { type: "text", value: lead },
    { type: "projects", ids: matching.map((project) => project.id) },
  ];
}

function skillBlocks(categoryId: string, lead: string): ResponseBlock[] {
  const category = getSkillCategory(categoryId);
  if (!category) {
    return [{ type: "text", value: "That category is not on the site." }];
  }

  const core = category.technologies.filter(
    (technology) => technology.proficiency === "core",
  );

  return [
    { type: "text", value: lead },
    {
      type: "badges",
      label: `${category.label} — ${category.technologies.length} technologies`,
      items: category.technologies.map((technology) => technology.name),
    },
    {
      type: "text",
      value:
        core.length > 0
          ? `The daily ones are **${core.map((technology) => technology.name).join("**, **")}**.`
          : "Everything here is at working level rather than daily.",
    },
    {
      type: "actions",
      actions: [
        {
          label: "Open the skills explorer",
          href: `#${SECTIONS.skills}`,
          kind: "internal",
        },
      ],
    },
  ];
}

const CONTACT_ACTIONS: ResponseBlock = {
  type: "actions",
  actions: [
    { label: "Email him", href: knowledge.links.email, kind: "mail" },
    { label: "GitHub", href: knowledge.links.github, kind: "external" },
    { label: "LinkedIn", href: knowledge.links.linkedin, kind: "external" },
  ],
};

/**
 * The response table.
 *
 * A record rather than a switch, so a missing builder is a type error at build time
 * instead of a silent fallthrough at runtime.
 */
export const responseBuilders: Record<string, () => ResponseBlock[]> = {
  /* ---------------------------------------------------------------- about -- */
  "about.who": () => [
    { type: "text", value: knowledge.narrative.introduction },
    {
      type: "facts",
      facts: [
        { label: "Role", value: knowledge.identity.role },
        { label: "Location", value: knowledge.identity.location },
        {
          label: "Status",
          value: knowledge.identity.availability.open
            ? knowledge.identity.availability.label
            : "Not currently looking",
        },
        { label: "Projects on site", value: String(knowledge.projectCount) },
      ],
    },
    { type: "text", value: knowledge.narrative.approach },
    {
      type: "actions",
      actions: [
        { label: "Read the full story", href: `#${SECTIONS.about}`, kind: "internal" },
      ],
    },
  ],

  "about.experience": () => {
    const current = knowledge.currentExperience;
    const blocks: ResponseBlock[] = [
      { type: "text", value: knowledge.narrative.experienceSummary },
    ];

    if (current) {
      blocks.push(
        {
          type: "facts",
          facts: [
            { label: "Company", value: current.company },
            { label: "Role", value: current.role },
            { label: "Period", value: current.period },
            { label: "Location", value: current.location },
          ],
        },
        { type: "text", value: "What he actually owns there:" },
        { type: "list", items: current.responsibilities.slice(0, 4) },
        { type: "badges", label: "Stack", items: current.technologies },
      );
    }

    blocks.push({
      type: "actions",
      actions: [
        {
          label: "Open the experience timeline",
          href: `#${SECTIONS.experience}`,
          kind: "internal",
        },
      ],
    });

    return blocks;
  },

  "about.focus": () => [
    { type: "text", value: knowledge.narrative.currentFocus },
    {
      type: "text",
      value: `On the roadmap right now: ${roadmapTracks
        .flatMap((track) => track.nodes)
        .filter((node) => node.status === "learning")
        .map((node) => node.label)
        .join(", ")}.`,
    },
    {
      type: "actions",
      actions: [
        { label: "See the roadmap", href: `#${SECTIONS.roadmap}`, kind: "internal" },
      ],
    },
  ],

  "about.roadmap": () => {
    const learning = roadmapTracks
      .flatMap((track) => track.nodes)
      .filter((node) => node.status === "learning");
    const planned = roadmapTracks
      .flatMap((track) => track.nodes)
      .filter((node) => node.status === "planned");

    return [
      {
        type: "text",
        value: `He keeps the roadmap public and honest — ${knowledge.roadmapTotals.completed} nodes complete, ${knowledge.roadmapTotals.learning} in progress, ${knowledge.roadmapTotals.planned} queued.`,
      },
      {
        type: "text",
        value: `**${ROADMAP_STATUS_META.learning.label}:** ${learning.map((node) => node.label).join(", ")}`,
      },
      {
        type: "text",
        value: `**${ROADMAP_STATUS_META.planned.label}:** ${planned.map((node) => node.label).join(", ")}`,
      },
      {
        type: "actions",
        actions: [
          {
            label: "Open the roadmap",
            href: `#${SECTIONS.roadmap}`,
            kind: "internal",
          },
        ],
      },
    ];
  },

  /* ------------------------------------------------------------- projects -- */
  "projects.all": () => [
    {
      type: "text",
      value: `${knowledge.projectCount} projects are on the site. Here they are, newest work first.`,
    },
    { type: "projects", ids: projects.map((project) => project.id) },
    {
      type: "actions",
      actions: [
        {
          label: "Browse with filters",
          href: `#${SECTIONS.projects}`,
          kind: "internal",
        },
      ],
    },
  ],

  "projects.java": () =>
    projectBlocks(
      "java",
      "Java work, where the interesting part was correctness rather than throughput:",
      "No Java projects are published yet.",
    ),

  "projects.spring": () =>
    projectBlocks(
      "spring",
      "Spring Boot work — service design, security and the boring parts done properly:",
      "No Spring Boot projects are published yet.",
    ),

  "projects.ai": () =>
    projectBlocks(
      "ai",
      "AI work. Both of these had to be evaluated before they shipped, not demoed:",
      "No AI projects are published yet.",
    ),

  "projects.mern": () =>
    projectBlocks(
      "mern",
      "JavaScript and React work. Less of it than the backend, and honestly labelled as such:",
      "No MERN-stack projects are published yet.",
    ),

  /* --------------------------------------------------------------- skills -- */
  "skills.all": () => [
    {
      type: "text",
      value: `${knowledge.technologyCount} technologies across ${knowledge.skillCategories.length} categories. The explorer on this page groups them properly, but here is the whole list.`,
    },
    ...knowledge.skillCategories.map(
      (category): ResponseBlock => ({
        type: "badges",
        label: category.label,
        items: category.technologies.map((technology) => technology.name),
      }),
    ),
    {
      type: "text",
      value:
        "No percentages anywhere — each entry is marked core, working or exploring, and *exploring* is used honestly.",
    },
    {
      type: "actions",
      actions: [
        {
          label: "Open the skills explorer",
          href: `#${SECTIONS.skills}`,
          kind: "internal",
        },
      ],
    },
  ],

  "skills.backend": () =>
    skillBlocks(
      "backend",
      "Backend is where most of his time goes. Typed domains, explicit boundaries, APIs built to outlive their first consumer.",
    ),

  "skills.frontend": () =>
    skillBlocks(
      "frontend",
      "Enough frontend depth to build the interface a backend deserves — accessible, fast, no layout shift.",
    ),

  "skills.ai": () =>
    skillBlocks(
      "ai",
      "Applied AI rather than decorative: retrieval that cites its sources, prompts under version control, evaluation before rollout.",
    ),

  /* ---------------------------------------------------------- credentials -- */
  "credentials.certifications": () => {
    const learning = achievements.filter(
      (entry) => entry.kind === "course" || entry.kind === "college",
    );

    return [
      {
        type: "text",
        value:
          "Mostly self-directed and project-assessed rather than exam-certified — he would rather show the thing he built than the badge.",
      },
      {
        type: "list",
        items: learning.map(
          (entry) => `${entry.title} — ${entry.issuer} (${entry.period})`,
        ),
      },
      {
        type: "actions",
        actions: [
          {
            label: "See all achievements",
            href: `#${SECTIONS.achievements}`,
            kind: "internal",
          },
        ],
      },
    ];
  },

  "credentials.achievements": () => {
    const work = achievements.filter((entry) => entry.kind === "work");

    return [
      {
        type: "text",
        value: `${knowledge.achievementCount} entries, grouped into ${Object.keys(ACHIEVEMENT_KIND_META).length} kinds. The ones from production work:`,
      },
      { type: "list", items: work.map((entry) => `${entry.title} — ${entry.description}`) },
      {
        type: "text",
        value:
          "Note there are no percentages here either. Nothing on this site claims a number he could not source in an interview.",
      },
      {
        type: "actions",
        actions: [
          {
            label: "Open achievements",
            href: `#${SECTIONS.achievements}`,
            kind: "internal",
          },
        ],
      },
    ];
  },

  "credentials.writing": () => {
    if (publishedPosts.length === 0) {
      return [{ type: "text", value: "Nothing published yet." }];
    }

    return [
      {
        type: "text",
        value: `${publishedPosts.length} articles so far, all long-form and all about something he actually shipped.`,
      },
      {
        type: "list",
        items: publishedPosts.map(
          (post) => `${post.title} — ${post.readingMinutes} min read`,
        ),
      },
      {
        type: "actions",
        actions: [
          { label: "Read the blog", href: "/blog", kind: "internal" },
          ...(publishedPosts[0]
            ? [
                {
                  label: `Latest: ${publishedPosts[0].title.slice(0, 32)}…`,
                  href: blogPostPath(publishedPosts[0].slug),
                  kind: "internal" as const,
                },
              ]
            : []),
        ],
      },
    ];
  },

  /* ---------------------------------------------------------------- links -- */
  "links.resume": () =>
    knowledge.links.resumeAvailable
      ? [
          { type: "text", value: "Here it is — one page, PDF." },
          {
            type: "actions",
            actions: [
              { label: "Download résumé", href: knowledge.links.resume, kind: "download" },
            ],
          },
        ]
      : [
          {
            type: "text",
            value:
              "The PDF is not published yet — rather than hand you a broken download, here are the two things that would be in it.",
          },
          {
            type: "actions",
            actions: [
              { label: "Experience", href: `#${SECTIONS.experience}`, kind: "internal" },
              { label: "Projects", href: `#${SECTIONS.projects}`, kind: "internal" },
              { label: "Email him for a copy", href: knowledge.links.email, kind: "mail" },
            ],
          },
        ],

  "links.github": () => [
    {
      type: "text",
      value:
        "GitHub is where the day-to-day is. There is a live dashboard further down this page too — repositories, languages and stars, pulled from the API.",
    },
    {
      type: "actions",
      actions: [
        { label: "Open GitHub", href: knowledge.links.github, kind: "external" },
        {
          label: "See the dashboard",
          href: `#${SECTIONS.github}`,
          kind: "internal",
        },
      ],
    },
  ],

  "links.linkedin": () => [
    { type: "text", value: "LinkedIn, for the formal version of the same history." },
    {
      type: "actions",
      actions: [
        { label: "Open LinkedIn", href: knowledge.links.linkedin, kind: "external" },
      ],
    },
  ],

  /* -------------------------------------------------------------- contact -- */
  "contact.how": () => [
    {
      type: "text",
      value: `Email is the fastest route — **${knowledge.identity.email}**. He reads it properly rather than skimming it.`,
    },
    {
      type: "text",
      value: knowledge.identity.availability.open
        ? `He is currently ${knowledge.identity.availability.label.toLowerCase()}, so a concrete opening is worth sending.`
        : "He is not actively looking right now, but interesting problems are always worth a message.",
    },
    CONTACT_ACTIONS,
  ],
};

/** Everything the assistant can be asked, for the suggestion rail and the palette. */
export function hasResponse(intentId: string): boolean {
  return intentId in responseBuilders;
}

export function buildResponse(intentId: string): ResponseBlock[] {
  const builder = responseBuilders[intentId];
  return builder ? builder() : [];
}
