import type {
  Certification,
  CertificationIssuer,
  CertificationTrack,
  IssuerMeta,
} from "@/types/certifications";

/**
 * Certifications.
 *
 * **Adding one is a two-step job.** Drop the image in `public/certificates/<slug>.webp`
 * (see the README there), then add an entry below with `image` pointing at it. Everything
 * else — the homepage strip, the library page, the issuer filter, the search index and the
 * viewer — reads from this array.
 *
 * Three rules, and they exist because a certificate is the most checkable claim on a
 * portfolio:
 *
 * 1. **`title` is exactly what the document says.** Not shortened, not improved. A
 *    recruiter comparing the card to the PDF must find the same words.
 * 2. **`summary` says what it covered, not what the course sold.** "Service decomposition
 *    and the Spring Cloud toolchain" is useful; "master microservices" is not.
 * 3. **`verifyUrl` only when it genuinely resolves.** A dead verification link is worse
 *    than none, because a reader who checks one and finds a 404 stops trusting the rest.
 *
 * The GeeksforGeeks entry was migrated out of `data/achievements.ts`, which used to carry
 * certificates as `certificate` and `course` kinds. They live here now so there is one
 * source of truth — the achievements section is for wins that have no document.
 *
 * **Every title, date, credential id and hour count below was read off the certificate
 * itself**, not from memory. That mattered: the pre-existing entry for the microservices
 * course carried credential id `UC-b8695f97`, which actually verifies *The Complete
 * JavaScript Course*. A recruiter clicking through would have found a different certificate
 * than the card claimed. The IDs are now the ones printed on each document.
 *
 * The six Udemy scans are the JPEGs extracted from their PDFs — a Udemy certificate PDF is a
 * single embedded image, so the JPEG is the document byte for byte, not a re-render. The two
 * Anthropic certificates are real text PDFs with no image to pull, so they ship as `file`
 * and render the generated cover; both carry a live Skilljar verification URL, which is the
 * stronger artefact anyway.
 */

export const ISSUER_META = {
  udemy: { label: "Udemy", accent: "#A435F0" },
  anthropic: { label: "Anthropic", accent: "#D97757" },
  geeksforgeeks: { label: "GeeksforGeeks", accent: "#2F8D46" },
  coursera: { label: "Coursera", accent: "#2A73CC" },
  linkedin: { label: "LinkedIn Learning", accent: "#0A66C2" },
  aws: { label: "AWS", accent: "#FF9900" },
  microsoft: { label: "Microsoft", accent: "#4F8FE8" },
  google: { label: "Google", accent: "#4285F4" },
  oracle: { label: "Oracle", accent: "#C74634" },
  hackerrank: { label: "HackerRank", accent: "#2EC866" },
  zensar: { label: "Zensar Technologies", accent: "#E4383C" },
  other: { label: "Other", accent: "#8E8E93" },
} as const satisfies Record<CertificationIssuer, IssuerMeta>;

/** Filter labels, in the order the library offers them — subject priority, not alphabetical. */
export const certificationTracks = [
  { id: "java", label: "Java" },
  { id: "spring", label: "Spring" },
  { id: "backend", label: "Backend" },
  { id: "ai", label: "AI" },
  { id: "cloud-devops", label: "Cloud & DevOps" },
  { id: "data", label: "Data" },
  { id: "frontend", label: "Frontend" },
  { id: "fundamentals", label: "Fundamentals" },
] as const satisfies readonly { id: CertificationTrack; label: string }[];

