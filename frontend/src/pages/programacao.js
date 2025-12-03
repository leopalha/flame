import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import EventCard from '../components/EventCard';
import TimelineEvent from '../components/TimelineEvent';
import {
  Calendar,
  Clock,
  DollarSign,
  Music,
  PartyPopper,
  Wine,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin
} from 'lucide-react';
import {
  programacaoSemanal,
  eventosEspeciais,
  happyHour,
  faq,
  proximasAtracoes
} from '../data/programacaoData';

export default function Programacao() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState('todos');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(null);

  // Detectar dia atual
  useEffect(() => {
    const today = new Date().getDay();
    const dayMap = { 0: 'domingo', 4: 'quinta', 5: 'sexta', 6: 'sabado' };
    setCurrentDayIndex(today);
  }, []);

  const filteredEvents = selectedDay === 'todos'
    ? programacaoSemanal
    : programacaoSemanal.filter(e => e.id === selectedDay);

  const getDayFilter = () => [
    { id: 'todos', label: 'Todos os Dias', active: selectedDay === 'todos' },
    { id: 'quinta', label: 'Quinta', active: selectedDay === 'quinta' },
    { id: 'sexta', label: 'Sexta', active: selectedDay === 'sexta' },
    { id: 'sabado', label: 'Sábado', active: selectedDay === 'sabado' },
    { id: 'domingo', label: 'Domingo', active: selectedDay === 'domingo' }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>Programacao Semanal | FLAME - Lounge Bar Botafogo</title>
        <meta name="description" content="Descubra a programacao semanal do FLAME: DJs ao vivo, musica acustica, happy hour, narguile premium e eventos especiais. Sinta o calor! 🔥" />
        <meta name="keywords" content="programacao flame, eventos botafogo, lounge bar arnaldo quintela, dj rio de janeiro, happy hour botafogo, musica ao vivo rio, narguile premium, flame lounge" />
        <meta property="og:title" content="Programacao Semanal | FLAME" />
        <meta property="og:description" content="O que esta acontecendo hoje? Confira a programacao completa do FLAME!" />
        <meta property="og:type" content="website" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-black text-white">

          {/* HERO SECTION */}
          <section className="relative pt-24 pb-16 px-4 overflow-hidden">
            {/* Background com grafismos */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 w-64 h-64 bg-magenta-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 via-purple-500 to-cyan-400 mb-6">
                  SINTA O CALOR
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 mb-8 opacity-80">
                  Sua programacao semanal em Botafogo
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => {
                      const today = new Date().getDay();
                      const dayMap = { 0: 'domingo', 4: 'quinta', 5: 'sexta', 6: 'sabado' };
                      setSelectedDay(dayMap[today] || 'todos');
                    }}
                    className="bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-magenta-500/50 hover:shadow-magenta-500/70 transition-all hover:scale-105"
                  >
                    Ver Hoje
                  </button>
                  <button
                    onClick={() => setSelectedDay('todos')}
                    className="border-2 border-magenta-500 text-magenta-400 hover:bg-magenta-500 hover:text-white font-bold py-4 px-8 rounded-lg transition-all hover:scale-105"
                  >
                    Ver Semana Completa
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Particulas flutuantes decorativas */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-magenta-500 rounded-full opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          </section>

          {/* FILTROS DE DIA */}
          <section className="sticky top-16 z-40 bg-gray-900/95 backdrop-blur-lg border-b-2 border-gray-800 py-4 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                {getDayFilter().map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedDay(filter.id)}
                    className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      filter.active
                        ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white shadow-lg shadow-magenta-500/50'
                        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* PROGRAMAÇÃO SEMANAL - CARDS */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div layout className="space-y-8">
                <AnimatePresence>
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isToday={event.diaSemana === currentDayIndex}
                      isExpanded={selectedDay !== 'todos'}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </section>

          {/* HAPPY HOUR PERMANENTE */}
          <section className="py-16 px-4 bg-gradient-to-r from-magenta-900/20 to-cyan-900/10">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border-2 border-magenta-500 shadow-2xl shadow-magenta-500/30"
              >
                <div className="text-center mb-8">
                  <span className="text-6xl mb-4 block">{happyHour.emoji}</span>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                    {happyHour.titulo}
                  </h2>
                  <p className="text-magenta-400 text-xl font-semibold mb-4">
                    {happyHour.horario}
                  </p>
                  <div className="inline-block">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 to-cyan-400"
                    >
                      {happyHour.descricao}
                    </motion.div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                      <Wine className="w-5 h-5 text-magenta-400" />
                      Valido para:
                    </h4>
                    <ul className="space-y-2">
                      {happyHour.validoPara.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <span className="w-2 h-2 bg-magenta-500 rounded-full"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-magenta-500/20 to-cyan-500/10 rounded-xl p-6 border border-magenta-500/50">
                    <div className="flex items-center gap-2 text-magenta-400 font-semibold mb-3">
                      <Sparkles className="w-5 h-5" />
                      {happyHour.combo.nome}
                    </div>
                    <div className="text-4xl font-black text-white mb-2">
                      {happyHour.combo.preco}
                    </div>
                    <div className="text-gray-300 text-sm">
                      {happyHour.combo.inclui}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => router.push('/cardapio?categoria=Drinks')}
                    className="flex-1 bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Ver Drinks
                  </button>
                  <button
                    onClick={() => window.open('https://wa.me/5521999999999?text=Ol%C3%A1!%20Gostaria%20de%20reservar%20um%20hor%C3%A1rio%20no%20FLAME', '_blank')}
                    className="flex-1 border-2 border-magenta-500 text-magenta-400 hover:bg-magenta-500 hover:text-white font-bold py-4 px-6 rounded-lg transition-all hover:scale-105"
                  >
                    Reservar Horario
                  </button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* EVENTOS ESPECIAIS */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
                  <PartyPopper className="w-10 h-10 text-magenta-500" />
                  Eventos Especiais
                </h2>
                <p className="text-gray-400 text-lg">
                  Eventos exclusivos que voce nao pode perder
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {eventosEspeciais.map((evento, index) => (
                  <motion.div
                    key={evento.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 hover:border-magenta-500/70 transition-all shadow-lg hover:shadow-magenta-500/30"
                  >
                    <span className="text-5xl mb-4 block">{evento.emoji}</span>
                    <h3 className="text-2xl font-bold text-white mb-2">{evento.titulo}</h3>
                    <div className="text-magenta-400 font-semibold mb-3">{evento.tipo}</div>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{evento.descricao}</p>

                    <div className="space-y-2 text-sm text-gray-400 mb-6">
                      {evento.frequencia && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-magenta-400" />
                          {evento.frequencia}
                        </div>
                      )}
                      {evento.proximaData && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          {evento.proximaData}
                        </div>
                      )}
                      {evento.investimento && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-cyan-400" />
                          {evento.investimento}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => window.open(`https://wa.me/5521999999999?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20evento%20${encodeURIComponent(evento.titulo)}`, '_blank')}
                      className="w-full bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105"
                    >
                      Saber Mais
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* PRÓXIMAS ATRAÇÕES - TIMELINE */}
          <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-black">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  🔜 Próximas Atrações
                </h2>
                <p className="text-gray-400 text-lg">
                  Marque na agenda e não perca!
                </p>
              </div>

              <div className="relative">
                <div className="flex gap-12 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
                  {proximasAtracoes.map((atracao, index) => (
                    <TimelineEvent key={atracao.id} event={atracao} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Duvidas sobre a Programacao
                </h2>
                <p className="text-gray-400 text-lg">
                  Tudo que voce precisa saber sobre o FLAME
                </p>
              </div>

              <div className="space-y-4">
                {faq.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
                    >
                      <span className="text-white font-semibold pr-4">{item.pergunta}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-6 h-6 text-magenta-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-gray-300 leading-relaxed border-t-2 border-gray-700 pt-4">
                            {item.resposta}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA FINAL */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-magenta-500 via-purple-500 to-cyan-500 rounded-3xl p-12 shadow-2xl shadow-magenta-500/50"
              >
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                  Pronto para sentir o calor?
                </h2>
                <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                  Reserve sua mesa agora e viva a experiencia FLAME!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.open('https://wa.me/5521999999999?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20reserva%20no%20FLAME!', '_blank')}
                    className="bg-white text-magenta-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:scale-105"
                  >
                    Reservar Agora
                  </button>
                  <button
                    onClick={() => window.open('https://wa.me/5521999999999?text=Ol%C3%A1!%20Gostaria%20de%20falar%20sobre%20o%20FLAME', '_blank')}
                    className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-magenta-600 transition-all hover:scale-105"
                  >
                    Falar no WhatsApp
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-8 text-white/80">
                  <MapPin className="w-5 h-5" />
                  <span>Rua Arnaldo Quintela 19 - Botafogo, Rio de Janeiro</span>
                </div>
              </motion.div>
            </div>
          </section>

        </div>
      </Layout>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
