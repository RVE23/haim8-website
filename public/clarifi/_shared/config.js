/* ============================================================================
   config.js — Clarifi by HAIM8 · shared site configuration (Wave 1)
   ----------------------------------------------------------------------------
   Single source of truth for HubSpot wiring. Load this FIRST, before
   capture.js / hubspot.html scripts, on every /clarifi page:

     <script src="/clarifi/_shared/config.js"></script>

   HubSpot account (confirmed live): Portal/Hub ID 148769785, EU data residency
   (region eu1 -> app-eu1 / api-eu1 / js-eu1). Booking link slug "mtshuma".

   ----------------------------------------------------------------------------
   IMPORTANT — the `forms` GUIDs below are intentional PENDING- sentinels.
   The HubSpot MARKETING forms do not exist yet; they are created later via the
   HubSpot UI. After that UI step, replace each `PENDING-HS-FORM-GUID-<magnet>`
   string with the real form GUID (a UUID, e.g. "a1b2c3d4-....").
   capture.js detects the PENDING- prefix and degrades gracefully (it still
   completes the thank-you redirect) so the flow is testable BEFORE the GUIDs
   land. These are the ONLY allowed sentinels in the whole site.
   ========================================================================== */
window.CLARIFI_CONFIG = {
  hubspotPortalId: '148769785',
  region: 'eu1',
  meetingsLink: '/book', // -> vercel.json redirect -> HubSpot (single place to change the slug)
  formSubmitBase: 'https://api.hsforms.com/submissions/v3/integration/submit',
  utmCampaign: 'clarifi-wave1',

  // ACTIVE capture path (Path B): custom forms POST a flat JSON contact payload
  // to this serverless function (site/api/clarifi-lead.js), which upserts the
  // HubSpot contact + opens a Lead-Captured deal using the server-side token.
  // No HubSpot form GUID needed. formSubmitBase + forms{} below are the
  // alternative Path A (native HubSpot Forms) and are currently unused.
  apiEndpoint: '/api/clarifi-lead',

  // Lead-magnet slug -> HubSpot form GUID. (Path A — unused; kept for reference.)
  // Replace PENDING- values after the HubSpot UI form-creation step.
  forms: {
    'simpler-recycling-guide': 'PENDING-HS-FORM-GUID-simpler-recycling',
    'reporting-gap-playbook':  'PENDING-HS-FORM-GUID-reporting-gap-playbook',
    'roi-calculator':          'PENDING-HS-FORM-GUID-roi-calculator',
    'reseller-application':    'PENDING-HS-FORM-GUID-reseller',
    'contact':                 'PENDING-HS-FORM-GUID-contact'
  }
};
