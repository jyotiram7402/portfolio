"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, FileText, History, Mail } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

import { ease } from "@/animations/easings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Tabs, type TabDefinition } from "@/components/ui/tabs";
import { DURATION } from "@/config/animations";
import { siteConfig } from "@/config/site";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import {
  DEFAULT_RESUME_VARIANT,
  getResumeVariant,
  resumeRevisions,
  resumeSummary,
  resumeVariants,
} from "@/data/resume";
import { AtsPanel } from "@/features/resume/components/ats-panel";
import { ResumePreview } from "@/features/resume/components/resume-preview";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { formatShortDate, toIsoDate } from "@/utils/format";

export interface ResumeCenterProps {
  className?: string;
}

/**
 * The résumé centre.
 *
 * Three variants of the same history, switchable, with a live HTML preview beside the download
 * controls.
 *
 * Two things worth recording:
 *
 * **The variant choice persists.** A recruiter who picked the AI résumé and comes back after
 * checking something should not land on the backend one. `localStorage` rather than session,
 * because that preference outlives a visit.
 *
 * **Downloads are honest about not existing.** No PDF has been committed, so the buttons say so
 * and offer the email route instead of a link that 404s. `variant.files.pdf` appearing in
 * `data/resume.ts` is the entire activation — the download analytics call is already wired behind
 * it, so the first real download is measured.
 */
export function ResumeCenter({ className }: ResumeCenterProps) {
  const idPrefix = useId();
  const [activeId, setActiveId] = useState<string>(DEFAULT_RESUME_VARIANT);

  // Restored after mount rather than read during render — `localStorage` is unavailable on
  // the server, and reading it in a render would be a hydration mismatch.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.resumeVariant);
      if (stored && getResumeVariant(stored)) setActiveId(stored);
    } catch {
      // Storage blocked. The default variant is a fine outcome.
    }
  }, []);

  const onSelect = useCallback((id: string) => {
    setActiveId(id);
    trackEvent("resume_variant_change", { variant: id });

    try {
      localStorage.setItem(STORAGE_KEYS.resumeVariant, id);
    } catch {
      // Non-fatal; the choice simply does not survive a reload.
    }
  }, []);

  const tabs = useMemo<TabDefinition[]>(
    () =>
      resumeVariants.map((variant) => ({
        id: variant.id,
        label: variant.label,
        icon: variant.icon,
      })),
    [],
  );

  const variant = getResumeVariant(activeId) ?? resumeVariants[0];
  if (!variant) return null;

  const pdf = variant.files?.pdf;
  const docx = variant.files?.docx;
  const hasDownload = Boolean(pdf ?? docx);

  const onDownload = (format: "pdf" | "docx") => {
    trackEvent("resume_download", { variant: variant.id, format });
  };

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      {/* ------------------------------------------------ variant selector -- */}
      <div className="flex flex-col gap-5">
        <Tabs
          tabs={tabs}
          activeId={activeId}
          onSelect={onSelect}
          label="Résumé version"
          idPrefix={idPrefix}
        />

        <p className="max-w-2xl text-sm leading-relaxed text-muted" aria-live="polite">
          {variant.positioning}
        </p>
      </div>

      <div
        role="tabpanel"
        id={`${idPrefix}-panel-${activeId}`}
        aria-labelledby={`${idPrefix}-tab-${activeId}`}
        className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:gap-10"
      >
        {/* --------------------------------------------------------- preview -- */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={variant.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: DURATION.normal, ease: ease.outQuint }}
          >
            <ResumePreview variant={variant} />
          </motion.div>
        </AnimatePresence>

        {/* --------------------------------------------------------- sidebar -- */}
        <div className="flex flex-col gap-6">
          {/* Downloads */}
          <GlassCard padding="lg" radius="3xl" surface="elevated" glow={false}>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl",
                    "border border-primary/30 bg-primary/12 text-primary",
                  )}
                >
                  <FileText className="size-4" />
                </span>

                <div className="flex flex-col gap-0.5">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    Download
                  </h3>
                  <p className="text-xs text-subtle">
                    {variant.label} version · one page
                  </p>
                </div>
              </div>

              {hasDownload ? (
                <div className="flex flex-col gap-2.5">
                  {pdf ? (
                    <Button asChild fullWidth onClick={() => onDownload("pdf")}>
                      <a href={pdf} download>
                        <Download aria-hidden="true" className="size-4" />
                        PDF
                      </a>
                    </Button>
                  ) : null}

                  {docx ? (
                    <Button
                      asChild
                      variant="secondary"
                      fullWidth
                      onClick={() => onDownload("docx")}
                    >
                      <a href={docx} download>
                        <Download aria-hidden="true" className="size-4" />
                        DOCX
                      </a>
                    </Button>
                  ) : (
                    <p className="text-2xs leading-relaxed text-subtle">
                      DOCX is not exported yet. Some older trackers parse it more reliably —
                      it is on the list.
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Badge tone="warning" size="sm" className="w-fit">
                    Not published yet
                  </Badge>

                  <p className="text-sm leading-relaxed text-muted">
                    Rather than hand you a broken download, the full document is rendered
                    beside this — it is the same content, and it reads better on a phone.
                  </p>

                  <Button asChild variant="secondary" fullWidth>
                    <a
                      href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(
                        `Résumé request — ${variant.label}`,
                      )}`}
                    >
                      <Mail aria-hidden="true" className="size-4" />
                      Request the PDF
                    </a>
                  </Button>
                </div>
              )}

              <p className="text-2xs leading-relaxed text-subtle">
                Downloads are counted anonymously — variant and format only, never who.
              </p>
            </div>
          </GlassCard>

          {/* Summary */}
          <GlassCard padding="lg" radius="3xl" glow={false}>
            <dl className="grid grid-cols-2 gap-5">
              {[
                { label: "Current role", value: resumeSummary.role },
                { label: "At", value: resumeSummary.company },
                { label: "Positions", value: String(resumeSummary.positions) },
                { label: "Projects", value: String(resumeSummary.projectCount) },
                {
                  label: "Technologies",
                  value: String(resumeSummary.technologyCount),
                },
                { label: "Core stack", value: String(resumeSummary.coreStack.length) },
              ].map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1">
                  <dt className="font-mono text-2xs tracking-widest text-subtle uppercase">
                    {fact.label}
                  </dt>
                  <dd className="text-sm leading-snug font-semibold text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </GlassCard>

          <AtsPanel />

          {/* Revisions */}
          <GlassCard padding="lg" radius="3xl" glow={false}>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl",
                    "border border-border bg-elevated text-muted",
                  )}
                >
                  <History className="size-4" />
                </span>

                <div className="flex flex-col gap-0.5">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    Revision history
                  </h3>
                  <p className="text-xs text-subtle">
                    Published, because a changelog is a commitment to keep it current
                  </p>
                </div>
              </div>

              <ol className="flex flex-col gap-4">
                {resumeRevisions.map((revision) => (
                  <li key={revision.version} className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="font-mono text-xs font-medium text-foreground">
                        {revision.version}
                      </p>
                      <time
                        dateTime={toIsoDate(revision.date)}
                        className="font-mono text-2xs text-subtle"
                      >
                        {formatShortDate(revision.date)}
                      </time>
                      {revision.variants.includes(variant.id) ? (
                        <Badge tone="primary" size="sm">
                          This version
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-xs leading-relaxed text-muted">
                      {revision.summary}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
