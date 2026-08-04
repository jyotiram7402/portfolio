# Deployment

The site is built to deploy with an empty environment. Every integration degrades to a
documented fallback rather than failing, so the first deploy needs one variable and
nothing else.

---

## 1. Push to GitHub

```bash
git init
```

```bash
git add . && git commit -m "Portfolio: sprints 0-4"
```

```bash
git branch -M main && git remote add origin git@github.com:USERNAME/portfolio.git && git push -u origin main
```

`.gitignore` already excludes `.env*.local`, `.next`, `node_modules` and `.vercel`.
Verify nothing sensitive is staged before the first push:

```bash
git ls-files | grep -iE "\.env($|\.)" || echo "clean"
```

---

## 2. Deploy to Vercel (recommended)

Vercel is the assumed target: `@vercel/analytics` and `@vercel/speed-insights` need no
keys there, image optimisation is native, and preview deployments per pull request are
free.

1. **Import** the repository at [vercel.com/new](https://vercel.com/new). Framework
   preset, build command and output directory are all detected — change nothing.
2. **Set one variable** before the first build:

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |

   Everything else in [`.env.example`](../.env.example) is optional. Add integrations
   afterwards; each one only needs a redeploy.
3. **Deploy.** The first build should take two to four minutes.

### Node version

`.nvmrc` pins Node 22. Vercel reads it, and CI reads the same file, so the three
environments cannot drift.

---

## 3. Custom domain

1. Vercel → project → **Settings → Domains** → add the apex domain.
2. At your registrar, point the domain at Vercel:

   | Record | Name | Value |
   | --- | --- | --- |
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

3. Redirect `www` to the apex (or the reverse) in Vercel's domain settings — pick one
   and redirect the other, or the two compete in search results.
4. **Update `NEXT_PUBLIC_SITE_URL`** to the final domain and redeploy. Until you do,
   canonical URLs and OpenGraph images point at the `.vercel.app` origin.

HSTS is sent with `preload`, so the domain is eligible for the browser preload list once
it has been serving HTTPS for a while. Submit it at
[hstspreload.org](https://hstspreload.org) only when you are certain the domain will
stay on HTTPS — the entry is difficult to reverse.

---

## 4. Cloudflare (alternative)

Works, with two caveats worth knowing before you commit.

```bash
npm install --save-dev @cloudflare/next-on-pages
```

- **`next/image` optimisation does not run on Pages.** Either add Cloudflare Images or
  set `images.unoptimized = true` and serve pre-sized assets.
- **Route handlers need the edge runtime.** `/api/contact` and `/api/newsletter`
  currently declare `runtime = "nodejs"` because the rate limiter and the Resend call
  want a real runtime. On Pages, switch them to `edge` and move the limiter to
  Cloudflare KV — the swap is documented at the bottom of
  [`lib/rate-limit.ts`](../lib/rate-limit.ts).

If either matters, stay on Vercel.

---

## 5. Post-deploy checklist

Run through this once on the live domain.

### Correctness

- [ ] `/`, `/blog`, `/blog/[slug]`, `/contact`, `/resume`, `/recruiters` all render
- [ ] `/sitemap.xml` lists five pages plus three articles, and no `/offline`
- [ ] `/robots.txt` allows `/`, disallows `/api/` and `/offline`
- [ ] `/manifest.webmanifest` returns JSON with three shortcuts
- [ ] A deliberate 404 (`/nope`) shows the styled not-found page

### Headers

```bash
curl -sI https://your-domain.com | grep -iE "content-security|strict-transport|x-content-type|permissions-policy"
```

- [ ] `Content-Security-Policy` present
- [ ] `Strict-Transport-Security` present with `max-age=63072000`
- [ ] Open DevTools → Console on the home page: **zero CSP violations**

If a violation appears, an origin is missing from `connect-src` or `script-src` in
[`next.config.mjs`](../next.config.mjs). Add it there — never widen a directive to
`https:` to make a warning go away.

### PWA

- [ ] DevTools → Application → Service Workers: `sw.js` is **activated**
- [ ] DevTools → Network → offline, then reload a visited page — it loads
- [ ] Navigate to an unvisited page while offline — `/offline` renders
- [ ] Application → Manifest: no errors, icons resolve

The service worker only registers in production (`NEXT_PUBLIC_ENABLE_PWA`), so none of
this is testable against `npm run dev`. Use `npm run build && npm run start`.

### SEO

- [ ] [Rich Results Test](https://search.google.com/test/rich-results) on `/` —
      `Person`, `WebSite`, `ProfessionalService`, `FAQPage`, `ItemList`
- [ ] Same on an article — `BlogPosting` and `BreadcrumbList`
- [ ] Same on `/recruiters` — `ProfilePage` and `FAQPage`
- [ ] Paste the OG URL into the X and LinkedIn post inspectors — the generated card
      renders
- [ ] Submit `sitemap.xml` in Google Search Console

### Performance

Run Lighthouse against the **production** URL on a throttled mobile profile. A local
dev-server score is fiction.

- [ ] Performance ≥ 95 mobile, ≥ 99 desktop
- [ ] Accessibility 100
- [ ] Best Practices 100
- [ ] SEO 100

---

## 6. Adding integrations later

Each of these is a variable plus a redeploy. Nothing else changes.

| Want | Set | Effect |
| --- | --- | --- |
| Server-side contact delivery | `RESEND_API_KEY`, `CONTACT_TO_EMAIL` | `/api/contact` delivers; EmailJS becomes the fallback |
| Live GitHub dashboard | `GITHUB_USERNAME` (+ `GITHUB_TOKEN`) | Replaces the "not connected" panel |
| Meeting booking | `NEXT_PUBLIC_CALENDLY_URL` | Click-to-load embed replaces the mailto |
| Privacy-first analytics | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No consent banner needed |
| Session replay | `NEXT_PUBLIC_CLARITY_ID` | No consent banner needed |
| GA4 or PostHog | `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_POSTHOG_KEY` | **Requires a consent gate in the EU** — `analyticsConfig.requiresConsent` reports this |
| Résumé downloads | Commit `public/resume/*.pdf`, add paths to `data/resume.ts` | Download buttons replace the "request by email" state |
| LLM-backed assistant | `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_CHAT_REMOTE=true` | `/api/chat` streams from the model; no component changes |

---

## 7. Rolling back

Vercel keeps every deployment. **Deployments → the last good one → Promote to
Production.** Instant, and no rebuild.

One caveat specific to this site: a returning visitor may hold the previous service
worker. The worker is served with `must-revalidate` and never caches documents
preferentially, so the next navigation picks up the rollback — but the `ServiceWorker`
component's update prompt is what makes it immediate. If you ship a bad worker, bump
`VERSION` in [`public/sw.js`](../public/sw.js): the `activate` handler deletes every
cache whose name is not in the current set.
