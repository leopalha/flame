import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Minus, Star, Clock, Wind } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../utils/format';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, showActions = true, variant = 'default', onImageClick, onNarguileClick }) => {
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // Check if product is narguile type
  const isNarguile = product.tipo === 'narguile' || product.category === 'Narguile' || (product.tags && product.tags.includes('narguile'));

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Faca login para adicionar produtos ao carrinho');
      return;
    }

    // If it's a narguile product, open options modal
    if (isNarguile && onNarguileClick) {
      onNarguileClick(product);
      return;
    }

    addItem(product, quantity);
    toast.success(`${product.name} adicionado ao carrinho!`);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 hover:border-magenta-500 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-neutral-700 rounded-lg flex items-center justify-center">
                <span className="text-neutral-500 text-xs">Sem foto</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">
              {product.name}
            </h3>
            <p className="text-neutral-400 text-xs mt-1 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                {hasDiscount && (
                  <span className="text-xs text-neutral-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
                <span className="font-bold text-magenta-400 text-sm">
                  {formatCurrency(discountedPrice)}
                </span>
              </div>

              {showActions && (
                <button
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-magenta-600 to-cyan-600 hover:from-magenta-700 hover:to-cyan-700 text-white p-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 hover:border-magenta-500/50 transition-all group"
    >
      {/* Product Image */}
      <div
        className="relative h-48 overflow-hidden cursor-pointer"
        onClick={() => onImageClick && product.image && onImageClick(product)}
      >
        {product.image ? (
          <>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {onImageClick && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white font-semibold bg-gradient-to-r from-magenta-500 to-cyan-500 px-4 py-2 rounded-lg shadow-lg text-sm">
                  Clique para ampliar
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <span className="text-neutral-500">Sem foto</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {isNarguile && (
            <span className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Wind className="w-3 h-3" />
              Narguile
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-gradient-to-r from-magenta-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Destaque
            </span>
          )}
          {hasDiscount && (
            <span className="bg-gradient-to-r from-cyan-500 to-magenta-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
          {!product.isActive && (
            <span className="bg-neutral-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              Indisponivel
            </span>
          )}
        </div>

        {/* Category */}
        <div className="absolute top-3 right-3">
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/10">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-white text-lg leading-tight flex-1">
            {product.name}
          </h3>

          {product.preparationTime && (
            <div className="flex items-center text-neutral-400 text-xs ml-2">
              <Clock className="w-3 h-3 mr-1" />
              {product.preparationTime}min
            </div>
          )}
        </div>

        <p className={`text-neutral-400 text-sm leading-relaxed mb-4 ${
          isExpanded ? '' : 'line-clamp-3'
        }`}>
          {product.description}
        </p>

        {product.description && product.description.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-magenta-400 text-xs font-medium mb-4 hover:text-magenta-300 transition-colors"
          >
            {isExpanded ? 'Ver menos' : 'Ver mais'}
          </button>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= product.rating
                      ? 'text-cyan-400 fill-current'
                      : 'text-neutral-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-neutral-400 text-sm">
              ({product.rating.toFixed(1)})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {hasDiscount && (
              <span className="text-neutral-500 line-through text-sm mr-2">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 to-cyan-400">
              {formatCurrency(discountedPrice)}
            </span>
          </div>

          {/* Stock Status */}
          {product.hasStock && (
            <div className="text-right">
              <span className={`text-xs font-medium ${
                product.stock > 10
                  ? 'text-cyan-400'
                  : product.stock > 0
                    ? 'text-yellow-400'
                    : 'text-magenta-400'
              }`}>
                {product.stock > 0
                  ? `${product.stock} em estoque`
                  : 'Fora de estoque'
                }
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && product.isActive && (
          <div className="flex items-center space-x-4">
            {/* Quantity Selector - hide for narguile */}
            {!isNarguile && (
              <div className="flex items-center border border-neutral-700 rounded-lg overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-white font-medium bg-neutral-800">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.hasStock && product.stock < quantity}
              className={`flex-1 bg-gradient-to-r ${
                isNarguile
                  ? 'from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700'
                  : 'from-magenta-600 to-cyan-600 hover:from-magenta-700 hover:to-cyan-700'
              } disabled:from-neutral-600 disabled:to-neutral-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg shadow-magenta-500/20 hover:shadow-magenta-500/40 flex items-center justify-center gap-2`}
            >
              {isNarguile && <Wind className="w-4 h-4" />}
              {isNarguile ? 'Personalizar' : 'Adicionar'}
            </button>
          </div>
        )}

        {!product.isActive && (
          <div className="text-center py-3">
            <span className="text-neutral-500 font-medium">
              Produto indisponivel
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
