import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  X,
  Smartphone,
  Monitor,
  Share,
  Plus,
  ArrowDown
} from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export default function PWAInstallBanner() {
  const {
    isInstallable,
    isInstalled,
    installApp,
    isLoading,
    showIOSInstallPrompt
  } = usePWA();

  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');

  // Check device type and localStorage dismiss status
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    // Detect device type
    const userAgent = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/Android/.test(userAgent)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  const handleInstall = async () => {
    if (deviceType === 'ios') {
      setShowIOSInstructions(true);
      return;
    }

    const success = await installApp();
    if (success) {
      setIsDismissed(true);
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const shouldShow = isInstallable && !isInstalled && !isDismissed;

  if (!shouldShow && !showIOSInstructions) return null;

  return (
    <>
      {/* Install Banner */}
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-700 rounded-xl p-4 shadow-2xl border border-orange-500/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  {deviceType === 'ios' || deviceType === 'android' ? (
                    <Smartphone className="w-5 h-5 text-white" />
                  ) : (
                    <Monitor className="w-5 h-5 text-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm mb-1">
                    Instalar FLAME
                  </h3>
                  <p className="text-white/90 text-xs mb-3 leading-relaxed">
                    {deviceType === 'ios' 
                      ? 'Adicione o FLAME à sua tela inicial para acesso rápido'
                      : 'Instale nosso app para uma experiência mais rápida e funcionalidades offline'
                    }
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleInstall}
                      disabled={isLoading}
                      className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                          Instalando...
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3" />
                          {deviceType === 'ios' ? 'Ver instruções' : 'Instalar'}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDismiss}
                  className="text-white/70 hover:text-white transition-colors p-1 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Installation Instructions Modal */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowIOSInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-xl max-w-sm w-full p-6 border border-gray-700"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Adicionar à Tela Inicial
                </h3>
                <p className="text-gray-400 text-sm">
                  Siga os passos abaixo para instalar o FLAME no seu iPhone/iPad
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1 flex items-center gap-2">
                      Toque no ícone <Share className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-gray-400 text-sm">
                      Toque no botão de compartilhamento na barra inferior do Safari
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1 flex items-center gap-2">
                      Selecione <Plus className="w-4 h-4 text-blue-400" /> "Adicionar à Tela Inicial"
                    </div>
                    <p className="text-gray-400 text-sm">
                      Role para baixo e encontre a opção "Adicionar à Tela Inicial"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">
                      Confirme a instalação
                    </div>
                    <p className="text-gray-400 text-sm">
                      Toque em "Adicionar" no canto superior direito
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowIOSInstructions(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Entendi
                </button>
                <button
                  onClick={() => {
                    setShowIOSInstructions(false);
                    handleDismiss();
                  }}
                  className="flex-1 bg-orange-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Não mostrar novamente
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}