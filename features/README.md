# `features/`

Vertical slices. Empty in Sprint 0 by design — there are no features yet, only a
foundation.

## The rule

`components/` holds things that are reusable and domain-agnostic: a button, a
card, a reveal wrapper. Nothing in `components/` knows what a "project" is.

`features/` holds things that are specific and self-contained. A feature owns its
components, hooks, types and data access, and exposes one public entry point.

```
features/
  contact/
    components/
      contact-form.tsx        # composes components/ui primitives
      contact-form-field.tsx
    hooks/
      use-contact-form.ts     # local state, validation, submission
    types.ts
    index.ts                  # the only file other code imports from
  projects/
    components/
      project-card.tsx
      project-grid.tsx
      project-filter.tsx
    hooks/
      use-project-filter.ts
    index.ts
```

## Constraints that keep this honest

1. **One public entry point.** Other code imports `@/features/contact`, never
   `@/features/contact/components/contact-form-field`. Everything else is
   internal and free to be refactored.

2. **Features never import each other.** If two need the same thing, that thing
   belongs in `components/`, `hooks/` or `lib/`. A `features/a → features/b`
   import is the first step towards a dependency graph nobody can reason about.

3. **Pages compose, features implement.** A route in `app/` should read as a list
   of feature and layout components. If a page file contains business logic, that
   logic wanted to be a feature.

4. **Server-first.** A feature's entry point should be a Server Component unless
   it genuinely needs state. Push `"use client"` down to the leaf that needs it.

## Slices

| Slice          | Status   | Notes                                                                  |
| -------------- | -------- | ---------------------------------------------------------------------- |
| `hero`         | shipped  | Headline reveal, rotating roles, technology orbit, scroll cue           |
| `stats`        | shipped  | Scroll-triggered counters; technology count derived from `data/skills`  |
| `about`        | shipped  | Sticky journey timeline, story cards, capability grid                   |
| `experience`   | shipped  | Scroll-drawn timeline; `ExperienceCard` is exported for reuse           |
| `projects`     | shipped  | Filterable grid. **Sprint 2 backfill** — Sprint 3 needed it to index    |
| `ai-assistant` | shipped  | Streaming chat over a local knowledge base; engine swappable for an LLM |
| `skills`       | shipped  | Tab-list technology explorer, hover/focus/pin description reveal        |
| `blog`         | shipped  | Registry + MDX bodies, search, filter, TOC, share, related, prev/next   |
| `roadmap`      | shipped  | Three tracks, expandable nodes, derived progress                       |
| `achievements` | shipped  | Filterable by kind, honest about unverifiable entries                   |
| `github`       | shipped  | Server-rendered from the API, `Suspense`-streamed, labelled placeholders |
| `resources`    | shipped  | Eight groups behind a tab list                                         |
| `speaking`     | shipped  | Topics lead, history follows — built to look deliberate while thin      |
| `newsletter`   | shipped  | Validation, honeypot, timing check; provider seam left open             |
| `contact`      | shipped  | Channel cards, 7-field form, three transports, map panel, social grid   |
| `resume`       | shipped  | Three variants, HTML preview, ATS checklist, revision history           |
| `recruiters`   | shipped  | One-screen hiring summary with the caveats printed rather than buried   |

### Cross-slice sharing

Features never import each other. Where two need the same thing, it moves down a layer —
`BookingPanel` lives in `components/common/` for exactly that reason, because the contact
page and the recruiter dashboard both render it.

One violation predates this rule being enforced: `features/blog/components/post-footer.tsx`
imports `SubscribeForm` from `features/newsletter`. It is a Sprint 5 cleanup — move the form
to `components/common/` and both callers keep working.

### The AI assistant

The signature feature, and the one with the most architecture behind it. Its
knowledge layer lives in `data/ai/` and is composed from the same modules the page
renders, so it cannot contradict what a visitor is looking at.

The migration path to a real model is the shape of the whole thing:
`ChatEngine.stream()` returns an `AsyncIterable<ChatChunk>`, which is what a local
generator and an SSE endpoint both are. `LocalKnowledgeEngine` ships;
`RemoteChatEngine` and `/api/chat` already speak the protocol. Nothing above
`services/ai.service.ts` — not `useChat`, not one component — knows which is running.

### A note on icons

Entries in `data/` carry Lucide icon *components*. Those cannot cross a
server-to-client boundary as props, so a client component that renders them
imports its data directly rather than receiving it from a Server Component. That
is why `StatsBand`, `JourneyTimeline`, `StoryCards`, `HighlightGrid`,
`ExperienceTimeline` and `CategoryTabs` are clients that read `data/` themselves,
while the section wrappers around them stay on the server.
