"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

import { mobileNavItem, staggerContainer } from "@/animations/variants";
import { NavLink } from "@/components/layout/nav-link";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Drawer } from "@/components/ui/drawer";
import { IconButton } from "@/components/ui/icon-button";
import { STAGGER } from "@/config/animations";
import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { NAV_SECTIONS } from "@/constants/sections";
import { useActiveSection } from "@/hooks/use-active-section";
import { useIsDesktop } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { externalLinkAttributes } from "@/utils/url";

export interface MobileNavProps {
  className?: string;
}

/**
 * Navigation drawer for narrow viewports.
 *
 * `Drawer` (Radix Dialog) provides the focus trap, escape handling and inert
 * background. This component adds the staggered entrance and — importantly —
 * closes itself when the viewport grows past the desktop breakpoint, which
 * otherwise leaves an open drawer floating over a layout that no longer has a
 * trigger for it.
 */
export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();
  // Only observe while the drawer is open — there is nothing to highlight when
  // it is closed, and an idle observer is wasted work on the device least able
  // to afford it.
  const activeSection = useActiveSection(NAV_SECTIONS, { enabled: open });

  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  return (
    <>
      <IconButton
        label="Open navigation"
        variant="ghost"
        size="sm"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn("text-muted hover:text-foreground", className)}
      >
        <Menu />
      </IconButton>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="right"
        title="Navigation"
        hideTitle
      >
        <nav aria-label="Main">
          <motion.ul
            variants={staggerContainer(STAGGER.normal, 0.05)}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-1"
          >
            {navigationConfig.mainNav.map((item) => (
              <motion.li key={item.href} variants={mobileNavItem}>
                <NavLink
                  item={item}
                  size="lg"
                  activeSectionId={activeSection}
                  onNavigate={() => setOpen(false)}
                />
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        <Divider className="my-8" />

        <div className="flex flex-col gap-6">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {socialConfig.links
              .filter((link) => link.primary)
              .map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    {...externalLinkAttributes()}
                    className="text-sm text-muted transition-colors hover:text-foreground focus-ring rounded-full"
                  >
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
          </ul>

          <Button asChild variant="secondary" fullWidth>
            <a href={`mailto:${siteConfig.email}`}>Email me</a>
          </Button>
        </div>
      </Drawer>
    </>
  );
}
