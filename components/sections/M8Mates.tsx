import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { EASE, CASES } from '../../lib/tokens';

export function M8Mates() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const m8Opacity = useTransform(scrollYProgress, [0.05, 0.2, 0.85, 0.95], [0, 1, 1, 0]);
  const m8Scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.85, 1, 1.05]);

  return (
    <section
      ref={ref}
      className="relative"
      style={{ minHeight: '220vh' }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          style={{ opacity: m8Opacity, scale: m8Scale }}
          className="flex flex-col items-center gap-10 max-w-5xl mx-auto text-center"
        >
          <span
            className="heading font-black leading-[0.8] select-none"
            style={{
              fontSize: 'clamp(10rem, 24vw, 24rem)',
              background: 'linear-gradient(160deg, #7D41B9 0%, #3b82f6 60%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 80px rgba(125,65,185,0.3))',
              letterSpacing: '-0.06em',
            }}
          >
            M8
          </span>

          <TypingTagline />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl mt-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE.outExpo }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {CASES.map((c, i) => (
              <CaseTile key={c.id} index={i} caseItem={c} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function TypingTagline() {
  const words = ['Consultants', 'on', 'paper,', 'your', 'friends', 'in', 'reality.'];
  return (
    <motion.p
      className="heading text-2xl md:text-4xl lg:text-5xl font-semibold text-white/95 leading-snug max-w-3xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: 0.08 }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          variants={{
            hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.7, ease: EASE.outExpo }}
        >
          {i === 4 || i === 5 || i === 6 ? (
            <span className="text-[#60a5fa]">{w}</span>
          ) : (
            w
          )}
        </motion.span>
      ))}
    </motion.p>
  );
}

function CaseTile({ index, caseItem }: { index: number; caseItem: typeof CASES[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15 * index, ease: EASE.outExpo }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -4 }}
      className="group relative cursor-pointer text-left rounded-2xl p-6 overflow-hidden"
      style={{
        background: 'rgba(15, 22, 41, 0.75)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 0%, ${caseItem.color}22, transparent 60%)`,
        }}
      />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-white/40">
            {caseItem.sector}
          </span>
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: caseItem.color, boxShadow: `0 0 12px ${caseItem.color}` }}
          />
        </div>
        <h3 className="heading text-2xl md:text-3xl font-bold text-white">{caseItem.client}</h3>
        <p className="text-base text-white/70">{caseItem.tagline}</p>
        <div className="mt-3 pt-3 border-t border-white/5 flex items-baseline gap-3">
          <span
            className="heading text-xl font-bold"
            style={{ color: caseItem.color }}
          >
            {caseItem.metric}
          </span>
          <span className="text-xs text-white/40">{caseItem.metricSub}</span>
        </div>
      </div>
    </motion.div>
  );
}
