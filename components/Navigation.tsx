import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { PageType } from '../App';

interface NavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const narrativeAnchors: { label: string; href: string }[] = [
  { label: 'Values', href: '#h-values' },
  { label: 'Services', href: '#ai-services' },
  { label: 'Work', href: '#m8' },
  { label: 'Contact', href: '#contact' },
];

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const handleAnchor = (href: string) => {
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4">
      <div
        className="max-w-6xl mx-auto flex items-center justify-between px-5 md:px-7 py-3 relative overflow-hidden rounded-full"
        style={{
          background: 'rgba(7, 11, 20, 0.55)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <motion.div
          className="absolute bottom-0 left-0 h-[1px]"
          style={{
            width: progressWidth,
            background: 'linear-gradient(90deg, #3b82f6, #7D41B9)',
          }}
          aria-hidden="true"
        />

        <button
          className="flex items-center cursor-pointer"
          onClick={() => onNavigate('home')}
          aria-label="HAIM8 home"
        >
          <img
            src="/haim8-logo-flat.png"
            alt="HAIM8"
            className="h-7 md:h-8 w-auto object-contain"
            draggable={false}
          />
        </button>

        <div className="hidden md:flex items-center gap-7">
          {narrativeAnchors.map((item) => (
            <button
              key={item.href}
              onClick={() => handleAnchor(item.href)}
              className="heading text-[13px] font-medium text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleAnchor('#contact')}
            className="heading px-5 py-2 rounded-full text-[13px] font-semibold text-white transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(120deg, #3b82f6 0%, #7D41B9 100%)',
              boxShadow: '0 0 0 1px rgba(96,165,250,0.3), 0 8px 24px -8px rgba(59,130,246,0.4)',
            }}
          >
            Get in touch
          </button>
        </div>

        <button
          className="md:hidden text-white cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-3 mx-auto max-w-6xl p-5 flex flex-col gap-3 rounded-3xl"
          style={{
            background: 'rgba(7, 11, 20, 0.9)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {narrativeAnchors.map((item) => (
            <button
              key={item.href}
              onClick={() => handleAnchor(item.href)}
              className="heading text-left text-base font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </nav>
  );
};
