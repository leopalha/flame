import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import { useThemeStore } from '../stores/themeStore';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Clock, MapPin, Star, Users, Flame, Zap, Wine } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { featuredProducts, isLoading, fetchFeaturedProducts } = useProductStore();
  const { getPalette } = useThemeStore();
  const palette = getPalette();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Redirecionar para complete-profile se necessário
  useEffect(() => {
    if (isAuthenticated && user && !user.profileComplete) {
      router.push('/complete-profile');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    fetchFeaturedProducts();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [fetchFeaturedProducts]);

  const isOpen = () => {
    const hour = currentTime.getHours();
    const day = currentTime.getDay();

    if (day === 0 || (day >= 1 && day <= 4)) {
      return hour >= 18 || hour <= 2;
    } else {
      return hour >= 18 || hour <= 3;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  return (
    <>
      <Head>
        <title>FLAME | Lounge Bar + Narguile em Botafogo</title>
        <meta name="description" content="FLAME - Lounge Bar com drinks autorais, gastronomia premium e narguile em Botafogo. Boa musica e ambiente sofisticado." />
        <meta name="keywords" content="flame, botafogo, bar, lounge, drinks autorais, narguile, gastronomia, rio de janeiro" />
      </Head>

      <Layout>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="min-h-screen"
        >
          {/* Hero Section */}
          <motion.section
            variants={itemVariants}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pb-16"
            style={{
              background: 'linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 50%, #0A0A0A 100%)'
            }}
          >
            {/* Animated gradient overlay - FLAME colors */}
            <div className="absolute inset-0 opacity-30">
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 20% 30%, #FF006E 0%, transparent 50%), radial-gradient(circle at 80% 70%, #00D4FF 0%, transparent 50%)'
                }}
              />
            </div>

            {/* Geometric pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF006E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }} />
            </div>

            {/* Glowing orbs - FLAME colors */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--theme-primary)] rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--theme-secondary)] rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-20 sm:pt-32">
              {/* Logo Vertical */}
              <motion.div
                className="flex items-center justify-center mb-8"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <Image
                  src="/logo-vertical.png"
                  alt="FLAME Lounge Bar"
                  width={240}
                  height={312}
                  className="object-contain w-40 h-52 sm:w-48 sm:h-62 md:w-60 md:h-78"
                  style={{
                    filter: 'drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))'
                  }}
                  priority
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-10"
              >
                <p
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-4"
                  style={{
                    background: `linear-gradient(to right, var(--theme-primary), var(--theme-secondary))`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Drinks + Gastronomia + Narguile
                </p>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-6 sm:px-4">
                  Onde o sabor encontra a sofisticacao. Drinks autorais, gastronomia premium e narguile em Botafogo.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold shadow-lg text-white"
                  style={{
                    background: isOpen()
                      ? 'linear-gradient(to right, #10B981, #06B6D4)'
                      : `linear-gradient(to right, var(--theme-primary), var(--theme-accent))`
                  }}
                >
                  <Clock className="w-5 h-5" />
                  <span>{isOpen() ? 'ABERTO AGORA' : 'FECHADO'}</span>
                </div>

                <div
                  className="flex items-center gap-2 text-gray-300 bg-gray-900/50 backdrop-blur-sm px-5 py-2.5 rounded-full"
                  style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'color-mix(in srgb, var(--theme-primary) 20%, transparent)' }}
                >
                  <MapPin className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                  <span>Botafogo, Rio de Janeiro</span>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0 mb-10"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link
                  href="/cardapio"
                  className="btn-link group relative px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all inline-flex items-center justify-center gap-2 sm:gap-3 shadow-xl sm:hover:scale-105 overflow-hidden w-full sm:w-auto hover:opacity-90"
                  style={{
                    background: `linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))`
                  }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10">Ver Cardápio</span>
                  <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  href="/historia"
                  className="btn-link group bg-black/40 backdrop-blur-sm border-2 px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all inline-flex items-center justify-center gap-2 sm:gap-3 sm:hover:scale-105 shadow-xl shadow-black/50 w-full sm:w-auto"
                  style={{
                    borderColor: 'var(--theme-primary)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)'}
                >
                  <span className="z-10">Nossa História</span>
                  <svg className="z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                className="mt-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex justify-center"
                >
                  <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>

          {/* Features Section */}
          <motion.section
            variants={itemVariants}
            className="py-24 relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)'
            }}
          >
            {/* Background accent */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[var(--theme-secondary)] to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
              <div className="text-center mb-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-block mb-4"
                >
                  <span className="text-[var(--theme-primary)] font-semibold tracking-wider uppercase text-sm">
                    O Melhor de Botafogo
                  </span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-6xl font-bold text-white mb-6"
                >
                  Por que <span style={{
                    background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>FLAME</span>?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
                >
                  Experiencia completa em um so lugar: drinks, gastronomia e narguile premium
                </motion.p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-20"
                    style={{ background: 'radial-gradient(circle, var(--theme-primary) 0%, transparent 70%)' }}
                  />
                  <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-[var(--theme-primary)]/20 group-hover:border-[var(--theme-primary)]/40 transition-all">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg" style={{
                      background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-accent))',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
                    }}>
                      <Wine className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[var(--theme-primary)] transition-colors">
                      Drinks Autorais
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Criacoes exclusivas dos nossos bartenders com ingredientes premium e apresentacao impecavel.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 group-hover:border-purple-500/40 transition-all">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-[var(--theme-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                      Gastronomia Premium
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Pratos elaborados com ingredientes selecionados para harmonizar com nossos drinks.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-secondary)]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-[var(--theme-secondary)]/20 group-hover:border-[var(--theme-secondary)]/40 transition-all">
                    <div className="w-20 h-20 bg-gradient-to-br from-[var(--theme-secondary)] to-[var(--theme-primary)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-[var(--theme-secondary)]/30">
                      <Flame className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[var(--theme-secondary)] transition-colors">
                      Narguile Premium
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Variedade de sabores importados com atendimento especializado para sua sessão perfeita.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Featured Products */}
          {Array.isArray(featuredProducts) && featuredProducts.length > 0 && (
            <motion.section
              variants={itemVariants}
              className="py-24 relative overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #0a0a0a 0%, #000000 50%, #0a0a0a 100%)'
              }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 opacity-20">
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle at 30% 20%, #FF006E 0%, transparent 60%), radial-gradient(circle at 70% 80%, #00D4FF 0%, transparent 60%)'
                  }}
                />
              </div>

              <div className="max-w-7xl mx-auto px-4 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <div className="inline-block mb-4">
                    <span className="text-[var(--theme-primary)] font-semibold text-sm uppercase tracking-wider bg-[var(--theme-primary)]/10 px-4 py-2 rounded-full border border-[var(--theme-primary)]/30">
                      Nosso Cardapio
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    <span style={{
                      background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      Destaques
                    </span>
                    {' '}Especiais
                  </h2>
                  <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Nossos produtos mais pedidos e criacoes especiais da casa
                  </p>
                </motion.div>

                {isLoading ? (
                  <div className="flex justify-center">
                    <LoadingSpinner size="large" />
                  </div>
                ) : (
                  <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ staggerChildren: 0.1 }}
                  >
                    {featuredProducts.slice(0, 6).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-center mt-16"
                >
                  <Link
                    href="/cardapio"
                    className="btn-link group relative px-12 py-5 rounded-xl font-bold text-lg transition-all inline-flex items-center gap-3 shadow-2xl hover:scale-105 hover:opacity-90 overflow-hidden"
                    style={{
                      background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative">Ver Cardápio Completo</span>
                    <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* Location Section */}
          <motion.section
            variants={itemVariants}
            className="py-24 relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)'
            }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, #FF006E 0%, transparent 70%)'
                }}
              />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="mb-6">
                    <span className="text-[var(--theme-primary)] font-semibold text-sm uppercase tracking-wider bg-[var(--theme-primary)]/10 px-4 py-2 rounded-full border border-[var(--theme-primary)]/30">
                      Localizacao
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    Venha nos{' '}
                    <span style={{
                      background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      Visitar
                    </span>
                  </h2>
                  <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                    Estamos localizados no coracao de Botafogo, facil acesso e estacionamento proximo.
                  </p>

                  <div className="space-y-6 mb-10">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="group flex items-start gap-4 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-5 rounded-xl border border-[var(--theme-primary)]/20 hover:border-[var(--theme-primary)]/40 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg" style={{
                        background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-accent))',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                      }}>
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold mb-1">Endereco</div>
                        <span className="text-gray-300">Rua Arnaldo Quintela 19, Botafogo - RJ</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className="group flex items-start gap-4 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-5 rounded-xl border border-[var(--theme-secondary)]/20 hover:border-[var(--theme-secondary)]/40 transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--theme-secondary)] to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-[var(--theme-secondary)]/30">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold mb-2">Horario de Funcionamento</div>
                        <div className="text-gray-300 space-y-1">
                          <div>Dom-Qui: 18h as 02h</div>
                          <div>Sex-Sab: 18h as 03h</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <Link
                    href="https://www.google.com/maps/search/?api=1&query=Rua+Arnaldo+Quintela+19+Botafogo+Rio+de+Janeiro"
                    target="_blank"
                    className="btn-link group relative px-10 py-5 rounded-xl font-bold text-lg transition-all inline-flex items-center gap-3 shadow-2xl hover:scale-105 hover:opacity-90 overflow-hidden"
                    style={{
                      background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <MapPin className="relative w-5 h-5" />
                    <span className="relative">Como Chegar</span>
                    <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative group"
                >
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-primary)]/30 via-purple-500/20 to-[var(--theme-secondary)]/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />

                  <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-[var(--theme-primary)]/30 h-[500px] overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d917.8!2d-43.1823!3d-22.9519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997fd3f3c57e4b%3A0x5e54c3b9d89f1e0a!2sR.%20Arnaldo%20Quintela%2C%2019%20-%20Botafogo%2C%20Rio%20de%20Janeiro%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1702234567890!5m2!1spt-BR!2sbr"
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '0.75rem', filter: 'invert(90%) hue-rotate(180deg)' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Localização FLAME - Rua Arnaldo Quintela, 19 - Botafogo, Rio de Janeiro"
                    />

                    {/* Overlay com informações */}
                    <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-[var(--theme-primary)]/30">
                      <div className="flex items-start gap-3">
                        <Flame className="w-5 h-5 text-[var(--theme-primary)] flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-white font-semibold mb-1">FLAME Lounge Bar</p>
                          <p className="text-gray-400 text-sm">Botafogo, Rio de Janeiro</p>
                          <p className="text-gray-400 text-sm">Rua Arnaldo Quintela, 19</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </Layout>
    </>
  );
}
