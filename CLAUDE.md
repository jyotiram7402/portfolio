# CLAUDE.md

## Overview
- Personal portfolio of Jyotiram Kamble, Java backend engineer (Pune), aimed at recruiters and hiring managers.
- Homepage, project case studies, certifications, MDX blog, résumé, recruiter summary, contact form, and an on-site assistant that answers from local data (no LLM).
- Live: https://portfolio-one-smoky-84.vercel.app · Repo: https://github.com/jyotiram7402/portfolio · Hosted on Vercel, which builds every push to `main` (per the owner; there is no `vercel.json`).

## Tech stack
- Next.js 15 App Router (`next ^15.1.6`), React 19, TypeScript 5.7 strict + `noUncheckedIndexedAccess`. Node 24 (`.nvmrc`, `engines`). npm.
- Tailwind CSS v4 through `@tailwindcss/postcss`; there is no `tailwind.config` — the theme lives in `styles/tokens.css` (`@theme`) and `styles/themes.css`.
- framer-motion 12, lenis 1 (smooth scroll), Radix Dialog / Tooltip / Slot, next-themes, cva + clsx + tailwind-merge 3, lucide-react.
- MDX through `@next/mdx` with remark-gfm, rehype-slug, rehype-autolink-headings and rehype-pretty-code/Shiki (highlighting at build time).
- zod 3 (env and form schemas), @emailjs/browser, @vercel/analytics + speed-insights. Fonts via `next/font`: Geist, Inter, JetBrains Mono (`lib/fonts.ts`).
- `gsap` is a dependency but never imported (`animations/gsap.ts` is dead code; the README's Motion section overstates it).

## Setup on a fresh machine
- Prerequisites: Node 24 (`nvm use`), npm, git. No database or Docker is needed to run the site.
- `npm install` — no lockfile is committed, so this creates `package-lock.json`. Commit it: it fixes CI (see Gotchas).
- `cp .env.example .env.local` — every variable is optional; the site runs with none set.
- `npm run dev` → http://localhost:3000. The service worker only runs in production: test it with `npm run preview`.
- On the owner's old Southco laptop, running npm was not permitted (2026-11). The workflow was: edit → push to `main` → Vercel builds → check the live URL with Playwright. Confirm whether that still applies.

## Commands
- Install: `npm install` (CI uses `npm ci`, which needs `package-lock.json`).
- Dev: `npm run dev` · Build: `npm run build` · Serve the build: `npm run start` · Build and serve: `npm run preview`.
- All checks (what CI runs): `npm run check` = `npm run typecheck` (`tsc --noEmit`) + `npm run lint` (`next lint`) + `npm run format:check`.
- Format: `npm run format` (Prettier with Tailwind class sorting).
- Tests: none — there is no test runner and no test file, so no single-test command either. Verify UI with Playwright against the deployed site.
- DB migrations: none (no database).
- Deploy: push to `main` (Vercel builds it). Roll back: Vercel → Deployments → Promote to Production. Details: `docs/DEPLOYMENT.md`.

## Project map
Read `docs/ARCHITECTURE.md` (route table, slices, services, data flows) before a change that crosses layers.
- Layers, imports flowing one way: `app → features → components → hooks → lib/utils → config/constants`.
- `app/` — routes `/`, `/projects`, `/projects/[slug]`, `/certifications`, `/blog`, `/blog/[slug]`, `/contact`, `/resume`, `/recruiters`, `/offline`. API: `app/api/{contact,newsletter,github,revalidate,chat}/route.ts`. Generated OG/Twitter images, icons, manifest, robots, sitemap.
- `app/layout.tsx` → `components/providers/app-providers.tsx` (theme → tooltips → Lenis → command palette) → `components/layout/site-shell.tsx` (preloader, navbar, `<main>` inside `PageTransition`, footer, floating search/chat buttons, back-to-top, service worker).
- `app/page.tsx` — the homepage: `features/*` sections in reading order.
- `features/<slice>/` — 18 vertical slices, each exposing one `index.ts`.
- `components/{ui,layout,animation,common,providers,icons}` — shared and domain-agnostic.
- `data/*.ts` — typed content (projects, certifications, experience, skills, blog registry, `data/ai/` assistant knowledge). `content/blog/*.mdx` — article bodies.
- `services/` — I/O returning `ServiceResult<T>` (`types/api.ts`): GitHub, project discovery, contact/email, newsletter, AI engine, blog content.
- `config/` — identity and behaviour (`site.ts`, `social.ts`, `projects.ts`, `seo.ts`, `navigation.ts`, `animations.ts`, `theme.ts`). `constants/` — `ROUTES`, section ids, z-index, storage keys.
- `lib/` — `env.ts` / `env.server.ts`, `metadata.ts`, `structured-data.ts`, `search-index.ts`, `rate-limit.ts`, `fonts.ts`, `utils.ts` (`cn`).
- `styles/globals.css` imports the token, theme, base, utility, prose and code CSS. `public/` — certificates, portrait, icons, `sw.js`.
- Project data flow: `config/projects.ts` → `services/github.service.ts` (1 h cache) → `services/projects.service.ts` (repos tagged `portfolio-project`, else curated `data/projects.ts` + `data/project-overrides.ts`) → homepage and `/projects` pages.

## Where to start
- Name, role, email, socials, hero copy: `config/site.ts`, `config/social.ts`, `data/profile.ts`.
- Add a project: an entry in `data/projects.ts` (array order = homepage order). Cover: an SVG scene in `features/projects/components/project-art.tsx` keyed by slug, or `public/projects/<slug>.webp` + `image` (see `public/projects/README.md`).
- Add a certificate: the file in `public/certificates/` named by slug, plus an entry in `data/certifications.ts` (see `public/certificates/README.md`).
- Add a blog post: `content/blog/<slug>.mdx` + its import in `content/blog/loaders.ts` + the slug in `content/blog/index.ts` + metadata in `data/blog.ts`.
- Add a homepage section: a new `features/<name>/` with `index.ts`, its id in `constants/sections.ts`, then render it in `app/page.tsx`.
- Add a page: `app/<route>/page.tsx` exporting `metadata = buildMetadata({ path })` (`lib/metadata.ts`), then add it to `ROUTES` and `IMPLEMENTED_ROUTES` in `constants/routes.ts` (navigation and sitemap read those).
- Add an API endpoint: follow `app/api/contact/route.ts` — zod schema in `services/*.schema.ts`, `lib/rate-limit.ts`, and a 501 `not_configured` response when its env vars are missing.
- Add an env var: `lib/env.ts` (public, zod) or `lib/env.server.ts` (secret), plus `.env.example` and this file.
- Assistant answers: `data/ai/*`; engine `services/ai.service.ts`; UI `features/ai-assistant/`.
- New third-party script or API origin: add it to the CSP in `next.config.mjs` (never widen a directive to `https:`).

## Conventions
- Import a slice only through `@/features/<slice>`; features never import each other. Existing exceptions: `app/projects/*` deep-imports `features/projects/components/*`, and `features/blog/components/post-footer.tsx` imports from `features/newsletter`.
- Server Components by default; `"use client"` only on the leaf that needs state or effects.
- `data/` entries that hold Lucide icon components cannot cross the server→client boundary, so client components import `data/` directly instead of receiving it as props.
- Absolute imports through `@/`. ESLint asks for `import type` (inline style) for type-only imports.
- Style with semantic tokens (`bg-card`, `text-muted`, `border-border`) — no hex values in components. Custom utilities are `@utility` blocks in `styles/utilities.css`.
- Merge classes with `cn()` (`lib/utils.ts`); build variants with `cva`.
- No string literals for paths or keys: `ROUTES` (`constants/routes.ts`), section ids (`constants/sections.ts`), storage keys (`constants/storage-keys.ts`, namespaced `portfolio:v1:*`).
- Every integration degrades instead of failing: API routes return 501 `not_configured`, and the UI falls back (contact: `/api/contact` → EmailJS → mailto; the newsletter reports `pending`).
- Services return `ServiceResult<T>` (`{ ok: true; data } | { ok: false; error: ServiceError }`) instead of throwing.
- Motion vocabulary lives in `config/animations.ts`; respect `useReducedMotion` / `useMotionVariants`.
- Files open with a doc comment explaining *why* a decision was made. Keep that style when editing.
- Prettier: 88 columns, double quotes, trailing commas, LF. Commit subjects are short, often prefixed `fix:`, `feat:`, `content:` or `chore:`.

## Env variables & external services
All optional; template in `.env.example`. Real values live in Vercel → Project → Settings → Environment Variables (which ones are set there: unverified).
- `NEXT_PUBLIC_SITE_URL` — canonical origin. Leave it unset on Vercel (`next.config.mjs` falls back to `VERCEL_PROJECT_PRODUCTION_URL`); set it once there is a custom domain.
- `GITHUB_USERNAME`, `GITHUB_TOKEN` — project discovery and the GitHub dashboard. Token: GitHub → Settings → Developer settings → fine-grained token, read-only public repos.
- `REVALIDATE_SECRET` — guards `POST /api/revalidate`. Generate with `openssl rand -hex 32`.
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` — server-side contact delivery (Resend dashboard; the sender must be on a verified domain).
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` — client-side contact fallback (EmailJS dashboard).
- `NEXT_PUBLIC_CALENDLY_URL` — booking embed (a Calendly event link).
- `NEWSLETTER_API_KEY`, `NEWSLETTER_LIST_ID` — for a newsletter provider; none is wired yet.
- `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `NEXT_PUBLIC_CHAT_REMOTE` — the reserved LLM seam for the assistant; unused today.
- Analytics: `NEXT_PUBLIC_ENABLE_ANALYTICS` (master switch, on by default in production), `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_PLAUSIBLE_HOST`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` (`G-…`), `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` — each from its provider's dashboard.
- `NEXT_PUBLIC_ENABLE_PWA` — service worker (on by default in production). `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — Search Console token.
- Injected by Vercel, never set by hand: `VERCEL_ENV`, `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`.
- External services: Vercel (hosting, Analytics, Speed Insights), GitHub REST API, Resend, EmailJS, Calendly, Plausible / Clarity / GA4 / PostHog. No database.

## Gotchas
- **CI is red:** with no lockfile, `.github/workflows/ci.yml` fails at "Set up Node" on every push (`cache: npm` and `npm ci` need `package-lock.json`). Typecheck, lint and build never run in CI; only Vercel's build catches errors.
- **`cn()` drops custom classes:** tailwind-merge doesn't know `text-display`, treats it as a colour, and removes it when `text-foreground` follows — the live hero name renders at 16px. Same risk for `text-gradient*`, `bg-grid`, `bg-dots`, `border-gradient`. Fix it by extending tailwind-merge, not by reordering classes ad hoc.
- **Content is hidden until hydration:** `components/animation/page-transition.tsx` server-renders `<main>` at `opacity:0` (blank page without JS); the hero `TextReveal`/`Reveal` do the same. Don't add more server-hidden wrappers above the fold.
- The preloader (`components/common/preloader.tsx`) waits for `load` plus 900 ms, once per tab (sessionStorage `portfolio:v1:preloader-seen`).
- Drawer, modal and command palette animate with CSS keyframes keyed on `data-state` (`styles/utilities.css`). Don't move them back to Framer: Radix Presence waits for `animationend`.
- Dialog triggers are plain buttons, not `Dialog.Trigger`, so focus isn't restored on close (known bug).
- The z-index scale exists twice — `--z-*` in `styles/themes.css` and `constants/z-index.ts`. Keep them in sync; overlay (50) must stay below drawer (60).
- Canonical URL: `next.config.mjs` inlines `NEXT_PUBLIC_SITE_URL` from `VERCEL_PROJECT_PRODUCTION_URL`. Never fall back to `VERCEL_URL` first: it is per-deployment and guarded, and it broke canonical tags and `og:image` before.
- Read `NEXT_PUBLIC_*` member by member (`lib/env.ts`); destructuring `process.env` yields `undefined` in the browser.
- One empty or invalid `NEXT_PUBLIC_*` value fails the zod parse in `lib/env.ts` and silently drops *all* public vars (dev logs `[env] Invalid public environment variables`). `.env.example` keeps unset public vars commented out for that reason.
- `lib/env.server.ts` imports `server-only`; importing it from client code breaks the build.
- `app/projects/[slug]` sets `dynamicParams = false`: unknown slugs 404, and a new project needs a rebuild.
- `TextReveal` appends a trailing space to each line so the `<h1>` text reads correctly. Don't add `aria-hidden` duplicates instead — they double `textContent`.
- `content/blog/index.ts` must stay import-free (the client search index reads it); article imports belong in `loaders.ts`.
- Set `image` on a project or certificate only once the file is committed — `next/image` cannot fall back.
- The robots.txt disallow list comes from `seoConfig.excludedPaths` in `config/seo.ts`; it currently blocks `/opengraph-image` and `/twitter-image` (known bug).
- The `next/dynamic` sections in `app/page.tsx` are server-rendered and download at hydration, not on scroll.
- The service worker registers only in production; bump `VERSION` in `public/sw.js` to purge client caches.
- `next lint` covers only the dirs in `next.config.mjs` → `eslint.dirs`; `data/`, `constants/` and `types/` are not linted.
- Never submit the live contact form with real data — it sends a real email.
- Playwright MCP runs in Docker (`mcr.microsoft.com/playwright/mcp`, set up in Claude Desktop's config, not in this repo). Behind Southco's TLS inspection every HTTPS page fails with `ERR_CERT_AUTHORITY_INVALID`: use `browser_run_code_unsafe` with `browser.newContext({ ignoreHTTPSErrors: true })`, or add `--ignore-https-errors` to the MCP args. A service-worker "SSL certificate error" in the console is the same artefact.
- Measurement traps: a hidden in-app browser pane freezes animations (false "off-screen" bugs); a programmatic `.focus()` doesn't trigger `:focus-visible` (press Tab instead); resizing and reloading one tab caused artefacts. Reproduce in a fresh context before reporting a bug.

## Current status
- Live and stable on `main` at `142a8da`. A full UI/UX/performance audit of the live site was done on 2026-11-06; nothing from it is fixed yet. Backlog with evidence and files: `docs/AUDIT-2026-11.md`.
- Agreed workflow: one branch per issue group, each verified on the Vercel preview or live URL before merging.
- Planned branches, in order: `chore/lockfile-ci`, `fix/hero-name-size`, `perf/content-visible-before-js`, `perf/remove-preloader`, `a11y/dialog-focus-return`, `fix/ios-input-zoom` (all inputs are 14px), `seo/robots-og-favicon`, `perf/js-diet` (421 KB JS, TBT ≈ 1.7 s on mobile), `a11y/light-theme-contrast`, `ux/mobile-floating-buttons`, `ux/about-diagram-mobile`, `ux/homepage-length` (needs the owner's decision), `polish/typography-headings`.
- Open owner decisions: which homepage sections to cut or move (52 phone screens long), a curated entry for `veil`, tagging repos `portfolio-project`, the Magento and Marketing Intern certificates, the Forage programme names, and the "CTO vs IT Director" and "20 developers" claims.
- No TODO/FIXME markers in the code. The newsletter provider is unwired (`services/newsletter.service.ts`). `features/README.md` is stale (its slice table lacks `certifications`).

When you change commands, structure, env vars or conventions, update this file in the same commit.
