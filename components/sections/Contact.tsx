import { motion } from 'motion/react';
import { useState } from 'react';
import { EASE } from '../../lib/tokens';

export function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
      setMessage('');
    }, 3500);
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center justify-center py-24 px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE.outExpo }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative w-full max-w-2xl mx-auto flex flex-col items-center gap-10 text-center"
      >
        <div className="flex flex-col gap-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="heading text-sm uppercase tracking-[0.35em] text-[#60a5fa]"
          >
            Let's talk
          </motion.span>
          <motion.h2
            className="heading text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE.outExpo }}
            viewport={{ once: true }}
          >
            Contact us to<br />
            <span
              style={{
                background: 'linear-gradient(120deg, #60a5fa 0%, #7D41B9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              find out more
            </span>
          </motion.h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 mt-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE.outExpo }}
            viewport={{ once: true }}
            className="relative"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              className="w-full px-6 py-5 rounded-2xl bg-[#0f1629]/60 border border-white/8 text-white placeholder:text-white/30 focus:outline-none focus:border-[#60a5fa]/60 focus:bg-[#0f1629]/90 transition-all duration-300"
              style={{ backdropFilter: 'blur(20px)' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE.outExpo }}
            viewport={{ once: true }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What are you building? What do you need help with?"
              rows={4}
              aria-label="Your message"
              className="w-full px-6 py-5 rounded-2xl bg-[#0f1629]/60 border border-white/8 text-white placeholder:text-white/30 focus:outline-none focus:border-[#60a5fa]/60 focus:bg-[#0f1629]/90 transition-all duration-300 resize-none"
              style={{ backdropFilter: 'blur(20px)' }}
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={submitted}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE.outExpo }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            viewport={{ once: true }}
            className="relative group overflow-hidden cursor-pointer py-5 px-8 rounded-2xl font-semibold text-white heading tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: 'linear-gradient(120deg, #3b82f6 0%, #7D41B9 100%)',
              boxShadow: '0 0 40px rgba(59,130,246,0.25)',
            }}
          >
            <span className="relative z-10">
              {submitted ? 'Thanks — we\u2019ll be in touch soon.' : 'Start the conversation'}
            </span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(120deg, #60a5fa 0%, #9b5fd4 100%)',
              }}
              aria-hidden="true"
            />
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-sm text-white/40"
        >
          Or email{' '}
          <a
            href="mailto:hello@haim8.com"
            className="text-[#60a5fa] hover:text-white transition-colors border-b border-[#60a5fa]/30 hover:border-white"
          >
            hello@haim8.com
          </a>
        </motion.p>
      </motion.div>
    </section>
  );
}
