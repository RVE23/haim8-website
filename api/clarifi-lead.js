/* ============================================================================
   clarifi-lead.js — Clarifi by HAIM8 · serverless lead-capture handler (Wave 1)
   ----------------------------------------------------------------------------
   Vercel Node serverless function (ESM). Receives a POST from the /clarifi
   capture forms, upserts the contact in HubSpot, and opens a deal in the
   "Clarifi Wave 1 · 2-layer sale" pipeline.

   Path when deployed:  /api/clarifi-lead

   SECURITY
     - Requires a HubSpot private-app token, read ONLY from the server-side
       env var HUBSPOT_TOKEN. The token is NEVER hardcoded, never logged, and
       never returned to the client.
     - HubSpot portal 148769785 (EU data residency). api.hubapi.com routes to
       the correct region for the portal automatically given the token.

   FLOW
     1. Validate method (POST only) + email (present, basic shape).
     2. Upsert contact by email:
          - search  POST /crm/v3/objects/contacts/search   (by email)
          - PATCH existing  or  POST new
        mapping every provided field to its contact property; UTM, lead_magnet
        and consent are stamped on.
     3. Create a deal POST /crm/v3/objects/deals in pipeline 3919122680,
        stage 5593357552 ("Lead Captured"), associated to the contact.
     4. Return 200 { ok:true, contactId, dealId }.

   Errors are caught, logged server-side only, and surfaced to the client as a
   generic message with no token / internal detail leaked.
   ========================================================================== */

const HUBSPOT_BASE = 'https://api.hubapi.com';

// Deal pipeline + first stage (supplied; do not change without HubSpot config).
const DEAL_PIPELINE_ID = '3919122680'; // "Clarifi Wave 1 · 2-layer sale"
const DEAL_STAGE_ID = '5593357552';    // "Lead Captured"

// Association from the DEAL we create TO the contact. The HubSpot-defined
// "deal -> contact" typeId is 3 (contact -> deal is 4); the deal is the object
// being created, so we use the deal -> contact direction. (Verify in the go-live
// smoke test; if it errors, fall back to the v4 default-association endpoint.)
const DEAL_TO_CONTACT_ASSOCIATION_TYPE_ID = 3;

// Contact properties we accept + stamp. Mirrors the /clarifi capture forms.
const CONTACT_PROPERTY_KEYS = [
  'email',
  'firstname',
  'lastname',
  'company',
  'jobtitle',
  'clarifi_sector',
  'employee_band',
  'buying_trigger',
  'lead_magnet',
  'consent_marketing',
  'lawful_basis',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term'
];

// Bot defence. The endpoint writes to the CRM and the repo is public, so the
// payload shape is known.
//
// What these gates DO stop: cross-origin browser requests (CSRF), form-filling
// bots, free-mailbox junk, and unsophisticated scripted floods.
//
// What they DO NOT stop, and must not be read as stopping: a scripted client
// that simply sends `Origin: https://www.haim8.com`. Origin is only meaningful
// because *browsers* enforce it; it authenticates nothing coming from a script.
// Closing that needs a CAPTCHA (Turnstile), a signed proof-of-page-load token,
// or a real distributed rate limit — each needs a secret or a dependency this
// function does not have. The per-instance limiter below is a partial measure,
// not that fix. Treat the residual risk as open.
const HONEYPOT_FIELD = 'cl_website';

// Mirrors FREE_DOMAINS in public/clarifi/_shared/capture.js. The client-side
// check is a UX affordance only — a direct POST bypasses it entirely, so the
// rule has to be enforced here too. Keep the two lists in step.
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'hotmail.com',
  'hotmail.co.uk', 'outlook.com', 'live.com', 'live.co.uk', 'icloud.com',
  'me.com', 'aol.com', 'protonmail.com', 'proton.me', 'gmx.com', 'mail.com'
]);

/* ---- helpers ------------------------------------------------------------- */

// ponytail: per-instance in-memory counter, bucketed on Vercel's own
// x-vercel-forwarded-for so the key cannot be forged by the caller. Vercel runs
// many instances and recycles them, so this throttles a burst from one IP within
// one instance's lifetime — it is NOT a global limit, and a flood spread across
// instances or source IPs defeats it.
// Upgrade path when that matters: Vercel Firewall rate rules (no code), or a
// KV/Upstash counter (a dependency + a credential).
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_PER_WINDOW = 5;
const RATE_MAX_TRACKED_IPS = 5000;
const rateHits = new Map();

