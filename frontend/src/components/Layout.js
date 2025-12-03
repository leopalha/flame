import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import LoadingSpinner from './LoadingSpinner';
import PWAInstallBanner from './PWAInstallBanner';
import PWANotifications from './PWANotifications';
import MockDataToggle from './MockDataToggle';
import { useAuthStore } from '../stores/authStore';
// import { usePWA } from '../hooks/usePWA'; // DESABILITADO TEMPORARIAMENTE
import { Toaster } from 'react-hot-toast';

const Layout = ({ children, showHeader = true, showFooter = true, showBottomNav = true, className = '' }) => {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  // const { isOnline, updateAvailable, updateApp } = usePWA(); // DESABILITADO
  const isOnline = true;
  const updateAvailable = false;
  const updateApp = () => {};
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Erro ao verificar autenticacao:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [checkAuth]);

  // Handle PWA update
  useEffect(() => {
    if (updateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [updateAvailable]);

  // Handle offline redirect
  useEffect(() => {
    if (!isOnline && router.pathname !== '/offline') {
      sessionStorage.setItem('offline_return_url', router.asPath);
      router.push('/offline');
    }
  }, [isOnline, router]);

  // Paginas que nao devem mostrar header/footer
  const hideNavigation = ['/login', '/register', '/verify'];
  const shouldHideNav = hideNavigation.some(path => router.pathname.startsWith(path));

  // Staff pages should not show BottomNav
  const staffPages = ['/admin', '/cozinha', '/atendente', '/staff'];
  const isStaffPage = staffPages.some(path => router.pathname.startsWith(path));

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-magenta-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FF006E" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <div className={`min-h-screen bg-black text-white flex flex-col ${className}`}>
        {/* Header */}
        {showHeader && !shouldHideNav && <Header />}

        {/* Main Content - add bottom padding for BottomNav on mobile */}
        <AnimatePresence mode="wait">
          <motion.main
            key={router.route}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className={`flex-1 ${showBottomNav && !shouldHideNav && !isStaffPage ? 'pb-20 md:pb-0' : ''}`}
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {/* Footer - hidden on mobile when BottomNav is shown */}
        {showFooter && !shouldHideNav && (
          <div className={showBottomNav && !isStaffPage ? 'hidden md:block' : ''}>
            <Footer />
          </div>
        )}

        {/* BottomNav - mobile only */}
        {showBottomNav && !shouldHideNav && !isStaffPage && <BottomNav />}

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #333',
            },
            success: {
              style: {
                border: '1px solid #00D4FF',
              },
              iconTheme: {
                primary: '#00D4FF',
                secondary: '#fff',
              },
            },
            error: {
              style: {
                border: '1px solid #FF006E',
              },
              iconTheme: {
                primary: '#FF006E',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* PWA Components - DESABILITADO */}
        {/* <PWAInstallBanner /> */}
        {/* <PWANotifications /> */}

        {/* Update Prompt */}
        <AnimatePresence>
          {showUpdatePrompt && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
            >
              <div className="bg-gradient-to-r from-magenta-600 to-cyan-600 rounded-xl p-4 shadow-2xl border border-magenta-500/30">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm mb-1">
                      Nova versao disponivel!
                    </h3>
                    <p className="text-white/90 text-xs mb-3 leading-relaxed">
                      Uma atualizacao esta disponivel com melhorias e correcoes
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          updateApp();
                          setShowUpdatePrompt(false);
                        }}
                        className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Atualizar Agora
                      </button>
                      <button
                        onClick={() => setShowUpdatePrompt(false)}
                        className="text-white/70 hover:text-white text-xs transition-colors"
                      >
                        Mais tarde
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUpdatePrompt(false)}
                    className="text-white/70 hover:text-white transition-colors p-1 flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Offline Status Indicator */}
        <AnimatePresence>
          {!isOnline && router.pathname !== '/offline' && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="fixed top-0 left-0 right-0 bg-gradient-to-r from-magenta-600 to-cyan-600 text-white px-4 py-2 text-center text-sm font-medium z-50"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Voce esta offline. Algumas funcionalidades podem nao estar disponiveis.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mock Data Toggle - Development Only */}
        <MockDataToggle />
      </div>
    </>
  );
};

export default Layout;
