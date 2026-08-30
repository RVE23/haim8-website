/* Self-check for the /api/clarifi-lead request gates. No network: every case
   here is rejected before the first HubSpot fetch, so a dummy token is enough.
   Run: node api/__checks__/clarifi-lead.check.mjs   (exits non-zero on failure) */
import assert from 'node:assert/strict';

process.env.HUBSPOT_TOKEN = 'dummy-not-used-these-paths-never-fetch';
const { default: handler } = await import('../clarifi-lead.js');

const SITE = 'www.haim8.com';
function call(headers, body) {
  const req = { method: 'POST', headers: { host: SITE, ...headers }, body };
  const out = {};
  const res = {
    setHeader() {},
    status(c) { out.code = c; return res; },
    json(p) { out.body = p; return res; }
  };
  return handler(req, res).then(() => out);
}
const good = { origin: `https://${SITE}` };
const lead = { email: 'ops@somecompany.co.uk', clarifi_sector: 'facilities-management' };

// A scripted POST sends no Origin at all — this is what stops curl flooding the CRM.
assert.equal((await call({}, lead)).code, 403, 'missing Origin must be refused');

// ...and one from another site must not be able to write either.
assert.equal((await call({ origin: 'https://evil.example' }, lead)).code, 403, 'cross-origin must be refused');

// Preview deployments have their own hostname; same-host must still pass the gate.
const preview = await call({ host: 'haim8-website-abc123.vercel.app', origin: 'https://haim8-website-abc123.vercel.app' },
                           { email: 'not-an-email' });
assert.equal(preview.code, 400, 'preview origin should pass the origin gate and fail on email');

// Honeypot returns 200 so the bot believes it succeeded and stops retrying.
const trap = await call(good, { ...lead, cl_website: 'http://spam.example' });
assert.equal(trap.code, 200, 'honeypot should answer 200');
assert.deepEqual(trap.body, { ok: true });

// The work-email rule is enforced server-side, not just in the browser.
assert.equal((await call(good, { ...lead, email: 'someone@gmail.com' })).code, 400, 'free mailbox must be refused');
assert.equal((await call(good, { email: 'nope' })).code, 400, 'malformed email must be refused');

// Wrong method never reaches any of the above.
const res405 = {}; 
await handler({ method: 'GET', headers: { host: SITE } },
  { setHeader() {}, status(c) { res405.code = c; return this; }, json() { return this; } });
assert.equal(res405.code, 405, 'GET must be refused');

console.log('clarifi-lead gates: 7/7 passed');
