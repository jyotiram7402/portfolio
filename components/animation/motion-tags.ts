"use client";

import { motion } from "framer-motion";

/**
 * The elements our animation wrappers are allowed to render as.
 *
 * An explicit map rather than `motion[tag]` indexing: this keeps the union
 * closed, keeps the props typed per element, and — because Framer Motion creates
 * a component per tag on first access — avoids materialising the entire DOM
 * surface at runtime.
 */
export const motionTags = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  aside: motion.aside,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  figure: motion.figure,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
} as const;

export type MotionTag = keyof typeof motionTags;
