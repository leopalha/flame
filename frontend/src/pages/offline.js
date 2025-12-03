import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  WifiOff,
  RefreshCw,
  Home,
  ShoppingBag,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Layout from '../components/Layout';
import { useCartStore } from '../stores/cartStore';
import { formatCurrency } from '../utils/format';

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [lastSyncAttempt, setLastSyncAttempt] = useState(null);
  const { items: cartItems, total } = useCartStore();

  // Check online status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const handleOnline = () => {
      setIsOnline(true);
      setRetryCount(0);
      // Redirect to previous page or home
      const returnUrl = sessionStorage.getItem('offline_return_url') || '/';
      sessionStorage.removeItem('offline_return_url');
      router.push(returnUrl);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Set initial status
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    setLastSyncAttempt(new Date());

    try {
      // Try to fetch a small resource to test connection
      const response = await fetch('/api/health', { 
        method: 'GET',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        setIsOnline(true);
        router.push('/');
      }
    } catch (error) {
      console.log('Still offline:', error);
      // Stay on offline page
    }
  };

  const goHome = () => {
    router.push('/');
  };

  const viewCart = () => {
    router.push('/carrinho');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <Head>
        <title>Sem Conexão | FLAME</title>
        <meta name="description" content="Você está offline. Alguns recursos podem não estar disponíveis." />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              {/* Offline Icon */}
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="mx-auto w-32 h-32 mb-8"
              >
                <div className="w-full h-full bg-orange-500/20 rounded-full flex items-center justify-center">
                  <WifiOff className="w-16 h-16 text-orange-400" />
                </div>
              </motion.div>

              {/* Title and Description */}
              <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Você está offline
                </h1>
                <p className="text-xl text-gray-400 mb-6">
                  Parece que você perdeu a conexão com a internet. Alguns recursos podem não estar disponíveis.
                </p>
                
                {/* Connection Status */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full border border-orange-500/30">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-orange-400 text-sm">Sem conexão</span>
                </div>
              </motion.div>

              {/* Retry Section */}
              <motion.div variants={itemVariants} className="mb-12">
                <button
                  onClick={handleRetry}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-3 mb-4"
                >
                  <RefreshCw className={`w-5 h-5 ${retryCount > 0 ? 'animate-spin' : ''}`} />
                  Tentar Novamente
                </button>
                
                {retryCount > 0 && (
                  <div className="text-gray-500 text-sm">
                    Tentativa {retryCount} • {lastSyncAttempt && new Date(lastSyncAttempt).toLocaleTimeString()}
                  </div>
                )}
              </motion.div>

              {/* Available Actions */}
              <motion.div variants={itemVariants} className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  O que você pode fazer offline
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* View Cart */}
                  {cartItems.length > 0 && (
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                      <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                        <ShoppingBag className="w-6 h-6 text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Seu Carrinho
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} • {formatCurrency(total)}
                      </p>
                      <button
                        onClick={viewCart}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Ver Carrinho
                      </button>
                    </div>
                  )}

                  {/* Cached Content */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Smartphone className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Conteúdo Salvo
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Acesse páginas que você visitou recentemente
                    </p>
                    <button
                      onClick={goHome}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      Ir para Início
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Dicas para reconectar
                </h3>
                
                <div className="text-left space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Verifique sua conexão Wi-Fi</div>
                      <div className="text-gray-400 text-sm">Certifique-se de que está conectado à rede</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Verifique seus dados móveis</div>
                      <div className="text-gray-400 text-sm">Ative os dados móveis se estiver usando 4G/5G</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Aguarde um momento</div>
                      <div className="text-gray-400 text-sm">Às vezes a conexão pode demorar para estabilizar</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Auto-retry indicator */}
              <motion.div variants={itemVariants} className="mt-8">
                <div className="text-gray-500 text-sm">
                  Tentaremos reconectar automaticamente quando a internet voltar
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
}