# Architecture

The module map and data flows behind `CLAUDE.md`. Read this before a change that crosses more
than one layer, or when you need to know where something is rendered or fetched.

## Layering

```
app → features → components → hooks → lib / utils → config / constants
```

- Imports flow one way. `components/` never imports from `features/`, features never import each
  other, and other code reaches a slice only through `features/<slice>/index.ts`.
- Pre-existing exceptions: `app/projects/page.tsx` and `app/projects/[slug]/page.tsx` deep-import
  `@/features/projects/components/*`; `features/blog/components/post-footer.tsx` imports
  `SubscribeForm` from `@/features/newsletter`.
- `@/*` resolves to the repository root (`tsconfig.json`).

## Render pipeline

1. `app/layout.tsx` (Server Component) — `<html>` with the font variables from `lib/fonts.ts`,
   root metadata (`buildRootMetadata` in `lib/metadata.ts`), root JSON-LD
   (`lib/structured-data.ts`) and `components/common/analytics.tsx`.
2. `components/providers/app-providers.tsx` — the single client boundary: `ThemeProvider`
   (next-themes, `class` attribute, default `dark`, key `portfolio:theme`) → `TooltipProvider` →
   `LenisProvider` (smooth scroll; singleton in `lib/lenis-store.ts`) → `CommandPaletteProvider`.
3. `components/layout/site-shell.tsx` — `SkipLink`, `Preloader`, `ScrollProgress`, `Navbar`,
   `<main id="main-content">` wrapped in `PageTransition`, `Footer`, `FloatingActions` (search and
   chat buttons; the chat drawer lazy-loads `ChatPanel`), `BackToTop`, `ServiceWorker`,
   `InstallPrompt`.
4. Each `page.tsx` composes feature entry points. Pages are statically generated;
   `app/projects/[slug]` and `app/blog/[slug]` prerender through `generateStaticParams`.

## Routes

| Route | File | Renders | Reads |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | Hero + StatementBand, Stats, About, Experience, Projects, Assistant, Skills, Certifications, Writing, Roadmap\*, Achievements\*, GitHub, Resources\*, Speaking, Newsletter, Contact | `data/*`, `projectsService`, `githubService` |
| `/projects` | `app/projects/page.tsx` | `ProjectGrid` | `projectsService` |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | `ProjectDetail` (`dynamicParams = false`) | `projectsService`, `lib/project-selection.ts` |
| `/certifications` | `app/certifications/page.tsx` | `CertificationsLibrary` | `data/certifications.ts` |
| `/blog` | `app/blog/page.tsx` | `BlogBrowser` (client search/filter) | `services/content.service.ts` |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | `PostLayout`, `PostFooter` | `data/blog.ts`, `content/blog/*.mdx` |
| `/contact` | `app/contact/page.tsx` | `ContactExperience` | `data/contact.ts` |
| `/resume` | `app/resume/page.tsx` | `ResumeCenter` | `data/resume.ts` |
| `/recruiters` | `app/recruiters/page.tsx` | `RecruiterDashboard` | `data/recruiter.ts` |
| `/offline` | `app/offline/page.tsx` | Service-worker fallback, never linked or indexed | — |

\* Loaded with `next/dynamic` but still server-rendered, so their chunks download at hydration,
not on scroll.

File-convention routes: `opengraph-image.tsx`, `twitter-image.tsx`, `icon.tsx`, `apple-icon.tsx`,
`manifest.ts`, `robots.ts` (disallow list = `seoConfig.excludedPaths` in `config/seo.ts` +
`UNINDEXED_ROUTES`; Vercel previews disallow everything) and `sitemap.ts` (built from
`IMPLEMENTED_ROUTES` in `constants/routes.ts`).

## API routes (`app/api/*/route.ts`)

| Endpoint | Does | When its env vars are missing |
| --- | --- | --- |
| `POST /api/contact` | zod validation (`services/contact.schema.ts`), rate limit (`lib/rate-limit.ts`), delivery through Resend (`services/email.service.ts`) | 501 `not_configured`; the form falls back to EmailJS, then to a mailto |
| `POST /api/newsletter` | validation, honeypot, rate limit (`services/newsletter.service.ts`) | always answers `pending: true` — no provider is wired |
| `GET /api/github?type=profile\|repos\|stats` | cacheable GitHub projection; the token never reaches the browser | 501 |
| `POST /api/revalidate?secret=…` | drops the GitHub fetch cache so a newly tagged repo appears at once | 501 |
| `POST /api/chat` | NDJSON stream for `RemoteChatEngine`, currently backed by the local engine | unused while `NEXT_PUBLIC_CHAT_REMOTE` is false |

`/api/contact`, `/api/newsletter` and `/api/revalidate` set `runtime = "nodejs"`. The rate limiter
is a fixed window in module memory, so on Vercel it is per instance.

## Feature slices (`features/`)

