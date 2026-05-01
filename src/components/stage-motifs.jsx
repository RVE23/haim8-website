/* HAIM8 — Per-stage hero visualizations.
   Each motif is themed to its stage's purpose, using brand gradients,
   the existing icon set, and CSS animation. Used in StagePage hero column. */
import React from 'react';
import { I } from './icons.jsx';

const MOTIF_DEFS = (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <linearGradient id="motif-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0080E4"/>
        <stop offset="100%" stopColor="#7D41B9"/>
      </linearGradient>
      <linearGradient id="motif-grad-soft" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0080E4" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#7D41B9" stopOpacity="0.4"/>
      </linearGradient>
      <radialGradient id="motif-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0080E4" stopOpacity="0.6"/>
        <stop offset="60%" stopColor="#0080E4" stopOpacity="0.1"/>
        <stop offset="100%" stopColor="#0080E4" stopOpacity="0"/>
      </radialGradient>
      <filter id="motif-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8"/>
      </filter>
    </defs>
  </svg>
);

/* ─── Stage 00 · Be Found ─── search results card stack with rank/highlight */
function MotifFound() {
  return (
    <div className="motif motif--found">
      <div className="motif__halo"/>
      <div className="motif__cards">
        {[
          { rank: '01', site: 'yourbrand.co.uk', score: '96', highlight: true,  badge: 'AI-cited' },
          { rank: '02', site: 'competitor-a.com',score: '78', highlight: false, badge: '—' },
          { rank: '03', site: 'directory-x.io',  score: '64', highlight: false, badge: '—' },
        ].map((r, i) => (
          <div key={i} className={'motif-card motif-card--found' + (r.highlight ? ' is-hot' : '')}>
            <div className="motif-card__rank">{r.rank}</div>
            <div className="motif-card__body">
              <div className="motif-card__site">{r.site}</div>
              <div className="motif-card__bar"><span style={{ width: r.score + '%' }}/></div>
            </div>
            <div className="motif-card__badge">{r.badge}</div>
          </div>
        ))}
      </div>
      <div className="motif__caption"><span/> Search · AI · GBP</div>
    </div>
  );
}

