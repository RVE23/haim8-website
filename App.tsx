import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { GradientBackground } from './components/GradientBackground';
import { StarScene } from './components/scene/StarScene';

import { HomePage } from './pages/HomePage';
import { AIConciergeDetailPage } from './pages/AIConciergeDetailPage';
import { GTMEngineDetailPage } from './pages/GTMEngineDetailPage';
import { BPADetailPage } from './pages/BPADetailPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CustomersPage } from './pages/CustomersPage';
import { PricingPage } from './pages/PricingPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';

export type PageType =
  | 'home'
  | 'ai-concierge'
  | 'gtm-engine'
  | 'bpa'
  | 'how-it-works'
  | 'customers'
  | 'pricing'
  | 'about'
  | 'contact';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentPage !== 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'ai-concierge':
        return <AIConciergeDetailPage onNavigate={setCurrentPage} />;
      case 'gtm-engine':
        return <GTMEngineDetailPage onNavigate={setCurrentPage} />;
      case 'bpa':
        return <BPADetailPage onNavigate={setCurrentPage} />;
      case 'how-it-works':
        return <HowItWorksPage onNavigate={setCurrentPage} />;
      case 'customers':
        return <CustomersPage onNavigate={setCurrentPage} />;
      case 'pricing':
        return <PricingPage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutUsPage onNavigate={setCurrentPage} />;
      case 'contact':
        return <ContactPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  const isHome = currentPage === 'home';

  return (
    <div className="relative min-h-screen">
      <GradientBackground />
      {isHome && <StarScene />}

      <Toaster position="top-right" />
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="relative" style={{ zIndex: 10 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>

        {!isHome && <Footer onNavigate={setCurrentPage} />}
      </div>

      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-4 rounded-full shadow-xl cursor-pointer"
          style={{
            background: 'linear-gradient(120deg, #3b82f6 0%, #7D41B9 100%)',
            boxShadow: '0 0 30px rgba(59,130,246,0.3)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </motion.button>
      )}
    </div>
  );
}
