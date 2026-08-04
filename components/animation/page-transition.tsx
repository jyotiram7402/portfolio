"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { pageTransition } from "@/animations/variants";
import { useMotionVariants } from "@/hooks/use-motion-variants";
import { cn } from "@/lib/utils";
import { scrollToTop } from "@/utils/scroll";

export interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Entrance animation for each route.
 *
 * Deliberately entrance-only. An exit animation in the App Router requires
 * holding the outgoing tree while the incoming one has already committed, which
 * either delays the new page's paint or double-renders it — both of which cost
 * more than the transition is worth. Keying on `pathname` re-runs the entrance
 * on every navigation, which is the part users actually perceive.
 *
 * The route change also resets the scroll position: Lenis keeps its own virtual
 * offset, so without this a navigation would land mid-page.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const variants = useMotionVariants(pageTransition);

  useEffect(() => {
    scrollToTop({ immediate: true });
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
