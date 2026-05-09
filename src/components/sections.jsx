/* HAIM8 page sections — composed in App.jsx
   Ported from project/sections.jsx. Differences from the prototype:
     - ESM imports instead of globals
     - Hero is stripped to logo + slogan + cosmic backdrop + scroll indicator
     - Each top-level section animates in via motion's whileInView
     - Buttons get a subtle whileHover/whileTap micro-interaction
*/
import React from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useReducedMotion,
  animate,
} from 'motion/react';
import { I } from './icons.jsx';
import { ScrollIndicator } from './scroll-indicator.jsx';

/* shared transition spec — expo-out, matches --h8-ease-out */
const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const REVEAL_QUICK = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export const STAGES = [
  { num: '01', key: 'found',    icon: 'magnifier', name: 'Search',    outcome: 'Brand-grade site that shows up — on Google and in AI search.', emWord: 'deserve',
    detail: { headline: <>You <em>deserve</em> to be found.</>,
      lede: 'A site that signals premium. Schema, structured data and AI-search visibility set up properly. Google Business owned, not abandoned.',
      bullets: ['Branded marketing site, brand-grade build', 'Schema, structured data, technical SEO foundation', 'AI-search / LLM visibility configured', 'Google Business presence — owned, not abandoned'] }},
  { num: '02', key: 'capture',  icon: 'chat',      name: 'Capture',   outcome: 'Never miss an inquiry — after-hours, weekends, on jobs.', emWord: 'miss',
    detail: { headline: <>Stop losing <em>inquiries</em> after hours.</>,
      lede: 'AI concierge handles web chat, after-hours email triage, voice deflection and missed-call rescue. Warm leads routed to a human in seconds.',
      bullets: ['Web chat trained on your services and tone', 'After-hours email triage and reply-drafting', 'Voice-call deflection and missed-call rescue', 'Warm-lead routing to phone, SMS or owner inbox'] }},
  { num: '03', key: 'generate', icon: 'chart',     name: 'Generate',  outcome: 'Daily, signal-driven pipeline — beyond referrals.', emWord: 'referrals',
    detail: { headline: <>Pipeline beyond <em>referrals</em>.</>,
      lede: 'We watch the right signals in your sector, find the matching businesses, and drop them in your CRM every morning. We pick the signals. You work the list.',
      bullets: ['Sector-targeted prospecting on real signals', 'Cleaned, ranked by fit, and dropped into your CRM', 'Daily refresh — fresh leads every morning', 'You see the source on every record'] }},
  { num: '04', key: 'activate', icon: 'bolt',      name: 'Activate',  outcome: 'First contact in 5 minutes, every time.', emWord: '5 minutes',
    detail: { headline: <>From lead to first call in <em>5 minutes</em>.</>,
      lede: 'Follow-ups that just run. Callback scheduler, sequence sender, nurture flows, SLA timer per lead. No spreadsheet, no rot.',
      bullets: ['Callback scheduler with owner SLA timer', 'Sequence sender with templates in your voice', 'Nurture flows that pause when humans take over', 'Per-lead audit trail — every touch, every hour'] }},
  { num: '05', key: 'close',    icon: 'sign',      name: 'Close',     outcome: 'Proposals, contracts and signatures — done for you.', emWord: 'done for you',
    detail: { headline: <>Close & Sign — <em>done for you</em>.</>,
      lede: 'We build the templates, send them, track sent → viewed → signed, and kick off onboarding the moment your customer signs.',
      bullets: ['Proposal, contract and schedule templates — drafted by us', 'Send-sequence: draft → revise → final → sign', 'Status tracking sent / viewed / signed in one view', 'Auto-trigger onboarding the moment a contract signs', 'Simple CRM setup and one screen showing every deal’s status'] }},
  { num: '06', key: 'process',  icon: 'gear',      name: 'Process',   outcome: 'Onboard a customer in minutes, not days.', emWord: 'minutes, not days',
    detail: { headline: <>Onboard in <em>minutes, not days</em>.</>,
      lede: 'Customer-ops automation. Intake → CRM → invoicing → onboarding email → portal. Multi-tenant where you need sub-accounts.',
      bullets: ['Intake forms wired to your CRM', 'Invoicing and onboarding emails on autopilot', 'Customer portal — multi-tenant where needed', 'Hand-offs you can audit, not chase'] }},
];

/* HAIM8 wordmark — inline SVG, brand-grade. Sparkle mark + bespoke wordmark. */
export function Wordmark({ height = 26, color = '#FEFEFE' }) {
  return (
    <svg viewBox="0 0 220 44" height={height} style={{ display: 'block' }} aria-label="HAIM8">
      <defs>
        <linearGradient id="h8-mark-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0080E4"/>
          <stop offset="100%" stopColor="#7D41B9"/>
        </linearGradient>
      </defs>
      <g transform="translate(2,4)">
        <rect x="0" y="0" width="36" height="36" rx="9" fill="url(#h8-mark-grad)"/>
        <path d="M18 9 L20.4 15.6 L27 18 L20.4 20.4 L18 27 L15.6 20.4 L9 18 L15.6 15.6 Z" fill="#FEFEFE"/>
      </g>
      <text x="50" y="30" fontFamily="Sora, system-ui, sans-serif" fontSize="24" fontWeight="600" letterSpacing="0.5" fill={color}>HAIM<tspan fontWeight="300" fill="url(#h8-mark-grad)">8</tspan></text>
    </svg>
  );
}

