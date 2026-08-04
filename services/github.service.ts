import "server-only";

import { serverEnv } from "@/lib/env.server";
import { requestJson } from "@/services/api-client";
import type { ServiceResult } from "@/types/api";
import type {
  GitHubProfile,
  GitHubRepository,
  GitHubStats,
  LanguageUsage,
} from "@/types/github";

/**
 * GitHub REST integration.
 *
 * Server-only by construction — the token must never reach the browser, and the
 * `server-only` import turns any accidental client import into a build error.
 *
 * Responses are mapped into narrow domain types rather than passed through: the
 * UI should not be coupled to a third-party payload shape, and the mapping is
 * the one place a breaking API change has to be handled.
 */

const API_BASE = "https://api.github.com";

/** One hour. Star counts are not worth a cache miss on every request. */
const REVALIDATE_SECONDS = 3600;

const CACHE_TAG = "github";

function headers(): Record<string, string> {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(serverEnv.github.authenticated
      ? { Authorization: `Bearer ${serverEnv.github.token}` }
      : {}),
  };
}

function notConfigured<T>(): ServiceResult<T> {
  return {
    ok: false,
    error: {
      message: "GITHUB_USERNAME is not set.",
      code: "not_configured",
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Raw payload shapes — only the fields consumed below                       */
/* -------------------------------------------------------------------------- */

interface RawUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface RawRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  archived: boolean;
  fork: boolean;
  pushed_at: string;
  created_at: string;
}

function mapProfile(raw: RawUser): GitHubProfile {
  return {
    login: raw.login,
    name: raw.name,
    avatarUrl: raw.avatar_url,
    htmlUrl: raw.html_url,
    bio: raw.bio,
    company: raw.company,
    location: raw.location,
    blog: raw.blog,
    publicRepos: raw.public_repos,
    followers: raw.followers,
    following: raw.following,
    createdAt: raw.created_at,
  };
}

function mapRepository(raw: RawRepo): GitHubRepository {
  return {
    id: raw.id,
    name: raw.name,
    fullName: raw.full_name,
    description: raw.description,
    htmlUrl: raw.html_url,
    homepage: raw.homepage,
    language: raw.language,
    topics: raw.topics ?? [],
    stars: raw.stargazers_count,
    forks: raw.forks_count,
    watchers: raw.watchers_count,
    openIssues: raw.open_issues_count,
    isArchived: raw.archived,
    isFork: raw.fork,
    pushedAt: raw.pushed_at,
    createdAt: raw.created_at,
  };
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

export async function getProfile(): Promise<ServiceResult<GitHubProfile>> {
  if (!serverEnv.github.configured) return notConfigured();

  const result = await requestJson<RawUser>(
    `${API_BASE}/users/${serverEnv.github.username}`,
    { headers: headers(), revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] },
  );

  return result.ok ? { ok: true, data: mapProfile(result.data) } : result;
}

export interface GetRepositoriesOptions {
  /** Upper bound on returned repositories. The API caps a page at 100. */
  limit?: number;
  includeForks?: boolean;
  includeArchived?: boolean;
  sort?: "pushed" | "created" | "updated" | "stars";
}

export async function getRepositories(
  options: GetRepositoriesOptions = {},
): Promise<ServiceResult<GitHubRepository[]>> {
  if (!serverEnv.github.configured) return notConfigured();

  const {
    limit = 12,
    includeForks = false,
    includeArchived = false,
    sort = "pushed",
  } = options;

  // `stars` is not a valid API sort for this endpoint, so fetch by recency and
  // sort locally.
  const apiSort = sort === "stars" ? "pushed" : sort;
  const url = `${API_BASE}/users/${serverEnv.github.username}/repos?per_page=100&sort=${apiSort}&direction=desc`;

  const result = await requestJson<RawRepo[]>(url, {
    headers: headers(),
    revalidate: REVALIDATE_SECONDS,
    tags: [CACHE_TAG],
  });

  if (!result.ok) return result;

  const repositories = result.data
    .map(mapRepository)
    .filter((repo) => (includeForks ? true : !repo.isFork))
    .filter((repo) => (includeArchived ? true : !repo.isArchived));

  if (sort === "stars") {
    repositories.sort((a, b) => b.stars - a.stars);
  }

  return { ok: true, data: repositories.slice(0, limit) };
}

/** Aggregate figures, derived in one pass over the repository list. */
export async function getStats(): Promise<ServiceResult<GitHubStats>> {
  const [profile, repositories] = await Promise.all([
    getProfile(),
    getRepositories({ limit: 100, includeArchived: true }),
  ]);

  if (!profile.ok) return profile;
  if (!repositories.ok) return repositories;

  const languageCounts = new Map<string, number>();
  let totalStars = 0;
  let totalForks = 0;

  for (const repo of repositories.data) {
    totalStars += repo.stars;
    totalForks += repo.forks;
    if (repo.language) {
      languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
    }
  }

  const counted = [...languageCounts.values()].reduce((sum, n) => sum + n, 0);
  const topLanguages: LanguageUsage[] = [...languageCounts.entries()]
    .map(([name, count]) => ({
      name,
      count,
      share: counted === 0 ? 0 : count / counted,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    ok: true,
    data: {
      totalStars,
      totalForks,
      publicRepos: profile.data.publicRepos,
      followers: profile.data.followers,
      topLanguages,
    },
  };
}

export const githubService = {
  getProfile,
  getRepositories,
  getStats,
  cacheTag: CACHE_TAG,
} as const;
