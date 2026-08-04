import {
  Activity,
  Clock,
  GitFork,
  Github,
  Star,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { githubService } from "@/services/github.service";
import { cn } from "@/lib/utils";
import { formatCompactNumber, formatRelativeTime } from "@/utils/format";
import type { GitHubRepository, GitHubStats } from "@/types/github";

/**
 * The live GitHub panel.
 *
 * A Server Component that calls the service directly, which is the right shape for three
 * reasons: the token never reaches the browser, the response is cached by Next's fetch
 * layer for an hour, and the whole panel costs the client bundle nothing.
 *
 * Failure is a first-class state, not an afterthought. GitHub is a third party with a rate
 * limit, and an unconfigured or throttled response renders an explanatory panel rather
 * than an empty grid or a thrown error. The section around this is wrapped in `Suspense`,
 * so a slow upstream delays this panel and nothing else on the page.
 *
 * Two figures are marked as placeholders because they cannot be obtained from the REST
 * API: the contribution graph needs the GraphQL API, and coding hours needs WakaTime.
 * Labelling them is more honest than rendering invented squares.
 */

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Star;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card/60 p-4">
      <span className="flex items-center gap-2 font-mono text-2xs tracking-widest text-subtle uppercase">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </span>
      <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </span>
      {hint ? <span className="text-2xs text-subtle">{hint}</span> : null}
    </div>
  );
}

