# Session — 2026-08-30 09:42 — clarifi-funnel-port

**Focus:** Port Mendisi's Clarifi GTM funnel onto the production site, and give him
standing write access so he can ship it himself from here.

**Changes:**
- `public/clarifi/**` (20 files) + `api/clarifi-lead.js` ported from
  `mendisi-ctrl/haim8-website@clarifi-gtm-wave-1` (his PR #3)
- `vercel.json` hand-merged — his version was a full replacement that would have
  dropped HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy and the
  `/assets/*` immutable cache. Kept ours, added his `/clarifi` cache rules
  (specific `_shared` rule ordered last so it wins), added the `/book` redirect.
  Dropped his SPA catch-all rewrite: we hash-route, we never had one.
- `api/clarifi-lead.js` hardened — Origin==Host gate, `cl_website` honeypot,
  server-side work-email rule. `api/__checks__/clarifi-lead.check.mjs`, 7 gates.
- Booking: 31 anchors → `/book`; 8 `?embed=true` iframes left on HubSpot.
- Canonical + og:url on 6 pages: apex → `www` (apex 308s; canonical must not).
- `eslint.config.js`: Node globals for `api/`, script globals for `public/clarifi/`.
- GitHub: `mendisi-ctrl` invited to `RVE23/haim8-website` (write).
  `main` protected — PR required, 0 approvals, no force-push, no deletion,
  `enforce_admins:false` so Rae keeps an escape hatch.

**Issues Found:**
- **His PR #3 targets the wrong repo.** `mendisi-ctrl/haim8-website` is not a fork —
  independent repo, `main` = one commit (2026-04-19) of the *dead* TS/Tailwind
  handoff bundle. Merging it deploys nothing to haim8.com. Root cause: he had no
  access to the production repo, so he branched from the only copy he could see.
- `/api/clarifi-lead` shipped with zero bot protection. Its own comment claimed
  "CORS — same-origin only" while setting `Vary: Origin` and never reading it.
  Endpoint + payload shape are public (his repo is public).
- Work-email gating was browser-side only; a direct POST bypassed it entirely.
- `npm run lint` already fails on `main`: 54 pre-existing `no-unused-vars` in
  `src/`. Untouched here — flagged, not fixed (off-topic for this PR).
- 5 of 11 pages carry no `rel=canonical`. Left to Mendisi (content decision;
  thank-you.html should stay unindexed anyway).

**Codex review (3 passes, each found something real):**
- Pass 1 — the Origin===Host gate was documented as stopping scripted POSTs. It
  does not: a script sets the header and passes. Origin is only meaningful because
  *browsers* enforce it. Docs corrected; per-instance rate limiter added.
- Pass 2 — the limiter was gameable twice over. `x-forwarded-for` is caller-supplied,
  so rotating it bought a fresh bucket; and `clear()` at the cap wiped active
  throttles, so minting keys reset your own allowance.
- Pass 3 — requested on the eviction rewrite specifically, because the regression
  test caught that plain oldest-first eviction ALSO evicted the attacker's own
  throttled bucket. Eviction is now expired -> un-throttled -> oldest.

**Learnings:**
- Vercel merges matching `headers` rules in order and **last match wins per key** —
  a narrow rule placed before a broad one is silently overridden.
- Personal-account repos expose exactly one collaborator level (write). The
  Read/Triage/Maintain/Admin ladder is org-only. "Complete access" is one switch.
- GitHub write alone == production deploy rights here, because Vercel auto-deploys
  from `main`. A Vercel seat buys only env vars + build logs, and the team holds
  Tyrli and Nu Group — so a seat would have crossed a client boundary for nothing.
- Browsers send `Origin` on same-origin POSTs too, so comparing it to `Host`
  authorises prod and every preview without hardcoding a domain.

**Next Steps:**
1. Rae sets `HUBSPOT_TOKEN` in Vercel (Production + Preview) — **rotate first**, the
   original was pasted in chat. Claude must not handle the value.
2. Verify the preview: `/`, `/clarifi/`, `/clarifi/simpler-recycling.html`, and the
   curl smoke test **with `-H "Origin: <preview-url>"`** (403 without it, by design).
3. Confirm the `mtshuma` meetings slug is live, then rename it — one line in
   `vercel.json`.
4. Mendisi accepts the repo invite; close his PR #3 pointing here.
5. Optional: rate limiting needs external state (KV/Upstash) — not built. Origin +
   honeypot covers scripted and form-bot abuse; a determined attacker driving a real
   browser is not covered.
