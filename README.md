# Portfolio

A developer portfolio built on a deliberately thin foundation.

**Sprint 0** shipped the design system, layout shell, motion layer, SEO surface and
service boundaries. **Sprint 1** shipped the landing page: hero, statistics, about,
experience and the skills explorer. **Sprint 3** turned it into a platform — an AI
assistant, an MDX blog, a learning roadmap, achievements, a live GitHub dashboard,
resources, speaking, a newsletter, and a ⌘K command palette over global search.
**Sprint 4** is the production release: the contact experience, a résumé centre, a
recruiter dashboard, PWA offline support, five-provider analytics, CSP and rate
limiting, and a deployment pipeline.

See [`features/README.md`](features/README.md) for slice-by-slice status and
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) to ship it.

**Deploys with an empty environment.** Every integration degrades to a documented
fallback rather than failing — the GitHub panel says it is not connected, the contact
form falls through EmailJS to a copyable mailto, the newsletter reports `pending`. Only
`NEXT_PUBLIC_SITE_URL` matters for a first deploy.

> **Note on Sprint 2.** It is not in this repository. The `projects` slice and
> `data/projects.ts` were backfilled during Sprint 3, because the assistant, the
> command palette and global search all index projects. The shape is final; the
> entries are content to expand.

Dark-first. Performance-first. Accessible by construction.

---

## Getting started

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

The site runs with an empty `.env.local` — every variable is optional and its
absence degrades one feature rather than breaking the build.

| Script                 | Does                                            |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Dev server on `http://localhost:3000`           |
| `npm run build`        | Production build                                |
| `npm run start`        | Serve the production build                      |
| `npm run preview`      | Build then serve — the only way to test the PWA |
| `npm run check`        | Typecheck, lint and format check — what CI runs |
| `npm run typecheck`    | `tsc --noEmit`, strict                          |
| `npm run lint`         | ESLint via `next lint`                          |
| `npm run format`       | Prettier, including Tailwind class ordering     |

The service worker only registers in production, so offline behaviour is not testable
against `npm run dev`. Use `npm run preview`.

---

## Where things live

```
app/          Routes, metadata, generated images, API handlers
components/   Reusable and domain-agnostic
  ui/           Primitives (Button, GlassCard, Modal, …)
  layout/       Page frame (Navbar, Footer, Container, Section, SiteShell)
  animation/    Motion wrappers (Reveal, AnimatedText, TiltCard, …)
  common/       Cross-cutting (Preloader, SkipLink, Analytics, FloatingActions)
  icons/        Brand mark and hand-drawn glyphs
  providers/    Client-side context (theme, Lenis, tooltips)
features/     Vertical slices — hero, stats, about, experience, skills
              One public entry point each; see features/README.md
hooks/        Reusable behaviour
lib/          Framework-adjacent singletons (fonts, metadata, env, cn)
services/     External I/O, returning typed result envelopes
utils/        Pure functions
config/       Behaviour and identity the app reads
constants/    Fixed values (routes, breakpoints, z-index, storage keys)
data/         Typed content the UI renders
content/      Long-form MDX — see content/README.md
animations/   Variants, transitions, easings, GSAP bridge
styles/       Tokens, themes, base, utilities, prose
types/        Shared type surface
```

### The dependency rule

```
app → features → components → hooks → lib/utils → config/constants
```

Imports flow one way. `config/` and `constants/` depend on nothing but
`lib/env`; `components/` never imports from `features/`; `features/` never import
each other. Anything shared by two features moves down a layer.

---

## Design system

Tokens live in [`styles/`](styles) and are the only place a raw value is written.

- [`themes.css`](styles/themes.css) — semantic colour per theme, plus durations,
  z-layers and layout metrics. Dark is on `:root` so the first paint is dark.
- [`tokens.css`](styles/tokens.css) — the Tailwind theme. Colour is mapped
  `inline` (so `bg-card` compiles to `var(--card)` and retints at runtime);
  everything else is emitted as real custom properties so handwritten CSS can
  read it.
