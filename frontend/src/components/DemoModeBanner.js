import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeLocalStorage } from '../utils/storage';

export default function DemoModeBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    // Check if user has dismissed the banner before
    return safeLocalStorage.getItem('demo-banner-dismissed') !== 'true';
  });

  const handleDismiss = () => {
    setIsVisible(false);
    safeLocalStorage.setItem('demo-banner-dismissed', 'true');
  };

  // Only show in production when using mock data
  const showBanner = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (!showBanner || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 to-orange-500 shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm md:text-base">
                  Modo Demonstração
                </h3>
                <p className="text-white/90 text-xs md:text-sm leading-tight">
                  Esta é uma versão demo do FLAME. Os dados exibidos são fictícios para demonstração.
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors p-1 flex-shrink-0"
              aria-label="Fechar banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
