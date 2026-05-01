/* HAIM8 — Stack hub + Stage pages.
   For this first migration pass, these are placeholder stubs so #/stack and
   #/stack/<key> routes don't crash. The full port from project/pages.jsx
   (StackHubPage with all 6 stages laid out + StagePage detail shells) lands
   in the next pass once home is signed off. */
import { motion } from 'motion/react';
import { Nav, Footer, STAGES } from './components/sections.jsx';
import { I } from './components/icons.jsx';

function PlaceholderShell({ onNav, eyebrow, title, lede }) {
  return (
    <>
      <Nav active="stack" onNav={onNav}/>
      <motion.section
        className="section deep on-dark"
        style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glow-blob b1"/>
        <div className="glow-blob b2"/>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <motion.div
            className="h-eyebrow"
            style={{ display: 'inline-block', marginBottom: 16 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >{eyebrow}</motion.div>
          <motion.h1
            className="h-display h-display-lg"
            style={{ color: 'var(--h8-white)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >{title}</motion.h1>
          <motion.p
            className="h-lede on-dark"
            style={{ margin: '20px auto 28px', maxWidth: 640 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >{lede}</motion.p>
          <motion.div
            className="row"
            style={{ justifyContent: 'center' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="btn btn--primary" onClick={() => onNav('home')}>
              <I name="arrow-right" size={16} style={{ transform: 'rotate(180deg)' }}/> Back to home
            </button>
          </motion.div>
        </div>
      </motion.section>
      <Footer onNav={onNav}/>
    </>
  );
}

export function StackHubPage({ onNav }) {
  return (
    <PlaceholderShell
      onNav={onNav}
      eyebrow="The Stack"
      title={<>Six stages, <em>one ladder</em>.</>}
      lede="The full stack hub is being rebuilt as part of the migration. For now, head back to the home page to see the stack overview."
    />
  );
}

export function StagePage({ stageKey, onNav }) {
  const stage = STAGES.find(s => s.key === stageKey) || STAGES[0];
  return (
    <PlaceholderShell
      onNav={onNav}
      eyebrow={`Stage ${stage.num} · ${stage.name}`}
      title={stage.detail.headline}
      lede={`${stage.detail.lede} — Detail page being rebuilt as part of the migration.`}
    />
  );
}
