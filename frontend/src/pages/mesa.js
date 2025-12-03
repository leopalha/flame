import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { MapPin, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Mesa() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { tableNumber: currentTable, setTable } = useCartStore();
  const [selectedTable, setSelectedTable] = useState(currentTable || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const hasRedirectedRef = useRef(false);

  // Wait for Zustand to hydrate before checking authentication
  useEffect(() => {
    // Small delay to allow Zustand persist to hydrate
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Redirect to login if not authenticated (only after hydration)
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      toast.error('Faça login para selecionar uma mesa');
      router.push('/login?returnTo=/mesa');
    }
  }, [isAuthenticated, isCheckingAuth, router]);

  // Generate table numbers (1-20)
  const tables = Array.from({ length: 20 }, (_, i) => i + 1);

  const handleTableSelect = (tableNum) => {
    setSelectedTable(tableNum);
  };

  const handleConfirm = () => {
    if (!selectedTable) {
      toast.error('Selecione uma mesa');
      return;
    }

    setIsSubmitting(true);

    try {
      setTable(selectedTable.toString(), selectedTable);
      toast.success(`Mesa ${selectedTable} selecionada!`);

      // Redirect to cardapio or back to cart
      const returnTo = router.query.returnTo || '/cardapio';
      router.push(returnTo);
    } catch (error) {
      console.error('Erro ao selecionar mesa:', error);
      toast.error('Erro ao selecionar mesa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Carregando..." />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Selecione sua Mesa | FLAME</title>
        <meta name="description" content="Selecione o número da sua mesa para fazer o pedido" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-orange-500"
              >
                <MapPin className="w-10 h-10 text-orange-400" />
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                Selecione sua Mesa
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-lg max-w-2xl mx-auto"
              >
                Escolha o número da mesa onde você está sentado para continuar com seu pedido
              </motion.p>

              {/* Current Table Info */}
              {currentTable && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 inline-flex items-center gap-2 bg-blue-900/20 border border-blue-700/50 text-blue-400 px-4 py-2 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">
                    Mesa atual: <strong>#{currentTable}</strong>
                  </span>
                </motion.div>
              )}
            </div>

            {/* Table Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-12"
            >
              {tables.map((tableNum) => (
                <motion.button
                  key={tableNum}
                  variants={itemVariants}
                  onClick={() => handleTableSelect(tableNum)}
                  className={`
                    relative aspect-square rounded-xl font-bold text-xl
                    transition-all duration-300 transform hover:scale-105
                    ${selectedTable === tableNum
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-600/50 scale-105'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    }
                  `}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <MapPin className={`w-5 h-5 mb-1 ${selectedTable === tableNum ? 'text-white' : 'text-gray-500'}`} />
                    <span>{tableNum}</span>
                  </div>

                  {selectedTable === tableNum && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Confirmation Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-md mx-auto"
            >
              {selectedTable && (
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Mesa selecionada</p>
                        <p className="text-white text-2xl font-bold">#{selectedTable}</p>
                      </div>
                    </div>
                    <Check className="w-8 h-8 text-green-400" />
                  </div>

                  <div className="text-sm text-gray-400 bg-gray-800 rounded-lg p-3">
                    <p>
                      ✓ Seu pedido será identificado para a Mesa {selectedTable}
                    </p>
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={!selectedTable || isSubmitting}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-lg
                  transition-all flex items-center justify-center gap-2
                  ${selectedTable && !isSubmitting
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-600/50'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isSubmitting ? (
                  'Confirmando...'
                ) : (
                  <>
                    Confirmar Mesa
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Help Text */}
              <p className="text-center text-gray-500 text-sm mt-4">
                Caso não encontre sua mesa, solicite auxílio ao atendente
              </p>
            </motion.div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">Identifique sua mesa</h3>
                <p className="text-gray-500 text-sm">
                  O número está na placa sobre a mesa
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">Confirme o número</h3>
                <p className="text-gray-500 text-sm">
                  Verifique antes de confirmar
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowRight className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">Faça seu pedido</h3>
                <p className="text-gray-500 text-sm">
                  Continue para o cardápio
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
