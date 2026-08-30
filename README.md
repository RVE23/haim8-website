# HAIM8 Website

Production marketing site for HAIM8 — Vite + React 19 + `motion` (Framer Motion v12).

## Stack

- **Vite 8** — build tooling
- **React 19** — UI
- **motion@12** (Framer Motion) — animations / transitions
- **Plain CSS** — design tokens in `src/styles/colors_and_type.css`, brand palette + type scale + motion tokens

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production bundle to dist/
npm run preview      # preview the production build
npm run lint         # eslint
```

## Project structure

```
.
├── index.html                           # entry HTML, mounts <App />
├── public/
│   ├── assets/                          # logos, sparkle, lens-flare SVGs
│   └── uploads/                         # image assets (carousel, etc.)
├── src/
│   ├── main.jsx                         # root render
│   ├── App.jsx                          # router + AnimatePresence + theme bootstrap
│   ├── pages.jsx                        # StackHubPage + StagePage (currently stubs)
│   ├── components/
│   │   ├── icons.jsx                    # phosphor-style <I /> icon set
│   │   ├── sections.jsx                 # Nav, Hero, ValuesSection, StackSection,
│   │   │                                #   DeliverSection, CustomersSection,
│   │   │                                #   ClosingCTA, Footer
│   │   ├── stage-motifs.jsx             # per-stage hero visualizations
│   │   └── scroll-indicator.jsx         # bottom-of-hero pulsing SCROLL line
│   └── styles/
│       ├── colors_and_type.css          # brand tokens
│       ├── glass.css                    # glass surface system
│       ├── site.css                     # main site styles + cosmic backdrop
│       ├── pages.css                    # stack/stage page styles
│       └── extras.css                   # scroll indicator + cosmos pacing
│                                        #   overrides + values section + reveal helpers
├── vercel.json                          # Vite framework + cache + security headers
└── vite.config.js
```

## Routing

Hash-based routing (no history-API rewrites needed):

- `#/` — Home (single-page anchored sections)
- `#/stack` — Stack hub (placeholder pending content port)
- `#/stack/<key>` — Stage detail (placeholder; keys: `found`, `capture`, `generate`, `activate`, `close`, `process`)

## Animation system

`motion` provides:

- **Hero entrance** — logo fades in, slogan follows, scroll indicator appears last
- **Section reveals** — `whileInView` on each top-level section (single-shot at 20% visibility)
- **Card stagger** — Stack/Pricing/Values cards stagger in
- **Page transitions** — `<AnimatePresence mode="wait">` cross-fades route changes
- **Hover/tap micro-interactions** — `whileHover` / `whileTap` on interactive elements

Cosmic backdrop animations are CSS keyframes in `src/styles/site.css`, with sparser
pacing overrides in `extras.css` (sporadic shooting stars, slowed flares, drifting nebula).

All animations honour `prefers-reduced-motion`.

## Deployment

Auto-deploys to Vercel on push to `main`. Preview deploys on every PR.

Production: https://www.haim8.com

## Clarifi campaign funnel (`/clarifi`)

Static lead-capture microsite living alongside the React app. Deliberately plain
HTML, not React routes: the SPA is hash-routed (`#/stack`), and hash routes are
not separately indexable — campaign landing pages have to be.

```
public/clarifi/            11 pages, served as-is at /clarifi/*.html
public/clarifi/_shared/    config.js -> hubspot.html -> capture.js (load in that order)
api/clarifi-lead.js        POST -> HubSpot contact upsert + deal in "Clarifi Wave 1"
api/__checks__/            node api/__checks__/clarifi-lead.check.mjs
```

**Required env var.** `HUBSPOT_TOKEN` (a HubSpot private-app token) on the Vercel
project, Production *and* Preview. Server-side only — it must never reach the
bundle or the repo. Without it the pages render fine and only form submission fails.

**Bot defence.** `/api/clarifi-lead` writes to the CRM and this repo is public, so
the payload shape is known. Three gates, all in `api/clarifi-lead.js`:

| Gate | Stops | Does not stop |
|---|---|---|
| Origin must match Host | cross-origin browser posts (CSRF); scripts sending no Origin | a script that sets the header itself |
| Honeypot `cl_website` | form-filling bots — answers 200 so they don't retry | a client that omits the field |
| Work-email rule | free mailboxes, server-side not just in the browser | a real work-domain address |
| Rate limit, 5/min/IP | bursts from one IP hitting one instance — keyed on Vercel's `x-vercel-forwarded-for`, which a caller cannot forge | a distributed flood, or bursts spread across instances |

**Read that right-hand column.** `Origin` means something only because *browsers*
enforce it — it authenticates nothing coming from a script, and the rate limit is
per-instance in-memory, so spreading a flood across instances or source IPs
defeats it. Together these
raise the bar and cover the ordinary cases; they do not make the endpoint safe
against someone deliberately targeting it. Closing that needs a CAPTCHA
(Turnstile), a signed proof-of-page-load token, or Vercel Firewall rate rules.
**Treat it as open.**

`HONEYPOT_FIELD` in the function and `HONEYPOT` in `capture.js` must stay equal.
The field is injected by `capture.js`, so pages never need to declare it.

Smoke-testing the endpoint therefore needs an Origin header:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST "<URL>/api/clarifi-lead" -H "Content-Type: application/json" -H "Origin: <URL>" -d '{"email":"deploy-test@haim8.com","company":"HAIM8 Internal","clarifi_sector":"facilities-management"}'
```

200 = working (a real contact + deal are created — delete them). 403 = Origin
rejected. 500 = `HUBSPOT_TOKEN` missing. 404 = routing.

**Booking link.** Every "Book a call" anchor points at `/book`, redirected in
`vercel.json` to the HubSpot meetings URL. Change the slug in that one line, not
across 31 anchors. The `?embed=true` iframes still address HubSpot directly —
that URL is never visible to a visitor.

## Design lineage

The site originated from a Claude Design handoff bundle (HTML/CSS/JS prototype loaded
via CDN React + Babel-standalone). That prototype lives at
`Deecy-haim8-website/haim8-website-v2/project/` *outside this repo's main branch* — it
exists only on local checkouts as a reference. The handoff was migrated to this
production-grade Vite + React structure on 2026-05-01.

Worktrees on other branches (`logo-movement-improvement`, `HAIM8-website-layout-and-structure`,
etc.) hold polished prototypes with 3D logo work and scroll-driven narratives that will
land in this repo via deliberate component-level cherry-picking, not direct merges.
