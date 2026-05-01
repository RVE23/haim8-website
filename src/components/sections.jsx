/* HAIM8 page sections — composed in App.jsx
   Ported from project/sections.jsx. Differences from the prototype:
     - ESM imports instead of globals
     - Hero is stripped to logo + slogan + cosmic backdrop + scroll indicator
     - Each top-level section animates in via motion's whileInView
     - Buttons get a subtle whileHover/whileTap micro-interaction
*/
import React from 'react';
import { motion } from 'motion/react';
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
  { num: '00', key: 'found',    icon: 'magnifier', name: 'Be Found',  outcome: 'Brand-grade site that shows up — on Google and in AI search.', emWord: 'deserve',
    detail: { headline: <>You <em>deserve</em> to be found.</>,
      lede: 'A site that signals premium. Schema, structured data and AI-search visibility set up properly. Google Business owned, not abandoned.',
      bullets: ['Branded marketing site, brand-grade build', 'Schema, structured data, technical SEO foundation', 'AI-search / LLM visibility configured', 'Google Business presence — owned, not abandoned'] }},
  { num: '01', key: 'capture',  icon: 'chat',      name: 'Capture',   outcome: 'Never miss an inquiry — after-hours, weekends, on jobs.', emWord: 'miss',
    detail: { headline: <>Stop losing <em>inquiries</em> after hours.</>,
      lede: 'AI concierge handles web chat, after-hours email triage, voice deflection and missed-call rescue. Warm leads routed to a human in seconds.',
      bullets: ['Web chat trained on your services and tone', 'After-hours email triage and reply-drafting', 'Voice-call deflection and missed-call rescue', 'Warm-lead routing to phone, SMS or owner inbox'] }},
  { num: '02', key: 'generate', icon: 'chart',     name: 'Generate',  outcome: 'Daily, signal-driven pipeline — beyond referrals.', emWord: 'referrals',
    detail: { headline: <>Pipeline beyond <em>referrals</em>.</>,
      lede: 'Sector-targeted scrape, enrich, score, drop into the CRM — refreshed daily. We write the signals. You work the list.',
      bullets: ['Sector-targeted prospecting on real signals', 'Enrichment, scoring and dedupe before CRM hand-off', 'Daily refresh — fresh leads every morning', 'You see the source on every record'] }},
  { num: '03', key: 'activate', icon: 'bolt',      name: 'Activate',  outcome: 'First contact in 5 minutes, every time.', emWord: '5 minutes',
    detail: { headline: <>From lead to first call in <em>5 minutes</em>.</>,
      lede: 'Auto follow-up orchestration. Callback scheduler, sequence sender, nurture flows, SLA timer per lead. No spreadsheet, no rot.',
      bullets: ['Callback scheduler with owner SLA timer', 'Sequence sender with brand-grade templates', 'Nurture flows that pause when humans take over', 'Per-lead audit trail — every touch, every hour'] }},
  { num: '04', key: 'close',    icon: 'sign',      name: 'Close',     outcome: 'Proposals, contracts and signatures — done for you.', emWord: 'done for you',
    detail: { headline: <>Close & Sign — <em>done for you</em>.</>,
      lede: 'Managed Contract & Signature Automation. We build the templates, wire the send-sequence, track sent → viewed → signed, and trigger onboarding the moment a contract is countersigned.',
      bullets: ['Proposal, MSA, NDA and schedule templates — drafted by us', 'Send-sequence: draft → revise → final → sign', 'Status tracking sent / viewed / signed in one view', 'Auto-trigger onboarding when contracts countersign', 'Simple CRM setup and a deal-predictability dashboard'] }},
  { num: '05', key: 'process',  icon: 'gear',      name: 'Process',   outcome: 'Onboard a customer in minutes, not days.', emWord: 'minutes, not days',
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
        <Item id="values" label="Values" />
        <div className="nav__menu" ref={menuRef}>
          <button
            className={'nav__link' + (active === 'stack' || active === 'stage' ? ' active' : '')}
            onClick={() => setOpenStack(o => !o)}
            aria-haspopup="true"
            aria-expanded={openStack}
          >
            The Stack <I name="down" size={14}/>
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
        <Item id="deliver"   label="How we deliver" />
        <Item id="about"     label="About" />
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
        <div className="hero-cosmos__stars"/>
        <div className="hero-cosmos__stars hero-cosmos__stars--mid"/>
        <div className="hero-cosmos__nebula"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--lg"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--lg2"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--md"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--sm"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--sm2"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--sm3"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--corner"/>
        <div className="hero-cosmos__flare hero-cosmos__flare--corner2"/>
        <div className="hero-cosmos__shoot"/>
        <div className="hero-cosmos__shoot hero-cosmos__shoot--alt"/>
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

/* ─── Values ──────────────────────────────────────────────────── */
/* The H stands for: Helpful, Handy, Honest.
   Stub starting content from the partner-site values; user can refine copy
   without restructure. Anchored at #sec-values for the nav Values tab. */
export function ValuesSection() {
  const values = [
    { title: 'Helpful',
      copy: 'We do the hard thinking so you don’t have to. The answer is always clearer than the problem.' },
    { title: 'Handy',
      copy: 'Things actually ship. Nothing stays in planning for longer than it takes to build it.' },
    { title: 'Honest',
      copy: 'Real numbers, real timelines, real trade-offs. No agency theatre — just the work.' },
  ];
  return (
    <motion.section className="section deep on-dark" id="sec-values" {...REVEAL}>
      <div className="glow-blob b2" style={{ top: '20%', right: '8%', left: 'auto' }}/>
      <div className="container">
        <div className="section-head">
          <div className="h-eyebrow">The H stands for</div>
          <h2 className="h-display h-display-lg">Three values. <em>Helpful, Handy, Honest.</em></h2>
          <p className="h-lede">The shape of how we work, named. The boring promise we keep that beats every flashy one.</p>
        </div>
        <div className="values-grid">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="values-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <span className="values-card__num">0{i + 1} / 03</span>
              <h3 className="values-card__title">{v.title}<em>.</em></h3>
              <p className="values-card__copy">{v.copy}</p>
            </motion.div>
          ))}
        </div>
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
          <div className="h-eyebrow">The Stack — 5 stages of revenue software</div>
          <h2 className="h-display h-display-lg">Revenue happens in <em>stages</em>. We ship across all of them.</h2>
          <p className="h-lede">Buy any stage on its own. Ladder up when you're ready. The customer journey doesn't break at a vendor handover — and neither do we.</p>
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
        <div className="cost-switch__caption">{cur.detail}<br/>Stage 1 · Capture pays for itself the first month it stops one.</div>
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
            <div className="h-eyebrow">How we deliver</div>
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

