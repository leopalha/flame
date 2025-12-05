import { motion } from 'framer-motion';
import {
  Wine, Music, DollarSign, Target, Users, Star,
  MapPin, TrendingUp, Clock, Award, Home, Lightbulb,
  Building, Settings, Shield, Calendar, CheckCircle,
  ArrowRight, ArrowDown, Percent, BarChart3, PieChart
} from 'lucide-react';
import { renderExtendedSlides } from './SlideExtensions';

// Stub functions for removed slide extensions (consolidated into SlideExtensions.js)
const renderEngrenagensSlides = () => null;
const renderStructureSlides = () => null;
const renderFinalSlides = () => null;

const Slide = ({ slide, textSize = 1 }) => {
  // Cálculo do tamanho do texto (0 = pequeno, 1 = médio, 2 = grande)
  const getTextSize = (base) => {
    const sizes = {
      0: { sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl' },
      1: { sm: 'text-base', base: 'text-lg', lg: 'text-xl', xl: 'text-2xl' },
      2: { sm: 'text-lg', base: 'text-xl', lg: 'text-2xl', xl: 'text-3xl' }
    };
    return sizes[textSize][base] || sizes[1][base];
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // SLIDE 1: CAPA
  if (slide.type === 'cover') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-black to-black relative overflow-hidden pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-red-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        </div>

        <motion.div {...fadeIn} className="relative z-10 text-center px-8 max-w-5xl mx-auto">
          <h1 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tight">
            {slide.content.title}
          </h1>

          <p className="text-2xl md:text-3xl text-gray-300 mb-12 whitespace-pre-line leading-relaxed">
            {slide.content.subtitle}
          </p>

          <div className="flex gap-8 justify-center mb-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Wine className="w-20 h-20 text-red-400" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Music className="w-20 h-20 text-amber-400" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <DollarSign className="w-20 h-20 text-green-400" />
            </motion.div>
          </div>

          {slide.content.footer && (
            <div className={`${getTextSize('lg')} text-gray-400 space-y-2`}>
              <p>Apresentação para: <span className="text-white font-semibold">{slide.content.footer.destinatario}</span></p>
              <p>Por: <span className="text-white font-semibold">{slide.content.footer.apresentador}</span></p>
              <p>Data: <span className="text-white font-semibold">{slide.content.footer.data}</span></p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // SLIDE 2: TRÊS COLUNAS
  if (slide.type === 'three-columns') {
    const iconMap = {
      'target': Target,
      'users': Users,
      'star': Star
    };

    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
            {slide.columns.map((col, i) => {
              const IconComponent = iconMap[col.icon] || Target;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="bg-gradient-to-b from-red-900/30 to-transparent border border-red-800/50 rounded-xl p-8 flex flex-col items-center text-center"
                >
                  <IconComponent className="w-20 h-20 text-red-400 mb-6" />
                  <h3 className="text-3xl font-bold text-red-400 mb-6">{col.title}</h3>
                  <div className={`${getTextSize('lg')} text-gray-300 space-y-3 flex-1 flex flex-col justify-center`}>
                    {col.items.map((item, j) => (
                      <p key={j}>{item}</p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 3: GRID 2x2
  if (slide.type === 'grid-2x2') {
    const iconMap = {
      'wine': Wine,
      'music': Music,
      'home': Home,
      'star': Star
    };

    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">
            {slide.grid.map((item, i) => {
              const IconComponent = iconMap[item.icon] || Wine;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <IconComponent className="w-16 h-16 text-red-400" />
                    <h3 className="text-3xl font-bold text-white">{item.title}</h3>
                  </div>
                  <div className={`${getTextSize('lg')} text-gray-300 space-y-2`}>
                    {item.items.map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 4: LOCALIZAÇÃO
  if (slide.type === 'location') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-6xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-gradient-to-r from-amber-600/20 to-amber-800/20 border-2 border-amber-500 rounded-2xl p-8 text-center"
            >
              <Award className="w-20 h-20 text-amber-400 mx-auto mb-4" />
              <h3 className="text-5xl font-black text-amber-400 mb-3">{slide.highlight.text}</h3>
              <p className={`${getTextSize('xl')} text-amber-200`}>{slide.highlight.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              {slide.blocks.map((block, i) => {
                const iconMap = {
                  'trending-up': TrendingUp,
                  'dollar-sign': DollarSign,
                  'users': Users,
                  'clock': Clock
                };
                const IconComponent = iconMap[block.icon] || TrendingUp;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center"
                  >
                    <IconComponent className="w-16 h-16 text-red-400 mx-auto mb-3" />
                    <h4 className="text-2xl font-bold text-red-400 mb-2">{block.title}</h4>
                    <p className={`${getTextSize('lg')} text-gray-300`}>{block.text}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className={`${getTextSize('lg')} text-center text-gray-400 whitespace-pre-line`}
            >
              {slide.footer}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 5: INVESTIMENTO OVERVIEW
  if (slide.type === 'investment-overview') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-5xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center"
            >
              <div className="text-9xl font-black text-red-500 mb-4">{slide.amount}</div>
              <p className={`${getTextSize('xl')} text-gray-400`}>{slide.subtitle}</p>
            </motion.div>

            <div className="space-y-6">
              {slide.breakdown.map((item, i) => {
                const iconMap = {
                  'building': Building,
                  'settings': Settings,
                  'file-text': CheckCircle
                };
                const IconComponent = iconMap[item.icon] || Building;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    className="bg-gradient-to-r from-red-900/30 to-transparent border-l-4 border-red-500 rounded-r-xl p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <IconComponent className="w-14 h-14 text-red-400" />
                      <div>
                        <h3 className="text-3xl font-bold text-white">{item.label}</h3>
                        <p className={`${getTextSize('lg')} text-gray-400`}>{item.percent}%</p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-red-400">{item.value}</div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className={`${getTextSize('base')} text-center space-y-2`}
            >
              {slide.footer.map((line, i) => (
                <p key={i} className="text-green-400 flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {line.replace('✅ ', '')}
                </p>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 6: TIMELINE HORIZONTAL
  if (slide.type === 'timeline-horizontal') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Timeline */}
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800" />
              <div className="relative flex justify-between">
                {slide.timeline.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.2, duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-6 h-6 rounded-full bg-red-500 border-4 border-black mb-6" />
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center w-72">
                      <p className={`${getTextSize('sm')} text-gray-400 mb-2`}>{item.day}</p>
                      <h3 className="text-2xl font-bold text-white mb-2">{item.parcela}</h3>
                      <p className="text-4xl font-black text-red-400 mb-4">{item.valor}</p>
                      <div className={`${getTextSize('base')} text-gray-300 space-y-1`}>
                        <p>{item.etapa}</p>
                        <p className="text-green-400 flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          {item.validacao}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Destaque */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-gradient-to-r from-green-900/30 to-transparent border-2 border-green-500 rounded-xl p-8 text-center max-w-2xl mx-auto"
            >
              <Shield className="w-20 h-20 text-green-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-green-400 mb-3">{slide.highlight.title}</h3>
              <p className={`${getTextSize('lg')} text-gray-300 whitespace-pre-line`}>{slide.highlight.text}</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 7: CÁLCULO PASSO A PASSO
  if (slide.type === 'calculation') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-4xl mx-auto space-y-6">
            {slide.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className={`${
                  step.highlight
                    ? 'bg-gradient-to-r from-red-900 to-red-800 border-2 border-red-500'
                    : 'bg-gray-900 border border-gray-800'
                } rounded-xl p-6 flex items-center justify-between`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {step.highlight && <BarChart3 className="w-8 h-8 text-white" />}
                    <h3 className={`text-2xl font-bold ${step.highlight ? 'text-white' : 'text-red-400'}`}>
                      {step.label}
                    </h3>
                  </div>
                  <p className={`${getTextSize('lg')} text-gray-300`}>{step.calc}</p>
                </div>
                <div className={`text-right flex items-center gap-3 ${step.highlight ? 'text-5xl font-black text-white' : 'text-3xl font-bold text-white'}`}>
                  {step.highlight && <ArrowRight className="w-10 h-10" />}
                  {step.result}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 8: WATERFALL
  if (slide.type === 'waterfall') {
    return (
      <div className="h-full flex flex-col bg-black">
        <motion.h2 {...fadeIn} className="text-6xl font-bold text-white pt-12 pb-8 text-center">
          {slide.title}
        </motion.h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 pb-32">
          <div className="max-w-3xl mx-auto">
            {slide.waterfall.map((item, i) => {
              const isNegative = item.type === 'negative';
              const isFinal = item.type === 'final';
              const isPositive = item.type === 'positive';

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  className="mb-4 last:mb-0"
                >
                  <div
                    className={`rounded-xl p-5 flex items-center justify-between ${
                      isFinal
                        ? 'bg-gradient-to-r from-green-900 to-green-800 border-2 border-green-400'
                        : isNegative
                        ? 'bg-red-900/30 border border-red-800/50'
                        : 'bg-green-900/20 border border-green-800/50'
                    }`}
                  >
                    <div className="flex-1 flex items-center gap-3">
                      {isFinal && <DollarSign className="w-10 h-10 text-white" />}
                      <div>
                        <h3 className={`text-2xl font-bold ${isFinal ? 'text-white' : isNegative ? 'text-red-300' : 'text-green-300'}`}>
                          {item.label}
                        </h3>
                        <p className={`${getTextSize('sm')} ${isFinal ? 'text-green-200' : 'text-gray-400'}`}>
                          {item.percent}
                        </p>
                      </div>
                    </div>
                    <div className={`text-right ${isFinal ? 'text-5xl font-black text-white' : 'text-3xl font-bold'} ${
                      isNegative ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {item.value}
                    </div>
                  </div>
                  {i < slide.waterfall.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowDown className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Tentar renderizar com todas as extensões de slides
  const extendedSlide = renderExtendedSlides(slide, textSize, getTextSize, fadeIn);
  if (extendedSlide) return extendedSlide;

  const engrenagensSlide = renderEngrenagensSlides(slide, textSize, getTextSize, fadeIn);
  if (engrenagensSlide) return engrenagensSlide;

  const structureSlide = renderStructureSlides(slide, textSize, getTextSize, fadeIn);
  if (structureSlide) return structureSlide;

  const finalSlide = renderFinalSlides(slide, textSize, getTextSize, fadeIn);
  if (finalSlide) return finalSlide;

  // Para slides não implementados ainda, renderizar placeholder
  return (
    <div className="h-full flex items-center justify-center bg-black p-12">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-white mb-8">Slide {slide.id}</h2>
        <p className={`${getTextSize('xl')} text-gray-400`}>Tipo: {slide.type}</p>
        <p className={`${getTextSize('lg')} text-gray-500 mt-4`}>Em desenvolvimento...</p>
      </div>
    </div>
  );
};

export default Slide;
