import type { ReactNode } from "react";

import { PageTransition } from "@/components/animation/page-transition";
import { BackgroundWrapper } from "@/components/background/background-wrapper";
import { CustomCursor } from "@/components/common/custom-cursor";
import { FloatingActions } from "@/components/common/floating-actions";
import { InstallPrompt } from "@/components/common/install-prompt";
import { Preloader } from "@/components/common/preloader";
import { ServiceWorker } from "@/components/common/service-worker";
import { SkipLink } from "@/components/common/skip-link";
import { BackToTop } from "@/components/layout/back-to-top";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { navigationConfig } from "@/config/navigation";

export interface SiteShellProps {
  children: ReactNode;
}

/**
 * The page frame: everything that is identical on every route.
 *
 * Kept out of `app/layout.tsx` so the root layout stays a thin Server Component
 * that owns nothing but `<html>`, fonts, metadata and the provider boundary. This
 * is also the one place the document's landmark structure is defined, which is
 * what makes it verifiable: one `<header>`, one `<main>`, one `<footer>`.
 *
 * `min-h-dvh` with `flex-col` and `flex-1` on main is what keeps the footer at
 * the bottom on short pages without `position: absolute` tricks.
 *
 * `pt-[var(--header-height)]` reserves space for the fixed header. The header
 * cannot be in flow — it has to blur what scrolls beneath it — so the padding is
 * how the first section avoids starting underneath it.
 */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <SkipLink />
      <Preloader />
      <BackgroundWrapper />
      <ScrollProgress />
      <CustomCursor />

      <div className="relative flex min-h-dvh flex-col">
        <Navbar />

        <main
          id={navigationConfig.mainContentId}
          // Programmatically focusable so the skip link can move focus here,
          // but not a tab stop of its own.
          tabIndex={-1}
          className="flex-1 pt-[var(--header-height)] outline-none"
        >
          <PageTransition>{children}</PageTransition>
        </main>

        <Footer />
      </div>

      {/* Persistent access to the assistant and to search. Sits above the
          back-to-top button, which keeps the primary action nearest the thumb. */}
      <FloatingActions />
      <BackToTop />

      {/* Progressive enhancement, both deferred and both silent when unavailable:
          the service worker registers after `load`, and the install prompt only
          appears if the browser says the site is genuinely installable. */}
      <ServiceWorker />
      <InstallPrompt />
    </>
  );
}
