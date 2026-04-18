import { motion, useScroll, useTransform } from 'motion/react';

export function GradientBackground() {
  const { scrollYProgress } = useScroll();

  const splashX = useTransform(scrollYProgress, [0, 1], ['-10%', '30%']);
  const splashY = useTransform(scrollYProgress, [0, 1], ['-20%', '50%']);
  const visionX = useTransform(scrollYProgress, [0, 1], ['10%', '-30%']);
  const visionY = useTransform(scrollYProgress, [0, 1], ['50%', '-10%']);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0, background: '#070b14' }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          top: splashY,
          left: splashX,
          width: '70%',
          height: '70%',
          background: '#3b82f6',
          opacity: 0.09,
          filter: 'blur(150px)',
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          top: visionY,
          left: visionX,
          width: '60%',
          height: '60%',
          background: '#7D41B9',
          opacity: 0.1,
          filter: 'blur(140px)',
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '65%',
          height: '65%',
          background: 'radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 60%)',
          filter: 'blur(120px)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.035) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      <svg className="absolute inset-0 w-full h-full opacity-[0.025] mix-blend-overlay">
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 0.7 0 0 0 0 0.8 0 0 0 0 1 0 0 0 1 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>
    </div>
  );
}
