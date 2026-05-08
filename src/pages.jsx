/* HAIM8 — Stack hub + 6 stage detail pages.
   Ported from project/pages.jsx (the prototype) into the Vite app. Globals
   replaced with ESM imports; motion entrances layered in. */
import React from 'react';
import { motion } from 'motion/react';
import { I } from './components/icons.jsx';
import { StageMotif } from './components/stage-motifs.jsx';
import { Nav, Footer } from './components/sections.jsx';

/* shared reveal spec — matches sections.jsx pattern */
const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

/* ─── Stage data (full copy + section content) ─────────────────── */
const STAGE_PAGES = [
  {
    key: 'found', num: '01', name: 'Search', icon: 'magnifier',
    tagline: 'Brand-grade site that shows up — on Google and in AI search.',
    challenge: {
      eyebrow: 'The problem',
      headline: <>You can't compete if you can't be <em>found</em>.</>,
      lede: 'A premium business with a templated, slow, half-cooked website signals the wrong thing in the first three seconds. Worse — Google and the new AI-search engines either don\'t see you, or see the wrong version of you.',
      points: [
        'Templated marketing site that says "freelancer," not "category leader"',
        'Schema and structured data missing — search engines guess at your offering',
        'Zero AI-search visibility — ChatGPT and Perplexity don\'t mention you',
        'Google Business profile abandoned, claimed by no one, full of stale info',
      ],
    },
    solution: {
      eyebrow: 'What we ship',
      headline: <>A site that <em>signals premium</em>, set up properly.</>,
      lede: 'Brand-grade marketing site, technical SEO foundation, AI-search visibility configured, Google Business owned. Production-grade build, not a template.',
      steps: [
        { n: '01', name: 'Brand-grade site', icon: 'magnifier', detail: 'A site built for you — made-to-measure, not a template. Performance, accessibility and trust signals baked in.' },
        { n: '02', name: 'Schema & SEO', icon: 'gear', detail: 'Structured data for services, locations, FAQs, reviews. Technical SEO foundation that takes the guesswork out of indexing.' },
        { n: '03', name: 'AI-search visibility', icon: 'bolt', detail: 'Configured to be cited by ChatGPT, Perplexity and Google AI overviews. Not gamed — set up properly, with the right signals.' },
      ],
    },
    outcome: {
      eyebrow: 'The outcome',
      number: '3s',
      label: 'is all you get to signal "category leader." We make those three seconds count.',
      pills: ['Brand-grade build', 'Schema configured', 'AI-search ready', 'Google Business owned'],
      pull: <>People who'd be a fit can finally find you — and when they land, they <em>stay</em>.</>,
    },
    impact: {
      eyebrow: 'What it moves',
      tiles: [
        { num: '47%', lbl: 'AI-citation lift', ctx: 'Average increase in AI-search visibility within 8 weeks of a structured-data + content-pass build.' },
        { num: '2.4×', lbl: 'Organic to-form rate', ctx: 'When the site signals "premium" rather than "templated," conversion on the same traffic roughly doubles.' },
        { num: '0', lbl: 'Templates we ship', ctx: 'No off-the-shelf themes. Every site is built from scratch, brand-grade, production-ready.' },
      ],
      ref: 'Indicative figures from Lighthouse engagements; final numbers depend on sector, baseline and scope.',
    },
  },
  {
    key: 'capture', num: '02', name: 'Capture', icon: 'chat',
    tagline: 'Never miss an inquiry — after-hours, weekends, on jobs.',
    challenge: {
      eyebrow: 'The problem',
      headline: <>Every missed inquiry is a <em>signed-up competitor</em>.</>,
      lede: 'A premium dentist case is worth £3,200. An aesthetic clinic course is £1,800. A construction refurb is £42,000. And the people who need them call after-hours, message on weekends, fill in forms while you\'re on a job. If no one answers, they keep scrolling.',
      points: [
        'Inquiries arriving outside 9–5 lose 70% of their conversion value within an hour',
        'Voicemail is a no-op — under-30s don\'t leave them and don\'t check yours',
        'Web-chat that times out feels worse than no chat at all',
        'Missed-call rescue is the highest-ROI software in your business',
      ],
    },
    solution: {
      eyebrow: 'What we ship',
      headline: <>An AI <em>concierge</em> that stays up so you don't have to.</>,
      lede: 'Web chat trained on your services and tone. After-hours email triage. Voice-call deflection and missed-call rescue. Warm leads routed to a human in seconds.',
      steps: [
        { n: '01', name: 'Trained concierge', icon: 'chat', detail: 'Web chat that knows your services, tone, pricing posture and what to escalate. Not a generic chatbot — your concierge.' },
        { n: '02', name: 'Triage + drafting', icon: 'doc', detail: 'After-hours email triaged, ranked, and replies drafted in your voice. Owner approves in one tap from the phone.' },
        { n: '03', name: 'Missed-call rescue', icon: 'bolt', detail: 'Voice deflection and instant SMS-back when calls miss. Warm leads routed to phone, SMS or owner inbox in seconds.' },
      ],
    },
    outcome: {
      eyebrow: 'The outcome',
      number: '5m',
      label: 'first-touch SLA on every inquiry — day, night, weekend, holiday.',
      pills: ['24/7 web chat', 'After-hours triage', 'Missed-call rescue', 'Warm-lead routing'],
      pull: <>Stage 2 typically <em>pays for itself</em> the first month it stops a missed inquiry.</>,
    },
    impact: {
      eyebrow: 'What it moves',
      tiles: [
        { num: '70%', lbl: 'Out-of-hours value retained', ctx: 'Inquiries that would have converted at 9am next day, captured the moment they arrive.' },
        { num: '£3.2k', lbl: 'Per saved dental case', ctx: 'Average lifetime value of a UK cosmetic-dentistry case. Stage 2 saves several per month.' },
        { num: '4m 12s', lbl: 'Avg first-touch time', ctx: 'Across Lighthouse tenants — well inside the 5-minute SLA, end-to-end.' },
      ],
      ref: 'Indicative; UK Lighthouse tenants. Stage 2 typically pays for itself within month one.',
    },
  },
  {
    key: 'generate', num: '03', name: 'Generate', icon: 'chart',
    tagline: 'Daily, signal-driven pipeline — beyond referrals.',
    challenge: {
      eyebrow: 'The problem',
      headline: <>Referrals are <em>love</em>, not strategy.</>,
      lede: 'When growth is 100% inbound, you\'re running on goodwill — not a pipeline. The day a major referrer leaves, retires or runs dry, the calendar empties. There is no "outbound team" coming to save a £3M business.',
      points: [
        'Referral-only growth caps at the size of your network — and so does your moat',
        'The first hire most owners regret is a "BDR" — list-buying without signal is noise',
        'Generic prospecting tools spam your inbox with 10k unfit leads, not 50 fit ones',
        'Sectors and triggers change weekly — last quarter\'s list is already stale',
      ],
    },
    solution: {
      eyebrow: 'What we ship',
      headline: <>A pipeline that <em>refreshes daily</em>, on signals you actually care about.</>,
      lede: 'We watch the right signs in your sector, find the matching businesses, and drop them in your CRM every morning. We pick the signals. You work the list.',
      steps: [
        { n: '01', name: 'Signal definition', icon: 'magnifier', detail: 'We sit down and figure out which signs matter — funding rounds, planning permission, hiring, content cadence — for the kind of customer you actually want.' },
        { n: '02', name: 'Daily scrape + enrich', icon: 'gear', detail: 'Sector-targeted scrape, checked against your CRM so nothing duplicates, filled out with company info and intent data. Refreshed every morning.' },
        { n: '03', name: 'Scored CRM hand-off', icon: 'check', detail: 'Each lead lands in your CRM with a fit score, the source signal, and a one-line "why now." Your team works the list — they don\'t hunt for it.' },
      ],
    },
    outcome: {
      eyebrow: 'The outcome',
      number: '50',
      label: 'leads in your CRM every morning — the ones worth a call, with the reason showing.',
      pills: ['Daily refresh', 'Signal-led', 'Ranked by fit', 'Source on every record'],
      pull: <>Your team stops <em>looking</em> for prospects and starts working them.</>,
    },
    impact: {
      eyebrow: 'What it moves',
      tiles: [
        { num: '12×', lbl: 'List-to-meeting rate', ctx: 'Versus generic data-vendor lists — because the signal is yours, not someone else\'s pre-canned ICP.' },
        { num: 'Daily', lbl: 'Refresh cadence', ctx: 'Every morning the list is fresh. No quarterly stale-data clean-up. No "we need to buy a new tool."' },
        { num: '£0', lbl: 'List-buying spend', ctx: 'You stop renting other people\'s data. Stage 3 is yours, by-name, with the signal trail.' },
      ],
      ref: 'Indicative; based on Lighthouse insolvency-intelligence engagement (Stage 3 + 4).',
    },
  },
  {
    key: 'activate', num: '04', name: 'Activate', icon: 'bolt',
    tagline: 'First contact in 5 minutes, every time.',
    challenge: {
      eyebrow: 'The problem',
      headline: <>Speed is the <em>cheapest</em> competitive advantage you're not using.</>,
      lede: 'A lead contacted within 5 minutes is 21× more likely to qualify than one contacted at the 30-minute mark. Most teams hit 5 minutes by accident, on a good day, when they\'re at their desk. The rest of the time the spreadsheet rots and the calendar leaks.',
      points: [
        'Sales reps quote "I\'ll call them back" — and 60% don\'t, within 24 hours',
        'Sequence tools sit dormant because no one updates the templates',
        'Owners can\'t see SLA breaches until the deal is already cold',
        'Nurture flows keep firing after a human takes over — and torch the trust',
      ],
    },
    solution: {
      eyebrow: 'What we ship',
      headline: <>Auto follow-up that <em>treats every lead like the first one</em>.</>,
      lede: 'Callback scheduler. Sequence sender. Nurture flows that pause when humans take over. A timer on every lead. No spreadsheet, no rot.',
      steps: [
        { n: '01', name: 'SLA timer + scheduler', icon: 'bolt', detail: 'Every inbound lead gets an SLA timer and a callback slot. Owners see breaches before they happen, not after the deal\'s cold.' },
        { n: '02', name: 'Brand-grade sequences', icon: 'doc', detail: 'Sequence sender with templates that read like a human wrote them — because we wrote them, in your voice. Not a Mailchimp wizard.' },
        { n: '03', name: 'Smart hand-off', icon: 'check', detail: 'Nurture flows that pause the moment a human replies. Per-lead audit trail — every touch, every hour, every channel.' },
      ],
    },
    outcome: {
      eyebrow: 'The outcome',
      number: '21×',
      label: 'higher qualification rate when first-touch is inside 5 minutes versus 30.',
      pills: ['5-min SLA', 'Sequence sender', 'Smart pause', 'Per-lead audit trail'],
      pull: <>Every lead gets the <em>first-call energy</em> — at 11pm and at 9am.</>,
    },
    impact: {
      eyebrow: 'What it moves',
      tiles: [
        { num: '5 min', lbl: 'First-touch SLA', ctx: 'Hard SLA per lead, breached-or-not visible to the owner in real time.' },
        { num: '0', lbl: 'Spreadsheets in the loop', ctx: 'Every touch is logged, audited, and visible on a single timeline per deal.' },
        { num: '+38%', lbl: 'Lead-to-qualified', ctx: 'Compared to "we have a CRM" baselines, when speed and templates ship together.' },
      ],
      ref: 'Indicative; benchmarks from US Inside Sales / MIT Lead Response Management. UK figures track within 10%.',
    },
  },
  {
    key: 'close', num: '05', name: 'Close', icon: 'sign',
    tagline: 'Proposals, contracts and signatures — done for you.',
    challenge: {
      eyebrow: 'The problem',
      headline: <>The <em>last mile</em> kills more deals than the pitch.</>,
      lede: 'You won the meeting. You agreed the price. Then the proposal sits in Word for three days, the MSA is on someone\'s desktop, the e-sign tool charges per seat and no one\'s admin\'d it in months. Deals don\'t die because you lost — they die because nobody pressed send.',
      points: [
        'Proposal, MSA, NDA and SoW templates in five different states across the team',
        'E-signature configured by an ex-employee, paid for, never used',
        'No visibility on sent / viewed / signed — the owner asks Slack three times a day',
        'When a contract finally signs, onboarding starts on Tuesday because no one\'s wired the trigger',
      ],
    },
    solution: {
      eyebrow: 'What we ship',
      headline: <>Close & <em>Sign</em>, done for you.</>,
      lede: 'We build the templates, send them, track sent → viewed → signed, and kick off onboarding the moment your customer signs. No more "where\'s that proposal?"',
      steps: [
        { n: '01', name: 'Template build', icon: 'doc', detail: 'Proposal, contract and schedule templates — drafted by us, reviewed by your counsel, typeset to look like your brand wrote them.' },
        { n: '02', name: 'Send-sequence', icon: 'bolt', detail: 'Draft → revise → final → sign, with status tracking sent / viewed / signed in one view. You see the funnel.' },
        { n: '03', name: 'Auto-onboarding trigger', icon: 'gear', detail: 'The moment the contract signs, onboarding kicks off — invoice, welcome email, portal account, kickoff call invite.' },
      ],
    },
    outcome: {
      eyebrow: 'The outcome',
      number: '0',
      label: 'days between signed contract and onboarding starting. Same minute, every time.',
      pills: ['Custom templates', 'Status tracking', 'Auto-trigger onboarding', 'One screen for every deal'],
      pull: <>Stage 5 is the difference between "we won the deal" and "the deal <em>actually closed</em>."</>,
    },
    impact: {
      eyebrow: 'What it moves',
      tiles: [
        { num: '−72%', lbl: 'Proposal-to-sign time', ctx: 'When templates, sequence and reminders ship together, weeks become days.' },
        { num: '+18%', lbl: 'Win-rate uplift', ctx: 'Same opportunities, materially better close — because the friction is removed, not the price.' },
        { num: '1 view', lbl: 'For every deal\'s state', ctx: 'Sent / viewed / signed / countersigned, per deal, per person — one screen for the owner.' },
      ],
      ref: 'Indicative; benchmarks from premium-clinic and PM-firm Lighthouse engagements.',
    },
  },
  {
    key: 'process', num: '06', name: 'Process', icon: 'gear',
    tagline: 'Onboard a customer in minutes, not days.',
    challenge: {
      eyebrow: 'The problem',
      headline: <>Onboarding is where <em>premium</em> brands start to feel cheap.</>,
      lede: 'You sold premium. Then onboarding is a chase: which form, which inbox, which spreadsheet, which login. The customer\'s first week with you is a worse experience than their first hour. That\'s how churn starts before delivery does.',
      points: [
        'Intake forms living in three different SaaS tools, none synced to the CRM',
        'Invoicing handled by an accounts inbox that batches once a week',
        'Onboarding email written in 2021, never updated, missing half the steps',
        'Customer portal? Either a £2k/month vendor mess or "email us, we\'ll help"',
      ],
    },
    solution: {
      eyebrow: 'What we ship',
      headline: <>Customer-ops automation that feels <em>made-for-you</em>.</>,
      lede: 'Intake → CRM → invoicing → onboarding email → portal. Multi-tenant where you need sub-accounts. Hand-offs you can audit, not chase.',
      steps: [
        { n: '01', name: 'Intake → CRM', icon: 'doc', detail: 'Brand-grade intake forms wired straight to your CRM. Every field validated, every record clean.' },
        { n: '02', name: 'Invoicing + welcome', icon: 'bolt', detail: 'Invoicing and onboarding email sequences on autopilot, with the right level of warmth for a premium customer.' },
        { n: '03', name: 'Customer portal', icon: 'gear', detail: 'Multi-tenant where you need sub-accounts. Customers log in to one place — projects, invoices, schedules, documents.' },
      ],
    },
    outcome: {
      eyebrow: 'The outcome',
      number: 'mins',
      label: 'from countersign to fully onboarded — not days, not "by Friday."',
      pills: ['Auto-intake', 'Invoicing wired', 'Multi-tenant portal', 'Audit trail'],
      pull: <>The customer\'s first hour with you should feel like the <em>best</em> hour, not the worst.</>,
    },
    impact: {
      eyebrow: 'What it moves',
      tiles: [
        { num: '< 30m', lbl: 'Onboarding time', ctx: 'From contract countersign to a fully-onboarded customer with portal access.' },
        { num: '0', lbl: 'Hand-offs to chase', ctx: 'Every state change is automated and audited. Owners stop asking "did we send the welcome?"' },
        { num: '−45%', lbl: 'First-90-days churn', ctx: 'Premium experience continues past the contract — the most underrated retention lever.' },
      ],
      ref: 'Indicative; based on PM-firm full-Stack Lighthouse engagement.',
    },
  },
];

