/* HAIM8 Website — App entry with hash-based routing.
   Routes:
     #/                  → Home (single-page anchored sections)
     #/stack             → Stack hub
     #/stack/<key>       → Stage page (found, capture, generate, activate, close, process)

   Differences from the prototype's app.jsx:
     - ESM imports replace globals
     - <AnimatePresence> wraps the route output for page transitions
     - The TweaksPanel (design-tool tooling) is dropped from the production app
*/
import React from 'react';
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

import './styles/colors_and_type.css';
import './styles/glass.css';
import './styles/site.css';
import './styles/pages.css';
import './styles/extras.css';

import {
  Nav,
  Hero,
  ValuesSection,
  StackSection,
  DeliverSection,
  WhyNowSection,
  CustomersSection,
  ClosingCTA,
  Footer,
} from './components/sections.jsx';
import { StackHubPage, StagePage } from './pages.jsx';

const ACCENT_DEFAULT = 'blue-purple';

function parseRoute() {
  const h = (window.location.hash || '').replace(/^#\/?/, '');
  if (!h) return { kind: 'home' };
  const parts = h.split('/').filter(Boolean);
  if (parts[0] === 'stack' && parts[1]) return { kind: 'stage', stageKey: parts[1] };
  if (parts[0] === 'stack') return { kind: 'stack' };
  return { kind: 'home' };
}

const PAGE_FADE = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
};

export default function App() {
  const [route, setRoute] = React.useState(parseRoute());
  const [active, setActive] = React.useState('home');

  React.useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem('haim8-theme'); } catch (e) {}
    document.documentElement.setAttribute('data-theme', saved || 'dark');
    const root = document.documentElement;
    if (ACCENT_DEFAULT === 'blue-only') {
      root.style.setProperty('--h8-text-gradient', 'linear-gradient(135deg, #0080E4 0%, #1A94F0 100%)');
    } else if (ACCENT_DEFAULT === 'purple-lead') {
      root.style.setProperty('--h8-text-gradient', 'linear-gradient(135deg, #7D41B9 0%, #0080E4 100%)');
    } else {
      root.style.setProperty('--h8-text-gradient', 'linear-gradient(135deg, #0080E4 0%, #7D41B9 100%)');
    }
  }, []);

  React.useEffect(() => {
    const onHash = () => {
      setRoute(parseRoute());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const scrollToAnchor = React.useCallback((anchor) => {
    const tryScroll = () => {
      const el = document.getElementById(anchor);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return true;
      }
      return false;
    };
    if (!tryScroll()) {
      window.location.hash = '#/';
      requestAnimationFrame(() => requestAnimationFrame(() => { tryScroll(); }));
    }
  }, []);

  const onNav = React.useCallback((id) => {
    if (id === 'home') {
      if (route.kind !== 'home') { window.location.hash = '#/'; }
      else { setActive('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      return;
    }
    if (id === 'stack') {
      window.location.hash = '#/stack';
      return;
    }
    if (typeof id === 'string' && id.startsWith('stage:')) {
      const key = id.split(':')[1];
      window.location.hash = '#/stack/' + key;
      return;
    }
    const map = {
      values:     'sec-values',
      customers:  'sec-customers',
      deliver:    'sec-deliver',
      whynow:     'sec-whynow',
      contact:    'sec-cta',
      audit:      'sec-cta',
      reliability:'sec-deliver',
      security:   'sec-deliver',
    };
    const tgt = map[id];
    setActive(id);
    if (tgt) scrollToAnchor(tgt);
  }, [route.kind, scrollToAnchor]);

  const routeKey = route.kind === 'stage' ? `stage:${route.stageKey}` : route.kind;

  /* Hero cosmic parallax — three depth layers drift at different rates as you
     scroll the hero offscreen. `useReducedMotion` disables the offset entirely
     for users with the OS-level preference. */
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const farY  = useTransform(scrollY, [0, 800], [0,  20]);
  const midY  = useTransform(scrollY, [0, 800], [0,  60]);
  const nearY = useTransform(scrollY, [0, 800], [0, 120]);

  React.useEffect(() => {
    if (reduceMotion || route.kind !== 'home') return;
    const apply = (sel, mv) => {
      const els = document.querySelectorAll(sel);
      if (!els.length) return null;
      let lastY = null;
      return mv.on('change', (v) => {
        // Round to integer pixels — fractional sub-pixel transforms force
        // Chromium to re-rasterise the (heavy radial-gradient) star layer on
        // every scroll tick and contribute to a stationary flicker. Bail
        // when the integer hasn't changed so we don't write redundantly.
        const y = Math.round(v);
        if (y === lastY) return;
        lastY = y;
        for (const el of els) el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };
    const u1 = apply('[data-parallax="far"]',  farY);
    const u2 = apply('[data-parallax="mid"]',  midY);
    const u3 = apply('[data-parallax="near"]', nearY);
    return () => { u1?.(); u2?.(); u3?.(); };
  }, [reduceMotion, route.kind, farY, midY, nearY]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={routeKey} {...PAGE_FADE}>
        {route.kind === 'stage' ? (
          <StagePage stageKey={route.stageKey} onNav={onNav}/>
        ) : route.kind === 'stack' ? (
          <StackHubPage onNav={onNav}/>
        ) : (
          <>
            <Nav active={active} onNav={onNav}/>
            <Hero/>
            <ValuesSection/>
            <StackSection onNav={onNav}/>
            <CustomersSection onNav={onNav}/>
            <DeliverSection onNav={onNav}/>
            <WhyNowSection/>
            <div id="sec-cta"><ClosingCTA onNav={onNav}/></div>
            <Footer onNav={onNav}/>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
