import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Slide from '../components/Slide';
import PresentationControls from '../components/PresentationControls';
import roadmapData from '../data/roadmapData';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'next/router';

export default function Roadmap() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [textSize, setTextSize] = useState(1); // 0 = small, 1 = medium, 2 = large
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação e permissão de admin
  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Apenas admins podem acessar
      if (user?.role !== 'admin') {
        router.push('/');
        return;
      }

      setIsLoading(false);
    };

    checkAccess();
  }, [isAuthenticated, user, router]);

  // Navegação
  const goToNext = () => {
    if (currentSlide < roadmapData.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPrevious = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Erro ao entrar em fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Detectar mudança de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Modo apresentação
  const togglePresentationMode = () => {
    setIsPresentationMode(!isPresentationMode);
  };

  const currentSlideData = roadmapData[currentSlide - 1];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Roadmap FLAME | 60 Dias até o Grand Opening</title>
        <meta name="description" content="Cronograma executivo do projeto FLAME: do aluguel ao grand opening em 60 dias" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="relative w-full h-screen overflow-hidden bg-black">
        {/* Slide atual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Slide slide={currentSlideData} textSize={textSize} />
          </motion.div>
        </AnimatePresence>

        {/* Controles de apresentação */}
        <PresentationControls
          currentSlide={currentSlide}
          totalSlides={roadmapData.length}
          onPrevious={goToPrevious}
          onNext={goToNext}
          textSize={textSize}
          onTextSizeChange={setTextSize}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          isPresentationMode={isPresentationMode}
          onTogglePresentationMode={togglePresentationMode}
        />

        {/* Indicador de slide (sempre visível no canto) */}
        {!isPresentationMode && (
          <div className="fixed top-4 right-4 z-40 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            <span className="text-white text-sm font-medium">
              <span className="text-orange-400">{currentSlide}</span>
              <span className="text-gray-400"> / {roadmapData.length}</span>
            </span>
          </div>
        )}

        {/* Voltar (apenas quando não está em modo apresentação) */}
        {!isPresentationMode && (
          <button
            onClick={() => router.push('/')}
            className="fixed top-4 left-4 z-40 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            ← Voltar
          </button>
        )}
      </div>
    </>
  );
}
