import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { pilares, arquetipos, manifesto, personalidade, valoresMarca } from '../data/filosofia';
import { Heart, Zap, BookOpen, Users, Sparkles } from 'lucide-react';

export default function Filosofia() {
  const pilarIcons = {
    paradox: Sparkles,
    freedom: Heart,
    intensity: Zap,
    history: BookOpen,
    duality: Users,
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
        <title>Nossa Filosofia | Exxquema - 5 Pilares de Identidade</title>
        <meta name="description" content="Paradoxo, Liberdade, Intensidade, História e Dualidade: os 5 pilares que definem a experiência Exxquema em Botafogo." />
      </Head>

      <Layout>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.section
            variants={itemVariants}
            className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#8B3A3A] to-black overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-32 h-32 bg-[#FF006E] rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-40 right-20 w-48 h-48 bg-[#E30613] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-20">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-block bg-[#E30613]/20 border border-[#E30613] px-6 py-2 rounded-full mb-6">
                  <span className="text-[#E30613] font-semibold">
                    5 Pilares de Identidade
                  </span>
                </div>
              </motion.div>

              <motion.h1
                className="text-6xl md:text-8xl font-bold text-white mb-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Nossa Filosofia
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                EXXQUEMA não é apenas um nome. É uma filosofia que celebra a dualidade humana:
                sofisticação e descontração, elegância e transgressão, tradição e modernidade.
              </motion.p>
            </div>
          </motion.section>

          {/* 5 Pilares */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-black"
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Os 5 Pilares
                </h2>
                <p className="text-xl text-gray-400">
                  Princípios que guiam cada decisão, cada drink, cada momento
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pilares.map((pilar, index) => {
                  const Icon = pilarIcons[pilar.icone];
                  const corClass = {
                    'golden-hour': 'from-[#D4AF37]/20 border-[#D4AF37]',
                    'neon-pink': 'from-[#FF006E]/20 border-[#FF006E]',
                    'primary': 'from-[#E30613]/20 border-[#E30613]',
                    'brick-red': 'from-[#8B3A3A]/20 border-[#8B3A3A]',
                    'canal-water': 'from-[#1C3A3A]/20 border-[#1C3A3A]',
                  }[pilar.cor];

                  return (
                    <motion.div
                      key={pilar.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      className={`bg-gradient-to-br ${corClass} to-black/50 border-2 rounded-xl p-8 transition-all duration-300 shadow-xl hover:shadow-2xl ${
                        index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 bg-${pilar.cor === 'golden-hour' ? '[#D4AF37]' : pilar.cor === 'neon-pink' ? '[#FF006E]' : pilar.cor === 'primary' ? '[#E30613]' : pilar.cor === 'brick-red' ? '[#8B3A3A]' : '[#1C3A3A]'}/20 rounded-lg flex items-center justify-center`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-semibold">{pilar.nome}</div>
                          <h3 className="text-2xl font-bold text-white">{pilar.titulo}</h3>
                        </div>
                      </div>

                      <p className="text-[#D4AF37] text-lg font-semibold mb-4">
                        {pilar.subtitulo}
                      </p>

                      <p className="text-gray-400 mb-6 leading-relaxed">
                        {pilar.descricao}
                      </p>

                      <div className="space-y-2">
                        {pilar.valores.map((valor, vIndex) => (
                          <div key={vIndex} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#E30613] rounded-full" />
                            <span className="text-gray-300 text-sm">{valor}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>

          {/* Arquétipos */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-[#0a0a0a]"
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Arquétipos de Marca
                </h2>
                <p className="text-xl text-gray-400">
                  As personas que definem nossa essência
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {arquetipos.map((arquetipo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#262626] rounded-xl p-6 hover:border-[#E30613] transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {arquetipo.titulo}
                        </h3>
                        <p className="text-sm text-gray-500">{arquetipo.nome}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        arquetipo.tipo === 'Primário' ? 'bg-[#E30613]/20 text-[#E30613]' :
                        arquetipo.tipo === 'Secundário' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                        'bg-[#1C3A3A] text-gray-400'
                      }`}>
                        {arquetipo.tipo}
                      </span>
                    </div>

                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {arquetipo.descricao}
                    </p>

                    <div className="space-y-2">
                      {arquetipo.caracteristicas.map((carac, cIndex) => (
                        <div key={cIndex} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-[#E30613] rounded-full" />
                          <span className="text-gray-300 text-sm">{carac}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Manifesto */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-black"
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {manifesto.titulo}
                </h2>
                <p className="text-xl text-[#D4AF37]">
                  {manifesto.subtitulo}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {manifesto.secoes.map((secao, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#262626] rounded-xl p-8"
                  >
                    <h3 className="text-2xl font-bold text-white mb-6 border-b border-[#E30613] pb-3">
                      {secao.titulo}
                    </h3>

                    <ul className="space-y-3">
                      {secao.itens.map((item, iIndex) => (
                        <li key={iIndex} className="flex items-start gap-3">
                          <span className="text-[#E30613] mt-1">✓</span>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Valores da Marca */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-[#0a0a0a]"
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Nossos Valores
                </h2>
                <p className="text-xl text-gray-400">
                  O que guia cada decisão que tomamos
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {valoresMarca.map((valor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#262626] rounded-lg p-6 hover:border-[#D4AF37] transition-all"
                  >
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-3">
                      {valor.valor}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {valor.descricao}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* CTA Final */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-gradient-to-br from-[#E30613] via-[#B30510] to-black"
          >
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Pronto para Experimentar?
              </h2>
              <p className="text-xl text-white/90 mb-12">
                Filosofia é teoria. Experiência é prática. Venha viver o EXXQUEMA.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/historia"
                  className="bg-white text-[#E30613] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
                >
                  Nossa História
                </Link>
                <Link
                  href="/cardapio"
                  className="bg-black border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                >
                  Ver Cardápio
                </Link>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </Layout>
    </>
  );
}
