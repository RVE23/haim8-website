import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';
import { EASE, SERVICES } from '../../lib/tokens';

export function AIServices() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const aiOpacity = useTransform(scrollYProgress, [0.05, 0.18, 0.88, 0.97], [0, 1, 1, 0]);
  const aiY = useTransform(scrollYProgress, [0, 0.3], [40, 0]);

  return (
    <section
      ref={ref}
      className="relative"
      style={{ minHeight: '320vh' }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-center">
          <motion.div
            style={{ opacity: aiOpacity, y: aiY }}
            className="flex items-center justify-center md:justify-start"
          >
            <span
              className="heading font-black leading-[0.8] select-none"
              style={{
                fontSize: 'clamp(10rem, 22vw, 22rem)',
                background: 'linear-gradient(160deg, #60a5fa 0%, #3b82f6 40%, #7D41B9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 60px rgba(125,65,185,0.25))',
                letterSpacing: '-0.04em',
              }}
            >
              AI
            </span>
          </motion.div>

          <div className="relative flex flex-col gap-5 py-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE.outExpo }}
              viewport={{ once: true }}
              className="heading text-sm uppercase tracking-[0.3em] text-white/40"
            >
              Six services, one stack
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE.outExpo }}
              viewport={{ once: true }}
              className="heading text-3xl md:text-5xl font-bold text-white max-w-2xl leading-tight"
            >
              Everything we build, rooted in
              <span className="text-[#60a5fa]"> data</span> and
              <span className="text-[#9b5fd4]"> intent</span>.
            </motion.h2>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
              {SERVICES.map((s, i) => (
                <ServiceCard key={s.id} index={i} service={s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ index, service }: { index: number; service: typeof SERVICES[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.08 * index, ease: EASE.outExpo }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative group"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full text-left relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-300"
        style={{
          background: 'rgba(22, 32, 54, 0.45)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 0%, rgba(59,130,246,0.12), transparent 60%)',
          }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-2">
              0{index + 1}
            </div>
            <h3 className="heading text-base md:text-lg font-semibold text-white mb-1.5 leading-tight">
              {service.title}
            </h3>
            <p className="text-sm text-[#60a5fa] font-medium">{service.tagline}</p>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 45 : 0 }}
            transition={{ duration: 0.4, ease: EASE.outExpo }}
            className="flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 group-hover:border-[#60a5fa]/60 group-hover:text-[#60a5fa] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE.outExpo }}
              className="relative overflow-hidden"
            >
              <p className="text-sm text-white/70 leading-relaxed pt-4 mt-4 border-t border-white/5">
                {service.body}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
