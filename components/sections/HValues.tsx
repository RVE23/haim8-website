import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { EASE, VALUES } from '../../lib/tokens';

export function HValues() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const hOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.85, 0.95], [0, 1, 1, 0]);
  const hX = useTransform(scrollYProgress, [0, 0.3], [-80, 0]);

  return (
    <section
      ref={ref}
      className="relative"
      style={{ minHeight: '260vh' }}
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <motion.div
            style={{ opacity: hOpacity, x: hX }}
            className="relative flex items-center justify-center md:justify-start"
          >
            <span
              className="heading font-black leading-[0.8] select-none"
              style={{
                fontSize: 'clamp(12rem, 28vw, 28rem)',
                background: 'linear-gradient(160deg, #60a5fa 0%, #3b82f6 45%, #7D41B9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 60px rgba(59,130,246,0.2))',
              }}
            >
              H
            </span>
          </motion.div>

          <div className="relative flex flex-col gap-20 md:gap-28 py-[30vh]">
            <div className="heading text-sm uppercase tracking-[0.3em] text-white/40">
              The H stands for
            </div>
            {VALUES.map((v, i) => (
              <ValueWord key={v.word} index={i} word={v.word} body={v.body} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueWord({ index, word, body }: { index: number; word: string; body: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.2]);
  const y = useTransform(scrollYProgress, [0, 0.3], [60, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className="flex flex-col gap-4"
    >
      <motion.h3
        className="heading font-bold leading-[0.9] text-white"
        style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE.outExpo }}
        viewport={{ once: false, amount: 0.5 }}
      >
        {word}
        <span className="text-[#3b82f6]">.</span>
      </motion.h3>
      <p className="text-lg md:text-xl text-white/60 max-w-lg leading-relaxed">
        {body}
      </p>
      <span className="text-xs font-mono text-white/20 tracking-widest">
        0{index + 1} / 03
      </span>
    </motion.div>
  );
}