// x-vercel-forwarded-for is written by Vercel's edge and cannot be set by the
// caller. x-forwarded-for CAN be — a client sends its own, so bucketing on it
// lets an attacker rotate the value per request and never hit the limit. The
// other two are fallbacks for running outside Vercel; they are only reached
// when the trusted header is absent.
function clientIp(req) {
  const trusted = req.headers['x-vercel-forwarded-for'];
  const raw = (typeof trusted === 'string' && trusted)
    ? trusted
    : (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '');
  const ip = String(raw).split(',')[0].trim();
  // Header values reach the log; strip anything that could forge a log line.
  return ip ? ip.replace(/[^\w.:%[\]-]/g, '').slice(0, 45) : 'unknown';
}

// Bounding the map by clearing it wholesale would wipe buckets that are actively
// being throttled, so anyone able to mint fresh keys could force a clear and
// reset their own allowance. Oldest-first has the same hole: the attacker's own
// bucket ages out. So evict in order of what is safe to lose.
function evict(now) {
  // 1. Expired windows — free, nobody loses anything.
  for (const [key, rec] of rateHits) {
    if (now - rec.start > RATE_WINDOW_MS) rateHits.delete(key);
  }
  if (rateHits.size <= RATE_MAX_TRACKED_IPS) return;

  // 2. Buckets that are NOT currently throttled, oldest first. Dropping one of
  //    these only forgives a caller who was under the limit anyway; dropping a
  //    throttled one would hand an attacker the reset we are trying to deny.
  for (const [key, rec] of rateHits) {
    if (rateHits.size <= RATE_MAX_TRACKED_IPS) break;
    if (rec.count <= RATE_MAX_PER_WINDOW) rateHits.delete(key);
  }

  // 3. Pathological: RATE_MAX_TRACKED_IPS+ genuinely throttled sources inside one
  //    window. That is a distributed attack, which a per-instance counter cannot
  //    answer anyway — stay bounded and let the Firewall/KV upgrade path handle it.
  while (rateHits.size > RATE_MAX_TRACKED_IPS) {
    rateHits.delete(rateHits.keys().next().value);
  }
}

function isRateLimited(req) {
  const ip = clientIp(req);
  const now = Date.now();
  if (rateHits.size > RATE_MAX_TRACKED_IPS) evict(now);
  const rec = rateHits.get(ip);
  if (!rec || now - rec.start > RATE_WINDOW_MS) {
    rateHits.set(ip, { start: now, count: 1 });
    return false;
  }
  rec.count += 1;
  return rec.count > RATE_MAX_PER_WINDOW;
}

function isEmailShape(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isWorkEmail(v) {
  const domain = v.split('@')[1];
  return !!domain && !FREE_EMAIL_DOMAINS.has(domain.toLowerCase());
}

// Browsers set Origin on every POST, same-origin included, so comparing it to
// the Host we were reached on accepts production and every preview deployment
// without hardcoding a domain. This is a CSRF control: it rejects posts from
// another origin, and scripts that send no Origin. It is NOT an authentication
// check — a script that sets the header itself passes. See the note above.
function isSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

// Read + coerce the body. Vercel usually parses JSON into req.body, but guard
// for the raw-string / unparsed case so the function is robust either way.
function parseBody(req) {
  const b = req.body;
  if (b == null) return {};
  if (typeof b === 'string') {
    if (!b.trim()) return {};
    return JSON.parse(b);
  }
  if (typeof b === 'object') return b;
  return {};
}

// Pick only the known contact property keys that have a non-empty value.
function collectProperties(body) {
  const props = {};
  for (const key of CONTACT_PROPERTY_KEYS) {
    const raw = body[key];
    if (raw == null) continue;
    const val = typeof raw === 'string' ? raw.trim() : String(raw);
    if (val === '') continue;
    props[key] = val;
  }
  return props;
}

// Thin wrapper over fetch with the Bearer token. Throws on non-2xx with a
// server-side-only detail (caller logs it; client never sees it).
async function hubspot(token, method, path, payload) {
  const res = await fetch(HUBSPOT_BASE + path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: payload == null ? undefined : JSON.stringify(payload)
  });

  const text = await res.text();
  let json = null;
  if (text) {
    try { json = JSON.parse(text); } catch { json = null; }
  }

  if (!res.ok) {
    const err = new Error(`HubSpot ${method} ${path} -> ${res.status}`);
    err.status = res.status;
    err.detail = json || text; // server-side log only
    throw err;
  }
  return json;
}

