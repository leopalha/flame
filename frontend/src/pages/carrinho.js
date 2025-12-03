import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Clock,
  CreditCard,
  Smartphone,
  MapPin,
  ArrowRight,
  AlertTriangle,
  Check
} from 'lucide-react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency, formatDuration } from '../utils/format';
import { toast } from 'react-hot-toast';

export default function Carrinho() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    items,
    tableNumber,
    notes,
    getTotalItems,
    getSubtotal,
    getTotal,
    getEstimatedTime,
    incrementItem,
    decrementItem,
    removeItem,
    updateItemNotes,
    setNotes,
    clearCart,
    validateCart,
    setTable
  } = useCartStore();

  const [itemNotes, setItemNotes] = useState({});
  const [showNotes, setShowNotes] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTable, setSelectedTable] = useState(tableNumber || null);
  const [showTableSelection, setShowTableSelection] = useState(!tableNumber);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      toast.error('Faça login para acessar o carrinho');
      router.push('/login?returnTo=/carrinho');
      return;
    }
  }, [isAuthenticated, router]);

  // Update selected table when tableNumber changes
  useEffect(() => {
    console.log('🔍 CARRINHO: tableNumber =', tableNumber);
    console.log('🔍 CARRINHO: showTableSelection =', showTableSelection);
    if (tableNumber) {
      setSelectedTable(tableNumber);
      setShowTableSelection(false);
    }
  }, [tableNumber, showTableSelection]);

  const handleTableSelect = (tableNum) => {
    setSelectedTable(tableNum);
  };

  const handleConfirmTable = () => {
    if (!selectedTable) {
      toast.error('Selecione uma mesa');
      return;
    }
    setTable(selectedTable.toString(), selectedTable);
    setShowTableSelection(false);
    toast.success(`Mesa ${selectedTable} selecionada!`);
  };

  const handleNotesChange = (itemId, notes) => {
    setItemNotes(prev => ({ ...prev, [itemId]: notes }));
  };

  const handleSaveNotes = (itemId) => {
    updateItemNotes(itemId, itemNotes[itemId] || '');
    toast.success('Observações salvas!');
  };

  const handleCheckout = async () => {
    // Check if table is selected
    if (!tableNumber) {
      toast.error('Selecione uma mesa antes de finalizar');
      setShowTableSelection(true);
      return;
    }

    const validation = validateCart();

    if (!validation.isValid) {
      validation.errors.forEach(error => {
        toast.error(error);
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Redirect to checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Erro no checkout:', error);
      toast.error('Erro ao processar pedido');
    } finally {
      setIsProcessing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      x: 20,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Verificando autenticação..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Carrinho | FLAME</title>
        <meta name="description" content="Revise seu pedido e finalize a compra no FLAME Lounge Bar" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Seu Carrinho</h1>
                <p className="text-neutral-400">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'}
                  {tableNumber && (
                    <span className="ml-2">
                      • <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 to-cyan-400">Mesa {tableNumber}</span>
                    </span>
                  )}
                </p>
              </div>

              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-neutral-400 hover:text-magenta-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar carrinho
                </button>
              )}
            </div>

            {items.length === 0 ? (
              /* Empty Cart */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-12 h-12 text-neutral-600" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Seu carrinho esta vazio
                </h2>
                <p className="text-neutral-400 mb-8">
                  Adicione produtos do nosso cardapio para fazer seu pedido
                </p>
                <Link
                  href="/cardapio"
                  className="bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 shadow-lg shadow-magenta-500/20"
                >
                  Ver Cardapio
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          layout
                          exit="exit"
                          className="bg-neutral-900 rounded-xl p-6 border border-neutral-700 hover:border-magenta-500/30 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            {/* Product Image */}
                            <div className="relative w-20 h-20 flex-shrink-0">
                              {item.product.image ? (
                                <Image
                                  src={item.product.image}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-full h-full bg-neutral-700 rounded-lg flex items-center justify-center">
                                  <ShoppingBag className="w-8 h-8 text-neutral-500" />
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-white text-lg mb-1">
                                    {item.product.name}
                                  </h3>
                                  <p className="text-sm text-neutral-400 line-clamp-2">
                                    {item.product.description}
                                  </p>
                                </div>

                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-neutral-400 hover:text-magenta-400 p-1 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Price and Quantity */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  {/* Quantity Controls */}
                                  <div className="flex items-center border border-neutral-600 rounded-lg">
                                    <button
                                      onClick={() => decrementItem(item.id)}
                                      className="p-2 text-neutral-400 hover:text-white transition-colors"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-3 py-2 text-white font-medium">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => incrementItem(item.id)}
                                      className="p-2 text-neutral-400 hover:text-white transition-colors"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Preparation Time */}
                                  {item.product.preparationTime && (
                                    <div className="flex items-center text-neutral-400 text-sm">
                                      <Clock className="w-4 h-4 mr-1" />
                                      {item.product.preparationTime}min
                                    </div>
                                  )}
                                </div>

                                {/* Item Total */}
                                <div className="text-right">
                                  <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 to-cyan-400">
                                    {formatCurrency(
                                      (item.product.discount > 0
                                        ? item.product.price * (1 - item.product.discount / 100)
                                        : item.product.price) * item.quantity
                                    )}
                                  </div>
                                  {item.product.discount > 0 && (
                                    <div className="text-sm text-neutral-500 line-through">
                                      {formatCurrency(item.product.price * item.quantity)}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Item Notes */}
                              {item.notes && (
                                <div className="mt-3 p-3 bg-neutral-800 rounded-lg">
                                  <p className="text-sm text-neutral-300">
                                    <strong>Observacoes:</strong> {item.notes}
                                  </p>
                                </div>
                              )}

                              {/* Add Notes Button */}
                              <button
                                onClick={() => {
                                  setItemNotes(prev => ({ ...prev, [item.id]: item.notes || '' }));
                                  setShowNotes(showNotes === item.id ? null : item.id);
                                }}
                                className="mt-3 text-sm text-magenta-400 hover:text-cyan-400 transition-colors"
                              >
                                {item.notes ? 'Editar observacoes' : 'Adicionar observacoes'}
                              </button>

                              {/* Notes Input */}
                              <AnimatePresence>
                                {showNotes === item.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-3 overflow-hidden"
                                  >
                                    <div className="space-y-2">
                                      <textarea
                                        value={itemNotes[item.id] || ''}
                                        onChange={(e) => handleNotesChange(item.id, e.target.value)}
                                        placeholder="Ex: sem cebola, ponto da carne..."
                                        className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-magenta-500 resize-none"
                                        rows={3}
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleSaveNotes(item.id)}
                                          className="bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                          Salvar
                                        </button>
                                        <button
                                          onClick={() => setShowNotes(null)}
                                          className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                          Cancelar
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Order Notes */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Observacoes do pedido
                    </h3>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Observacoes gerais para seu pedido..."
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-magenta-500 resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-700 sticky top-24">
                    <h3 className="text-xl font-semibold text-white mb-6">
                      Resumo do Pedido
                    </h3>

                    {/* Table Info */}
                    {/* Table Selection Section */}
                    {!showTableSelection && tableNumber ? (
                      <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg mb-6">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-magenta-400" />
                          <div>
                            <p className="text-white font-medium">Mesa {tableNumber}</p>
                            <p className="text-sm text-neutral-400">Local do pedido</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowTableSelection(true)}
                          className="text-sm text-magenta-400 hover:text-cyan-400"
                        >
                          Alterar
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-neutral-800 rounded-lg mb-6">
                        {!tableNumber && (
                          <div className="flex items-center gap-3 p-3 bg-magenta-900/20 border border-magenta-700/50 rounded-lg mb-4">
                            <AlertTriangle className="w-5 h-5 text-magenta-400" />
                            <p className="text-magenta-400 text-sm">
                              Selecione sua mesa para continuar
                            </p>
                          </div>
                        )}

                        {/* Table Grid */}
                        <div className="grid grid-cols-5 gap-2 mb-4">
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((tableNum) => (
                            <button
                              key={tableNum}
                              onClick={() => handleTableSelect(tableNum)}
                              className={`
                                h-12 rounded-lg font-bold text-base
                                transition-all duration-200
                                ${selectedTable === tableNum
                                  ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 text-white'
                                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600 border border-neutral-600'
                                }
                              `}
                            >
                              {tableNum}
                            </button>
                          ))}
                        </div>

                        {/* Confirm Button */}
                        <button
                          onClick={handleConfirmTable}
                          disabled={!selectedTable}
                          className={`
                            w-full py-2 px-4 rounded-lg font-semibold text-sm
                            transition-all flex items-center justify-center gap-2
                            ${selectedTable
                              ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 text-white'
                              : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                            }
                          `}
                        >
                          <Check className="w-4 h-4" />
                          Confirmar Mesa {selectedTable ? `#${selectedTable}` : ''}
                        </button>
                      </div>
                    )}

                    {/* Estimated Time */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Tempo estimado</span>
                      </div>
                      <span className="text-white font-medium">
                        {formatDuration(getEstimatedTime())}
                      </span>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-neutral-400">
                        <span>Subtotal ({getTotalItems()} itens)</span>
                        <span>{formatCurrency(getSubtotal())}</span>
                      </div>

                      {/* Add service fee or other charges here if needed */}
                    </div>

                    {/* Total */}
                    <div className="border-t border-neutral-700 pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Total</span>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta-400 to-cyan-400">
                          {formatCurrency(getTotal())}
                        </span>
                      </div>
                    </div>

                    {/* Payment Methods Preview */}
                    <div className="mb-6">
                      <p className="text-sm text-neutral-400 mb-3">Formas de pagamento:</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <CreditCard className="w-3 h-3" />
                          <span>Cartao</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <Smartphone className="w-3 h-3" />
                          <span>PIX</span>
                        </div>
                        <div className="text-xs text-neutral-500">Dinheiro</div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing || items.length === 0 || !tableNumber}
                      className="w-full bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 disabled:from-neutral-600 disabled:to-neutral-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-magenta-500/20"
                    >
                      {isProcessing ? (
                        <LoadingSpinner size="small" color="white" />
                      ) : (
                        <>
                          Finalizar Pedido
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-neutral-500 text-center mt-3">
                      Voce pode pagar na mesa ou online
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}