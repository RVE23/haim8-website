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

## Design lineage

The site originated from a Claude Design handoff bundle (HTML/CSS/JS prototype loaded
via CDN React + Babel-standalone). That prototype lives at
`Deecy-haim8-website/haim8-website-v2/project/` *outside this repo's main branch* — it
exists only on local checkouts as a reference. The handoff was migrated to this
production-grade Vite + React structure on 2026-05-01.

Worktrees on other branches (`logo-movement-improvement`, `HAIM8-website-layout-and-structure`,
etc.) hold polished prototypes with 3D logo work and scroll-driven narratives that will
land in this repo via deliberate component-level cherry-picking, not direct merges.
