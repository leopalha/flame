import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, BarChart3, Clock, Target, Settings, AlertCircle, CheckCircle, Share2, Globe, Calendar, Frown, Smile, Rocket, FileText, Landmark, Building, PartyPopper } from 'lucide-react';

// Parte 4: Slides finais (fases, riscos, decisão, próximos passos, perguntas)
export const renderFinalSlides = (slide, textSize, getTextSize, fadeIn) => {

  // SLIDE: PHASES-1 (FASES 1/2)
  if (slide.type === 'phases-1') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-6xl mx-auto space-y-6">
            {slide.fases.map((fase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="bg-gradient-to-r from-gray-900 to-transparent border border-orange-700 rounded-xl p-6"
              >
                <div className="flex items-start gap-6">
                  <div className="text-5xl font-black text-orange-400">{fase.numero}</div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-3xl font-bold text-white">{fase.nome}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">TEMPO</p>
                        <p className="text-xl font-semibold text-gray-300">{fase.tempo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">CUSTO</p>
                        <p className="text-xl font-semibold text-orange-400">{fase.custo}</p>
                      </div>
                    </div>
                    <p className={`${getTextSize('lg')} text-gray-300`}>{fase.descricao}</p>
                    {fase.deposito && (
                      <p className={`${getTextSize('base')} text-green-400 font-semibold`}>💰 {fase.deposito}</p>
                    )}
                    <p className={`${getTextSize('sm')} text-gray-500`}>✓ Checkpoint: {fase.checkpoint}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // SLIDE: PHASES-2 (FASES 2/2)
  if (slide.type === 'phases-2') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-6xl mx-auto space-y-6">
            {slide.fases.map((fase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className={`bg-gradient-to-r ${
                  fase.lucro ? 'from-green-900/30 to-transparent border-2 border-green-500' : 'from-gray-900 to-transparent border border-orange-700'
                } rounded-xl p-6`}
              >
                <div className="flex items-start gap-6">
                  <div className={`text-5xl font-black ${fase.lucro ? 'text-green-400' : 'text-orange-400'}`}>{fase.numero}</div>
                  <div className="flex-1 space-y-3">
                    <h3 className={`text-3xl font-bold ${fase.lucro ? 'text-green-400' : 'text-white'}`}>{fase.nome}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">TEMPO</p>
                        <p className="text-xl font-semibold text-gray-300">{fase.tempo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{fase.lucro ? 'LUCRO' : 'CUSTO'}</p>
                        <p className={`text-xl font-semibold ${fase.lucro ? 'text-green-400' : 'text-orange-400'}`}>{fase.custo}</p>
                      </div>
                    </div>
                    <p className={`${getTextSize('lg')} text-gray-300`}>{fase.descricao}</p>
                    <p className={`${getTextSize('sm')} text-gray-500`}>✓ Checkpoint: {fase.checkpoint}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {slide.destaque && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-green-900/20 to-transparent border-2 border-green-500 rounded-xl p-8 mt-8"
              >
                <h3 className="text-3xl font-bold text-green-400 mb-3 text-center">{slide.destaque.title}</h3>
                <p className={`${getTextSize('xl')} text-white mb-4 text-center`}>{slide.destaque.subtitle}</p>
                <p className={`${getTextSize('lg')} text-gray-300 text-center whitespace-pre-line`}>{slide.destaque.extra}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SLIDE: PHASES (FASES)
  if (slide.type === 'phases') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-6xl mx-auto space-y-6">
            {slide.list.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="bg-gradient-to-r from-gray-900 to-transparent border border-gray-700 rounded-xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-red-400">{i + 1}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{phase.fase}</h3>
                    <p className={`${getTextSize('lg')} text-gray-300`}>{phase.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // SLIDE: RISKS (RISCOS)
  if (slide.type === 'risks') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-6xl mx-auto space-y-6">
            {slide.risks.map((risk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-gradient-to-r from-red-900/30 to-transparent border border-red-700 rounded-xl p-6"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">RISCO</p>
                      <h3 className="text-2xl font-bold text-red-400">{risk.risco}</h3>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">PROTEÇÃO</p>
                      <h3 className="text-2xl font-bold text-green-400">{risk.protecao}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {slide.footer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-gray-900 to-transparent border border-gray-700 rounded-xl p-6 mt-8"
              >
                <div className="space-y-2">
                  {slide.footer.map((line, i) => (
                    <p key={i} className={`${getTextSize('lg')} text-gray-300 text-center`}>✓ {line}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SLIDE: DECISION (DECISÃO)
  if (slide.type === 'decision') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Duas colunas */}
            <div className="grid grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-900/30 to-transparent border-2 border-green-500 rounded-xl p-8"
              >
                <CheckCircle className="w-12 h-12 mb-4 text-green-400" />
                <h4 className="text-2xl font-bold text-green-400 mb-6">{slide.ganha.title}</h4>
                <div className={`${getTextSize('base')} text-gray-300 space-y-3`}>
                  {slide.ganha.items.map((item, i) => (
                    <p key={i}>• {item}</p>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-orange-900/30 to-transparent border-2 border-orange-500 rounded-xl p-8"
              >
                <Target className="w-12 h-12 mb-4 text-orange-400" />
                <h4 className="text-2xl font-bold text-orange-400 mb-6">{slide.precisa.title}</h4>
                <div className={`${getTextSize('base')} text-gray-300 space-y-3`}>
                  {slide.precisa.items.map((item, i) => (
                    <p key={i}>• {item}</p>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Pergunta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-red-900 to-red-800 border-2 border-red-500 rounded-xl p-8 text-center"
            >
              <h3 className="text-5xl font-bold text-white">{slide.question}</h3>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // SLIDE: NEXT STEPS (PRÓXIMOS PASSOS)
  if (slide.type === 'next-steps') {
    const iconMap = {
      'clock': Clock
    };

    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-6xl mx-auto space-y-6">
            {slide.steps.map((step, i) => {
              const Icon = iconMap[step.icon] || Clock;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-gradient-to-r from-gray-900 to-transparent border border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <Icon className="w-10 h-10 text-orange-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-4">{step.titulo}</h3>
                      <div className={`${getTextSize('lg')} text-gray-300 space-y-2`}>
                        {step.items.map((item, j) => (
                          <p key={j}>• {item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {slide.footer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-orange-900/20 to-transparent border border-orange-700 rounded-xl p-6 mt-8"
              >
                <div className="space-y-2 text-center">
                  {slide.footer.map((line, i) => (
                    <p key={i} className={`${getTextSize('lg')} text-orange-400 font-semibold`}>{line}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SLIDE: QUESTIONS (PERGUNTAS)
  if (slide.type === 'questions') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-12"
        >
          <div>
            <h2 className="text-8xl font-black text-white mb-6">{slide.title}</h2>
            <h3 className="text-6xl font-bold text-orange-400 mb-4">{slide.mainText}</h3>
            <p className={`${getTextSize('2xl')} text-gray-400`}>{slide.subText}</p>
          </div>

          {slide.contact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-orange-900/20 to-transparent border-2 border-orange-700 rounded-xl p-8 space-y-4"
            >
              <p className="text-2xl text-gray-300">
                <span className="text-orange-400 font-semibold">WhatsApp:</span> {slide.contact.whatsapp}
              </p>
              <p className="text-2xl text-gray-300">
                <span className="text-orange-400 font-semibold">E-mail:</span> {slide.contact.email}
              </p>
              <p className="text-2xl text-gray-300">
                <span className="text-orange-400 font-semibold">Local:</span> {slide.contact.location}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // SLIDE: RETURN 3 SCENARIOS (RETORNO 3 CENÁRIOS)
  if (slide.type === 'return-3scenarios') {
    const iconMap = {
      'frown': Frown,
      'smile': Smile,
      'rocket': Rocket
    };

    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {slide.scenarios.map((scenario, i) => {
                const Icon = iconMap[scenario.emoji] || Smile;
                const colors = [
                  { border: 'border-amber-500', bg: 'from-amber-900/30', text: 'text-amber-400' },
                  { border: 'border-green-500', bg: 'from-green-900/30', text: 'text-green-400' },
                  { border: 'border-blue-500', bg: 'from-blue-900/30', text: 'text-blue-400' }
                ];
                const color = colors[i];

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className={`bg-gradient-to-br ${color.bg} to-transparent border-2 ${color.border} rounded-xl p-6 ${
                      scenario.highlight ? 'ring-4 ring-green-500/50' : ''
                    }`}
                  >
                    <div className="text-center mb-6">
                      <Icon className={`w-16 h-16 mx-auto mb-4 ${color.text}`} />
                      <h3 className={`text-xl font-bold ${color.text} mb-2`}>{scenario.title}</h3>
                      <p className={`${getTextSize('sm')} text-gray-400`}>{scenario.subtitle}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Pró-labore</p>
                        <p className="text-2xl font-bold text-white">{scenario.proLabore}</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Lucro</p>
                        <p className="text-2xl font-bold text-white">{scenario.lucro}</p>
                      </div>
                      <div className={`bg-gradient-to-r ${color.bg} to-transparent rounded-lg p-4 border ${color.border}`}>
                        <p className="text-gray-400 text-sm mb-1">TOTAL</p>
                        <p className={`text-3xl font-black ${color.text}`}>{scenario.total}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SLIDE: PAYBACK ROI 3 SCENARIOS
  if (slide.type === 'payback-roi-3scenarios') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* 3 Cenários PAYBACK */}
            <div className="grid grid-cols-3 gap-6">
              {slide.payback.scenarios.map((scenario, i) => {
                const colors = [
                  { border: 'border-amber-500', bg: 'from-amber-900/30', text: 'text-amber-400' },
                  { border: 'border-green-500', bg: 'from-green-900/30', text: 'text-green-400' },
                  { border: 'border-blue-500', bg: 'from-blue-900/30', text: 'text-blue-400' }
                ];
                const color = colors[i];

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className={`bg-gradient-to-br ${color.bg} to-transparent border-2 ${color.border} rounded-xl p-6 ${
                      scenario.highlight ? 'ring-4 ring-green-500/50' : ''
                    }`}
                  >
                    <div className="text-center mb-6">
                      <h3 className={`text-2xl font-bold ${color.text} mb-2`}>{scenario.label}</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Você recebe</p>
                        <p className="text-2xl font-bold text-white">{scenario.recebe}</p>
                      </div>
                      <div className={`bg-gradient-to-r ${color.bg} to-transparent rounded-lg p-4 border ${color.border}`}>
                        <p className="text-gray-400 text-sm mb-1">Payback</p>
                        <p className={`text-3xl font-black ${color.text}`}>{scenario.meses}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Timeline Realista */}
            {slide.payback.timelineRealista && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-green-900/20 to-transparent border border-green-700 rounded-xl p-6"
              >
                <h3 className="text-2xl font-bold text-green-400 mb-6 text-center">Timeline Cenário Realista</h3>
                <div className="flex justify-between items-end">
                  {slide.payback.timelineRealista.map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`text-xl font-bold mb-2 ${item.valor.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                        {item.valor}
                      </div>
                      <div className="text-sm text-gray-400">{item.mes}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ROI */}
            <div className="bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-700 rounded-xl p-6">
              <h3 className="text-3xl font-bold text-blue-400 mb-6 text-center">RETORNO SOBRE INVESTIMENTO (ROI)</h3>
              <div className="grid grid-cols-3 gap-6">
                {slide.roi.scenarios.map((scenario, i) => {
                  const colors = [
                    { border: 'border-amber-500', bg: 'from-amber-900/30', text: 'text-amber-400' },
                    { border: 'border-green-500', bg: 'from-green-900/30', text: 'text-green-400' },
                    { border: 'border-blue-500', bg: 'from-blue-900/30', text: 'text-blue-400' }
                  ];
                  const color = colors[i];

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className={`bg-gradient-to-br ${color.bg} to-transparent border ${color.border} rounded-xl p-4 ${
                        scenario.highlight ? 'ring-2 ring-green-500/50' : ''
                      }`}
                    >
                      <h4 className={`text-lg font-bold ${color.text} mb-3 text-center`}>{scenario.label}</h4>
                      <div className="space-y-2 text-center">
                        <p className={`${getTextSize('sm')} text-gray-400`}>Em 12 meses:</p>
                        <p className="text-xl font-bold text-white">{scenario.recebeAno}</p>
                        <p className={`text-2xl font-black ${color.text}`}>{scenario.roiAno}</p>
                        {scenario.doisAnos && (
                          <p className={`${getTextSize('sm')} text-gray-300 mt-3 pt-3 border-t border-gray-700`}>
                            {scenario.doisAnos}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            {slide.footer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center space-y-2"
              >
                {slide.footer.map((line, i) => (
                  <p key={i} className={`${getTextSize('lg')} text-gray-400`}>{line}</p>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