export const certifications: readonly Certification[] = [
  /* ---------------------------------------------------------------- Anthropic */
  {
    id: "anthropic-claude-code",
    slug: "anthropic-claude-code-in-action",
    title: "Claude Code in Action",
    issuer: "anthropic",
    issued: "Mar 2026",
    issuedAt: "2026-03-06",
    credentialId: "2gwsdm4i9d6k",
    verifyUrl: "https://verify.skilljar.com/c/2gwsdm4i9d6k",
    file: "/certificates/anthropic-claude-code-in-action.pdf",
    summary:
      "Anthropic's own course on agentic development with Claude Code. The direct credential behind the AI board work at Southco — I led the R&D on this tooling, presented it to the CTO, and it became the standard workflow for 20 developers.",
    tracks: ["ai"],
    skills: ["Claude Code", "Agentic AI", "Prompt Engineering", "MCP"],
    featured: true,
    order: 2,
  },
  {
    id: "anthropic-agent-skills",
    slug: "anthropic-intro-agent-skills",
    title: "Introduction to agent skills",
    issuer: "anthropic",
    issued: "Mar 2026",
    issuedAt: "2026-03-09",
    credentialId: "t55zmnkg56fw",
    verifyUrl: "https://verify.skilljar.com/c/t55zmnkg56fw",
    file: "/certificates/anthropic-intro-agent-skills.pdf",
    summary:
      "How agent skills are defined, scoped and invoked — the packaging layer that turns a prompt into something a team can reuse and review rather than retype.",
    tracks: ["ai"],
    skills: ["Agent Skills", "Claude Code", "Agentic AI"],
  },

  /* -------------------------------------------------------------------- Udemy */
  {
    id: "udemy-devops-aws",
    slug: "udemy-devops-aws-java",
    title: "Devops Tools and AWS for Java Microservice Developers",
    issuer: "udemy",
    issued: "Jan 2026",
    issuedAt: "2026-01-27",
    credentialId: "UC-7fcd83c6-9c2c-4bb4-9e09-62aeb4492372",
    verifyUrl:
      "https://www.udemy.com/certificate/UC-7fcd83c6-9c2c-4bb4-9e09-62aeb4492372/",
    image: "/certificates/udemy-devops-aws-java.jpg",
    hours: 20.5,
    summary:
      "Docker, CI/CD pipelines and AWS from a JVM developer's perspective rather than an operator's. The groundwork for the isolated DevContainer work that followed at Southco.",
    tracks: ["cloud-devops", "backend", "java"],
    skills: ["Docker", "CI/CD", "AWS", "Kubernetes", "Maven"],
    featured: true,
    order: 3,
  },
  {
    id: "udemy-git",
    slug: "udemy-git-for-beginners",
    title: "Git For Beginners",
    issuer: "udemy",
    issued: "Jun 2025",
    issuedAt: "2025-06-11",
    credentialId: "UC-cc79a70b-0f92-417c-bbe6-bff8cd25c4d0",
    verifyUrl:
      "https://www.udemy.com/certificate/UC-cc79a70b-0f92-417c-bbe6-bff8cd25c4d0/",
    image: "/certificates/udemy-git-for-beginners.jpg",
    hours: 3,
    summary:
      "Branching, merging and rebasing as a model rather than a set of commands — the difference between recovering from a bad merge and starting the clone again.",
    tracks: ["fundamentals"],
    skills: ["Git", "Version Control"],
  },
  {
    id: "udemy-docker-java",
    slug: "udemy-docker-for-java",
    title: "Docker for Java Developers",
    issuer: "udemy",
    issued: "Aug 2024",
    issuedAt: "2024-08-18",
    credentialId: "UC-f5736fb9-3437-49f6-bc47-92d2f97deeff",
    verifyUrl:
      "https://www.udemy.com/certificate/UC-f5736fb9-3437-49f6-bc47-92d2f97deeff/",
    image: "/certificates/udemy-docker-for-java.jpg",
    hours: 2,
    summary:
      "Containerising JVM services specifically — image layering, multi-stage builds and what actually belongs in a Java base image. Applied in the DevContainer that 20 developers now use.",
    tracks: ["cloud-devops", "java"],
    skills: ["Docker", "DevContainers", "Java"],
  },
  {
    id: "udemy-spring-microservices",
    slug: "udemy-spring-microservices",
    title: "Master Microservices with Spring Boot and Spring Cloud",
    issuer: "udemy",
    issued: "Feb 2024",
    issuedAt: "2024-02-15",
    credentialId: "UC-1ffaeab8-4182-4201-9736-db4be2a74331",
    verifyUrl:
      "https://www.udemy.com/certificate/UC-1ffaeab8-4182-4201-9736-db4be2a74331/",
    image: "/certificates/udemy-spring-microservices.jpg",
    hours: 25,
    summary:
      "Service decomposition, inter-service communication and the Spring Cloud toolchain — config server, service discovery and API gateway. Applied directly in the Foodies microservices backend.",
    tracks: ["java", "spring", "backend"],
    skills: ["Spring Boot", "Microservices", "REST API", "Spring Cloud"],
    featured: true,
    order: 1,
  },
  {
    id: "udemy-javascript",
    slug: "udemy-complete-javascript-course",
    title: "The Complete JavaScript Course 2023: From Zero to Expert!",
    issuer: "udemy",
    issued: "Nov 2023",
    issuedAt: "2023-11-01",
    credentialId: "UC-b8695f97-1df0-4f74-893c-b32fe23aa625",
    verifyUrl:
      "https://www.udemy.com/certificate/UC-b8695f97-1df0-4f74-893c-b32fe23aa625/",
    image: "/certificates/udemy-complete-javascript-course.jpg",
    hours: 68.5,
    summary:
      "The longest course on this list at 68.5 hours, and the one that made the JavaScript side genuinely mine rather than borrowed — closures, the event loop, prototypes and asynchronous behaviour as they actually work.",
    tracks: ["frontend"],
    skills: ["JavaScript", "Node.js", "HTML & CSS"],
  },
  {
    id: "udemy-java-beginners",
    slug: "udemy-java-programming-beginners",
    title: "Java Programming for Complete Beginners",
    issuer: "udemy",
    issued: "Nov 2023",
    issuedAt: "2023-11-01",
    credentialId: "UC-476c88f1-f822-46b4-844a-48a16e578708",
    verifyUrl:
      "https://www.udemy.com/certificate/UC-476c88f1-f822-46b4-844a-48a16e578708/",
    image: "/certificates/udemy-java-programming-beginners.jpg",
    hours: 38,
    summary:
      "Thirty-eight hours on the language itself, taken alongside the ProAzure internship — object-oriented design, collections, exceptions and generics, learned while writing Java on the server every day.",
    tracks: ["java", "fundamentals"],
    skills: ["Java", "OOP", "Collections", "Data Structures"],
  },

  /* ------------------------------------------------------------ No scan yet */
  {
    id: "gfg-java-backend",
    slug: "gfg-java-backend-developer",
    title: "Certified Java Backend Developer",
    issuer: "geeksforgeeks",
    issued: "2024",
    issuedAt: "2024-04-01",
    summary:
      "Core Java, Spring Boot, REST API design and persistence, assessed by building rather than by multiple choice.",
    tracks: ["java", "spring", "backend"],
    skills: ["Java", "Spring Boot", "REST API", "Hibernate & JPA"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Selectors                                                                 */
/* -------------------------------------------------------------------------- */

/** Newest first. The comparison is on `issuedAt`; `issued` is display only. */
function byNewest(a: Certification, b: Certification): number {
  return b.issuedAt.localeCompare(a.issuedAt);
}

/**
 * Homepage ordering: explicit `order` first, then newest.
 *
 * `order` and `featured` are separate on purpose — `featured` says "good enough to show",
 * `order` says "show this one first", and only a person can decide the second.
 */
function byOrderThenNewest(a: Certification, b: Certification): number {
  if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
  if (a.order !== undefined) return -1;
  if (b.order !== undefined) return 1;
  return byNewest(a, b);
}

/** How many the homepage strip shows. A strip, not a library. */
export const HOMEPAGE_CERTIFICATION_COUNT = 3;

export function getFeaturedCertifications(
  limit: number = HOMEPAGE_CERTIFICATION_COUNT,
): readonly Certification[] {
  return certifications
    .filter((entry) => entry.featured === true)
    .toSorted(byOrderThenNewest)
    .slice(0, limit);
}

/** The full library, newest first. */
export const certificationsByDate: readonly Certification[] =
  certifications.toSorted(byNewest);

export function getCertification(slug: string): Certification | undefined {
  const wanted = slug.toLowerCase();
  return certifications.find(
    (entry) => entry.slug.toLowerCase() === wanted || entry.id.toLowerCase() === wanted,
  );
}

/**
 * Issuers that actually have entries, with their counts.
 *
 * Derived rather than listed, so an issuer with nothing filed under it is never offered as
 * a filter — the same rule the project and achievement filters follow.
 */
export function getIssuerCounts(): readonly {
  id: CertificationIssuer;
  label: string;
  count: number;
}[] {
  const counts = new Map<CertificationIssuer, number>();
  for (const entry of certifications) {
    counts.set(entry.issuer, (counts.get(entry.issuer) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([id, count]) => ({ id, label: ISSUER_META[id].label, count }))
    .toSorted((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
