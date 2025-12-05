/**
 * Componente de prompt para ativar Push Notifications
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, AlertTriangle } from 'lucide-react';
import { usePushNotification } from '../hooks/usePushNotification';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';

export function PushNotificationPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const { shouldShowPrompt, setLastPrompt, setEnabled } = useNotificationStore();
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    error
  } = usePushNotification();

  useEffect(() => {
    // Show prompt after 3 seconds if conditions are met
    const timer = setTimeout(() => {
      if (
        isAuthenticated &&
        isSupported &&
        !isSubscribed &&
        permission !== 'denied' &&
        shouldShowPrompt()
      ) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isSupported, isSubscribed, permission, shouldShowPrompt]);

  const handleEnable = async () => {
    const result = await subscribe();
    if (result) {
      setEnabled(true);
      setShowSuccess(true);
      setTimeout(() => {
        setIsVisible(false);
        setShowSuccess(false);
      }, 2000);
    }
  };

  const handleDismiss = () => {
    setLastPrompt(new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50"
      >
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-orange-500/30 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500/20 to-transparent p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white">Ative as Notificações</h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-green-400 font-medium">Notificações ativadas!</p>
              </motion.div>
            ) : (
              <>
                <p className="text-gray-300 text-sm mb-4">
                  Receba alertas quando seu pedido estiver pronto, promoções exclusivas e lembretes de reservas.
                </p>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleDismiss}
                    className="flex-1 py-2.5 text-gray-400 hover:text-white transition-colors text-sm"
                    disabled={isLoading}
                  >
                    Depois
                  </button>
                  <button
                    onClick={handleEnable}
                    disabled={isLoading}
                    className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Ativando...
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        Ativar
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PushNotificationPrompt;