/* ─── Theme toggle (inline — used by Nav) ─────────────────────── */
function ThemeToggle() {
  const [theme, setTheme] = React.useState(() =>
    typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') || 'dark' : 'dark'
  );
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('haim8-theme', theme); } catch (e) {}
  }, [theme]);
  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')} aria-label="Dark mode" title="Dark">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')} aria-label="Light mode" title="Light">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
      </button>
    </div>
  );
}

/* ─── Top Navigation ─────────────────────────────────────────── */
export function Nav({ active, onNav }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [openStack, setOpenStack] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 12);
    onS(); window.addEventListener('scroll', onS, { passive: true });
    return () => window.removeEventListener('scroll', onS);
  }, []);

  React.useEffect(() => {
    if (!openStack) return;
    const onDoc = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpenStack(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpenStack(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [openStack]);

  const Item = ({ id, label }) => (
    <button className={'nav__link' + (active === id ? ' active' : '')} onClick={() => onNav(id)}>{label}</button>
  );

  const goStage = (key) => { setOpenStack(false); onNav('stage:' + key); };

  return (
    <motion.nav
      className={'nav' + (scrolled ? ' scrolled' : '')}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div className="nav__brand" onClick={() => onNav('home')}>
        <img src="assets/haim8-logo.png" alt="HAIM8 — home" style={{ height: 36, width: 'auto', display: 'block' }}/>
      </div>
      <div className="nav__links">
        <Item id="concept" label="Concept" />
        <div className="nav__menu" ref={menuRef}>
          <button
            className={'nav__link' + (active === 'stack' || active === 'stage' ? ' active' : '')}
            onClick={() => setOpenStack(o => !o)}
            aria-haspopup="true"
            aria-expanded={openStack}
          >
            Offerings <I name="down" size={14}/>
          </button>
          {openStack && (
            <div className="nav__dropdown" role="menu">
              <button className="nav__drop-item" onClick={() => { setOpenStack(false); onNav('stack'); }} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 4, paddingBottom: 14 }}>
                <span className="nav__drop-icon" style={{ background:'linear-gradient(135deg, rgba(0,128,228,.35), rgba(125,65,185,.30))', borderColor:'rgba(255,255,255,0.20)', color:'#fff' }}><I name="grid" size={18}/></span>
                <span>
                  <span className="nav__drop-step">OVERVIEW</span>
                  <div className="nav__drop-title">The Stack — all 6 stages</div>
                  <div className="nav__drop-sub">See the journey end-to-end and how stages ladder.</div>
                </span>
              </button>
              {STAGES.map(s => (
                <button key={s.key} className="nav__drop-item" onClick={() => goStage(s.key)} role="menuitem">
                  <span className="nav__drop-icon"><I name={s.icon} size={18}/></span>
                  <span>
                    <span className="nav__drop-step">STAGE {s.num}</span>
                    <div className="nav__drop-title">{s.name}</div>
                    <div className="nav__drop-sub">{s.outcome}</div>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <Item id="customers" label="Customers" />
        <Item id="deliver"   label="Delivery" />
        <Item id="whynow"    label="Timing" />
        <ThemeToggle/>
        <button className="nav__cta" onClick={() => onNav('contact')} style={{ whiteSpace: 'nowrap' }}>Book a call</button>
      </div>
    </motion.nav>
  );
}

/* ─── Hero (stripped: logo + slogan + cosmic backdrop + scroll indicator) ─── */
export function Hero() {
  return (
    <section className="hero section dark on-dark hero--cosmic">
      <div className="hero-cosmos" aria-hidden="true">
        <div className="hero-cosmos__stars hero-cosmos__stars--far" data-parallax="far"/>
        <div className="hero-cosmos__milkyway"/>
        <div className="hero-cosmos__stars hero-cosmos__stars--mid" data-parallax="mid"/>
        <div className="hero-cosmos__stars" data-parallax="near"/>
        <div className="hero-cosmos__nebula"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--lg"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--lg2"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--md"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--sm"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--sm2"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--sm3"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--corner"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--corner2"/>
        <div className="hero-cosmos__shoot hero-cosmos__shoot--intro"/>
        <div className="hero-cosmos__shoot"/>
        <div className="hero-cosmos__shoot hero-cosmos__shoot--alt"/>
        <div className="hero-cosmos__shoot hero-cosmos__shoot--v3"/>
        <div className="hero-cosmos__shoot hero-cosmos__shoot--v4"/>
      </div>
      <div className="glow-blob b1"/><div className="glow-blob b2"/><div className="glow-blob b3"/>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 28 }}>
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <img
              src="assets/haim8-logo.png"
              alt="HAIM8"
              style={{
                width: 'min(620px, 75vw)',
                height: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 30px 80px rgba(0,128,228,.35))',
              }}
            />
          </motion.div>
          <motion.h1
            className="h-display h-display-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
            style={{ margin: '0 auto', color: 'var(--h8-white)', maxWidth: 880 }}
          >
            Simplifying <em>AI</em> for everyday businesses.
          </motion.h1>
        </div>
      </div>

      <ScrollIndicator delay={1.6}/>
    </section>
  );
}

/* ─── Concept ─────────────────────────────────────────────────── */
/* Four-act animated narrative for HAIM8's pitch: SMB AI consultancy
   that turns AI into ROI, plain English, no jargon. Anchored at
   #sec-concept (was #sec-values). */

const HOOK_LEFT  = ['AI', 'Automations', 'Agents', 'Tools'];
const HOOK_RIGHT = ['ROI', 'Revenue', 'Hours back', 'Savings'];

function HookHeadline({ reduced }) {
  const [i, setI] = React.useState(0);
  // reveal: 0 = nothing, 1 = "We turn", 2 = + L grad, 3 = + "into", 4 = + R grad
  const [reveal, setReveal] = React.useState(reduced ? 4 : 4);
  const [paused, setPaused] = React.useState(false);
  const pausedRef = React.useRef(false);
  pausedRef.current = paused;

  React.useEffect(() => {
    if (reduced) { setReveal(4); return; }
    let alive = true;
    let timer = null;
    const wait = (ms) => new Promise((res) => { timer = setTimeout(res, ms); });
    const waitWhilePaused = async () => {
      while (alive && pausedRef.current) await wait(120);
    };

    // Timings (ms) — premium pacing
    const HOLD_AFTER_FULL = 4500; // long read time once full phrase visible
    const EXIT_DUR        = 1600; // slow, soft fade-out
    const EMPTY_HOLD      = 200;  // brief empty-screen beat after exit completes
    const STATIC_DUR      = 1400; // duration framer needs to fade in static word
    const GRAD_DUR        = 1600; // gradient word reveal — slowest of all
    const PAUSE           = 600;  // pause between each part landing

    const run = async () => {
      // Page first paints with reveal=4 (all visible). Hold, then loop.
      while (alive) {
        // 1) Held complete phrase
        await wait(HOLD_AFTER_FULL);
        if (!alive) return;
        await waitWhilePaused();

        // 2) All four exit together
        setReveal(0);
        await wait(EXIT_DUR + EMPTY_HOLD);
        if (!alive) return;
        await waitWhilePaused();

        // 3) Bump to next word pair
        setI((n) => (n + 1) % HOOK_LEFT.length);
        await wait(20); // let React settle the new words at hidden state

        // 4) Sequential reveal: "We turn" → grad-L → "into" → grad-R
        setReveal(1);
        await wait(STATIC_DUR + PAUSE);
        if (!alive) return;
        setReveal(2);
        await wait(GRAD_DUR + PAUSE);
        if (!alive) return;
        setReveal(3);
        await wait(STATIC_DUR + PAUSE);
        if (!alive) return;
        setReveal(4);
        await wait(GRAD_DUR);
        // loop back to top — held visible time fires again
      }
    };
    run();
    return () => { alive = false; if (timer) clearTimeout(timer); };
  }, [reduced]);

  if (reduced) {
    return (
      <h2 className="h-display h-display-lg concept__hook-title">
        <span className="concept__hook-row">We turn <em>AI</em></span>
        <span className="concept__hook-row">into <em>ROI</em></span>
      </h2>
    );
  }

  const SOFT_EASE = [0.22, 1, 0.36, 1];
  const variantsStatic = {
    hidden:  { opacity: 0, filter: 'blur(10px)', transition: { duration: 1.6, ease: SOFT_EASE } },
    visible: { opacity: 1, filter: 'blur(0px)',  transition: { duration: 1.4, ease: SOFT_EASE } },
  };
  const variantsGrad = {
    hidden:  { opacity: 0, filter: 'blur(16px)', transition: { duration: 1.6, ease: SOFT_EASE } },
    visible: { opacity: 1, filter: 'blur(0px)',  transition: { duration: 1.6, ease: SOFT_EASE } },
  };

  return (
    <h2
      className="h-display h-display-lg concept__hook-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className="concept__hook-row">
        <span className="concept__hook-static">
          <motion.span
            variants={variantsStatic}
            initial="hidden"
            animate={reveal >= 1 ? 'visible' : 'hidden'}
          >
            We turn
          </motion.span>
        </span>
        {' '}
        <span className="concept__hook-slot">
          <motion.em
            variants={variantsGrad}
            initial="hidden"
            animate={reveal >= 2 ? 'visible' : 'hidden'}
          >
            {HOOK_LEFT[i]}
          </motion.em>
        </span>
      </span>
      <span className="concept__hook-row">
        <span className="concept__hook-static">
          <motion.span
            variants={variantsStatic}
            initial="hidden"
            animate={reveal >= 3 ? 'visible' : 'hidden'}
          >
            into
          </motion.span>
        </span>
        {' '}
        <span className="concept__hook-slot">
          <motion.em
            variants={variantsGrad}
            initial="hidden"
            animate={reveal >= 4 ? 'visible' : 'hidden'}
          >
            {HOOK_RIGHT[i]}
          </motion.em>
        </span>
      </span>
    </h2>
  );
}

/* 1:1 with the 6-stage Stack — each row mirrors one Offerings stage so the
   Concept story and the Offerings story reinforce each other. Ids match
   STAGES[].key so the mapping is self-documenting. */
const MACHINE_INPUTS = [
  { id: 'found',    num: '25', label: 'Searches made where you didn’t come up', body: 'Invisible online' },
  { id: 'capture',  num: '12', label: 'Missed calls a day',                     body: 'Missed inquiries' },
  { id: 'generate', num: '3',  label: 'Referrals each month',                   body: 'No pipeline' },
  { id: 'activate', num: '60', label: 'Mins to first response',                 body: 'Slow follow-up' },
  { id: 'close',    num: '4',  label: 'Days proposals sit unsent',              body: 'Stuck at the proposal' },
  { id: 'process',  num: '5',  label: 'Days to invoice a customer',             body: 'Invoice chaos' },
];
const MACHINE_OUTPUTS = [
  { id: 'found',    num: '0',  unit: '', label: 'Missed opportunities', body: 'SEO & AEO so you come up first in any search' },
  { id: 'capture',  num: '0',  unit: '', label: 'Missed enquiries',     body: '24/7 AI Receptionist' },
  { id: 'generate', num: '50', unit: '', label: 'Fit leads daily',      body: 'Automated pipeline generation' },
  { id: 'activate', num: '5',  unit: '', label: 'Min auto follow-up',   body: 'Always-on AI assistant' },
  { id: 'close',    num: '0',  unit: '', label: 'Days to onboarding',   body: 'Auto-sent, signed and onboarded — same day' },
  { id: 'process',  num: '5',  unit: '', label: 'Min invoice turnaround', body: 'Auto-invoiced the moment they sign' },
];

function CounterTile({ tile, active, reduced, kickoff }) {
  /* numeric portion of `num` (handles £3.2k, −18, 24/7, 0, '5'). */
  const numeric = React.useMemo(() => {
    const m = String(tile.num).match(/-?\d+(?:\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }, [tile.num]);
  const mv = useMotionValue(0);
  const [text, setText] = React.useState(reduced || numeric == null ? tile.num : tile.num.replace(/-?\d+(?:\.\d+)?/, '0'));
  React.useEffect(() => {
    if (!kickoff || numeric == null || reduced) {
      setText(tile.num);
      return;
    }
    const controls = animate(mv, numeric, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        const formatted = Number.isInteger(numeric)
          ? Math.round(v).toString()
          : v.toFixed(1);
        setText(tile.num.replace(/-?\d+(?:\.\d+)?/, formatted));
      },
    });
    return () => controls.stop();
  }, [kickoff, numeric, reduced, tile.num, mv]);
  return (
    <motion.div
      className={'concept__tile' + (active ? ' is-active' : '')}
      animate={{
        scale: active ? 1.04 : 1,
        borderColor: active ? 'rgba(0,128,228,0.55)' : 'rgba(255,255,255,0.10)',
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="concept__tile-num">{text}</div>
      {tile.unit ? <div className="concept__tile-unit">{tile.unit}</div> : null}
      <div className="concept__tile-lbl">{tile.label}</div>
      {tile.body ? <div className="concept__tile-body">{tile.body}</div> : null}
    </motion.div>
  );
}

function ConceptMachine({ reduced }) {
  const ref = React.useRef(null);
  const [hover, setHover] = React.useState(null);
  const [kickoff, setKickoff] = React.useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'center 30%'],
  });

  React.useEffect(() => {
    if (reduced) { setKickoff(true); return; }
    const u = scrollYProgress.on('change', (v) => { if (v > 0.5) setKickoff(true); });
    return () => u();
  }, [reduced, scrollYProgress]);

  return (
    <div className="concept__machine" ref={ref}>
      <div className="concept__machine-head">
        <span className="concept__machine-eyebrow">How it works</span>
        <h3 className="concept__machine-title">
          Your data in. <em>Our results out</em>
        </h3>
        <motion.span
          aria-hidden="true"
          className="concept__machine-underline"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <ul className="concept__machine-rows" role="list">
        <li className="concept__machine-headers" aria-hidden="true">
          <span>What goes in</span>
          <span/>
          <span>What comes out</span>
        </li>
        {MACHINE_INPUTS.map((it, i) => {
          const out = MACHINE_OUTPUTS[i];
          const active = hover === it.id;
          return (
            <li
              key={it.id}
              className={'concept__mrow' + (active ? ' is-active' : '')}
              onMouseEnter={() => setHover(it.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(it.id)}
              onBlur={() => setHover(null)}
              tabIndex={0}
            >
              <motion.div
                className={'concept__mrow-input' + (it.num ? ' concept__mrow-input--rich' : '')}
                initial={reduced ? false : { opacity: 0, x: -28 }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
              >
                {it.num ? (
                  <>
                    <div className="concept__mrow-input-num">{it.num}</div>
                    <div className="concept__mrow-input-lbl">{it.label}</div>
                    {it.body ? <div className="concept__mrow-input-body">{it.body}</div> : null}
                  </>
                ) : (
                  <>
                    <span className="concept__mrow-ico"><I name={it.icon} size={18}/></span>
                    <span className="concept__mrow-lbl">{it.label}</span>
                  </>
                )}
              </motion.div>
              <div className="concept__mrow-arrow" aria-hidden="true">
                <I name="arrow-right" size={18}/>
              </div>
              <motion.div
                className="concept__mrow-output"
                initial={reduced ? false : { opacity: 0, x: 28 }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: 0.08 * i + 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <CounterTile tile={out} active={active} reduced={reduced} kickoff={kickoff}/>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ConceptHandoff({ onNav, reduced }) {
  const lines = ["You stay focused on your business.", "Whilst we turn AI into ROI"];
  return (
    <div className="concept__handoff">
      <motion.h3
        className="concept__handoff-line"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : 0.05, delayChildren: 0.05 } },
        }}
        aria-label={lines.join(' ')}
      >
        {lines.map((rowText, ri) => { const ws = rowText.split(' '); return (
          <span key={ri} className="concept__handoff-line-row">
          {ws.map((w, wi) => {
          const i = wi; const words = ws;
          const accent = w === 'AI' || w === 'ROI';
          return (
          <motion.span
            key={i}
            aria-hidden="true"
            className={'concept__handoff-word' + (accent ? ' concept__handoff-word--accent' : '')}
            variants={{
              hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
              show:   { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
          );
        })}
        </span>
        ); })}
      </motion.h3>
      <span className="concept__handoff-pulse" aria-hidden="true"/>
      <div className="concept__handoff-ctas">
        <button className="btn btn--primary" onClick={() => onNav('contact')}>
          Book a 30-min call <I name="arrow-right" size={16}/>
        </button>
        <button className="btn btn--glass" onClick={() => onNav('stack')}>
          See what we ship
        </button>
      </div>
    </div>
  );
}

export function ConceptSection({ onNav }) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      className="section deep on-dark concept"
      id="sec-concept"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="glow-blob b2" style={{ top: '15%', right: '6%', left: 'auto' }}/>
      <div className="glow-blob b3" style={{ top: '60%', left: '4%' }}/>
      <div className="container">
        {/* Act 1 — Hook */}
        <motion.div className="concept__hook" {...REVEAL}>
          <div className="h-eyebrow">Concept</div>
          <HookHeadline reduced={reduced}/>
          <p className="h-lede concept__hook-lede">
            For all businesses that want results, not jargon. We build the AI
            behind the scenes — you keep doing what you do best.
          </p>
        </motion.div>

        {/* Act 2 — Interactive AI→ROI machine (translator-style rows) */}
        <motion.div {...REVEAL_QUICK}>
          <ConceptMachine reduced={reduced}/>
        </motion.div>

        {/* Act 3 — Handoff */}
        <motion.div {...REVEAL_QUICK}>
          <ConceptHandoff onNav={onNav} reduced={reduced}/>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ─── Stack diagram ───────────────────────────────────────────── */
export function StackSection({ onNav }) {
  const [active, setActive] = React.useState(0);
  const stage = STAGES[active];
  const fillPct = (active / (STAGES.length - 1)) * 100;
  return (
    <motion.section className="section deep on-dark" id="sec-stack" {...REVEAL}>
      <div className="glow-blob b3" style={{ top:'10%', left:'5%' }}/>
      <div className="container">
        <div className="section-head">
          <div className="h-eyebrow">Offerings</div>
          <h2 className="h-display h-display-lg">Growth happens in <em>stages</em>. We ship across all of them.</h2>
          <p className="h-lede">Buy what you need now, add the rest later. No awkward hand-offs between tools — and no awkward hand-offs from us either.</p>
        </div>

        <div className="stack-row">
          {STAGES.map((s, i) => (
            <motion.button
              key={s.key}
              className={'stack-card' + (i === active ? ' is-active' : '')}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => onNav('stage:' + s.key)}
              aria-label={'Open Stage ' + s.num + ' · ' + s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="stack-card__num">STAGE {s.num}</div>
              <div className="stack-card__icon"><I name={s.icon} size={20}/></div>
              <h3 className="stack-card__title">{s.name}</h3>
              <p className="stack-card__sub">{s.outcome}</p>
              <span className="stack-card__open" aria-label="Open"><span className="stack-card__chev">›</span></span>
            </motion.button>
          ))}
          <div className="stack-rail">
            <motion.div
              className="stack-rail__fill"
              animate={{ width: fillPct + '%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.div
              className="stack-rail__avatar"
              animate={{ left: fillPct + '%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.div
              className="stack-rail__label"
              animate={{ left: fillPct + '%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >Customer journey</motion.div>
          </div>
        </div>

        <div className="stack-detail">
          <div>
            <div className="h-eyebrow">Stage {stage.num} · {stage.name}</div>
            <h3 className="h-display h-display-md on-dark" style={{ margin:'10px 0 14px' }}>{stage.detail.headline}</h3>
            <p className="h-lede on-dark" style={{ marginBottom: 18 }}>{stage.detail.lede}</p>
            <div className="row">
              <button className="btn btn--primary" onClick={() => onNav('stage:' + stage.key)}>Open Stage {stage.num} <I name="arrow-right" size={16}/></button>
              <button className="btn btn--glass" onClick={() => onNav('contact')}>Talk to us about {stage.name}</button>
            </div>
          </div>
          <ul style={{ listStyle:'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap: 10 }}>
            {stage.detail.bullets.map((b,i) => (
              <li key={i} style={{ display:'flex', gap: 12, padding:'12px 14px', borderRadius: 12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ flex:'0 0 22px', height: 22, borderRadius: 6, background:'rgba(0,128,228,0.20)', display:'grid', placeItems:'center', color:'var(--h8-blue-50)' }}>
                  <I name="check" size={14}/>
                </span>
                <span className="h-body on-dark" style={{ fontSize: 14.5, color:'rgba(255,255,255,0.82)' }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}

/* ─── Pricing Ladder ─────────────────────────────────────────── */
export function PricingSection({ onNav }) {
  return (
    <motion.section className="section light" id="sec-pricing" {...REVEAL}>
      <div className="container">
        <div className="section-head">
          <div className="h-eyebrow">Pricing · The Ladder</div>
          <h2 className="h-display h-display-lg">Three tiers. <em>Indicative</em>. Final number after a 30-min call.</h2>
          <p className="h-lede">Bespoke build, production-grade, brand-grade — priced like grown-ups. GBP, never USD. Engagement-based, not seat-based.</p>
        </div>

        <div className="ladder">
          {[
            { tier:'C', name:'We Can Deliver',  price:'12k', suffix:'+ from', tag:'Single stage, fixed scope',
              feats:['One stage of the Stack, end-to-end', 'Brand-grade build, production-grade ship', 'Named owner, weekly UAT', 'Run plan + handover documentation'],
              foot:'Right when you have a single, well-defined revenue gap.' },
            { tier:'B', name:'Fully Loaded',    price:'35k', suffix:'+ from', tag:'Multi-stage, integrated',
              feats:['Two-to-three stages, wired together', 'Bespoke templates and brand layer', 'Discovery + Pilot + Build + Run', 'Quarterly business review with the owner'],
              foot:'Right when revenue work spans capture, activate and close.' },
            { tier:'A', name:'Team-Grade',      price:'80k', suffix:'+ from', tag:'Full Stack, run by us',
              feats:['Full Stack — 0 through 5', 'Managed Close & Sign included', 'Reliability + observability tier', 'Embedded delivery lead, monthly board pack'],
              foot:'Right when you want a partner who hits renewal dates.' },
          ].map((t,i) => (
            <motion.div
              key={i}
              className="card-light ladder-card"
              data-tier={t.tier}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <div className="ladder-tier"><span className="ladder-tier__dot">{t.tier}</span> Tier {t.tier} · {t.tag}</div>
              <h3 className="ladder-name">{t.name}</h3>
              <div className="ladder-price">
                <span className="ladder-price__num">£{t.price}</span>
                <span className="ladder-price__suffix">{t.suffix}</span>
              </div>
              <ul className="ladder-list">
                {t.feats.map((f,j) => (<li key={j}><I name="check" size={16}/> {f}</li>))}
              </ul>
              <div className="ladder-foot">{t.foot}</div>
              <div style={{ marginTop: 18 }}>
                <button className="btn btn--primary" onClick={() => onNav('contact')} style={{ width:'100%', justifyContent:'center' }}>Get a tailored proposal <I name="arrow-right" size={16}/></button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="container-narrow" style={{ marginTop: 64, textAlign:'center' }}>
          <div className="h-eyebrow" style={{ display:'inline-block', marginBottom: 14 }}>Cost-of-missed-inquiry</div>
          <CostSwitcher/>
        </div>
      </div>
    </motion.section>
  );
}

function CostSwitcher() {
  const sectors = [
    { k:'dentist',    label:'Premium dentist',   value:'£3,200', detail:'Avg lifetime value of a cosmetic-dentistry case (UK).' },
    { k:'aesthetic',  label:'Aesthetic clinic',  value:'£1,800', detail:'Avg first treatment + 12-month follow-on programme.' },
    { k:'building',   label:'Building firm',     value:'£42,000',detail:'Avg refurbishment project (sweet-spot ICP, UK).' },
    { k:'electrician',label:'Electrician',       value:'£480',   detail:'Avg domestic job size, UK Floor-tier benchmark.' },
  ];
  const [s, setS] = React.useState(0);
  const cur = sectors[s];
  return (
    <div className="cost-switch">
      <div>
        <div className="h-eyebrow" style={{ marginBottom: 8, display:'inline-block' }}>What's a missed inquiry worth to a…</div>
        <div className="cost-switch__pills">
          {sectors.map((x,i) => (
            <button key={x.k} className={'cost-switch__pill' + (i === s ? ' is-active' : '')} onClick={() => setS(i)}>
              {x.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <motion.div
          key={cur.k}
          className="cost-switch__num"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >{cur.value}</motion.div>
        <div className="cost-switch__caption">{cur.detail}<br/>Stage 2 · Capture pays for itself the first month it stops one.</div>
      </div>
    </div>
  );
}

/* ─── Delivery Timeline ──────────────────────────────────────── */
function DeliverCycleGraphic() {
  const phases = [
    { name: 'Discovery', short: 'DISC' },
    { name: 'Pilot',     short: 'PILOT' },
    { name: 'Build',     short: 'BUILD' },
    { name: 'Grow',      short: 'GROW' },
    { name: 'Run',       short: 'RUN' },
  ];
  const cx = 200, cy = 200, r = 130;
  const pts = phases.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / phases.length;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a };
  });
  return (
    <div className="deliver-graphic" aria-hidden="true">
      <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="dg-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0080E4"/>
            <stop offset="100%" stopColor="#7D41B9"/>
          </linearGradient>
          <radialGradient id="dg-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="rgba(0,128,228,0.40)"/>
            <stop offset="60%" stopColor="rgba(125,65,185,0.18)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <filter id="dg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <circle cx={cx} cy={cy} r={r + 28} fill="none"
          stroke="rgba(255,255,255,0.18)" strokeWidth="1"
          strokeDasharray="2 8" />

        <circle cx={cx} cy={cy} r="70" fill="url(#dg-core)"/>

        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="url(#dg-stroke)" strokeWidth="2"
          strokeDasharray="4 6"
          opacity="0.55"/>

        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="url(#dg-stroke)" strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * r * 0.18} ${2 * Math.PI * r}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#dg-glow)">
          <animateTransform attributeName="transform" type="rotate"
            from={`-90 ${cx} ${cy}`} to={`270 ${cx} ${cy}`}
            dur="14s" repeatCount="indefinite"/>
        </circle>

        {pts.map((p, i) => {
          const isHero = i === 2;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={isHero ? 14 : 10}
                fill={isHero ? 'url(#dg-stroke)' : 'rgba(10,15,30,0.95)'}
                stroke="url(#dg-stroke)" strokeWidth={isHero ? 0 : 2}
                filter={isHero ? 'url(#dg-glow)' : undefined}/>
              {isHero && (
                <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="url(#dg-stroke)" strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="r" from="14" to="26" dur="2.6s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.5" to="0" dur="2.6s" repeatCount="indefinite"/>
                </circle>
              )}
              <text
                x={p.x + Math.cos(p.a) * 32}
                y={p.y + Math.sin(p.a) * 32 + 4}
                textAnchor={Math.cos(p.a) > 0.3 ? 'start' : Math.cos(p.a) < -0.3 ? 'end' : 'middle'}
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
                fontSize="11" letterSpacing="2"
                fill="rgba(255,255,255,0.85)">
                {phases[i].short}
              </text>
            </g>
          );
        })}

        <path d="M 200 60 a 8 8 0 0 1 -10 6"
          fill="none" stroke="url(#dg-stroke)" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M 192 64 l -4 4 l 6 1 z" fill="url(#dg-stroke)"/>

        <text x={cx} y={cy - 6} textAnchor="middle"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="10" letterSpacing="2.4" fill="rgba(255,255,255,0.55)">
          DELIVERY CYCLE
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle"
          fontFamily="'Instrument Serif', serif"
          fontSize="22" fontStyle="italic" fill="#fff">
          rinse &amp;
        </text>
        <text x={cx} y={cy + 38} textAnchor="middle"
          fontFamily="'Instrument Serif', serif"
          fontSize="22" fontStyle="italic" fill="#fff">
          repeat
        </text>
      </svg>
      <div className="deliver-graphic__chip deliver-graphic__chip--tl">
        <div className="dgchip__num">1×</div>
        <div className="dgchip__lbl">Named owner per stage</div>
      </div>
      <div className="deliver-graphic__chip deliver-graphic__chip--br">
        <div className="dgchip__num">7d</div>
        <div className="dgchip__lbl">UAT cadence</div>
      </div>
    </div>
  );
}

export function DeliverSection({ onNav }) {
  return (
    <motion.section className="section deliver-section" id="sec-deliver" {...REVEAL}>
      <div className="glow-blob b1" style={{ top:'-20%', right:'-10%', left:'auto' }}/>
      <div className="container">
        <div className="deliver-head">
          <div className="section-head" style={{ textAlign:'left', maxWidth: 640, margin: 0 }}>
            <div className="h-eyebrow">Delivery</div>
            <h2 className="h-display h-display-lg">Discovery, Pilot, Build, Grow, Run — <em>rinse and repeat</em>.</h2>
          </div>
          <DeliverCycleGraphic/>
        </div>
        <p className="h-lede" style={{ marginLeft: 0, marginTop: 24, maxWidth: 720 }}>Named owner. Weekly UAT. We hit renewal dates. The boring promise that beats every flashy one.</p>

        <div className="timeline">
          <div className="timeline-axis">
            {[
              { name:'Discovery', time:'1 wk',     fill:'14%',  pills:['Owner: Strategy lead','Workshop + audit'], detail:'We map your revenue stack, name the gaps, agree the scope. You leave with a one-page plan.' },
              { name:'Pilot',     time:'1 wk',     fill:'28%',  pills:['Owner: Solutions eng','Working slice'],   detail:'A small, real slice shipped end-to-end so the team trusts the approach before we scale.' },
              { name:'Build',     time:'4–8 wks',  fill:'60%',  pills:['Owner: Delivery lead','Weekly UAT'],       detail:'Production-grade build with weekly demos. You see it, you sign it off, we move on.' },
              { name:'Grow',      time:'4–6 wks',  fill:'80%',  pills:['Owner: Growth lead','Iteration sprints'], detail:'We tune what is shipped — funnels, prompts, models, copy — until the metrics that matter actually move.' },
              { name:'Run',       time:'ongoing',  fill:'100%', pills:['Owner: HAIM8 ops','Monthly review'],       detail:'We run it. Observability, on-call, monthly business review. You get the upside; we get the bleep.' },
            ].map((p,i) => (
              <motion.div
                key={i}
                className="timeline-phase"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="timeline-phase__head">
                  <span className="timeline-phase__name">{p.name}</span>
                  <span className="timeline-phase__time">{p.time}</span>
                </div>
                <div className="timeline-phase__bar"><span style={{ width: p.fill }}/></div>
                {p.pills.map((x,j) => (<span key={j} className="timeline-phase__pill"><I name={j === 0 ? 'flag' : 'doc'} size={11}/> {x}</span>))}
                <div className="timeline-phase__detail">{p.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="row" style={{ marginTop: 36 }}>
          <button className="btn btn--primary" onClick={() => onNav('contact')}>Book discovery <I name="arrow-right" size={16}/></button>
          <button className="btn btn--glass" onClick={() => onNav('deliver')}>Read the delivery doctrine</button>
        </div>
      </div>
    </motion.section>
  );
}

/* ─── Why now ──────────────────────────────────────────────────
   The case for moving on AI now rather than later. Stub copy — same
   structure as ValuesSection so it lands consistently with the rest
   of the page. Anchored at #sec-whynow for the nav 'Why now' tab. */
export function WhyNowSection() {
  const reasons = [
    { title: 'Costs collapsed',
      copy: 'What cost £50k a year ago costs £500 now. The companies who waited are paying the same price as the ones who moved — but a year behind.' },
    { title: 'The tools work',
      copy: 'Not "demo work" — actual production-grade work. Drafting, sorting, scheduling, replying. The same capability that drove your competitors’ margins last quarter.' },
    { title: 'Customers noticed',
      copy: 'A 3-minute reply is the floor now, not the ceiling. The speed your customers got from someone else this morning is the speed they’ll expect from you tomorrow.' },
    { title: 'The window is open, briefly',
      copy: 'First-movers in your sector are stitching AI advantages together right now. The gap they’re building closes faster the longer you wait.' },
  ];
  return (
    <motion.section className="section deep on-dark" id="sec-whynow" {...REVEAL}>
      <div className="glow-blob b3" style={{ top: '15%', left: '10%' }}/>
      <div className="container">
        <div className="section-head">
          <div className="h-eyebrow">Timing</div>
          <h2 className="h-display h-display-lg">AI just crossed the line from <em>toy</em> to tool.</h2>
          <p className="h-lede">The price dropped, the capability arrived, and your customers noticed. Four reasons the next twelve months matter more than the last twelve.</p>
        </div>
        <div className="values-grid">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              className="values-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <span className="values-card__num">0{i + 1} / 0{reasons.length}</span>
              <h3 className="values-card__title">{r.title}<em>.</em></h3>
              <p className="values-card__copy">{r.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ─── Customers / Lighthouse ─────────────────────────────────── */
export function CustomersSection({ onNav }) {
  return (
    <motion.section className="section subtle" id="sec-customers" {...REVEAL}>
      <div className="container">
        <div className="section-head">
          <div className="h-eyebrow">Customers</div>
          <h2 className="h-display h-display-lg">
            Work that{' '}
            <motion.em
              initial={{ opacity: 0, filter: 'blur(12px)', y: 6 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              style={{ display: 'inline-block' }}
            >belongs</motion.em>
            {' '}in the software it lives in
          </h2>
          <p className="h-lede">The platform looks hand-made for them — because it is. Three real engagements, three different shapes of growth work.</p>
        </div>

        <div className="lighthouse">
          {[
            { tag:'Stage 3 + 4', quote:'A UK insolvency-intelligence firm. Daily signal-driven pipeline, plus 5-minute first-touch SLA wired into their CRM.',
              meta:[['Stages','Generate · Activate'],['Shipped in','4 weeks'],['Posture',['A-grade security','UK GDPR']],['Sign-off','Pending — name on request']] },
            { tag:'Stage 1 + 5', quote:'A premium private clinic group. A site that signals premium, AI-search visibility, and Close & Sign run by us across three locations.',
              meta:[['Stages','Search · Close'],['Shipped in','5 weeks'],['Posture',['A-grade security','UK GDPR','Multi-tenancy']],['Sign-off','Pending — name on request']] },
            { tag:'Full Stack', quote:'A leading events waste-management company. End-to-end — from getting found to onboarding — with a separate portal for each event.',
              meta:[['Stages','Full Stack'],['Shipped in','6 weeks'],['Posture',['A-grade security','UK GDPR + DPA','Multi-tenancy']],['Sign-off','Pending — name on request']] },
          ].map((c,i) => (
            <motion.div
              key={i}
              className="card-light lighthouse-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <div className="lighthouse-card__tag">{c.tag}</div>
              <p className="lighthouse-card__quote">"{c.quote}"</p>
              <div className="lighthouse-card__meta">
                {c.meta.map(([k,v],j) => (
                  <div key={j}>
                    <div className="lighthouse-card__meta-k">{k}</div>
                    {Array.isArray(v)
                      ? v.map((line, m) => <div key={m} className="lighthouse-card__meta-v">{line}</div>)
                      : <div className="lighthouse-card__meta-v">{v}</div>}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ─── Closing CTA ────────────────────────────────────────────── */
export function ClosingCTA({ onNav }) {
  return (
    <motion.section className="section deep on-dark" style={{ paddingTop: 100, paddingBottom: 100 }} {...REVEAL}>
      <div className="glow-blob b1" style={{ left:'30%', top:'-20%' }}/>
      <div className="glow-blob b2"/>
      <div className="container-narrow" style={{ textAlign:'center' }}>
        <div className="h-eyebrow" style={{ display:'inline-block', marginBottom: 16 }}>Next step</div>
        <h2 className="h-display h-display-lg" style={{ color:'var(--h8-white)' }}>Tell us where the <em>revenue</em> leaks. We'll show you what to ship.</h2>
        <p className="h-lede on-dark" style={{ margin:'18px auto 28px', maxWidth: 620 }}>30 minutes. UK GBP-friendly proposal. No SaaS sales cadence. No "free trial" theatre.</p>
        <div className="row" style={{ justifyContent:'center' }}>
          <button className="btn btn--primary" onClick={() => onNav('contact')}>Book a 30-min strategy call <I name="arrow-right" size={16}/></button>
          <button className="btn btn--glass" onClick={() => onNav('audit')}>Audit my online presence</button>
        </div>
      </div>
    </motion.section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */
export function Footer({ onNav }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__cols">
          <div className="footer__brand">
            <Wordmark height={28}/>
            <p className="footer__pitch">Software that helps you grow — built for businesses that should look as good as they are. UK Ltd. Built in Britain.</p>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">The Stack</h4>
            <ul>
              {STAGES.map(s => <li key={s.key} onClick={() => onNav('stage:' + s.key)}>{s.num} · {s.name}</li>)}
            </ul>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Company</h4>
            <ul>
              <li onClick={() => onNav('concept')}>Concept</li>
              <li onClick={() => onNav('stack')}>Offerings</li>
              <li onClick={() => onNav('customers')}>Customers</li>
              <li onClick={() => onNav('deliver')}>Delivery</li>
              <li onClick={() => onNav('whynow')}>Timing</li>
            </ul>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Trust</h4>
            <ul>
              <li onClick={() => onNav('reliability')}>Reliability</li>
              <li onClick={() => onNav('security')}>Security &amp; Compliance</li>
              <li>UK GDPR · DPA</li>
              <li>UK Ltd · Companies House</li>
            </ul>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <ul>
              <li onClick={() => onNav('contact')}>Book a strategy call</li>
              <li onClick={() => onNav('contact')}>Get a tailored proposal</li>
              <li>hello@haim8.co.uk</li>
            </ul>
          </div>
        </div>
        <div className="footer__base">
          <span>© HAIM8 Ltd. All prices in GBP. Indicative until discovery.</span>
          <span>Built in the UK · Hand-made, production-ready, brand-grade</span>
        </div>
      </div>
    </footer>
  );
}