/* ─── StagePage ──────────────────────────────────────────────── */
export function StagePage({ stageKey, onNav }) {
  const idx = STAGE_PAGES.findIndex(s => s.key === stageKey);
  const s = STAGE_PAGES[idx];
  const next = STAGE_PAGES[idx + 1] || null;
  const prev = STAGE_PAGES[idx - 1] || null;

  const sections = React.useMemo(() => [
    { id: 'A', label: 'Stage', anchor: 'sec-stage-hero' },
    { id: 'B', label: 'Challenge', anchor: 'sec-stage-challenge' },
    { id: 'C', label: 'Solution', anchor: 'sec-stage-solution' },
    { id: 'D', label: 'Outcome', anchor: 'sec-stage-outcome' },
    { id: 'E', label: 'Impact', anchor: 'sec-stage-impact' },
    { id: 'F', label: 'Next', anchor: 'sec-stage-cta' },
  ], []);

  const [activeSec, setActiveSec] = React.useState('A');
  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 140;
      let cur = 'A';
      for (const sec of sections) {
        const el = document.getElementById(sec.anchor);
        if (el && el.offsetTop <= y) cur = sec.id;
      }
      setActiveSec(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [stageKey, sections]);

  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [stageKey]);

  const goSec = (id) => {
    const sec = sections.find(x => x.id === id);
    const el = document.getElementById(sec.anchor);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (!s) return null;
  return (
    <div className="page" data-screen-label={'Stage ' + s.num + ' · ' + s.name}>
      <Nav active="stage" onNav={onNav}/>

      {/* Sticky mini-nav (A–F spine) */}
      <aside className="mini-nav" aria-label="Stage sections">
        {sections.map(x => (
          <button
            key={x.id}
            className={'mini-nav__item' + (activeSec === x.id ? ' is-active' : '')}
            onClick={() => goSec(x.id)}
          >
            <span className="mini-nav__dot"/> {x.id} · {x.label}
          </button>
        ))}
      </aside>

      {/* HERO */}
      <section className="page-hero" id="sec-stage-hero">
        <div className="deck-bg" aria-hidden="true">
          <div className="deck-bg__split"/>
          <div className="deck-bg__stars"/>
          <div className="deck-bg__flare deck-bg__flare--lg"/>
          <div className="deck-bg__flare deck-bg__flare--sm"/>
          <div className="deck-bg__flare deck-bg__flare--corner"/>
        </div>

        <div className="page-hero__inner">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="crumb">
              <a onClick={() => onNav('home')}>HAIM8</a>
              <span className="crumb__sep">/</span>
              <a onClick={() => onNav('stack')}>The Stack</a>
              <span className="crumb__sep">/</span>
              <span className="crumb__here">Stage {s.num} · {s.name}</span>
            </div>
            <div className="h-eyebrow" style={{ display:'inline-block', marginBottom: 14, color: 'var(--h8-electric-blue)', whiteSpace: 'nowrap' }}>Stage {s.num} of 06</div>
            <h1 className="h-display h-display-lg page-hero__title">
              {s.name}.
            </h1>
            <p className="h-lede page-hero__sub" style={{ color: 'var(--ink-2)' }}>{s.tagline}</p>
            <div className="page-hero__ctas">
              <button className="btn btn--primary" onClick={() => onNav('contact')}>
                Talk to us about Stage {s.num} <I name="arrow-right" size={16}/>
              </button>
              <button className="btn btn--glass" onClick={() => onNav('stack')}>See the full Stack</button>
            </div>
          </motion.div>
          <motion.div
            className="stage-motif"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            <StageMotif stageKey={s.key}/>
          </motion.div>
        </div>
      </section>

      {/* CHALLENGE */}
      <motion.section className="psec psec--challenge" id="sec-stage-challenge" {...REVEAL}>
        <div className="psec__inner">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 56, alignItems:'start' }} className="stage-two-col">
            <div>
              <div className="psec__eyebrow">{s.challenge.eyebrow}</div>
              <h2 className="psec__title">{s.challenge.headline}</h2>
              <p className="psec__lede">{s.challenge.lede}</p>
            </div>
            <ul style={{ listStyle:'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap: 12 }}>
              {s.challenge.points.map((p, i) => (
                <motion.li
                  key={i}
                  className="t-card"
                  style={{ padding: '18px 22px', display:'flex', gap: 14, alignItems:'flex-start' }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span style={{ flex:'0 0 28px', height: 28, borderRadius: 8, background: 'rgba(125,65,185,0.18)', border: '1px solid rgba(125,65,185,0.30)', display:'grid', placeItems:'center', color:'#9D6FD6', fontFamily:'var(--h8-font-mono)', fontSize: 12, fontWeight: 600 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)' }}>{p}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* SOLUTION */}
      <motion.section className="psec psec--solution" id="sec-stage-solution" {...REVEAL}>
        <div className="deck-bg" style={{ opacity: 0.6 }} aria-hidden="true">
          <div className="deck-bg__stars" style={{ opacity: 0.5 }}/>
        </div>
        <div className="psec__inner">
          <div className="psec__eyebrow">{s.solution.eyebrow}</div>
          <h2 className="psec__title" style={{ color: '#fff' }}>{s.solution.headline}</h2>
          <p className="psec__lede" style={{ color: 'rgba(255,255,255,0.78)' }}>{s.solution.lede}</p>

          <div className="sol-grid">
            {s.solution.steps.map((st, i) => (
              <motion.div
                key={i}
                className="sol-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
              >
                <div className="sol-card__ico"><I name={st.icon} size={22}/></div>
                <div className="sol-card__step">Step {st.n}</div>
                <h3 className="sol-card__name">{st.name}</h3>
                <p className="sol-card__detail">{st.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* OUTCOME */}
      <motion.section className="psec psec--outcome" id="sec-stage-outcome" {...REVEAL}>
        <div className="psec__inner">
          <div className="psec__eyebrow">{s.outcome.eyebrow}</div>
          <h2 className="psec__title">The outcome we ship for.</h2>

          <div className="outcome-card">
            <div>
              <div className="outcome-num">{s.outcome.number}</div>
              <div className="outcome-label">{s.outcome.label}</div>
              <div className="outcome-pills">
                {s.outcome.pills.map((p, i) => <span key={i} className="outcome-pill">{p}</span>)}
              </div>
            </div>
            <div>
              <div className="pull-quote">"{s.outcome.pull}"
                <span className="pull-quote__cite">— Stage {s.num} · {s.name} · the promise</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* IMPACT */}
      <motion.section className="psec psec--impact" id="sec-stage-impact" {...REVEAL}>
        <div className="deck-bg" style={{ opacity: 0.5 }} aria-hidden="true">
          <div className="deck-bg__stars" style={{ opacity: 0.5 }}/>
        </div>
        <div className="psec__inner">
          <div className="psec__eyebrow">{s.impact.eyebrow}</div>
          <h2 className="psec__title" style={{ color: '#fff' }}>What it <em>moves</em>.</h2>

          <div className="impact-grid">
            {s.impact.tiles.map((t, i) => (
              <motion.div
                key={i}
                className="impact-tile"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
              >
                <div className="impact-tile__num">{t.num}</div>
                <div className="impact-tile__lbl">{t.lbl}</div>
                <div className="impact-tile__ctx">{t.ctx}</div>
              </motion.div>
            ))}
          </div>
          <div className="impact-ref">{s.impact.ref}</div>
        </div>
      </motion.section>

      {/* CTA + Next ribbon */}
      <motion.section className="psec psec--cta" id="sec-stage-cta" {...REVEAL}>
        <div className="psec__inner">
          <div className="cta-strip">
            <div className="psec__eyebrow" style={{ display:'inline-block' }}>Next step</div>
            <h3>Ready to ship Stage {s.num}?</h3>
            <p>30 minutes. UK GBP-friendly proposal. No SaaS sales cadence.</p>
            <div className="row">
              <button className="btn btn--primary" onClick={() => onNav('contact')}>
                Book a strategy call <I name="arrow-right" size={16}/>
              </button>
              <button className="btn btn--glass" onClick={() => onNav('stack')}>Back to The Stack</button>
            </div>
          </div>

          {next && (
            <motion.button
              className="next-ribbon"
              onClick={() => onNav('stage:' + next.key)}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="next-ribbon__l">
                <span className="next-ribbon__step">Up next · Stage {next.num}</span>
                <span className="next-ribbon__name">{next.name}</span>
                <span className="next-ribbon__hint">{next.tagline}</span>
              </div>
              <span className="next-ribbon__arrow"><I name="arrow-right" size={22}/></span>
            </motion.button>
          )}
          {!next && prev && (
            <motion.button
              className="next-ribbon"
              onClick={() => onNav('stack')}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="next-ribbon__l">
                <span className="next-ribbon__step">End of the Stack</span>
                <span className="next-ribbon__name">Back to The Stack</span>
                <span className="next-ribbon__hint">See all 6 stages and how they ladder.</span>
              </div>
              <span className="next-ribbon__arrow"><I name="arrow-right" size={22}/></span>
            </motion.button>
          )}
        </div>
      </motion.section>

      <Footer onNav={onNav}/>

      <style>{`
        @media (max-width: 900px) {
          .stage-two-col { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Stack hub page ──────────────────────────────────────────── */
export function StackHubPage({ onNav }) {
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return (
    <div className="page" data-screen-label="Stack Hub">
      <Nav active="stack" onNav={onNav}/>

      <section className="page-hero" id="sec-hub-hero">
        <div className="deck-bg" aria-hidden="true">
          <div className="deck-bg__split"/>
          <div className="deck-bg__stars"/>
          <div className="deck-bg__flare deck-bg__flare--lg"/>
          <div className="deck-bg__flare deck-bg__flare--sm"/>
          <div className="deck-bg__flare deck-bg__flare--corner"/>
        </div>
        <div className="page-hero__inner" style={{ gridTemplateColumns: '1fr', textAlign: 'left' }}>
          <motion.div
            style={{ maxWidth: 920 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="crumb">
              <a onClick={() => onNav('home')}>HAIM8</a>
              <span className="crumb__sep">/</span>
              <span className="crumb__here">The Stack</span>
            </div>
            <div className="h-eyebrow" style={{ display:'inline-block', marginBottom: 14, color: 'var(--h8-electric-blue)' }}>The Stack · six stages that move the needle</div>
            <h1 className="h-display h-display-lg page-hero__title">
              From the first <em>search</em> to the signed contract.
            </h1>
            <p className="h-lede page-hero__sub" style={{ color: 'var(--ink-2)', maxWidth: 720 }}>
              Six stages, one ladder. Buy any stage on its own. Ladder up when you're ready. The customer journey doesn't break at a vendor handover — and neither do we.
            </p>
            <div className="page-hero__ctas">
              <button className="btn btn--primary" onClick={() => onNav('contact')}>
                Talk to us about your Stack <I name="arrow-right" size={16}/>
              </button>
              <button className="btn btn--glass" onClick={() => onNav('home')}>Back to home</button>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section className="psec psec--challenge" style={{ paddingTop: 64 }} {...REVEAL}>
        <div className="psec__inner">
          <div className="psec__eyebrow">The journey</div>
          <h2 className="psec__title">Growth happens in <em>stages</em>. We ship across all of them.</h2>

          <div className="journey">
            <div className="journey__line"><div className="journey__line-fill" style={{ width: '100%' }}/></div>
            {STAGE_PAGES.map((s, i) => (
              <motion.button
                key={s.key}
                className="journey-node"
                onClick={() => onNav('stage:' + s.key)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
              >
                <div className="journey-node__ico"><I name={s.icon} size={22}/></div>
                <div className="journey-node__step">Stage {s.num}</div>
                <div className="journey-node__name">{s.name}</div>
                <div className="journey-node__what">{s.tagline}</div>
                <div className="journey-node__open">Open <I name="arrow-right" size={12}/></div>
              </motion.button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 64 }} className="stage-two-col">
            <div>
              <div className="psec__eyebrow">How to use the Stack</div>
              <h3 className="psec__title" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>Three ways to buy.</h3>
              <p className="psec__lede">You don't have to ship six stages on day one. Most lighthouse engagements start with one or two.</p>
            </div>
            <div className="use-grid" style={{ gridTemplateColumns: '1fr' }}>
              {[
                { num: '01 · Single stage', title: 'One gap, fixed scope.', body: 'Pick the stage where the leak is biggest. Tier C, from £12k. Most start at Stage 02 — Capture.' },
                { num: '02 · Multi-stage', title: 'Two or three, wired together.', body: 'The compounding starts. Capture + Activate, or Generate + Activate + Close. Tier B, from £35k.' },
                { num: '03 · Full Stack', title: 'End-to-end, run by us.', body: 'All six stages, plus Managed Close & Sign and the run plan. Tier A, from £80k.' },
              ].map((x, i) => (
                <motion.div
                  key={i}
                  className="use-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="use-card__num">{x.num}</div>
                  <h4>{x.title}</h4>
                  <p>{x.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="psec psec--cta" {...REVEAL}>
        <div className="psec__inner">
          <div className="cta-strip">
            <div className="psec__eyebrow" style={{ display:'inline-block' }}>Next step</div>
            <h3>Tell us where the revenue leaks. We'll show you what to ship.</h3>
            <p>30 minutes. UK GBP-friendly proposal. No SaaS sales cadence.</p>
            <div className="row">
              <button className="btn btn--primary" onClick={() => onNav('contact')}>
                Book a strategy call <I name="arrow-right" size={16}/>
              </button>
              <button className="btn btn--glass" onClick={() => onNav('home')}>Back to home</button>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer onNav={onNav}/>
    </div>
  );
}
