/* ============================================================================
   capture.js — Clarifi by HAIM8 · reusable lead-capture handler (Wave 1)
   ----------------------------------------------------------------------------
   Drives custom-styled HTML forms that POST a flat JSON contact payload to the
   /api/clarifi-lead serverless function (Path B), which upserts the HubSpot
   contact + opens a Lead-Captured deal server-side using the private-app token.
   No HubSpot form GUID is needed. (Path A — native HubSpot Forms v3 submit — is
   retained in config.js but unused.)

   LOAD ORDER on a page:
     1. /clarifi/_shared/config.js   (window.CLARIFI_CONFIG)
     2. hubspot.html BLOCK A         (window.ClarifiAnalytics, consent)
     3. /clarifi/_shared/capture.js  (this file)

   WIRING A FORM (page author):
     <form class="cl-form" data-clarifi-capture data-magnet="simpler-recycling-guide">
       <input name="email"     type="email" required>
       <input name="firstname">
       <input name="lastname">
       <input name="company">
       <input name="jobtitle">
       <select name="clarifi_sector"> ... </select>          <!-- qualifying -->
       <select name="employee_band"> under-50|50-99|100-249|250-plus </select> <!-- qualifying -->
       <input  name="buying_trigger">                          <!-- qualifying -->
       <label class="cl-consent">
         <input type="checkbox" name="consent_marketing" value="yes">
         I agree to be contacted by HAIM8 Ltd about Clarifi.
       </label>
       <div class="cl-form-status" data-cl-status></div>
       <button class="h8-btn" type="submit">Get it</button>
     </form>

   Qualifying rule (mirrors measurement/tracking-plan.md): a valid WORK email
   PLUS at least one of { clarifi_sector, employee_band, buying_trigger }.
   No phone field is ever required.

   On success -> redirect to thank-you.html?asset=<magnet> and fire lead_submitted.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.CLARIFI_CONFIG || {};
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var UTM_STORE = 'clarifi_utm';
  var QUALIFYING = ['clarifi_sector', 'employee_band', 'buying_trigger'];
  var HONEYPOT = 'cl_website'; // must match HONEYPOT_FIELD in api/clarifi-lead.js

  // Free / personal-mailbox domains -> not a work email.
  var FREE_DOMAINS = [
    'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'hotmail.com',
    'hotmail.co.uk', 'outlook.com', 'live.com', 'live.co.uk', 'icloud.com',
    'me.com', 'aol.com', 'protonmail.com', 'proton.me', 'gmx.com', 'mail.com'
  ];

  /* ---- UTM capture + persistence ---------------------------------------- */
  function captureUtm() {
    var qs = new URLSearchParams(location.search);
    var stored = readUtm();
    var found = false;
    UTM_KEYS.forEach(function (k) {
      var v = qs.get(k);
      if (v) { stored[k] = v; found = true; }
    });
    // Default the campaign so every lead is attributable even on a bare URL.
    if (!stored.utm_campaign && CFG.utmCampaign) stored.utm_campaign = CFG.utmCampaign;
    if (found || !readUtmRaw()) {
      try { localStorage.setItem(UTM_STORE, JSON.stringify(stored)); } catch (e) {}
    }
    return stored;
  }
  function readUtmRaw() { try { return localStorage.getItem(UTM_STORE); } catch (e) { return null; } }
  function readUtm() {
    try { return JSON.parse(readUtmRaw() || '{}'); } catch (e) { return {}; }
  }

  /* ---- Validation -------------------------------------------------------- */
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function isWorkEmail(v) {
    if (!isEmail(v)) return false;
    var domain = v.split('@')[1].toLowerCase();
    return FREE_DOMAINS.indexOf(domain) === -1;
  }
  function fieldVal(form, name) {
    var el = form.elements[name];
    return el && el.value ? el.value.trim() : '';
  }
  function markField(form, name, invalid, msg) {
    var el = form.elements[name];
    if (!el) return;
    var wrap = el.closest('.cl-field') || el.parentNode;
    if (wrap && wrap.classList) wrap.classList.toggle('is-invalid', !!invalid);
    var err = wrap && wrap.querySelector ? wrap.querySelector('.cl-error') : null;
    if (err) err.textContent = invalid ? (msg || '') : '';
  }

  function validate(form) {
    var ok = true;
    var email = fieldVal(form, 'email');
    if (!email) { markField(form, 'email', true, 'Work email required.'); ok = false; }
    else if (!isWorkEmail(email)) {
      markField(form, 'email', true, 'Please use your work email.'); ok = false;
    } else { markField(form, 'email', false); }

    var hasQualifier = QUALIFYING.some(function (k) { return !!fieldVal(form, k); });
    if (!hasQualifier) {
      // flag whichever qualifying fields exist on this form
      QUALIFYING.forEach(function (k) {
        if (form.elements[k]) markField(form, k, true, '');
      });
      ok = false;
      setStatus(form, 'Tell us a little about your operation so we can tailor this.', 'err');
    } else {
      QUALIFYING.forEach(function (k) { if (form.elements[k]) markField(form, k, false); });
    }
    return ok;
  }

  /* ---- Status line ------------------------------------------------------- */
  function statusEl(form) { return form.querySelector('[data-cl-status]'); }
  function setStatus(form, msg, kind) {
    var el = statusEl(form);
    if (!el) return;
    el.textContent = msg || '';
    el.className = 'cl-form-status' + (kind ? ' ' + kind : '');
  }

  /* ---- Build the flat contact payload for /api/clarifi-lead -------------- */
  function collectProps(form, magnet) {
    var utm = readUtm();
    var consentEl = form.elements['consent_marketing'];
    var consentGiven = consentEl ? (consentEl.type === 'checkbox' ? consentEl.checked : !!consentEl.value) : false;

    var props = {
      email:          fieldVal(form, 'email'),
      firstname:      fieldVal(form, 'firstname'),
      lastname:       fieldVal(form, 'lastname'),
      company:        fieldVal(form, 'company'),
      jobtitle:       fieldVal(form, 'jobtitle'),
      clarifi_sector: fieldVal(form, 'clarifi_sector'),
      employee_band:  fieldVal(form, 'employee_band'),
      buying_trigger: fieldVal(form, 'buying_trigger'),
      lead_magnet:    magnet,
      cl_website:     fieldVal(form, HONEYPOT),
      consent_marketing: consentGiven ? 'yes' : 'no',
      // lawful_basis HubSpot enum: 'consent' | 'legitimate-interest' (hyphen).
      lawful_basis:   consentGiven ? 'consent' : 'legitimate-interest',
      utm_source:     utm.utm_source || '',
      utm_medium:     utm.utm_medium || '',
      utm_campaign:   utm.utm_campaign || CFG.utmCampaign || '',
      utm_content:    utm.utm_content || '',
      utm_term:       utm.utm_term || ''
    };

    // Drop empties so the function only writes provided fields.
    Object.keys(props).forEach(function (k) {
      if (props[k] === '' || props[k] == null) delete props[k];
    });
    return props;
  }

  /* ---- Submit (Path B: POST flat JSON to /api/clarifi-lead) -------------- */
  function submitForm(form) {
    var magnet = form.getAttribute('data-magnet') || 'contact';
    var redirect = form.getAttribute('data-thankyou') || ('thank-you.html?asset=' + encodeURIComponent(magnet));
    var btn = form.querySelector('[type=submit]');
    var endpoint = CFG.apiEndpoint || '/api/clarifi-lead';
    var isPreview = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:';

    function done() {
      // Fire analytics (consent-gated inside the helper) then redirect.
      if (window.ClarifiAnalytics) window.ClarifiAnalytics.leadSubmitted({ lead_magnet: magnet });
      location.href = redirect;
    }

    if (btn) { btn.classList.add('is-busy'); }
    setStatus(form, 'Sending…', '');

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectProps(form, magnet))
    }).then(function (res) {
      if (!res.ok) throw new Error('Capture endpoint responded ' + res.status);
      done();
    }).catch(function (err) {
      // On local/preview there is no serverless function — degrade gracefully so
      // the funnel is testable. In production a real failure surfaces an error.
      if (isPreview) {
        console.warn('[clarifi] preview: ' + endpoint + ' not available; completing thank-you flow.', err);
        done();
        return;
      }
      console.error('[clarifi] capture submit failed:', err);
      if (btn) btn.classList.remove('is-busy');
      setStatus(form, 'Something went wrong sending that. Please try again, or book a call.', 'err');
    });
  }

  /* ---- Honeypot ---------------------------------------------------------- */
  // Off-screen rather than display:none / hidden — some bots skip fields they
  // can tell are unrenderable. aria-hidden + tabindex keep it away from screen
  // readers and the tab order.
  function addHoneypot(form) {
    if (form.elements[HONEYPOT]) return;
    var wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden';
    var input = document.createElement('input');
    input.type = 'text';
    input.name = HONEYPOT;
    input.tabIndex = -1;
    input.autocomplete = 'off';
    wrap.appendChild(input);
    form.appendChild(wrap);
  }

  /* ---- Wire up ----------------------------------------------------------- */
  function init() {
    captureUtm();
    var forms = document.querySelectorAll('form[data-clarifi-capture]');
    Array.prototype.forEach.call(forms, function (form) {
      form.setAttribute('novalidate', 'novalidate');
      addHoneypot(form);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        setStatus(form, '', '');
        if (validate(form)) submitForm(form);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  // Expose for the ROI calculator / programmatic callers.
  window.ClarifiCapture = { captureUtm: captureUtm, readUtm: readUtm };
})();
