import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { EASE } from '../../lib/tokens';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const logoOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 1, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section
      ref={ref}
      className="relative h-[140vh] flex items-center justify-center"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-6">
        <motion.div
          style={{ opacity: logoOpacity, scale: logoScale, y: logoY }}
          className="relative flex flex-col items-center justify-center gap-8"
        >
          <motion.img
            src="/haim8-noBG.png"
            alt="HAIM8"
            className="w-[min(820px,92vw)] h-auto object-contain drop-shadow-[0_0_100px_rgba(59,130,246,0.35)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE.outExpo }}
          />

          <motion.p
            className="heading text-[clamp(1.1rem,1.6vw,1.5rem)] font-medium tracking-[0.2em] uppercase text-white/50 text-center max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: EASE.outExpo }}
          >
            Consultants on paper,<br />
            <span className="text-[#60a5fa]">your friends in reality</span>
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-3 mt-8 text-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
            <motion.div
              className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"
              animate={{ scaleY: [0.4, 1, 0.4], originY: 0 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
