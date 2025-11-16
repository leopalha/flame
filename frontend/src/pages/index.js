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
import { Clock, MapPin, Star, Users, Network, Zap, TrendingUp } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { featuredProducts, isLoading, fetchFeaturedProducts } = useProductStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchFeaturedProducts();
    
    // Atualizar hora a cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [fetchFeaturedProducts]);

  const isOpen = () => {
    const hour = currentTime.getHours();
    const day = currentTime.getDay();
    
    // Horário de funcionamento
    if (day === 0 || (day >= 1 && day <= 4)) { // Dom-Qui: 18h-02h
      return hour >= 18 || hour <= 2;
    } else { // Sex-Sab: 18h-03h
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
        <title>Exxquema | Lounge Bar em Botafogo</title>
        <meta name="description" content="Entre no esquema! Lounge Bar descontraído em Botafogo com drinks autorais, boa música e conexões reais. O melhor lugar para encontrar os amigos e fazer novas conexões." />
        <meta name="keywords" content="exxquema, botafogo, bar, lounge, drinks autorais, música ao vivo, happy hour, arnaldo quintela, rio de janeiro, bar descontraído" />
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
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 opacity-30">
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 20% 30%, #FF6B35 0%, transparent 50%), radial-gradient(circle at 80% 70%, #F7931E 0%, transparent 50%)'
                }}
              />
            </div>

            {/* Geometric pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }} />
            </div>

            {/* Glowing orbs */}
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
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"
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
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-20 sm:pt-32">
              <motion.h1
                className="text-5xl sm:text-7xl md:text-9xl font-black text-white mb-8"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{
                  textShadow: '0 0 40px rgba(255, 107, 53, 0.5), 0 0 80px rgba(247, 147, 30, 0.3)',
                  fontFamily: "'Futura PT Heavy', 'Futura', 'Helvetica Neue', Arial, sans-serif",
                  fontStyle: 'italic',
                  letterSpacing: '0.02em',
                  paddingRight: '0.1em'
                }}
              >
                <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent inline-block">
                  EXXQUEMA
                </span>
              </motion.h1>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-10"
              >
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-300 mb-4">
                  Seu esquema perfeito em Botafogo
                </p>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-6 sm:px-4">
                  Onde conexões viram amizades, drinks viram momentos, e toda noite é um novo esquema.
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
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30'
                    : 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30'
                }`}>
                  <Clock className="w-5 h-5" />
                  <span>{isOpen() ? 'ABERTO AGORA' : 'FECHADO'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-300 bg-gray-900/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-orange-500/20">
                  <MapPin className="w-5 h-5 text-orange-400" />
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
                  className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all inline-flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 sm:hover:scale-105 overflow-hidden w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10 text-white">Ver Cardápio</span>
                  <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  href="/historia"
                  className="group bg-black/40 backdrop-blur-sm border-2 border-orange-500 text-white hover:bg-orange-500 hover:text-white px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all inline-flex items-center justify-center gap-2 sm:gap-3 sm:hover:scale-105 shadow-xl shadow-black/50 w-full sm:w-auto"
                >
                  <span className="z-10 text-white">Nossa História</span>
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
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
              <div className="text-center mb-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-block mb-4"
                >
                  <span className="text-orange-500 font-semibold tracking-wider uppercase text-sm">
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
                  Por que <span className="bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">Exxquema</span>?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
                >
                  O lugar perfeito para fazer conexões, curtir boa música e drinks incríveis
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
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-500/20 group-hover:border-orange-500/40 transition-all">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                      <Network className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                      Conexões Reais
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Ambiente descontraído e social, perfeito para conhecer pessoas novas e fortalecer amizades.
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
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-500/20 group-hover:border-yellow-500/40 transition-all">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/30">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                      Energia Contagiante
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Música ao vivo, DJs, happy hours animados e uma vibe que faz você querer voltar sempre.
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
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-500/20 group-hover:border-orange-500/40 transition-all">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/30">
                      <Star className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                      Drinks Autorais
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Criações exclusivas dos nossos bartenders com ingredientes premium e preço justo.
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
                    background: 'radial-gradient(circle at 30% 20%, #FF6B35 0%, transparent 60%), radial-gradient(circle at 70% 80%, #F7931E 0%, transparent 60%)'
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
                    <span className="text-orange-400 font-semibold text-sm uppercase tracking-wider bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/30">
                      Nosso Cardápio
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                      Destaques
                    </span>
                    {' '}Especiais
                  </h2>
                  <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Nossos produtos mais pedidos e criações especiais da casa
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
                    className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-5 rounded-xl font-bold text-lg transition-all inline-flex items-center gap-3 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 overflow-hidden"
                  >
                    {/* Shine effect */}
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
                  background: 'radial-gradient(circle at 50% 50%, #FF6B35 0%, transparent 70%)'
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
                    <span className="text-orange-400 font-semibold text-sm uppercase tracking-wider bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/30">
                      Localização
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    Venha nos{' '}
                    <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                      Visitar
                    </span>
                  </h2>
                  <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                    Estamos localizados no coração de Botafogo, fácil acesso e estacionamento próximo.
                  </p>

                  <div className="space-y-6 mb-10">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="group flex items-start gap-4 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-5 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold mb-1">Endereço</div>
                        <span className="text-gray-300">Rua Arnaldo Quintela 19, Botafogo - RJ</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className="group flex items-start gap-4 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-5 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold mb-2">Horário de Funcionamento</div>
                        <div className="text-gray-300 space-y-1">
                          <div>Dom-Qui: 18h às 02h</div>
                          <div>Sex-Sáb: 18h às 03h</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <Link
                    href="https://maps.google.com"
                    target="_blank"
                    className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-5 rounded-xl font-bold text-lg transition-all inline-flex items-center gap-3 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 overflow-hidden"
                  >
                    {/* Shine effect */}
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
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />

                  <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30 h-[500px] overflow-hidden">
                    {/* Google Maps Embed - sem necessidade de API key */}
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.0987654321!2d-43.1847!3d-22.9496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU2JzU4LjYiUyA0M8KwMTEnMDQuOSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890!5m2!1spt-BR!2sbr"
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '0.75rem', filter: 'invert(90%) hue-rotate(180deg)' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Localização Exxquema - Botafogo, Rio de Janeiro"
                    />

                    {/* Overlay com informações */}
                    <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-orange-500/30">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-white font-semibold mb-1">Exxquema Bar</p>
                          <p className="text-gray-400 text-sm">Botafogo, Rio de Janeiro</p>
                          <p className="text-gray-400 text-sm">8ª rua mais cool do mundo</p>
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