import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Home, Search, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Página não encontrada | FLAME</title>
        <meta name="description" content="A página que você procura não existe" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-24 bg-black flex items-center justify-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
            {/* Animated 404 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="mb-8"
            >
              <div className="relative">
                <h1 className="text-[150px] md:text-[250px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta-600 via-purple-500 to-cyan-500 leading-none select-none">
                  404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertTriangle className="w-16 h-16 md:w-24 md:h-24 text-magenta-400 opacity-50" />
                </div>
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Página não encontrada
              </h2>
              <p className="text-neutral-400 text-lg mb-8 max-w-md mx-auto">
                Ops! Parece que você se perdeu na vibe. A página que você procura não existe ou foi movida.
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/"
                className="text-white px-8 py-4 rounded-lg font-semibold transition-all inline-flex items-center justify-center gap-2 hover:opacity-90"
                style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))' }}
              >
                <Home className="w-5 h-5" />
                Voltar para Início
              </Link>

              <Link
                href="/cardapio"
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2 border border-neutral-700"
              >
                <Search className="w-5 h-5" />
                Ver Cardápio
              </Link>
            </motion.div>

            {/* Suggestions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 p-6 bg-neutral-900 border border-neutral-700 rounded-xl"
            >
              <h3 className="text-white font-semibold mb-4">Você pode estar procurando:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <Link
                  href="/"
                  className="text-neutral-400 hover:text-magenta-400 transition-colors"
                >
                  → Início
                </Link>
                <Link
                  href="/cardapio"
                  className="text-neutral-400 hover:text-magenta-400 transition-colors"
                >
                  → Cardápio
                </Link>
                <Link
                  href="/historia"
                  className="text-neutral-400 hover:text-magenta-400 transition-colors"
                >
                  → Nossa História
                </Link>
                <Link
                  href="/reservas"
                  className="text-neutral-400 hover:text-magenta-400 transition-colors"
                >
                  → Reservas
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Decorative lights */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-magenta-600 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-600 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-10" />
        </div>
      </Layout>
    </>
  );
}