| Slice | Contents |
| --- | --- |
| `hero` | `TextReveal` name heading, `AnimatedRoles`, `HeroPortrait`, CTAs, `StatementBand` |
| `stats` | counters; technology count derived from `data/skills.ts` |
| `about` | journey timeline, story cards, `system-diagram.tsx` (the payment-flow SVG) |
| `experience` | timeline from `data/experience.ts` |
| `projects` | grid, filters, `project-detail` case study, `project-art.tsx` (bespoke SVG cover per slug) |
| `ai-assistant` | chat UI (homepage section + drawer); engine in `services/ai.service.ts`, hook `hooks/use-chat.ts` |
| `skills` | category tabs with brand marks (`lib/tech-brand.ts`, `components/icons/tech-marks.tsx`) |
| `certifications` | homepage strip, library page, `certificate-card`, `certificate-cover`, viewer dialog |
| `blog` | listing, search, filter, post layout, TOC, share, related and adjacent posts |
| `roadmap`, `achievements`, `resources`, `speaking` | homepage sections, each from its `data/*.ts` |
| `github` | GitHub dashboard, server-rendered and Suspense-streamed |
| `newsletter` | subscribe form (validation, honeypot, timing check) |
| `contact` | channel cards, 7-field form, map panel, social grid |
| `resume` | résumé variants, HTML preview, ATS checklist, revision history |
| `recruiters` | one-screen hiring summary |

## Data and content

- `data/` — typed records the UI renders: `profile.ts` (hero lines, subtitle), `experience.ts`,
  `journey.ts`, `projects.ts` (curated list; array order is homepage order), `project-overrides.ts`
  (curation applied to discovered repos), `certifications.ts`, `skills.ts`, `blog.ts` (post
  registry; `draft: true` posts are hidden in production), `roadmap.ts`, `achievements.ts`,
  `resources.ts`, `speaking.ts`, `resume.ts`, `recruiter.ts`, `contact.ts`, and `data/ai/`
  (knowledge, responses, FAQ, prompt, conversation copy for the assistant).
- `types/` — the shared type surface for all of the above (`types/api.ts` holds `ServiceResult`).
- `content/blog/*.mdx` — article bodies. `content/blog/index.ts` lists slugs with no imports, because
  the client-side search index reads it; `content/blog/loaders.ts` maps each slug to a static
  dynamic import, reached only from `services/content.service.ts`, so compiled articles stay out of
  the client bundle. Element overrides: `mdx-components.tsx`. Typography: `styles/prose.css`.
- `public/certificates/` — scans and PDFs (rules in its README). `public/projects/` — optional real
  covers (README). `public/images/portrait.png` — hero portrait. `public/sw.js`, `public/icons/`.

## Services (`services/`)

- `github.service.ts` — GitHub REST calls with `next: { revalidate: 3600 }`; token from
  `lib/env.server.ts`.
- `projects.service.ts` (`server-only`) — resolution order: repos tagged `portfolio-project`
  (`config/projects.ts`) → most recently pushed repos (disabled: `fallbackToRecent: false`) → the
  curated `data/projects.ts`. `excludedRepos` are always hidden; `data/project-overrides.ts` wins
  over GitHub data.
- `contact.service.ts` — used by the contact form: `/api/contact` → EmailJS
  (`@emailjs/browser`) → composed mailto. `email.service.ts` — the Resend call behind the route.
- `newsletter.service.ts` — the provider seam; the commented-out call near its end marks where a
  provider goes.
- `ai.service.ts` — `ChatEngine` interface; `LocalKnowledgeEngine` ships, `RemoteChatEngine` is
  wired but unused; `createChatEngine({ remote })` picks one.
- `content.service.ts` — the blog read model (lists, search, related posts, body loading).
  `api-client.ts` — thin fetch wrapper with timeouts shared by the services.

## Cross-cutting concerns

- **Env** — `lib/env.ts` (zod-validated `NEXT_PUBLIC_*`, `siteUrl` resolution) and
  `lib/env.server.ts` (`server-only` secrets, `describeIntegrations()`). `next.config.mjs` inlines
  the canonical `NEXT_PUBLIC_SITE_URL` for both runtimes.
- **SEO** — `buildMetadata({ path })` in `lib/metadata.ts` for every route; JSON-LD from
  `lib/structured-data.ts` rendered by `components/common/structured-data.tsx`; `config/seo.ts`.
- **Search** — `lib/search-index.ts` feeds `components/common/command-palette.tsx`, opened by
  Ctrl/⌘+K, the header Search button or the floating search button (`hooks/use-command-palette.ts`).
- **Styling** — `styles/globals.css` imports `tailwindcss`, then `themes.css` (semantic colours per
  theme, durations, `--z-*` layers, layout metrics), `tokens.css` (Tailwind `@theme`), `base.css`,
  `utilities.css` (`@utility` customs and dialog keyframes), `prose.css`, `code.css` (Shiki light
  and dark themes switched by the `<html>` class).
- **Motion** — `config/animations.ts` (durations, easings, `PRELOADER`), `animations/variants.ts`,
  `components/animation/*` (`Reveal`, `TextReveal`, `AnimatedText`, `AnimatedHeading`,
  `PageTransition`, `Magnetic`, `Parallax`), `hooks/use-reduced-motion.ts`,
  `hooks/use-motion-variants.ts`.
- **Dialogs** — `components/ui/drawer.tsx`, `components/ui/modal.tsx` and the command palette are
  Radix Dialog, animated by CSS keyframes keyed on `data-state` in `styles/utilities.css`.
- **PWA** — `public/sw.js` (network-first documents, cache-first hashed assets,
  stale-while-revalidate media; bump `VERSION` to purge caches), registered in production only by
  `components/common/service-worker.tsx`; fallback page `app/offline/page.tsx`.
- **Analytics** — `components/common/analytics.tsx` (Vercel Analytics + Speed Insights) and
  `components/analytics/provider-scripts.tsx` (Plausible, Clarity, GA4, PostHog when configured);
  `config/analytics.ts`, `lib/analytics.ts`.
- **Security** — CSP and the other security headers are built in `next.config.mjs`.
