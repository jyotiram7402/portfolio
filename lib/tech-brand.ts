import type { ComponentType } from "react";

import {
  Activity,
  Bot,
  Boxes,
  Brain,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  FileCode2,
  FileSearch,
  GitPullRequest,
  Globe,
  KanbanSquare,
  Layers,
  Network,
  Package,
  Plug,
  Quote,
  Radio,
  Rocket,
  Route,
  Search,
  Server,
  Shapes,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Split,
  TestTube2,
  Timer,
  Waypoints,
  Workflow,
  Zap,
} from "lucide-react";

import {
  DockerMark,
  GitMark,
  JavaMark,
  JavaScriptMark,
  KafkaMark,
  KubernetesMark,
  MongoMark,
  NextMark,
  PythonMark,
  ReactMark,
  RedisMark,
  SpringMark,
  TailwindMark,
  type TechMarkProps,
  TypeScriptMark,
} from "@/components/icons/tech-marks";
import type { Technology } from "@/types/skills";

/**
 * The glyph and brand colour for one technology in the explorer.
 *
 * Kept out of `data/skills.ts` on purpose. That file is content, and a component
 * reference in it would make it unusable from a Server Component — the same reason
 * `types/projects.ts` has no `icon` field and `lib/project-icon.ts` exists. Resolve,
 * do not store.
 *
 * **On colour.** The brand hex tints the chip; it never paints the glyph. Painting a
 * glyph in its brand colour looks obvious until you try it in both themes: Next.js and
 * Kafka are black, so they vanish on a black card, and JavaScript's yellow fails on a
 * white one. Tinting the chip and leaving the glyph at `--foreground` keeps the colour
 * identity *and* a legible mark in both themes, with one rule instead of two palettes.
 *
 * **On coverage.** Around a third of these entries are not products — Collections,
 * SOLID, Code Reviews, Query Optimisation. There is no logo for those, and inventing
 * one would be worse than the semantic Lucide glyph they get instead. The brands with
 * real marks are the ones in `components/icons/tech-marks.tsx`; everything else is
 * matched to a glyph that says what the thing *does*.
 */

/** Anything that renders from a `className`. Lucide and the local marks both satisfy it. */
export type TechGlyph = ComponentType<TechMarkProps>;

export interface TechBrand {
  Glyph: TechGlyph;
  /**
   * Brand colour, or `undefined` for the concepts that have none. Chosen at mid
   * luminance so the tint reads on both `#000` and `#fff`.
   */
  color?: string;
}

const BRANDS: Record<string, TechBrand> = {
  /* ---------------------------------------------------------------- Core Java */
  java: { Glyph: JavaMark, color: "#E76F00" },
  collections: { Glyph: Boxes },
  streams: { Glyph: Waypoints },
  optional: { Glyph: Split },
  concurrency: { Glyph: Cpu },
  jvm: { Glyph: Activity },
  dsa: { Glyph: Shapes },

  /* ----------------------------------------------------------------- Backend */
  "spring-boot": { Glyph: SpringMark, color: "#6DB33F" },
  "spring-mvc": { Glyph: SpringMark, color: "#6DB33F" },
  "spring-security": { Glyph: ShieldCheck, color: "#6DB33F" },
  "rest-api": { Glyph: Route },
  "hibernate-jpa": { Glyph: Layers, color: "#BCAE79" },
  microservices: { Glyph: Network },
  "event-driven": { Glyph: Radio },
  fastapi: { Glyph: Zap, color: "#05998B" },

  /* -------------------------------------------------------- Data & messaging */
  mysql: { Glyph: Database, color: "#00758F" },
  sql: { Glyph: Database },
  kafka: { Glyph: KafkaMark, color: "#7E8B8F" },
  redis: { Glyph: RedisMark, color: "#DC382D" },
  postgresql: { Glyph: Database, color: "#4A90C4" },
  mongodb: { Glyph: MongoMark, color: "#4DB33D" },
  "query-optimisation": { Glyph: FileSearch },
  hikaricp: { Glyph: Timer },

  /* --------------------------------------------------------------------- AI */
  "claude-code": { Glyph: Bot, color: "#D97757" },
  mcp: { Glyph: Plug, color: "#D97757" },
  "secure-ai-tooling": { Glyph: ShieldCheck },
  "prompt-engineering": { Glyph: Quote },
  "llm-apis": { Glyph: Brain },
  "ai-search": { Glyph: Search, color: "#4A90C4" },
  rag: { Glyph: FileCode2 },
  "machine-learning": { Glyph: Brain, color: "#EE8C2B" },

  /* ------------------------------------------------------- Cloud and DevOps */
  docker: { Glyph: DockerMark, color: "#2496ED" },
  devcontainers: { Glyph: Container, color: "#2496ED" },
  aws: { Glyph: Cloud, color: "#FF9900" },
  "ci-cd": { Glyph: Workflow },
  jenkins: { Glyph: Siren, color: "#D33833" },
  "azure-devops": { Glyph: Workflow, color: "#0F8ED8" },
  kubernetes: { Glyph: KubernetesMark, color: "#4B7FE8" },
  maven: { Glyph: Package, color: "#C7183C" },
  vercel: { Glyph: Rocket, color: "#8E8E93" },

  /* ---------------------------------------------------------------- Frontend */
  react: { Glyph: ReactMark, color: "#61DAFB" },
  javascript: { Glyph: JavaScriptMark, color: "#E8C511" },
  typescript: { Glyph: TypeScriptMark, color: "#3F8FDC" },
  nextjs: { Glyph: NextMark, color: "#8E8E93" },
  tailwind: { Glyph: TailwindMark, color: "#38BDF8" },
  nodejs: { Glyph: Server, color: "#5FA04E" },
  supabase: { Glyph: Zap, color: "#3ECF8E" },
  "html-css": { Glyph: Globe, color: "#E4653B" },

  /* --------------------------------------------------------------- Practices */
  "design-patterns": { Glyph: Shapes },
  solid: { Glyph: Layers },
  junit: { Glyph: TestTube2, color: "#25A162" },
  mockito: { Glyph: TestTube2 },
  "code-reviews": { Glyph: GitPullRequest },
  agile: { Glyph: KanbanSquare, color: "#2684FF" },
  "production-support": { Glyph: Siren },

  /* ------------------------------------------------------------------- Tools */
  git: { Glyph: GitMark, color: "#F05032" },
  bitbucket: { Glyph: GitPullRequest, color: "#2684FF" },
  jira: { Glyph: KanbanSquare, color: "#2684FF" },
  postman: { Glyph: SlidersHorizontal, color: "#FF6C37" },
  python: { Glyph: PythonMark, color: "#4B8BBE" },
};

/** Last resort, so a technology added without a mapping still renders. */
const FALLBACK: TechBrand = { Glyph: Code2 };

export function getTechBrand(technology: Pick<Technology, "id">): TechBrand {
  return BRANDS[technology.id] ?? FALLBACK;
}