// Search for an existing contact by email. Returns the contact id or null.
async function findContactByEmail(token, email) {
  const result = await hubspot(token, 'POST', '/crm/v3/objects/contacts/search', {
    filterGroups: [
      {
        filters: [{ propertyName: 'email', operator: 'EQ', value: email }]
      }
    ],
    properties: ['email'],
    limit: 1
  });
  const first = result && Array.isArray(result.results) ? result.results[0] : null;
  return first && first.id ? first.id : null;
}

async function upsertContact(token, properties) {
  const existingId = await findContactByEmail(token, properties.email);
  if (existingId) {
    await hubspot(token, 'PATCH', `/crm/v3/objects/contacts/${existingId}`, {
      properties
    });
    return existingId;
  }
  const created = await hubspot(token, 'POST', '/crm/v3/objects/contacts', {
    properties
  });
  return created.id;
}

async function createDeal(token, contactId, properties) {
  const dealProps = {
    dealname: 'Clarifi Lead — ' + (properties.company || properties.email),
    pipeline: DEAL_PIPELINE_ID,
    dealstage: DEAL_STAGE_ID
  };
  // clarifi_sector / buying_trigger exist on the CONTACT only (not the deal object
  // in this portal) — segment reporting reads them via the associated contact, so
  // they are intentionally NOT written as deal properties here.

  const created = await hubspot(token, 'POST', '/crm/v3/objects/deals', {
    properties: dealProps,
    associations: [
      {
        to: { id: contactId },
        types: [
          {
            associationCategory: 'HUBSPOT_DEFINED',
            associationTypeId: DEAL_TO_CONTACT_ASSOCIATION_TYPE_ID
          }
        ]
      }
    ]
  });
  return created.id;
}

/* ---- handler ------------------------------------------------------------- */

export default async function handler(req, res) {
  // CORS — same-origin only. The capture forms are served from the same Vercel
  // deployment, so no cross-origin Access-Control-Allow-Origin is granted.
  res.setHeader('Vary', 'Origin');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  if (!isSameOrigin(req)) {
    console.warn('[clarifi-lead] rejected cross-origin POST from:', req.headers.origin || '(none)');
    res.status(403).json({ ok: false, error: 'Forbidden' });
    return;
  }

  if (isRateLimited(req)) {
    console.warn('[clarifi-lead] rate limited:', clientIp(req));
    res.setHeader('Retry-After', String(RATE_WINDOW_MS / 1000));
    res.status(429).json({ ok: false, error: 'Too many requests' });
    return;
  }

  const token = process.env.HUBSPOT_TOKEN;
  if (!token) {
    console.error('[clarifi-lead] HUBSPOT_TOKEN env var is not set');
    res.status(500).json({ ok: false, error: 'Server not configured' });
    return;
  }

  let body;
  try {
    body = parseBody(req);
  } catch (err) {
    console.error('[clarifi-lead] invalid JSON body:', err.message);
    res.status(400).json({ ok: false, error: 'Invalid JSON body' });
    return;
  }

  // Honeypot: a hidden field no human fills in. Return 200 so the bot sees
  // success and does not retry with the field cleared; nothing is written.
  if (body[HONEYPOT_FIELD]) {
    console.warn('[clarifi-lead] honeypot tripped; discarding submission');
    res.status(200).json({ ok: true });
    return;
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!email || !isEmailShape(email)) {
    res.status(400).json({ ok: false, error: 'A valid email is required' });
    return;
  }
  if (!isWorkEmail(email)) {
    res.status(400).json({ ok: false, error: 'Please use your work email' });
    return;
  }

  const properties = collectProperties(body);
  properties.email = email; // normalised

  try {
    const contactId = await upsertContact(token, properties);
    const dealId = await createDeal(token, contactId, properties);
    res.status(200).json({ ok: true, contactId, dealId });
  } catch (err) {
    // Log full detail server-side only. Never leak token or HubSpot internals.
    console.error('[clarifi-lead] HubSpot sync failed:', err.message, err.detail || '');
    res.status(502).json({ ok: false, error: 'Lead capture failed' });
  }
}
