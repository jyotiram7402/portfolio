import { BookOpen, Brain, Chrome, Code, Globe, GraduationCap, Wrench } from "lucide-react";

import type { ResourceGroup } from "@/types/explore";

/**
 * Things worth someone else's time.
 *
 * Every `note` says why the resource earns its place, not what it is. A list that
 * describes what Docker's documentation is has no value; a list that says which
 * three pages of it actually matter does.
 */
export const resourceGroups: readonly ResourceGroup[] = [
  {
    id: "books",
    label: "Books",
    summary: "The ones I return to, not the ones that look good on a shelf.",
    icon: BookOpen,
    items: [
      {
        id: "designing-data-intensive",
        name: "Designing Data-Intensive Applications",
        by: "Martin Kleppmann",
        note: "The single best explanation of why distributed systems fail the way they do. Chapters 5 and 7 changed how I model data.",
        href: "https://dataintensive.net",
      },
      {
        id: "effective-java",
        name: "Effective Java",
        by: "Joshua Bloch",
        note: "Read it once for the rules, then again after a year of writing Java to understand why each one exists.",
        href: "https://www.oreilly.com/library/view/effective-java/9780134686097/",
      },
      {
        id: "clean-architecture",
        name: "Clean Architecture",
        by: "Robert C. Martin",
        note: "Useful for the dependency-direction argument specifically. Take the layering advice as a starting point, not a law.",
        href: "https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/",
      },
      {
        id: "pragmatic-programmer",
        name: "The Pragmatic Programmer",
        by: "Hunt & Thomas",
        note: "The chapter on tracer bullets is the one that stuck: build the thin end-to-end path before the thick middle.",
        href: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
      },
    ],
  },
  {
    id: "courses",
    label: "Courses",
    summary: "Structured material that survived contact with a real project.",
    icon: GraduationCap,
    items: [
      {
        id: "spring-docs",
        name: "Spring Framework reference",
        by: "VMware",
        note: "Better than most paid courses. Read the sections on the container and on transaction management in full.",
        href: "https://docs.spring.io/spring-framework/reference/",
      },
      {
        id: "system-design-primer",
        name: "System Design Primer",
        by: "Donne Martin",
        note: "The best free starting point. Work the exercises rather than reading the answers.",
        href: "https://github.com/donnemartin/system-design-primer",
      },
      {
        id: "anthropic-cookbook",
        name: "Anthropic Cookbook",
        by: "Anthropic",
        note: "Runnable notebooks for tool use, structured output and evaluation. Closer to production practice than most LLM courses.",
        href: "https://github.com/anthropics/anthropic-cookbook",
      },
      {
        id: "web-dev-simplified",
        name: "web.dev",
        by: "Google",
        note: "The Core Web Vitals material is the reference I check before arguing about performance.",
        href: "https://web.dev",
      },
    ],
  },
  {
    id: "tools",
    label: "Developer tools",
    summary: "The daily surface. Chosen for how fast they get me to the truth.",
    icon: Wrench,
    items: [
      {
        id: "bruno",
        name: "Bruno",
        note: "API client whose collections are plain files in the repository, so they get reviewed like code.",
        href: "https://www.usebruno.com",
      },
      {
        id: "dbeaver",
        name: "DBeaver",
        note: "One client for MySQL, Postgres and Mongo, with an execution-plan view that is actually readable.",
        href: "https://dbeaver.io",
      },
      {
        id: "testcontainers",
        name: "Testcontainers",
        note: "Integration tests against a real database in a container. Ends the class of bug that only exists in H2.",
        href: "https://testcontainers.com",
      },
      {
        id: "k6",
        name: "k6",
        note: "Load tests as JavaScript, so a performance claim can be reproduced by anyone on the team.",
        href: "https://k6.io",
      },
      {
        id: "claude-code",
        name: "Claude Code",
        note: "Agentic development in the terminal. Best used for reading unfamiliar code and scaffolding tests.",
        href: "https://claude.com/claude-code",
      },
    ],
  },
  {
    id: "vscode",
    label: "VS Code extensions",
    summary: "A short list. Every extension is startup time and another thing to break.",
    icon: Code,
    items: [
      {
        id: "error-lens",
        name: "Error Lens",
        note: "Puts the diagnostic on the line instead of in a panel. The single biggest feedback-loop win.",
        href: "https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens",
      },
      {
        id: "tailwind-intellisense",
        name: "Tailwind CSS IntelliSense",
        note: "Reads the theme from the stylesheet, so custom tokens autocomplete like built-ins.",
        href: "https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss",
      },
      {
        id: "gitlens",
        name: "GitLens",
        note: "Inline blame answers \"why is this here\" without leaving the file.",
        href: "https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens",
      },
      {
        id: "extension-pack-java",
        name: "Extension Pack for Java",
        note: "The debugger and test runner are the parts that matter; the rest can stay disabled.",
        href: "https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack",
      },
    ],
  },
  {
    id: "chrome",
    label: "Chrome extensions",
    summary: "Four, and each one earns its permissions.",
    icon: Chrome,
    items: [
      {
        id: "lighthouse",
        name: "Lighthouse",
        note: "Run it on a throttled profile or the numbers are fiction.",
        href: "https://developer.chrome.com/docs/lighthouse/overview",
      },
      {
        id: "wappalyzer",
        name: "Wappalyzer",
        note: "Fastest way to see what a site you admire is actually built on.",
        href: "https://www.wappalyzer.com",
      },
      {
        id: "json-viewer",
        name: "JSON Viewer",
        note: "Makes an API response readable without pasting it into a formatter.",
        href: "https://chromewebstore.google.com/",
      },
      {
        id: "axe-devtools",
        name: "axe DevTools",
        note: "Catches the accessibility mistakes that are cheap to fix and embarrassing to ship.",
        href: "https://www.deque.com/axe/devtools/",
      },
    ],
  },
  {
    id: "java",
    label: "Java & JVM",
    summary: "Where I go when the answer has to be exact.",
    icon: Code,
    items: [
      {
        id: "jep-index",
        name: "JEP Index",
        note: "The primary source for what a Java release actually changed, and why.",
        href: "https://openjdk.org/jeps/0",
      },
      {
        id: "baeldung",
        name: "Baeldung",
        note: "Good for the narrow how-do-I question. Always check the Spring version the article targets.",
        href: "https://www.baeldung.com",
      },
      {
        id: "inside-java",
        name: "Inside Java",
        note: "Posts and podcasts from the people building the platform. The best signal-to-noise on the JVM.",
        href: "https://inside.java",
      },
    ],
  },
  {
    id: "ai-resources",
    label: "AI engineering",
    summary: "Material that treats models as components, not as magic.",
    icon: Brain,
    items: [
      {
        id: "prompt-eng-guide",
        name: "Prompt Engineering Guide",
        note: "A reference rather than a course. Useful for naming techniques you are already using by instinct.",
        href: "https://www.promptingguide.ai",
      },
      {
        id: "anthropic-docs",
        name: "Anthropic documentation",
        note: "The tool-use and long-context sections are the practical parts. Read them before designing an agent loop.",
        href: "https://docs.anthropic.com",
      },
      {
        id: "openai-cookbook",
        name: "OpenAI Cookbook",
        note: "Runnable recipes for embeddings and retrieval. Adapt them; do not ship them as they are.",
        href: "https://cookbook.openai.com",
      },
    ],
  },
  {
    id: "learning",
    label: "Learning websites",
    summary: "Where I go to be told I am wrong.",
    icon: Globe,
    items: [
      {
        id: "mdn",
        name: "MDN Web Docs",
        note: "Still the reference. Its compatibility tables have settled more arguments than any blog post.",
        href: "https://developer.mozilla.org",
      },
      {
        id: "roadmap-sh",
        name: "roadmap.sh",
        note: "Useful for spotting the gap you did not know you had. Not useful as a curriculum to follow literally.",
        href: "https://roadmap.sh",
      },
      {
        id: "exercism",
        name: "Exercism",
        note: "Java track with human mentorship. The feedback is the product; the exercises are the excuse.",
        href: "https://exercism.org",
      },
      {
        id: "highscalability",
        name: "High Scalability",
        note: "Real architecture write-ups from real outages. Better than any interview prep list.",
        href: "https://highscalability.com",
      },
    ],
  },
];

export const resourceCount = resourceGroups.reduce(
  (total, group) => total + group.items.length,
  0,
);