/* ─── Stage 01 · Capture ─── chat console with live message + waveform */
function MotifCapture() {
  return (
    <div className="motif motif--capture">
      <div className="motif__halo"/>
      <div className="motif-console">
        <div className="motif-console__head">
          <span className="motif-console__dot motif-console__dot--live"/>
          <span className="motif-console__title">Concierge · web chat</span>
          <span className="motif-console__time">22:47</span>
        </div>
        <div className="motif-console__bubbles">
          <div className="bubble bubble--in">
            <div className="bubble__author">Visitor</div>
            <div className="bubble__text">Do you do same-week consults?</div>
          </div>
          <div className="bubble bubble--out">
            <div className="bubble__author">HAIM8 concierge</div>
            <div className="bubble__text">Yes — Thursday 10:30 or 14:00. Want me to hold one?</div>
            <div className="bubble__meta">Drafted in 0.7s · routed to owner</div>
          </div>
          <div className="bubble bubble--typing">
            <span/><span/><span/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stage 02 · Generate ─── pipeline with daily refresh + scoring tiles */
function MotifGenerate() {
  const rows = [
    { co: 'Northshore Refurb Co.',  score: 94, tag: 'Planning approved', win: true },
    { co: 'Atlas Property Group',   score: 88, tag: 'Hiring spike',      win: true },
    { co: 'Vale Construction Ltd',  score: 76, tag: 'Funding round',     win: false },
    { co: 'Meridian Build Partners',score: 71, tag: 'Repeat ICP',        win: false },
  ];
  return (
    <div className="motif motif--generate">
      <div className="motif__halo"/>
      <div className="motif-pipe">
        <div className="motif-pipe__head">
          <span className="motif-pipe__chip">Today · refreshed</span>
          <span className="motif-pipe__chip motif-pipe__chip--hot">+34 new</span>
        </div>
        <div className="motif-pipe__rows">
          {rows.map((r, i) => (
            <div key={i} className="motif-pipe__row">
              <div className="motif-pipe__name">{r.co}</div>
              <div className="motif-pipe__tag">{r.tag}</div>
              <div className={'motif-pipe__score' + (r.win ? ' is-win' : '')}>{r.score}</div>
            </div>
          ))}
        </div>
        <div className="motif-pipe__foot">
          <svg viewBox="0 0 240 30" className="motif-pipe__spark">
            <path d="M0 22 L20 18 L40 20 L60 14 L80 16 L100 10 L120 12 L140 6 L160 8 L180 4 L200 6 L220 2 L240 4" fill="none" stroke="url(#motif-grad)" strokeWidth="2"/>
          </svg>
          <span>Pipeline · last 14 days</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Stage 03 · Activate ─── SLA timer + sequence badges */
function MotifActivate() {
  return (
    <div className="motif motif--activate">
      <div className="motif__halo"/>
      <div className="motif-sla">
        <svg viewBox="0 0 200 200" className="motif-sla__ring">
          <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14"/>
          <circle cx="100" cy="100" r="84" fill="none" stroke="url(#motif-grad)"
            strokeWidth="14" strokeLinecap="round" strokeDasharray="528" strokeDashoffset="370"
            transform="rotate(-90 100 100)">
            <animate attributeName="stroke-dashoffset" values="528;370;528" dur="6s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <div className="motif-sla__center">
          <div className="motif-sla__num">4m 12s</div>
          <div className="motif-sla__lbl">First-touch · SLA 5m</div>
        </div>
      </div>
      <div className="motif-seq">
        {[
          { n: '01', t: 'Inbound', s: 'done' },
          { n: '02', t: 'Routed',  s: 'done' },
          { n: '03', t: 'Owner',   s: 'now' },
          { n: '04', t: 'Reply',   s: 'next' },
        ].map((p, i) => (
          <div key={i} className={'motif-seq__step is-' + p.s}>
            <span className="motif-seq__n">{p.n}</span>
            <span className="motif-seq__t">{p.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Stage 04 · Close ─── document with status pills + signature */
function MotifClose() {
  return (
    <div className="motif motif--close">
      <div className="motif__halo"/>
      <div className="motif-doc">
        <div className="motif-doc__head">
          <span className="motif-doc__type">PROPOSAL · v3</span>
          <span className="motif-doc__co">Northshore Refurb</span>
        </div>
        <div className="motif-doc__lines">
          <span style={{ width: '92%' }}/>
          <span style={{ width: '78%' }}/>
          <span style={{ width: '88%' }}/>
          <span style={{ width: '40%' }}/>
        </div>
        <div className="motif-doc__sig">
          <svg viewBox="0 0 220 60" preserveAspectRatio="none">
            <path d="M5 40 C 25 10, 40 50, 60 30 S 90 5, 110 35 S 150 50, 170 20 S 200 40, 215 25" fill="none" stroke="url(#motif-grad)" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div className="motif-doc__sig-line"/>
          <div className="motif-doc__sig-lbl">Signed · 14:22</div>
        </div>
        <div className="motif-doc__pills">
          <span className="motif-doc__pill is-done">Sent</span>
          <span className="motif-doc__pill is-done">Viewed</span>
          <span className="motif-doc__pill is-done">Signed</span>
          <span className="motif-doc__pill is-fire">Onboarding ⟶</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Stage 05 · Process ─── operations grid with flow arrows */
function MotifProcess() {
  return (
    <div className="motif motif--process">
      <div className="motif__halo"/>
      <div className="motif-flow">
        {[
          { ico: 'doc',  l: 'Intake' },
          { ico: 'gear', l: 'CRM' },
          { ico: 'mail', l: 'Welcome' },
          { ico: 'globe',l: 'Portal' },
        ].map((n, i, arr) => (
          <React.Fragment key={i}>
            <div className="motif-flow__node">
              <div className="motif-flow__ico"><I name={n.ico} size={20}/></div>
              <div className="motif-flow__lbl">{n.l}</div>
            </div>
            {i < arr.length - 1 && (
              <div className="motif-flow__line">
                <span className="motif-flow__pulse"/>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="motif-process__time">
        <span className="motif-process__num">&lt; 30m</span>
        <span className="motif-process__lbl">Contract → onboarded</span>
      </div>
    </div>
  );
}

/* ─── Dispatcher ─── */
export function StageMotif({ stageKey }) {
  const map = {
    found:    <MotifFound/>,
    capture:  <MotifCapture/>,
    generate: <MotifGenerate/>,
    activate: <MotifActivate/>,
    close:    <MotifClose/>,
    process:  <MotifProcess/>,
  };
  return (
    <>
      {MOTIF_DEFS}
      {map[stageKey] || null}
    </>
  );
}
