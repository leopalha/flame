import { useState, useMemo } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useReviewStore, REVIEW_CATEGORIES } from '../stores/reviewStore';
import {
  Star,
  ThumbsUp,
  MessageCircle,
  Filter,
  ChevronDown,
  User,
  Quote
} from 'lucide-react';

// Componente de estrelas
const StarRating = ({ rating, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
          }`}
        />
      ))}
    </div>
  );
};

// Componente de card de avaliação
const ReviewCard = ({ review, onMarkHelpful }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 transition-all hover:border-opacity-30"
      style={{ '--border-color': 'var(--theme-primary)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))' }}>
            {review.userAvatar ? (
              <img src={review.userAvatar} alt={review.userName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-white">{review.userName}</h4>
            <p className="text-sm text-neutral-400">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      {/* Comment */}
      <p className="text-neutral-300 leading-relaxed mb-4">{review.comment}</p>

      {/* Category ratings */}
      {review.categories && Object.keys(review.categories).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(review.categories).map(([catId, rating]) => {
            const category = REVIEW_CATEGORIES.find(c => c.id === catId);
            if (!category) return null;
            return (
              <div
                key={catId}
                className="flex items-center gap-1.5 bg-neutral-800 px-3 py-1.5 rounded-full text-sm"
              >
                <span>{category.emoji}</span>
                <span className="text-neutral-300">{category.nome}</span>
                <span className="text-amber-400 font-medium">{rating}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Response from establishment */}
      {review.response && (
        <div className="bg-neutral-800/50 rounded-r-lg p-4 mb-4" style={{ borderLeft: '4px solid var(--theme-primary)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Quote className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--theme-primary)' }}>Resposta do FLAME</span>
          </div>
          <p className="text-sm text-neutral-300">{review.response}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
        <button
          onClick={() => onMarkHelpful(review.id)}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-cyan-400 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Útil ({review.helpful})</span>
        </button>
      </div>
    </motion.div>
  );
};

export default function Avaliacoes() {
  const {
    getAllReviews,
    getAverageRating,
    getRatingDistribution,
    getCategoryAverages,
    getTotalReviews,
    markHelpful
  } = useReviewStore();

  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const reviews = getAllReviews();
  const averageRating = getAverageRating();
  const distribution = getRatingDistribution();
  const categoryAverages = getCategoryAverages();
  const totalReviews = getTotalReviews();

  // Filtrar e ordenar avaliacoes
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    // Filtrar por rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(filterRating));
    }

    // Ordenar
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'helpful') {
      filtered.sort((a, b) => b.helpful - a.helpful);
    }

    return filtered;
  }, [reviews, filterRating, sortBy]);

  // Calcular porcentagem para barra de distribuicao
  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };

  return (
    <>
      <Head>
        <title>Avaliacoes | FLAME Lounge Bar</title>
        <meta name="description" content="Veja o que nossos clientes dizem sobre o FLAME Lounge Bar. Avaliacoes reais de experiencias incriveis!" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-black pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{
                  background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Avaliacoes
              </motion.h1>
              <p className="text-neutral-400 text-lg">
                Veja o que nossos clientes dizem sobre a experiencia FLAME
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Overall Rating */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl p-6 text-center"
              >
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 mb-2">
                  {averageRating}
                </div>
                <StarRating rating={Math.round(parseFloat(averageRating))} size="lg" />
                <p className="text-neutral-400 mt-2">{totalReviews} avaliacoes</p>
              </motion.div>

              {/* Rating Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Distribuicao</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm text-neutral-400 w-6">{rating}</span>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                          style={{ width: `${getPercentage(distribution[rating])}%` }}
                        />
                      </div>
                      <span className="text-sm text-neutral-400 w-8">{distribution[rating]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Category Averages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Por Categoria</h3>
                <div className="space-y-3">
                  {REVIEW_CATEGORIES.map((cat) => {
                    const avg = categoryAverages[cat.id] || '-';
                    return (
                      <div key={cat.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{cat.emoji}</span>
                          <span className="text-neutral-300">{cat.nome}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-amber-400 font-semibold">{avg}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-400">Filtrar:</span>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-magenta-500"
                >
                  <option value="all">Todas as notas</option>
                  <option value="5">5 estrelas</option>
                  <option value="4">4 estrelas</option>
                  <option value="3">3 estrelas</option>
                  <option value="2">2 estrelas</option>
                  <option value="1">1 estrela</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-magenta-500"
                >
                  <option value="recent">Mais recentes</option>
                  <option value="highest">Maior nota</option>
                  <option value="lowest">Menor nota</option>
                  <option value="helpful">Mais úteis</option>
                </select>
              </div>
            </div>

            {/* Reviews List */}
            <div className="grid gap-6">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ReviewCard review={review} onMarkHelpful={markHelpful} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Nenhuma avaliação encontrada</h3>
                  <p className="text-neutral-400">
                    {filterRating !== 'all'
                      ? 'Tente mudar os filtros'
                      : 'Seja o primeiro a avaliar!'}
                  </p>
                </div>
              )}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="border rounded-2xl p-8" style={{
                background: 'linear-gradient(135deg, rgba(var(--theme-primary-rgb, 255, 0, 110), 0.1), rgba(var(--theme-secondary-rgb, 0, 212, 255), 0.1))',
                borderColor: 'rgba(var(--theme-primary-rgb, 255, 0, 110), 0.3)'
              }}>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Já visitou o FLAME?
                </h3>
                <p className="text-neutral-400 mb-6">
                  Faça seu pedido e deixe sua avaliação para ajudar outros clientes!
                </p>
                <a
                  href="/cardapio"
                  style={{
                    background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
                    boxShadow: 'rgba(var(--theme-primary-rgb, 255, 0, 110), 0.3) 0 0 20px'
                  }}
                  className="inline-block text-white font-semibold px-8 py-3 rounded-lg transition-all hover:opacity-90"
                >
                  Ver Cardapio
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
}
