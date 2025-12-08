import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  X,
  CheckCircle,
  AlertCircle,
  Settings,
  Smartphone,
  Loader2
} from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { usePushNotification } from '../hooks/usePushNotification';

export default function PWANotifications() {
  const { showNotification } = usePWA();
  const {
    permission,
    subscription,
    isSupported,
    isSubscribed,
    isLoading: pushLoading,
    error: pushError,
    requestPermission,
    subscribe: subscribeToPush,
    sendTest
  } = usePushNotification();

  const [permissionStatus, setPermissionStatus] = useState('default');
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Check initial notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }

    // Check if user dismissed the prompt before
    const dismissed = localStorage.getItem('notification-prompt-dismissed');
    if (!dismissed && Notification.permission === 'default') {
      // Show prompt after a delay
      const timer = setTimeout(() => {
        setShowPermissionPrompt(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnableNotifications = async () => {
    // Usa o hook usePushNotification que já faz tudo (pede permissão, registra SW, envia para backend)
    const subscription = await subscribeToPush();

    if (subscription) {
      setPermissionStatus('granted');

      // Show welcome notification
      await showNotification('Notificações ativadas! 🎉', {
        body: 'Agora você receberá atualizações sobre seus pedidos',
        tag: 'welcome',
        requireInteraction: false,
        actions: []
      });

      setShowPermissionPrompt(false);
    } else {
      // Check if permission was denied
      if ('Notification' in window) {
        const perm = Notification.permission;
        setPermissionStatus(perm);
        if (perm === 'denied') {
          localStorage.setItem('notification-prompt-dismissed', 'true');
        }
      }
      setShowPermissionPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPermissionPrompt(false);
    localStorage.setItem('notification-prompt-dismissed', 'true');
  };

  const openNotificationSettings = () => {
    setShowSettings(true);
  };

  const testNotification = async () => {
    // Primeiro tenta enviar via backend (que usa push real)
    const success = await sendTest();

    if (!success) {
      // Fallback para notificação local
      await showNotification('Teste de Notificação', {
        body: 'Esta é uma notificação de teste do FLAME',
        tag: 'test',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        actions: [
          {
            action: 'open',
            title: 'Abrir App',
            icon: '/icons/action-open.png'
          }
        ]
      });
    }
  };

  return (
    <>
      {/* Permission Prompt */}
      <AnimatePresence>
        {showPermissionPrompt && permissionStatus === 'default' && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto"
          >
            <div className="bg-gray-900 rounded-xl p-4 shadow-2xl border border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-orange-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm mb-1">
                    Quer receber notificações?
                  </h3>
                  <p className="text-gray-400 text-xs mb-3 leading-relaxed">
                    Receba atualizações sobre o status dos seus pedidos e ofertas especiais
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleEnableNotifications}
                      className="bg-orange-500 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                    >
                      <Bell className="w-3 h-3" />
                      Permitir
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="text-gray-400 hover:text-white text-xs transition-colors"
                    >
                      Não agora
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-white transition-colors p-1 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Settings Button */}
      {(permissionStatus === 'granted' || permissionStatus === 'denied') && (
        <button
          onClick={openNotificationSettings}
          className="fixed bottom-20 right-4 w-12 h-12 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center transition-colors z-40"
          title="Configurações de notificação"
        >
          {permissionStatus === 'granted' ? (
            <Bell className="w-5 h-5 text-green-400" />
          ) : (
            <BellOff className="w-5 h-5 text-orange-400" />
          )}
        </button>
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-gray-700"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Configurações de Notificação
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                {/* Permission Status */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Status das Notificações</span>
                    {permissionStatus === 'granted' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {permissionStatus === 'granted' && 'Notificações ativadas'}
                    {permissionStatus === 'denied' && 'Notificações bloqueadas'}
                    {permissionStatus === 'default' && 'Não configurado'}
                  </p>
                </div>

                {/* Subscription Status */}
                {permissionStatus === 'granted' && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Push Notifications</span>
                      {isSubscribed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {isSubscribed 
                        ? 'Inscrito para receber notificações push' 
                        : 'Não inscrito para notificações push'
                      }
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {permissionStatus === 'granted' && (
                    <button
                      onClick={testNotification}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Testar Notificação
                    </button>
                  )}

                  {permissionStatus === 'default' && (
                    <button
                      onClick={handleEnableNotifications}
                      className="w-full bg-orange-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Ativar Notificações
                    </button>
                  )}

                  {permissionStatus === 'denied' && (
                    <div className="bg-yellow-600/20 rounded-lg p-3 border border-yellow-600/30">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-yellow-300 font-medium text-sm">
                            Notificações bloqueadas
                          </div>
                          <div className="text-yellow-200 text-xs mt-1">
                            Para ativar, vá em Configurações do navegador {'>'} Notificações e permita para este site
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-medium mb-2 text-sm">
                  Tipos de notificação que você pode receber:
                </h4>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>• Status dos seus pedidos (confirmado, pronto, entregue)</li>
                  <li>• Ofertas e promoções especiais</li>
                  <li>• Novos itens no cardápio</li>
                  <li>• Atualizações importantes do app</li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}