import type { TechStackItem } from "@/types/content";

/**
 * What this site is built on, and why each dependency earns its bundle cost.
 *
 * Rendered by the footer's "built with" line. Kept in `data/` rather than
 * `config/` because it is content the page displays, not behaviour the app reads
 * — the distinction that keeps `config/` small enough to be trustworthy.
 */
export const techStack: readonly TechStackItem[] = [
  {
    name: "Next.js",
    href: "https://nextjs.org",
    role: "App Router, streaming, image and font optimisation",
    category: "framework",
  },
  {
    name: "TypeScript",
    href: "https://www.typescriptlang.org",
    role: "Strict mode, no implicit any, no unchecked index access",
    category: "language",
  },
  {
    name: "Tailwind CSS",
    href: "https://tailwindcss.com",
    role: "Design tokens as CSS custom properties, zero runtime",
    category: "styling",
  },
  {
    name: "Framer Motion",
    href: "https://motion.dev",
    role: "Component motion, driven by MotionValues rather than state",
    category: "motion",
  },
  {
    name: "GSAP",
    href: "https://gsap.com",
    role: "Scroll choreography via ScrollTrigger",
    category: "motion",
  },
  {
    name: "Lenis",
    href: "https://lenis.darkroom.engineering",
    role: "Interpolated scrolling, desktop only",
    category: "motion",
  },
  {
    name: "React Three Fiber",
    href: "https://r3f.docs.pmnd.rs",
    role: "WebGL particle field, lazily loaded on capable devices",
    category: "3d",
  },
  {
    name: "Radix UI",
    href: "https://www.radix-ui.com",
    role: "Accessibility primitives behind the dialog, drawer and tooltip",
    category: "content",
  },
  {
    name: "Vercel",
    href: "https://vercel.com",
    role: "Hosting, analytics and Speed Insights",
    category: "platform",
  },
];

export function getTechByCategory(
  category: TechStackItem["category"],
): readonly TechStackItem[] {
  return techStack.filter((item) => item.category === category);
}
