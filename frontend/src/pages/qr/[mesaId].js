import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import FlameLogo from '../../components/Logo';
import { QrCode, User, UserPlus, ArrowRight } from 'lucide-react';

export default function QRCodePage() {
  const router = useRouter();
  const { mesaId } = router.query;
  const { isAuthenticated } = useAuthStore();
  const { setTable } = useCartStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!mesaId) return;

    // Salva a mesa no sessionStorage para recuperar após login
    sessionStorage.setItem('redlight-qr-mesa', mesaId);

    // Define o número da mesa no carrinho imediatamente
    setTable(mesaId, parseInt(mesaId));

    // Verifica autenticação após 1 segundo
    const timer = setTimeout(() => {
      setIsChecking(false);

      if (isAuthenticated) {
        // Se já está logado, vai direto para o cardápio
        router.push(`/cardapio?mesa=${mesaId}`);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [mesaId, isAuthenticated, router, setTable]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
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

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <FlameLogo color="#FF6B35" size={80} compact={false} />
          </div>
          <LoadingSpinner size="large" text="Verificando mesa..." />
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Mesa {mesaId} | Red Light</title>
        <meta name="description" content={`Bem-vindo à Mesa ${mesaId} do Red Light`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex items-center justify-center p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <FlameLogo color="#FF6B35" size={100} compact={false} />
          </motion.div>

          {/* Welcome Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-900/80 backdrop-blur-sm border border-red-900/50 rounded-2xl p-8 mb-6"
          >
            {/* Mesa Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center border-2 border-orange-500">
                <QrCode className="w-10 h-10 text-orange-400" />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">
                Bem-vindo à Mesa <span className="text-orange-400">#{mesaId}</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Faça seu pedido direto da mesa
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Onde Amsterdam encontra Botafogo
              </p>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-500">
                  Escolha uma opção
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Login Button */}
              <motion.button
                variants={itemVariants}
                onClick={() => router.push(`/login?returnTo=/cardapio&mesa=${mesaId}`)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-between group shadow-lg hover:shadow-orange-600/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-80">Já tenho conta</div>
                    <div className="text-base">Entrar</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Register Button */}
              <motion.button
                variants={itemVariants}
                onClick={() => router.push(`/register?returnTo=/cardapio&mesa=${mesaId}`)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-between group border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/30">
                    <UserPlus className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-80">Nova por aqui?</div>
                    <div className="text-base">Criar conta</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>

          {/* Info Footer */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <p className="text-gray-500 text-sm">
              Ao continuar, você concorda com nossos{' '}
              <a href="/termos" className="text-orange-400 hover:underline">
                Termos de Uso
              </a>
            </p>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-10" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-600 rounded-full blur-3xl opacity-10" />
        </motion.div>
      </div>
    </>
  );
}
