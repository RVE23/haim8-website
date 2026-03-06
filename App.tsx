import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

// Import page components
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
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return (
    <div className="bg-[#0A0E1A]">
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Page Content with Animation */}
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

      {/* Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-r from-[#0080E4] to-[#7D41B9] text-white rounded-full shadow-xl hover:shadow-2xl transition-all"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
