/** Narrow projections of the GitHub REST payloads — only the fields we render. */

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  topics: readonly string[];
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  isArchived: boolean;
  isFork: boolean;
  pushedAt: string;
  createdAt: string;
}

export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  publicRepos: number;
  followers: number;
  topLanguages: readonly LanguageUsage[];
}

export interface LanguageUsage {
  name: string;
  count: number;
  /** 0–1 share of the counted repositories. */
  share: number;
}
