import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useProductStore } from '../stores/productStore';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Clock, MapPin, Star, Users, Flame, Zap, Wine } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { featuredProducts, isLoading, fetchFeaturedProducts } = useProductStore();
  const [currentTime, setCurrentTime] = useState(new Date());

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
        <title>FLAME | Lounge Bar + Gastronomia em Botafogo</title>
        <meta name="description" content="FLAME - Lounge Bar com gastronomia premium e narguile em Botafogo. Drinks autorais, boa musica e ambiente sofisticado." />
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
            className="relative h-screen flex items-center justify-center overflow-hidden"
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
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-magenta-500 rounded-full blur-3xl"
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
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-20 sm:pt-32">
              <motion.h1
                className="text-6xl sm:text-8xl md:text-[10rem] font-black text-white mb-8"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{
                  textShadow: '0 0 40px rgba(255, 0, 110, 0.5), 0 0 80px rgba(0, 212, 255, 0.3)',
                  fontFamily: "'Bebas Neue', 'Futura', 'Helvetica Neue', Arial, sans-serif",
                  letterSpacing: '0.1em',
                }}
              >
                <span className="bg-gradient-to-r from-magenta-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent inline-block">
                  FLAME
                </span>
              </motion.h1>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-10"
              >
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta-300 to-cyan-300 mb-4">
                  Lounge Bar + Gastronomia + Narguile
                </p>
                <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed px-6 sm:px-4">
                  Onde o sabor encontra a sofisticacao. Drinks autorais, gastronomia premium e narguile em Botafogo.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold shadow-lg ${
                  isOpen()
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-cyan-500/30'
                    : 'bg-gradient-to-r from-magenta-500 to-rose-500 shadow-magenta-500/30'
                }`}>
                  <Clock className="w-5 h-5" />
                  <span>{isOpen() ? 'ABERTO AGORA' : 'FECHADO'}</span>
                </div>

                <div className="flex items-center gap-2 text-neutral-300 bg-neutral-900/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-magenta-500/20">
                  <MapPin className="w-5 h-5 text-magenta-400" />
                  <span>Botafogo, Rio de Janeiro</span>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link
                  href="/cardapio"
                  className="group relative bg-gradient-to-r from-magenta-500 via-purple-500 to-cyan-500 hover:from-magenta-600 hover:via-purple-600 hover:to-cyan-600 text-white px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all inline-flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-magenta-500/30 hover:shadow-magenta-500/50 sm:hover:scale-105 overflow-hidden w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10 text-white">Ver Cardapio</span>
                  <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  href="/historia"
                  className="group bg-black/40 backdrop-blur-sm border-2 border-magenta-500 text-white hover:bg-magenta-500 hover:text-white px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all inline-flex items-center justify-center gap-2 sm:gap-3 sm:hover:scale-105 shadow-xl shadow-black/50 w-full sm:w-auto"
                >
                  <span className="z-10 text-white">Nossa Historia</span>
                  <svg className="z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
              </div>
            </motion.div>
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
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-magenta-500 to-transparent" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
              <div className="text-center mb-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-block mb-4"
                >
                  <span className="text-magenta-400 font-semibold tracking-wider uppercase text-sm">
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
                  Por que <span className="bg-gradient-to-r from-magenta-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">FLAME</span>?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed"
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
                  <div className="absolute inset-0 bg-gradient-to-br from-magenta-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-sm p-8 rounded-2xl border border-magenta-500/20 group-hover:border-magenta-500/40 transition-all">
                    <div className="w-20 h-20 bg-gradient-to-br from-magenta-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-magenta-500/30">
                      <Wine className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-magenta-400 transition-colors">
                      Drinks Autorais
                    </h3>
                    <p className="text-neutral-400 leading-relaxed">
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
                  <div className="relative bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 group-hover:border-purple-500/40 transition-all">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                      Gastronomia Premium
                    </h3>
                    <p className="text-neutral-400 leading-relaxed">
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
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20 group-hover:border-cyan-500/40 transition-all">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
                      <Flame className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                      Narguile Premium
                    </h3>
                    <p className="text-neutral-400 leading-relaxed">
                      Variedade de sabores importados com atendimento especializado para sua sessao perfeita.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
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
                    <span className="text-magenta-400 font-semibold text-sm uppercase tracking-wider bg-magenta-500/10 px-4 py-2 rounded-full border border-magenta-500/30">
                      Nosso Cardapio
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    <span className="bg-gradient-to-r from-magenta-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      Destaques
                    </span>
                    {' '}Especiais
                  </h2>
                  <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
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
                    className="group relative bg-gradient-to-r from-magenta-500 via-purple-500 to-cyan-500 hover:from-magenta-600 hover:via-purple-600 hover:to-cyan-600 text-white px-12 py-5 rounded-xl font-bold text-lg transition-all inline-flex items-center gap-3 shadow-2xl shadow-magenta-500/30 hover:shadow-magenta-500/50 hover:scale-105 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative">Ver Cardapio Completo</span>
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
                    <span className="text-magenta-400 font-semibold text-sm uppercase tracking-wider bg-magenta-500/10 px-4 py-2 rounded-full border border-magenta-500/30">
                      Localizacao
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    Venha nos{' '}
                    <span className="bg-gradient-to-r from-magenta-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      Visitar
                    </span>
                  </h2>
                  <p className="text-xl text-neutral-400 mb-10 leading-relaxed">
                    Estamos localizados no coracao de Botafogo, facil acesso e estacionamento proximo.
                  </p>

                  <div className="space-y-6 mb-10">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="group flex items-start gap-4 bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-sm p-5 rounded-xl border border-magenta-500/20 hover:border-magenta-500/40 transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-magenta-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-magenta-500/30">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold mb-1">Endereco</div>
                        <span className="text-neutral-300">Rua Arnaldo Quintela 19, Botafogo - RJ</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className="group flex items-start gap-4 bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-sm p-5 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold mb-2">Horario de Funcionamento</div>
                        <div className="text-neutral-300 space-y-1">
                          <div>Dom-Qui: 18h as 02h</div>
                          <div>Sex-Sab: 18h as 03h</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <Link
                    href="https://maps.google.com"
                    target="_blank"
                    className="group relative bg-gradient-to-r from-magenta-500 via-purple-500 to-cyan-500 hover:from-magenta-600 hover:via-purple-600 hover:to-cyan-600 text-white px-10 py-5 rounded-xl font-bold text-lg transition-all inline-flex items-center gap-3 shadow-2xl shadow-magenta-500/30 hover:shadow-magenta-500/50 hover:scale-105 overflow-hidden"
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
                  <div className="absolute inset-0 bg-gradient-to-br from-magenta-500/30 via-purple-500/20 to-cyan-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />

                  <div className="relative bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-magenta-500/30 h-[500px] overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.0987654321!2d-43.1847!3d-22.9496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU2JzU4LjYiUyA0M8KwMTEnMDQuOSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890!5m2!1spt-BR!2sbr"
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '0.75rem', filter: 'invert(90%) hue-rotate(180deg)' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Localizacao FLAME - Botafogo, Rio de Janeiro"
                    />

                    {/* Overlay com informacoes */}
                    <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-magenta-500/30">
                      <div className="flex items-start gap-3">
                        <Flame className="w-5 h-5 text-magenta-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-white font-semibold mb-1">FLAME Lounge Bar</p>
                          <p className="text-neutral-400 text-sm">Botafogo, Rio de Janeiro</p>
                          <p className="text-neutral-400 text-sm">Rua Arnaldo Quintela, 19</p>
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