function LanguageBars({ stats }: { stats: GitHubStats }) {
  if (stats.topLanguages.length === 0) {
    return (
      <p className="text-sm text-muted">
        No language data — the public repositories have no detected language yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* A single stacked bar rather than one bar per language: the useful comparison is
          proportion of the whole, which a stack shows and separate bars do not. */}
      <div
        className="flex h-2 w-full overflow-hidden rounded-full bg-input"
        role="img"
        aria-label={`Language distribution: ${stats.topLanguages
          .map((language) => `${language.name} ${Math.round(language.share * 100)}%`)
          .join(", ")}`}
      >
        {stats.topLanguages.map((language, index) => (
          <span
            key={language.name}
            className={cn(
              index === 0 && "bg-primary",
              index === 1 && "bg-secondary",
              index === 2 && "bg-accent",
              index === 3 && "bg-success",
              index >= 4 && "bg-border-strong",
            )}
            style={{ width: `${language.share * 100}%` }}
          />
        ))}
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {stats.topLanguages.map((language, index) => (
          <li key={language.name} className="flex items-center gap-2 text-xs text-muted">
            <span
              aria-hidden="true"
              className={cn(
                "size-2 rounded-full",
                index === 0 && "bg-primary",
                index === 1 && "bg-secondary",
                index === 2 && "bg-accent",
                index === 3 && "bg-success",
                index >= 4 && "bg-border-strong",
              )}
            />
            <span className="text-foreground">{language.name}</span>
            <span className="font-mono text-2xs text-subtle tabular-nums">
              {Math.round(language.share * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RepoCard({ repository }: { repository: GitHubRepository }) {
  return (
    <li>
      <a
        href={repository.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group/repo flex h-full flex-col gap-3 rounded-2xl border border-border",
          "bg-card/60 p-4 transition-colors duration-[var(--duration-normal)]",
          "hover:border-primary/40 focus-ring",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <h4 className="truncate font-mono text-sm font-medium text-foreground">
            {repository.name}
          </h4>
          {repository.language ? (
            <Badge tone="default" size="sm" className="shrink-0">
              {repository.language}
            </Badge>
          ) : null}
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted">
          {repository.description ?? "No description."}
        </p>

        <div className="mt-auto flex items-center gap-4 font-mono text-2xs text-subtle">
          <span className="flex items-center gap-1">
            <Star aria-hidden="true" className="size-3" />
            {formatCompactNumber(repository.stars)}
          </span>
          <span className="flex items-center gap-1">
            <GitFork aria-hidden="true" className="size-3" />
            {formatCompactNumber(repository.forks)}
          </span>
          <span className="ml-auto">{formatRelativeTime(repository.pushedAt)}</span>
        </div>

        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </li>
  );
}

function UnavailablePanel({ reason }: { reason: string }) {
  return (
    <GlassCard padding="lg" radius="3xl" glow={false} className="flex flex-col gap-4">
      <span
        aria-hidden="true"
        className={cn(
          "grid size-11 place-items-center rounded-xl",
          "border border-border bg-elevated text-subtle",
        )}
      >
        <Github className="size-5" />
      </span>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Live data is not connected
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-muted">{reason}</p>
      </div>

      <p className="font-mono text-2xs leading-relaxed text-subtle">
        Set <span className="text-muted">GITHUB_USERNAME</span> — and optionally{" "}
        <span className="text-muted">GITHUB_TOKEN</span> to raise the rate limit from 60 to
        5,000 requests an hour — then redeploy.
      </p>
    </GlassCard>
  );
}

export async function GithubDashboard() {
  const [statsResult, reposResult] = await Promise.all([
    githubService.getStats(),
    githubService.getRepositories({ limit: 6, sort: "stars" }),
  ]);

  if (!statsResult.ok) {
    return (
      <UnavailablePanel
        reason={
          statsResult.error.code === "not_configured"
            ? "The GitHub integration is wired and waiting for credentials. Nothing here is faked in the meantime — the panel simply says so."
            : `GitHub responded with an error: ${statsResult.error.message} The rest of the page is unaffected.`
        }
      />
    );
  }

  const stats = statsResult.data;
  const repositories = reposResult.ok ? reposResult.data : [];

  return (
    <div className="flex flex-col gap-6">
      {/* ------------------------------------------------------------- tiles -- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={Star}
          label="Stars"
          value={formatCompactNumber(stats.totalStars)}
          hint="Across public repositories"
        />
        <StatTile
          icon={GitFork}
          label="Forks"
          value={formatCompactNumber(stats.totalForks)}
        />
        <StatTile
          icon={Github}
          label="Repositories"
          value={formatCompactNumber(stats.publicRepos)}
          hint="Public"
        />
        <StatTile
          icon={Users}
          label="Followers"
          value={formatCompactNumber(stats.followers)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[7fr_5fr]">
        {/* ---------------------------------------------------- repositories -- */}
        <div className="flex flex-col gap-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Most-starred repositories
            </h3>
            <span className="font-mono text-2xs text-subtle">
              {repositories.length} shown
            </span>
          </div>

          {repositories.length === 0 ? (
            <p className="text-sm text-muted">
              No public repositories to show yet.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {repositories.map((repository) => (
                <RepoCard key={repository.id} repository={repository} />
              ))}
            </ul>
          )}
        </div>

        {/* -------------------------------------------------------- sidebar -- */}
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Top languages
            </h3>
            <LanguageBars stats={stats} />
          </section>

          {/* Explicitly labelled placeholders. Both need APIs this integration does
              not use, and inventing the data would be the one dishonest thing on
              the page. */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Contribution graph
              </h3>
              <Badge tone="warning" size="sm">
                Placeholder
              </Badge>
            </div>

            <div
              role="img"
              aria-label="Contribution graph placeholder — requires the GitHub GraphQL API"
              className="grid grid-cols-[repeat(26,minmax(0,1fr))] gap-1"
            >
              {Array.from({ length: 26 * 7 }, (_, index) => (
                <span
                  key={index}
                  className="aspect-square rounded-[2px] bg-input opacity-60"
                />
              ))}
            </div>

            <p className="text-2xs leading-relaxed text-subtle">
              The contribution calendar is only available through GitHub&rsquo;s GraphQL
              API. The grid is drawn to reserve its exact space, so wiring it in later
              causes no layout shift.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                <Clock aria-hidden="true" className="size-3.5 text-subtle" />
                Coding hours
              </h3>
              <Badge tone="warning" size="sm">
                Placeholder
              </Badge>
            </div>
            <p className="text-2xs leading-relaxed text-subtle">
              Needs a WakaTime integration. Until that exists, no number is shown —
              a made-up figure here would be the easiest thing on the site to disprove.
            </p>
          </section>

          <p className="flex items-center gap-2 font-mono text-2xs text-subtle">
            <Activity aria-hidden="true" className="size-3" />
            Cached for one hour, served stale while revalidating.
          </p>
        </div>
      </div>
    </div>
  );
}
