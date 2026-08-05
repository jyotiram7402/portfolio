import { Building2, GraduationCap } from "lucide-react";

import { Divider } from "@/components/ui/divider";
import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { resumeSummary } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { ResumeVariant } from "@/types/hiring";
import { getHostname } from "@/utils/url";

export interface ResumePreviewProps {
  variant: ResumeVariant;
  className?: string;
}

/**
 * The résumé, rendered as HTML.
 *
 * Not an embedded PDF, and that is the interesting decision. A PDF `<iframe>` needs the file to
 * exist, ships a plugin-rendered document that cannot be styled, is unreadable on a phone, and is
 * effectively invisible to a screen reader. This is real markup: it reflows, it inherits the
 * theme, it is selectable and searchable, and it is indexable.
 *
 * When `variant.files.pdf` lands, the download button appears alongside this — the preview does
 * not get replaced by an embed. A reader who wants the file downloads it; a reader who wants the
 * content already has it.
 *
 * Every figure is derived from the same modules the rest of the site renders, so the preview
 * cannot claim a different project count from the projects section.
 *
 * A Server Component — nothing here is interactive.
 */
export function ResumePreview({ variant, className }: ResumePreviewProps) {
  const github = socialConfig.links.find((link) => link.id === "github");
  const linkedin = socialConfig.links.find((link) => link.id === "linkedin");

  const work = experience.filter((entry) => entry.kind === "work");
  const education = experience.filter((entry) => entry.kind === "education");

  // Ordered by how well each project serves this variant's audience, so the AI résumé
  // leads with the retrieval work and the backend one with payments.
  const relevantProjects = projects
    .filter((project) =>
      variant.id === "ai"
        ? project.domains.includes("ai")
        : variant.id === "full-stack"
          ? true
          : project.domains.includes("backend") || project.domains.includes("java"),
    )
    .slice(0, 4);

  return (
    <article
      // Mirrors an A4 measure so the on-screen document reads like the printed one.
      className={cn(
        "flex flex-col gap-8 rounded-2xl border border-border bg-card p-7 sm:p-10",
        className,
      )}
    >
      {/* ------------------------------------------------------------ header -- */}
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            {siteConfig.name}
          </h3>
          <p className="font-mono text-2xs tracking-widest text-subtle uppercase">
            {variant.label} résumé
          </p>
        </div>

        {/* The résumé's own header line, which is denser than the site's role label. */}
        <p className="text-sm font-medium text-primary">{siteConfig.roleLine}</p>

        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <li>{siteConfig.email}</li>
          <li>{siteConfig.phone}</li>
          <li>{siteConfig.location}</li>
          {github ? <li>{getHostname(github.href)}/{github.handle}</li> : null}
          {linkedin ? <li>{getHostname(linkedin.href)}/in/{linkedin.handle}</li> : null}
        </ul>
      </header>

      <Divider />

      {/* ----------------------------------------------------------- profile -- */}
      <section className="flex flex-col gap-3">
        <h4 className="eyebrow">Profile</h4>
        <p className="text-sm leading-relaxed text-muted">{variant.positioning}</p>
        <ul className="flex flex-col gap-2">
          {variant.emphasis.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
              <span
                aria-hidden="true"
                className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/70"
              />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------- stack -- */}
      <section className="flex flex-col gap-3">
        <h4 className="eyebrow">Core stack</h4>
        {/* A comma-separated list, not a grid of rating bars — this is one of the ATS
            checks the panel below claims to pass. */}
        <p className="text-sm leading-relaxed text-foreground">
          {variant.headlineStack.join(" · ")}
        </p>
        <p className="text-xs leading-relaxed text-subtle">
          Also working with {resumeSummary.coreStack.length} core technologies across{" "}
          {resumeSummary.categoryCount} areas — the full list is on the skills section of the
          site.
        </p>
      </section>

      {/* -------------------------------------------------------- experience -- */}
      <section className="flex flex-col gap-5">
        <h4 className="eyebrow">Experience</h4>

        {work.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Building2 aria-hidden="true" className="size-3.5 text-subtle" />
                {entry.role} — {entry.company}
              </p>
              <p className="font-mono text-2xs text-subtle">{entry.period}</p>
            </div>

            <p className="text-sm leading-relaxed text-muted">{entry.summary}</p>

            <ul className="flex flex-col gap-1.5">
              {entry.achievements.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm leading-relaxed text-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1 shrink-0 rounded-full bg-border-strong"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* ---------------------------------------------------------- projects -- */}
      <section className="flex flex-col gap-4">
        <h4 className="eyebrow">Selected projects</h4>

        {relevantProjects.map((project) => (
          <div key={project.id} className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <p className="text-sm font-semibold text-foreground">{project.name}</p>
              <p className="font-mono text-2xs text-subtle">{project.period}</p>
            </div>
            <p className="text-sm leading-relaxed text-muted">{project.tagline}</p>
            <p className="font-mono text-2xs text-subtle">
              {project.stack.slice(0, 6).join(", ")}
            </p>
          </div>
        ))}
      </section>

      {/* --------------------------------------------------------- education -- */}
      {education.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h4 className="eyebrow">Education</h4>

          {education.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <GraduationCap aria-hidden="true" className="size-3.5 text-subtle" />
                {entry.role}
              </p>
              <p className="font-mono text-2xs text-subtle">{entry.period}</p>
            </div>
          ))}
        </section>
      ) : null}
    </article>
  );
}
