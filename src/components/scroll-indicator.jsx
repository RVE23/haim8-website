/* ScrollIndicator — bottom-of-hero pulsing line indicator.
   Adapted from the worktree's logo-movement-improvement branch.

   IMPORTANT: positioning lives on the OUTER wrapper (so the transform isn't
   clobbered by motion's animated transform on `y`). Motion only owns the
   inner button + line transforms.

   Animation: line scales vertically (scaleY 0.4 → 1 → 0.4) over 2.4s, fades in
   with a 1.6s delay so the hero entrance lands first.
   Visual: matches v2 — uppercase Sora caps (var(--h8-font-display)),
   accent uses the brand's blue→purple gradient (var(--h8-text-gradient)). */
import { motion } from 'motion/react';

export function ScrollIndicator({ delay = 1.6 }) {
  const handleClick = () => {
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };

  return (
    <div className="hero__scroll-wrap">
      <motion.button
        type="button"
        onClick={handleClick}
        aria-label="Scroll down"
        className="hero__scroll"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ opacity: 0.85 }}
      >
        <span className="hero__scroll-label">Scroll</span>
        <motion.span
          className="hero__scroll-line"
          aria-hidden="true"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          style={{ originY: 0 }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: delay + 0.4,
          }}
        />
      </motion.button>
    </div>
  );
}
