import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { pilares, arquetipos, manifesto, posicionamento, valoresMarca, diferenciais } from '../data/conceito';
import { Heart, Zap, Users, Target, MapPin, Smile, DollarSign, Star } from 'lucide-react';

export default function Conceito() {
  const pilarIcons = {
    connection: Users,
    smile: Smile,
    dollar: DollarSign,
    star: Star,
    'map-pin': MapPin,
  };

  const valorIcons = {
    users: Users,
    heart: Heart,
    zap: Zap,
    'shield-check': Heart,
    target: Target,
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
        <title>Nosso Conceito | FLAME - Lounge Bar em Botafogo</title>
        <meta name="description" content="Paixao, Experiencia, Qualidade, Conexao e Inovacao: os valores que definem a experiencia FLAME em Botafogo." />
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
            className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-magenta-900/30 to-black overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-32 h-32 bg-magenta-500 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-40 right-20 w-48 h-48 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-20">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-block bg-magenta-500/20 border border-magenta-500 px-6 py-2 rounded-full mb-6">
                  <span className="text-magenta-400 font-semibold">
                    {posicionamento.tagline}
                  </span>
                </div>
              </motion.div>

              <motion.h1
                className="text-6xl md:text-8xl font-bold text-white mb-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Nosso Conceito
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {posicionamento.elevatorPitch}
              </motion.p>
            </div>
          </motion.section>

          {/* 5 Valores */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-black"
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Nossos Valores
                </h2>
                <p className="text-xl text-gray-400">
                  O que nos torna únicos e guia cada decisão
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {valoresMarca.map((valor, index) => {
                  const Icon = valorIcons[valor.icone];

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      className="bg-gradient-to-br from-magenta-500/10 to-black border-2 border-magenta-500/30 rounded-xl p-8 transition-all duration-300 shadow-xl hover:shadow-2xl hover:border-magenta-400"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-magenta-500/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-8 h-8 text-magenta-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{valor.valor}</h3>
                        </div>
                      </div>

                      <p className="text-gray-300 leading-relaxed">
                        {valor.descricao}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>

          {/* 5 Pilares do Conceito */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-[#0a0a0a]"
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Os Pilares do FLAME
                </h2>
                <p className="text-xl text-gray-400">
                  Como transformamos o conceito em experiencia
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pilares.map((pilar, index) => {
                  const Icon = pilarIcons[pilar.icone];

                  return (
                    <motion.div
                      key={pilar.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                      className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 hover:border-magenta-500/50 rounded-xl p-8 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-magenta-500/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-7 h-7 text-magenta-400" />
                        </div>
                        <div>
                          <div className="text-sm text-magenta-400 font-semibold">{pilar.nome}</div>
                          <h3 className="text-xl font-bold text-white">{pilar.titulo}</h3>
                        </div>
                      </div>

                      <p className="text-cyan-400 text-base font-semibold mb-4">
                        {pilar.subtitulo}
                      </p>

                      <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                        {pilar.descricao}
                      </p>

                      <div className="space-y-2">
                        {pilar.valores.map((valor, vIndex) => (
                          <div key={vIndex} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-magenta-500 rounded-full" />
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

          {/* O Que Somos / Não Somos */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-black"
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {diferenciais.titulo}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-magenta-500/10 to-black border-2 border-magenta-500/30 rounded-xl p-8"
                >
                  <h3 className="text-3xl font-bold text-magenta-400 mb-6 border-b border-magenta-500/30 pb-3">
                    O Que FLAME E
                  </h3>

                  <ul className="space-y-3">
                    {diferenciais.oQueFLAMEE.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-1 text-xl">✓</span>
                        <span className="text-gray-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-xl p-8"
                >
                  <h3 className="text-3xl font-bold text-gray-400 mb-6 border-b border-gray-700 pb-3">
                    O Que FLAME Nao E
                  </h3>

                  <ul className="space-y-3">
                    {diferenciais.oQueFLAMENaoE.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-magenta-500 mt-1 text-xl">✕</span>
                        <span className="text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
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
                  Nosso Publico
                </h2>
                <p className="text-xl text-gray-400">
                  Quem se conecta com o FLAME
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
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-gray-800 rounded-xl p-6 hover:border-magenta-500/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {arquetipo.titulo}
                        </h3>
                        <p className="text-sm text-gray-500">{arquetipo.nome}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        arquetipo.tipo === 'Primario' ? 'bg-magenta-500/20 text-magenta-400' :
                        arquetipo.tipo === 'Secundario' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-gray-800 text-gray-400'
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
                          <div className="w-1 h-1 bg-magenta-500 rounded-full" />
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
                <p className="text-xl text-magenta-400">
                  {manifesto.subtitulo}
                </p>
              </div>

              <div className="bg-gradient-to-br from-magenta-500/10 to-black border-2 border-magenta-500/30 rounded-2xl p-8 mb-12">
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                  {manifesto.intro}
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
                    className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8"
                  >
                    <h3 className="text-2xl font-bold text-white mb-6 border-b border-magenta-500 pb-3">
                      {secao.titulo}
                    </h3>

                    <ul className="space-y-3">
                      {secao.itens.map((item, iIndex) => (
                        <li key={iIndex} className="flex items-start gap-3">
                          <span className="text-cyan-500 mt-1">✓</span>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 to-cyan-400 font-semibold whitespace-pre-line">
                  {manifesto.conclusao}
                </p>
              </div>
            </div>
          </motion.section>

          {/* CTA Final */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-gradient-to-br from-magenta-600 via-purple-500 to-cyan-600"
          >
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Pronto para Sentir o Calor?
              </h2>
              <p className="text-xl text-white/90 mb-12">
                Conceito e teoria. Experiencia e pratica. Venha viver o FLAME.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/historia"
                  className="bg-white text-magenta-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
                >
                  Nossa Historia
                </Link>
                <Link
                  href="/cardapio"
                  className="bg-black border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                >
                  Ver Cardapio
                </Link>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </Layout>
    </>
  );
}