- [`base.css`](styles/base.css) — element defaults, focus, scrollbars, the Lenis
  stylesheet, and the global reduced-motion policy.
- [`utilities.css`](styles/utilities.css) — composable custom utilities
  (`glass`, `spotlight`, `bg-grid`, `mask-fade-b`, `focus-ring`, …).

Components reference roles, never hexes: `bg-card`, `text-muted`,
`border-border`. Retheming is a one-file edit.

### Typography

Geist for display and UI, Inter for body copy, JetBrains Mono for data. All
self-hosted and subset by `next/font`, so there is no third-party request and no
layout shift. The scale is fluid — `clamp()` between a 360px and a 1536px
viewport — so there are no per-breakpoint font-size overrides anywhere.

---

## Motion

Three libraries, with a strict division of labour:

| Library            | Owns                                    |
| ------------------ | --------------------------------------- |
| **Framer Motion**  | Component entrances, gestures, overlays |
| **GSAP**           | Scroll choreography (ScrollTrigger)     |
| **Lenis**          | The scroll position itself              |

Nothing animates the same property on the same element from two libraries.
ScrollTrigger reads Lenis's virtual offset through a scroller proxy
([`animations/gsap.ts`](animations/gsap.ts)), so scrubbed animations do not lag a
frame behind the content.

Vocabulary lives in [`config/animations.ts`](config/animations.ts) — named
durations, easings, springs and stagger values. The CSS `--ease-*` tokens are
byte-identical to the JS ones, so a CSS transition and a JS tween on the same
element cannot drift.

### Reduced motion

Handled in three places, deliberately redundant:

1. A global CSS rule collapses every animation and transition.
2. `useReducedMotion` gates each JS-driven effect.
3. `useMotionVariants` strips travel and scale from variants, keeping opacity.

Decorative layers marked `data-motion-decorative` are removed outright. Lenis and
the preloader never initialise at all.

---

## Performance

- **No decorative background and no custom cursor.** The page is a flat
  `--background`, the way apple.com is. That removed seven composited layers and
  took `three` out of the dependency tree entirely.
- **Pointer effects bypass React.** Glow, tilt and magnetic hover write to
  MotionValues or CSS custom properties. Hovering a grid of cards costs zero
  re-renders.
- **`useScroll` exposes discrete state only.** Booleans and a direction, not a
  pixel offset, so the header re-renders a handful of times per page.
- **Server Components by default.** `"use client"` is pushed to the leaf that
  needs it; the root layout mounts exactly one client boundary.

---

## Accessibility

- Skip link, one `<main>`, landmarks with accessible names.
- Split-text animations render the original string to a visually hidden span, so
  assistive tech reads a sentence rather than dozens of fragments.
- Dialogs and drawers are Radix-backed: focus trap, focus restore, escape,
  `aria-modal`, background inerting.
- Icon-only controls take a required `label` prop — enforced by the type system.
- State is never conveyed by colour alone: `aria-current`, `aria-pressed`,
  `aria-disabled`, `aria-busy`.
- Focus is always visible. Zoom is never disabled.

---

## SEO

`buildMetadata()` in [`lib/metadata.ts`](lib/metadata.ts) is the single entry
point, so canonical URL, OpenGraph, Twitter card and robots directives cannot be
forgotten per route.

- `sitemap.xml` is generated from `IMPLEMENTED_ROUTES`, so unshipped pages cannot
  leak into search.
- `robots.txt` disallows everything on Vercel preview deployments.
- OG and Twitter images are generated at build time from `config/site.ts`.
- JSON-LD (`Person` + `WebSite`) ships in the HTML.
- Icons and the web manifest come from file conventions; the app is PWA-ready.

---

## Deploying

Push to GitHub, import the repository on Vercel, and set the environment
variables from [`.env.example`](.env.example) — `NEXT_PUBLIC_SITE_URL` is the only
one that matters for a first deploy. Analytics and Speed Insights need no keys on
Vercel.

## Making it yours

Everything identity-related is in [`config/site.ts`](config/site.ts) and
[`config/social.ts`](config/social.ts): name, role, tagline, email, location and
handles. Start there.
