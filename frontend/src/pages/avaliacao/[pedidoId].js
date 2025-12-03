import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { useAuthStore } from '../../stores/authStore';
import { Star, ThumbsUp, Send, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Avaliacao() {
  const router = useRouter();
  const { pedidoId } = router.query;
  const { isAuthenticated } = useAuthStore();

  const [npsScore, setNpsScore] = useState(null);
  const [ratings, setRatings] = useState({
    quality: 0,
    speed: 0,
    ambience: 0,
    price: 0
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para avaliar');
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleNpsClick = (score) => {
    setNpsScore(score);
  };

  const handleRatingClick = (category, score) => {
    setRatings(prev => ({ ...prev, [category]: score }));
  };

  const getNpsCategory = () => {
    if (npsScore === null) return null;
    if (npsScore >= 0 && npsScore <= 6) return { label: 'Detrator', color: 'text-magenta-400' };
    if (npsScore >= 7 && npsScore <= 8) return { label: 'Neutro', color: 'text-yellow-400' };
    if (npsScore >= 9 && npsScore <= 10) return { label: 'Promotor', color: 'text-green-400' };
  };

  const handleSubmit = async () => {
    if (npsScore === null) {
      toast.error('Por favor, dê uma nota de 0 a 10');
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Here you would send to API:
      // await api.post(`/orders/${pedidoId}/review`, { npsScore, ratings, comment });

      setSubmitted(true);
      toast.success('Obrigado pela sua avaliação!');

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/cardapio');
      }, 3000);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      toast.error('Erro ao enviar avaliação');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.push('/cardapio');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (submitted) {
    return (
      <>
        <Head>
          <title>Avaliação Enviada | FLAME</title>
        </Head>

        <Layout>
          <div className="min-h-screen pt-16 bg-black flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="text-center max-w-md mx-auto px-4"
            >
              <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-600">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                Obrigado! ⭐
              </h1>

              <p className="text-neutral-400 text-lg mb-8">
                Sua opinião nos ajuda a melhorar cada vez mais!
              </p>

              <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                <p className="text-neutral-300 mb-4">
                  Esperamos vê-lo novamente em breve no FLAME
                </p>
                <p className="text-sm text-neutral-500">
                  Redirecionando para o cardápio...
                </p>
              </div>
            </motion.div>
          </div>
        </Layout>
      </>
    );
  }

  const npsCategory = getNpsCategory();

  return (
    <>
      <Head>
        <title>Avaliar Pedido #{pedidoId} | FLAME</title>
        <meta name="description" content="Como foi sua experiência?" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-20 h-20 bg-magenta-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-magenta-600"
              >
                <Star className="w-10 h-10 text-magenta-400" />
              </motion.div>

              <h1 className="text-4xl font-bold text-white mb-4">
                Como foi sua experiência?
              </h1>
              <p className="text-neutral-400 text-lg">
                Sua opinião é muito importante para nós
              </p>
            </div>

            {/* NPS Score */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-8 mb-6">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">
                De 0 a 10, quanto você recomendaria o FLAME?
              </h2>

              <div className="grid grid-cols-11 gap-2 mb-4">
                {[...Array(11)].map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleNpsClick(i)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`aspect-square rounded-lg font-bold text-lg transition-all ${
                      npsScore === i
                        ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white shadow-lg shadow-magenta-600/50 scale-110'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    {i}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between text-sm text-neutral-500 mb-4">
                <span>Pouco provável</span>
                <span>Muito provável</span>
              </div>

              {npsCategory && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className={`text-lg font-semibold ${npsCategory.color}`}>
                    {npsCategory.label}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Detailed Ratings */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-8 mb-6">
              <h2 className="text-xl font-semibold text-white mb-6">Como estava:</h2>

              <div className="space-y-6">
                {/* Quality */}
                <div>
                  <label className="block text-neutral-300 mb-3">Qualidade dos drinks:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick('quality', star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= ratings.quality
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Speed */}
                <div>
                  <label className="block text-neutral-300 mb-3">Velocidade do atendimento:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick('speed', star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= ratings.speed
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ambience */}
                <div>
                  <label className="block text-neutral-300 mb-3">Ambiente:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick('ambience', star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= ratings.ambience
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-neutral-300 mb-3">Preço (custo-benefício):</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick('price', star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= ratings.price
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Comment */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-8 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Quer deixar um comentário?
              </h2>
              <p className="text-neutral-400 text-sm mb-4">(Opcional)</p>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte sua experiência..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-magenta-500 resize-none"
                rows={5}
                maxLength={500}
              />

              <div className="flex justify-between mt-2">
                <p className="text-sm text-neutral-500">
                  Compartilhe o que achou da comida, bebida, ambiente ou atendimento
                </p>
                <p className="text-sm text-neutral-500">
                  {comment.length}/500
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleSkip}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                Pular
              </button>

              <button
                onClick={handleSubmit}
                disabled={npsScore === null || isSubmitting}
                className="flex-1 bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 disabled:from-neutral-600 disabled:to-neutral-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Enviando...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Avaliação
                  </>
                )}
              </button>
            </div>

            {/* Info */}
            <p className="text-center text-neutral-500 text-sm mt-6">
              Sua avaliação é anônima e nos ajuda a melhorar continuamente
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
