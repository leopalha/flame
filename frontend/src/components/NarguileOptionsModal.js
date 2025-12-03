import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Wind, Plus, Check, Flame } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../utils/format';
import { toast } from 'react-hot-toast';

export default function NarguileOptionsModal({ isOpen, onClose, product }) {
  const [selectedSabor, setSelectedSabor] = useState(null);
  const [selectedDuracao, setSelectedDuracao] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [observacoes, setObservacoes] = useState('');

  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && product?.opcoes) {
      setSelectedSabor(null);
      setSelectedDuracao(product.opcoes.duracoes?.[0] || null);
      setSelectedExtras([]);
      setSelectedDrinks([]);
      setObservacoes('');
    }
  }, [isOpen, product]);

  // Handle ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        window.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const opcoes = product.opcoes || {};
  const sabores = opcoes.sabores || [];
  const duracoes = opcoes.duracoes || [];
  const extras = opcoes.extras || [];
  const drinks = opcoes.drinks || [];

  const toggleExtra = (extra) => {
    setSelectedExtras(prev =>
      prev.find(e => e.id === extra.id)
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const toggleDrink = (drink) => {
    if (selectedDrinks.includes(drink)) {
      setSelectedDrinks(prev => prev.filter(d => d !== drink));
    } else if (selectedDrinks.length < 2) {
      setSelectedDrinks(prev => [...prev, drink]);
    }
  };

  const calculateTotal = () => {
    let total = selectedDuracao?.preco || product.preco;
    selectedExtras.forEach(extra => {
      total += extra.preco;
    });
    return total;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Faca login para adicionar ao carrinho');
      return;
    }

    if (!selectedSabor) {
      toast.error('Selecione um sabor');
      return;
    }

    if (!selectedDuracao) {
      toast.error('Selecione a duracao');
      return;
    }

    if (drinks.length > 0 && selectedDrinks.length < 2) {
      toast.error('Selecione 2 drinks para o combo');
      return;
    }

    // Build custom product for cart
    const customProduct = {
      ...product,
      price: calculateTotal(),
      customOptions: {
        sabor: selectedSabor,
        duracao: selectedDuracao,
        extras: selectedExtras,
        drinks: selectedDrinks,
        observacoes
      }
    };

    // Build notes string for cart display
    const notes = [
      `Sabor: ${selectedSabor}`,
      `Duracao: ${selectedDuracao.label}`,
      ...(selectedExtras.length > 0 ? [`Extras: ${selectedExtras.map(e => e.nome).join(', ')}`] : []),
      ...(selectedDrinks.length > 0 ? [`Drinks: ${selectedDrinks.join(', ')}`] : []),
      ...(observacoes ? [`Obs: ${observacoes}`] : [])
    ].join(' | ');

    addItem(customProduct, 1, notes);
    toast.success(`${product.nome} adicionado ao carrinho!`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-800"
          >
            {/* Header */}
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
              {product.imagem ? (
                <Image
                  src={product.imagem}
                  alt={product.nome}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-magenta-600 to-cyan-600 flex items-center justify-center">
                  <Flame className="w-16 h-16 text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl font-bold text-white mb-1">{product.nome}</h2>
                <p className="text-neutral-300 text-sm line-clamp-2">{product.descricao}</p>
              </div>
            </div>

            {/* Options */}
            <div className="p-6 space-y-6">
              {/* Sabores */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-cyan-400" />
                  Escolha o Sabor
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {sabores.map((sabor) => (
                    <button
                      key={sabor}
                      onClick={() => setSelectedSabor(sabor)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedSabor === sabor
                          ? 'border-magenta-500 bg-magenta-500/20 text-white'
                          : 'border-neutral-700 hover:border-neutral-600 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{sabor}</span>
                        {selectedSabor === sabor && (
                          <Check className="w-4 h-4 text-magenta-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duracao */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Duracao
                </h3>
                <div className="space-y-2">
                  {duracoes.map((duracao) => (
                    <button
                      key={duracao.tempo}
                      onClick={() => setSelectedDuracao(duracao)}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                        selectedDuracao?.tempo === duracao.tempo
                          ? 'border-magenta-500 bg-magenta-500/20'
                          : 'border-neutral-700 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {selectedDuracao?.tempo === duracao.tempo ? (
                          <div className="w-5 h-5 rounded-full bg-magenta-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-neutral-600" />
                        )}
                        <span className="text-white font-medium">{duracao.label}</span>
                      </div>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 to-cyan-400 font-bold">
                        {formatCurrency(duracao.preco)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drinks (for combo) */}
              {drinks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">🍹</span>
                    Escolha 2 Drinks
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {drinks.map((drink) => (
                      <button
                        key={drink}
                        onClick={() => toggleDrink(drink)}
                        disabled={!selectedDrinks.includes(drink) && selectedDrinks.length >= 2}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedDrinks.includes(drink)
                            ? 'border-cyan-500 bg-cyan-500/20 text-white'
                            : selectedDrinks.length >= 2
                              ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                              : 'border-neutral-700 hover:border-neutral-600 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{drink}</span>
                          {selectedDrinks.includes(drink) && (
                            <Check className="w-4 h-4 text-cyan-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-neutral-500 text-sm mt-2">
                    {selectedDrinks.length}/2 drinks selecionados
                  </p>
                </div>
              )}

              {/* Extras */}
              {extras.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-cyan-400" />
                    Extras (Opcional)
                  </h3>
                  <div className="space-y-2">
                    {extras.map((extra) => (
                      <button
                        key={extra.id}
                        onClick={() => toggleExtra(extra)}
                        className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                          selectedExtras.find(e => e.id === extra.id)
                            ? 'border-cyan-500 bg-cyan-500/20'
                            : 'border-neutral-700 hover:border-neutral-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            selectedExtras.find(e => e.id === extra.id)
                              ? 'bg-cyan-500 border-cyan-500'
                              : 'border-neutral-600'
                          }`}>
                            {selectedExtras.find(e => e.id === extra.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-white">{extra.nome}</span>
                        </div>
                        <span className="text-cyan-400 font-medium">
                          +{formatCurrency(extra.preco)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Observacoes */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Observacoes (Opcional)
                </h3>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Algum pedido especial?"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-magenta-500 resize-none"
                  rows={2}
                />
              </div>

              {/* Total and Add to Cart */}
              <div className="pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg text-neutral-400">Total</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 to-cyan-400">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSabor || !selectedDuracao || (drinks.length > 0 && selectedDrinks.length < 2)}
                  className="w-full bg-gradient-to-r from-magenta-600 to-cyan-600 hover:from-magenta-700 hover:to-cyan-700 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-magenta-500/20 hover:shadow-magenta-500/40 flex items-center justify-center gap-2"
                >
                  <Flame className="w-5 h-5" />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