/* ─── Customers / Lighthouse ─────────────────────────────────── */
export function CustomersSection({ onNav }) {
  return (
    <motion.section className="section subtle" id="sec-customers" {...REVEAL}>
      <div className="container">
        <div className="section-head">
          <div className="h-eyebrow">Lighthouse customers · anonymised pending sign-off</div>
          <h2 className="h-display h-display-lg">Work that <em>belongs</em> in the business it lives in.</h2>
          <p className="h-lede">Bespoke build means the software looks like it was made for them — because it was. Three real engagements, three different shapes of revenue work.</p>
        </div>

        <div className="lighthouse">
          {[
            { tag:'Stage 2 + 3', quote:'A UK insolvency-intelligence firm. Daily signal-driven pipeline, plus 5-minute first-touch SLA wired into their CRM.',
              meta:[['Stages','Generate · Activate'],['Shipped in','6 weeks'],['Posture','A-grade security'],['Sign-off','Pending — name on request']] },
            { tag:'Stage 0 + 4', quote:'A premium private clinic group. Brand-grade marketing site, AI-search visibility, and Managed Close & Sign across three locations.',
              meta:[['Stages','Be Found · Close'],['Shipped in','9 weeks'],['Posture','UK GDPR'],['Sign-off','Pending — name on request']] },
            { tag:'Full Stack', quote:'A premium-construction PM firm. End-to-end revenue stack — from search through to onboarding portal — multi-tenant per project.',
              meta:[['Stages','Full Stack'],['Run by','HAIM8 ops'],['Posture','UK GDPR + DPA'],['Sign-off','Pending — name on request']] },
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
                  <div key={j}><div className="lighthouse-card__meta-k">{k}</div><div className="lighthouse-card__meta-v">{v}</div></div>
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
            <p className="footer__pitch">Revenue software for businesses that need to look as good as they are. UK Ltd. Built in Britain.</p>
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
              <li onClick={() => onNav('about')}>About</li>
              <li onClick={() => onNav('values')}>Values</li>
              <li onClick={() => onNav('customers')}>Customers</li>
              <li onClick={() => onNav('deliver')}>How we deliver</li>
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
          <span>Built in the UK · Bespoke build, production-grade, brand-grade</span>
        </div>
      </div>
    </footer>
  );
}
