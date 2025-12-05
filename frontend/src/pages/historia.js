import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { timelineData, fatosHistoricos, citacoesHistoricas, secaoManifesto } from '../data/historia';
import { Clock, MapPin, Calendar, Book } from 'lucide-react';

export default function Historia() {
  const [selectedEra, setSelectedEra] = useState(null);

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
        <title>Nossa Historia | FLAME - Lounge Bar em Botafogo</title>
        <meta name="description" content="Conheca a historia do FLAME, o lounge bar que acende a noite carioca na 8a rua mais cool do mundo em Botafogo." />
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
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(to bottom right, black, var(--theme-primary-dark), black)' }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-32 h-32 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'var(--theme-primary)' }} />
              <div className="absolute bottom-40 right-20 w-48 h-48 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'var(--theme-secondary)', animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-20">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-block px-6 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(var(--theme-primary-rgb), 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--theme-primary)' }}>
                  <span className="font-semibold flex items-center gap-2" style={{ color: 'var(--theme-primary)' }}>
                    <Clock className="w-4 h-4" />
                    O Fogo que Acende a Noite
                  </span>
                </div>
              </motion.div>

              <motion.h1
                className="text-6xl md:text-8xl font-bold text-white mb-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {secaoManifesto.titulo}
              </motion.h1>

              <motion.p
                className="text-2xl md:text-3xl mb-8"
                style={{ color: 'var(--theme-primary)' }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {secaoManifesto.subtitulo}
              </motion.p>

              <motion.p
                className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Na 8a rua mais cool do mundo, em Botafogo, acendemos a chama que ilumina a noite carioca.
                Lounge bar, gastronomia e narguile premium em um so lugar.
              </motion.p>

              <motion.div
                className="mt-12"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <a
                  href="#timeline"
                  className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
                  style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <Book className="w-5 h-5" />
                  Explore a Jornada
                </a>
              </motion.div>
            </div>
          </motion.section>

          {/* Timeline Section */}
          <motion.section
            id="timeline"
            variants={itemVariants}
            className="py-20 bg-black"
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Linha do Tempo
                </h2>
                <p className="text-xl text-gray-400">
                  A jornada ate o FLAME
                </p>
              </div>

              <div className="relative">
                {/* Linha vertical */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(to bottom, var(--theme-primary), var(--theme-accent), var(--theme-secondary))' }} />

                {timelineData.map((evento, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative mb-12 md:mb-20 ${
                      index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
                    }`}
                  >
                    {/* Ponto na linha */}
                    <div
                      className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full shadow-lg"
                      style={evento.destaque
                        ? { backgroundColor: 'var(--theme-primary)', boxShadow: '0 0 0 4px rgba(var(--theme-primary-rgb), 0.3)' }
                        : { backgroundColor: 'var(--theme-secondary)' }
                      }
                    />

                    {/* Card */}
                    <div className={`ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                      <div
                        className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 rounded-xl p-6 transition-all duration-300 shadow-xl hover:shadow-2xl"
                        style={{ borderColor: evento.destaque ? 'var(--theme-primary)' : '#262626' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = evento.destaque ? 'var(--theme-primary)' : '#262626'}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className="text-2xl font-bold"
                            style={{ color: evento.destaque ? 'var(--theme-primary)' : 'var(--theme-secondary)' }}
                          >
                            {evento.ano}
                          </span>
                          <span className="text-sm bg-[#262626] px-3 py-1 rounded-full text-gray-400">
                            {evento.era}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3">
                          {evento.titulo}
                        </h3>

                        <p className="text-gray-400 leading-relaxed">
                          {evento.descricao}
                        </p>

                        {evento.destaque && (
                          <div className="mt-4 inline-block px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(var(--theme-primary-rgb), 0.1)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(var(--theme-primary-rgb), 0.3)' }}>
                            <span className="text-sm font-semibold" style={{ color: 'var(--theme-primary)' }}>
                              ★ Momento Histórico
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Fatos Históricos */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-[#0a0a0a]"
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Curiosidades
                </h2>
                <p className="text-xl text-gray-400">
                  Fatos fascinantes sobre o FLAME
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fatosHistoricos.map((fato) => (
                  <motion.div
                    key={fato.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#262626] rounded-xl p-6 transition-all shadow-lg"
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#262626'}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(var(--theme-primary-rgb), 0.2)' }}>
                        <span className="font-bold text-sm" style={{ color: 'var(--theme-primary)' }}>{fato.id}</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-xs bg-[#262626] px-2 py-1 rounded-full text-gray-500">
                          {fato.categoria}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">
                      {fato.titulo}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed">
                      {fato.texto}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Citações */}
          <motion.section
            variants={itemVariants}
            className="py-20 bg-black"
          >
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Palavras que Iluminam
                </h2>
              </div>

              <div className="space-y-8">
                {citacoesHistoricas.map((citacao, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="pl-6 py-4"
                    style={{ borderLeft: '4px solid var(--theme-primary)' }}
                  >
                    <p className="text-xl md:text-2xl text-gray-300 italic leading-relaxed mb-4">
                      "{citacao.texto}"
                    </p>
                    <div className="flex items-center gap-2" style={{ color: 'var(--theme-primary)' }}>
                      <span className="font-semibold">{citacao.autor}</span>
                      {citacao.ano && <span className="text-gray-500">• {citacao.ano}</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Manifesto Final */}
          <motion.section
            variants={itemVariants}
            className="py-20"
            style={{ background: 'linear-gradient(to bottom right, rgba(var(--theme-primary-rgb), 0.3), black, rgba(var(--theme-secondary-rgb), 0.3))' }}
          >
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                {secaoManifesto.titulo}
              </h2>

              <div className="prose prose-invert prose-lg mx-auto mb-12">
                {secaoManifesto.texto.split('\n\n').map((paragrafo, index) => (
                  <p key={index} className="text-gray-300 leading-relaxed mb-6">
                    {paragrafo.trim()}
                  </p>
                ))}
              </div>

              {/* Manifesto Destaque */}
              <div className="bg-black/50 border-2 rounded-2xl p-8 mb-12" style={{ borderColor: 'rgba(var(--theme-primary-rgb), 0.3)' }}>
                <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text mb-8" style={{ backgroundImage: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}>
                  {secaoManifesto.manifestoDestaque.titulo}
                </h3>

                <div className="space-y-4 mb-8">
                  {secaoManifesto.manifestoDestaque.parrafos.map((linha, index) => (
                    linha.trim() ? (
                      <p key={index} className="text-lg md:text-xl text-gray-300 leading-relaxed">
                        {linha}
                      </p>
                    ) : (
                      <div key={index} className="h-4" />
                    )
                  ))}
                </div>

                <div className="pt-8 space-y-3" style={{ borderTop: '1px solid rgba(var(--theme-secondary-rgb), 0.3)' }}>
                  {secaoManifesto.manifestoDestaque.conclusao.map((linha, index) => (
                    <p key={index} className="text-xl md:text-2xl font-bold text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}>
                      {linha}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/conceito"
                  className="text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
                  style={{ background: 'linear-gradient(to right, var(--theme-secondary), var(--theme-accent))' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Nosso Conceito
                </Link>
                <Link
                  href="/cardapio"
                  className="text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg"
                  style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
