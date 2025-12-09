import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  CreditCard,
  Wallet,
  Banknote,
  QrCode,
  Utensils,
  Truck,
  MapPin,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Gift,
  Coins,
  User,
  Heart
} from 'lucide-react';
import Layout from '../components/Layout';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore, PAYMENT_METHODS, CONSUMPTION_TYPES } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import useThemeStore from '../stores/themeStore';
import { formatCurrency } from '../utils/format';
import { toast } from 'react-hot-toast';

// Mesas disponiveis
const MESAS_DISPONIVEIS = Array.from({ length: 20 }, (_, i) => i + 1);

// Sprint 58: Categorias que exigem consumo em mesa (não permitem pickup/delivery)
const TABLE_ONLY_CATEGORIES = ['narguilé', 'narguile', 'hookah', 'shisha'];

export default function Checkout() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Estado para cashback
  const [useCashback, setUseCashback] = useState(false);
  const [cashbackAmount, setCashbackAmount] = useState(0);

  // Estado para troco (pagamento em dinheiro)
  const [needsChange, setNeedsChange] = useState(false);
  const [changeFor, setChangeFor] = useState('');

  // Estado para gorjeta
  const [selectedTip, setSelectedTip] = useState(null); // 'none', 5, 10, 15, 'custom'
  const [customTip, setCustomTip] = useState('');

  const { user, isAuthenticated } = useAuthStore();
  const { getPalette } = useThemeStore();
  const palette = getPalette();
  const {
    items,
    getSubtotal,
    getTotal,
    getTotalItems,
    getServiceFee,
    includeServiceFee,
    toggleServiceFee,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart
  } = useCartStore();

  const {
    checkoutData,
    setConsumptionType,
    setTableNumber,
    setPaymentMethod,
    setObservacoes,
    createOrder,
    resetCheckout,
    loading
  } = useOrderStore();

  // Redirecionar se não autenticado, perfil incompleto ou carrinho vazio
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para finalizar o pedido');
      router.push('/login?redirect=/checkout');
    } else if (user && !user.profileComplete) {
      toast.error('Complete seu cadastro para fazer pedidos');
      router.push('/complete-profile');
    } else if (items.length === 0 && !orderComplete) {
      toast.error('Seu carrinho está vazio');
      router.push('/cardapio');
    }
  }, [isAuthenticated, user, items.length, orderComplete, router]);

  // Sprint 58: Verificar se há produtos que exigem consumo em mesa (narguilé)
  const hasTableOnlyProducts = items.some(item => {
    const category = (item.product.category || item.product.categoria || '').toLowerCase();
    return TABLE_ONLY_CATEGORIES.some(cat => category.includes(cat));
  });

  // Sprint 58: Filtrar tipos de consumo se houver narguilé
  const availableConsumptionTypes = hasTableOnlyProducts
    ? CONSUMPTION_TYPES.filter(type => type.id === 'table')
    : CONSUMPTION_TYPES;

  // Sprint 58: Auto-selecionar mesa se for o único tipo disponível
  useEffect(() => {
    if (hasTableOnlyProducts && checkoutData.consumptionType !== 'table') {
      setConsumptionType('table');
    }
  }, [hasTableOnlyProducts, checkoutData.consumptionType, setConsumptionType]);

  // Calculos
  const subtotal = getSubtotal();
  // Sprint 42: Usa taxa do cartStore (usuário pode desativar)
  const taxaServico = checkoutData.consumptionType === 'table' ? getServiceFee() : 0;
  const taxaEntrega = checkoutData.consumptionType === 'delivery' ? 8.00 : 0;

  // Calcular gorjeta
  const calculateTipAmount = () => {
    if (selectedTip === 'none' || selectedTip === null) return 0;
    if (selectedTip === 'custom') return parseFloat(customTip) || 0;
    return (subtotal * selectedTip) / 100;
  };
  const tipAmount = calculateTipAmount();

  const totalBeforeDiscount = subtotal + taxaServico + taxaEntrega + tipAmount;

  // Cashback disponível do usuário
  const userCashbackBalance = parseFloat(user?.cashbackBalance) || 0;
  const maxCashbackToUse = Math.min(userCashbackBalance, totalBeforeDiscount);
  const cashbackDiscount = useCashback ? Math.min(cashbackAmount, maxCashbackToUse) : 0;
  const total = Math.max(0, totalBeforeDiscount - cashbackDiscount);

  // Atualizar cashbackAmount quando toggle é ativado
  useEffect(() => {
    if (useCashback && cashbackAmount === 0 && maxCashbackToUse > 0) {
      setCashbackAmount(maxCashbackToUse);
    }
  }, [useCashback, maxCashbackToUse, cashbackAmount]);

  // Validacao de steps
  const canProceedStep1 = items.length > 0;
  const canProceedStep2 = checkoutData.consumptionType &&
    (checkoutData.consumptionType !== 'table' || checkoutData.tableNumber);
  const canProceedStep3 = checkoutData.paymentMethod;

  const handleNextStep = () => {
    if (currentStep === 1 && !canProceedStep1) {
      toast.error('Adicione itens ao carrinho');
      return;
    }
    if (currentStep === 2 && !canProceedStep2) {
      toast.error('Selecione o tipo de consumo');
      return;
    }
    if (currentStep === 3 && !canProceedStep3) {
      toast.error('Selecione a forma de pagamento');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinalizarPedido = async () => {
    // Validação extra antes de enviar para API
    if (!items || items.length === 0) {
      toast.error('Carrinho vazio. Adicione itens para finalizar o pedido.');
      return;
    }

    setIsProcessing(true);

    // Adicionar informação de troco às observações se aplicável
    let observacoesFinais = checkoutData.observacoes || '';
    if (checkoutData.paymentMethod === 'cash' && needsChange && changeFor) {
      const trocoInfo = `\n[TROCO] Cliente precisa de troco para ${formatCurrency(parseFloat(changeFor))} (Troco: ${formatCurrency(parseFloat(changeFor) - total)})`;
      observacoesFinais += trocoInfo;
      // Atualizar as observações no store
      setObservacoes(observacoesFinais);
    }

    const result = await createOrder(
      items,
      subtotal,
      user?.id,
      user?.name,
      cashbackDiscount, // Passa o cashback a usar
      tipAmount // Passa a gorjeta
    );

    if (result.success) {
      setCompletedOrder(result.order);
      setOrderComplete(true);
      clearCart();
      resetCheckout();
      setUseCashback(false);
      setCashbackAmount(0);
      setNeedsChange(false);
      setChangeFor('');
      setSelectedTip(null);
      setCustomTip('');
    }

    setIsProcessing(false);
  };

  // Icone de pagamento
  // Sprint 43: Adicionado icone 'user' para pagar com atendente
  const getPaymentIcon = (iconName) => {
    switch (iconName) {
      case 'qr-code': return <QrCode className="w-6 h-6" />;
      case 'credit-card': return <CreditCard className="w-6 h-6" />;
      case 'banknotes': return <Banknote className="w-6 h-6" />;
      case 'user': return <User className="w-6 h-6" />;
      default: return <Wallet className="w-6 h-6" />;
    }
  };

  // Icone de consumo
  const getConsumptionIcon = (iconName) => {
    switch (iconName) {
      case 'utensils': return <Utensils className="w-6 h-6" />;
      case 'shopping-bag': return <ShoppingBag className="w-6 h-6" />;
      case 'truck': return <Truck className="w-6 h-6" />;
      default: return <MapPin className="w-6 h-6" />;
    }
  };

  if (!isAuthenticated) return null;

  // Tela de sucesso
  if (orderComplete && completedOrder) {
    return (
      <>
        <Head>
          <title>Pedido Confirmado | FLAME</title>
        </Head>
        <Layout>
          <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 bg-gradient-to-r from-green-500 to-[var(--theme-secondary)] rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold text-white mb-4">
                Pedido Confirmado!
              </h1>

              <p className="text-gray-400 mb-8">
                Seu pedido <span className="text-[var(--theme-primary)] font-semibold">#{completedOrder.id}</span> foi
                recebido e está sendo processado.
              </p>

              <div className="bg-gray-800 rounded-xl p-6 mb-8 text-left">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Status</span>
                  <span className="text-[var(--theme-secondary)] font-medium">Confirmado</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Tempo estimado</span>
                  <span className="text-white font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {completedOrder.estimatedTime} min
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Total</span>
                  <span className="text-[var(--theme-primary)] font-bold text-xl">
                    {formatCurrency(completedOrder.total)}
                  </span>
                </div>
                {completedOrder.consumptionType === 'table' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Mesa</span>
                    <span className="text-white font-medium">#{completedOrder.tableNumber}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => router.push('/pedidos')}
                  className="w-full bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] hover:opacity-90 text-white font-semibold py-4 px-6 rounded-xl transition-all"
                >
                  Acompanhar Pedido
                </button>
                <button
                  onClick={() => router.push('/cardapio')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                >
                  Voltar ao Cardapio
                </button>
              </div>
            </motion.div>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout | FLAME</title>
      </Head>
      <Layout>
        <div className="min-h-screen bg-gray-900 pt-24 pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.back()}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-2xl font-bold text-white">Finalizar Pedido</h1>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 px-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white'
                        : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-16 sm:w-24 h-1 mx-2 rounded transition-all ${
                        currentStep > step
                          ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]'
                          : 'bg-gray-800'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Labels */}
            <div className="flex justify-between mb-8 px-2 text-xs sm:text-sm text-gray-500">
              <span className={currentStep >= 1 ? 'text-white' : ''}>Carrinho</span>
              <span className={currentStep >= 2 ? 'text-white' : ''}>Consumo</span>
              <span className={currentStep >= 3 ? 'text-white' : ''}>Pagamento</span>
              <span className={currentStep >= 4 ? 'text-white' : ''}>Confirmar</span>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Carrinho */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-white mb-6">Revise seu pedido</h2>

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-800 rounded-xl p-4 flex items-center gap-4"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-[var(--theme-primary)] font-medium">
                          {formatCurrency(item.product.price)}
                        </p>
                        {item.notes && (
                          <p className="text-gray-500 text-sm truncate">{item.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decrementItem(item.id)}
                          className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="w-8 text-center text-white font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementItem(item.id)}
                          className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  <div className="bg-gray-800 rounded-xl p-4 mt-6">
                    <div className="flex justify-between text-gray-400 mb-2">
                      <span>Subtotal ({getTotalItems()} itens)</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-white font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-[var(--theme-primary)]">{formatCurrency(subtotal)}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Tipo de Consumo */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-6">Como deseja consumir?</h2>

                  {/* Sprint 58: Aviso para produtos que exigem mesa */}
                  {hasTableOnlyProducts && (
                    <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl mb-4">
                      <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                      <p className="text-orange-400 text-sm">
                        Seu pedido contém narguilé. Este produto só pode ser consumido no local (mesa).
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4">
                    {availableConsumptionTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setConsumptionType(type.id)}
                        className={`p-6 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                          checkoutData.consumptionType === type.id
                            ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)] bg-opacity-10'
                            : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                        }`}
                      >
                        <div className={`p-3 rounded-lg ${
                          checkoutData.consumptionType === type.id
                            ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {getConsumptionIcon(type.icon)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{type.nome}</h3>
                          <p className="text-gray-400 text-sm">{type.descricao}</p>
                        </div>
                        {checkoutData.consumptionType === type.id && (
                          <Check className="w-6 h-6 text-[var(--theme-primary)] ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Selecao de Mesa */}
                  {checkoutData.consumptionType === 'table' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">Selecione sua mesa</h3>
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                        {MESAS_DISPONIVEIS.map((mesa) => (
                          <button
                            key={mesa}
                            onClick={() => setTableNumber(mesa)}
                            className={`p-3 rounded-lg font-semibold transition-all ${
                              checkoutData.tableNumber === mesa
                                ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                          >
                            {mesa}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Aviso de taxa */}
                  {checkoutData.consumptionType === 'table' && (
                    <div className="flex items-center gap-3 p-4 bg-[var(--theme-secondary)] bg-opacity-10 border border-[var(--theme-secondary)]/30 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-[var(--theme-secondary)] flex-shrink-0" />
                      <p className="text-[var(--theme-secondary)] text-sm">
                        Taxa de serviço de 10% será adicionada para consumo no local.
                      </p>
                    </div>
                  )}

                  {checkoutData.consumptionType === 'delivery' && (
                    <div className="flex items-center gap-3 p-4 bg-[var(--theme-primary)] bg-opacity-10 border border-[var(--theme-primary)]/30 rounded-xl">
                      <Truck className="w-5 h-5 text-[var(--theme-primary)] flex-shrink-0" />
                      <p className="text-[var(--theme-primary)] text-sm">
                        Taxa de entrega: {formatCurrency(8.00)}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Pagamento */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-6">Forma de pagamento</h2>

                  <div className="grid gap-4">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-6 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                          checkoutData.paymentMethod === method.id
                            ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)] bg-opacity-10'
                            : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                        }`}
                      >
                        <div className={`p-3 rounded-lg ${
                          checkoutData.paymentMethod === method.id
                            ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {getPaymentIcon(method.icon)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{method.nome}</h3>
                          <p className="text-gray-400 text-sm">{method.descricao}</p>
                        </div>
                        {checkoutData.paymentMethod === method.id && (
                          <Check className="w-6 h-6 text-[var(--theme-primary)] ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Troco para pagamento em dinheiro */}
                  {checkoutData.paymentMethod === 'cash' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-[var(--theme-primary)]" />
                          <span className="text-white font-medium">Precisa de troco?</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={needsChange}
                            onChange={(e) => {
                              setNeedsChange(e.target.checked);
                              if (!e.target.checked) setChangeFor('');
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--theme-primary)]"></div>
                        </label>
                      </div>

                      {needsChange && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-3"
                        >
                          <label className="block text-gray-400 text-sm mb-2">
                            Troco para quanto?
                          </label>
                          <input
                            type="number"
                            value={changeFor}
                            onChange={(e) => setChangeFor(e.target.value)}
                            placeholder="Ex: 50.00"
                            min={total}
                            step="0.01"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)] outline-none"
                          />
                          {changeFor && parseFloat(changeFor) > total && (
                            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                              <span className="text-green-400 text-sm">Troco:</span>
                              <span className="text-green-400 font-semibold">
                                {formatCurrency(parseFloat(changeFor) - total)}
                              </span>
                            </div>
                          )}
                          {changeFor && parseFloat(changeFor) < total && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="text-red-400 text-sm">
                                O valor deve ser maior ou igual ao total do pedido
                              </span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Observações */}
                  <div className="mt-6">
                    <label className="block text-white font-medium mb-2">
                      Observações (opcional)
                    </label>
                    <textarea
                      value={checkoutData.observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Ex: Sem cebola, ponto da carne, alergias..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-neutral-500 focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)] outline-none resize-none"
                      rows={3}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmacao */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-6">Confirme seu pedido</h2>

                  {/* Resumo dos itens */}
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">Itens do pedido</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-400">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="text-white">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detalhes do consumo */}
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">Detalhes</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tipo de consumo</span>
                        <span className="text-white">
                          {CONSUMPTION_TYPES.find(t => t.id === checkoutData.consumptionType)?.nome}
                        </span>
                      </div>
                      {checkoutData.consumptionType === 'table' && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Mesa</span>
                          <span className="text-white">#{checkoutData.tableNumber}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pagamento</span>
                        <span className="text-white">
                          {PAYMENT_METHODS.find(m => m.id === checkoutData.paymentMethod)?.nome}
                        </span>
                      </div>
                      {checkoutData.paymentMethod === 'cash' && needsChange && changeFor && (
                        <div className="flex justify-between items-center p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm">Troco para {formatCurrency(parseFloat(changeFor))}</span>
                          </div>
                          <span className="text-green-400 font-semibold text-sm">
                            Troco: {formatCurrency(parseFloat(changeFor) - total)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Totais */}
                  <div className="bg-gray-800 rounded-xl p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      {/* Sprint 42: Taxa de serviço com toggle */}
                      {checkoutData.consumptionType === 'table' && (
                        <div className="flex items-center justify-between text-gray-400">
                          <div className="flex items-center gap-2">
                            <span>Taxa de serviço (10%)</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={includeServiceFee}
                                onChange={toggleServiceFee}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--theme-primary)]"></div>
                            </label>
                          </div>
                          <span className={!includeServiceFee ? 'line-through text-gray-600' : ''}>
                            {formatCurrency(getServiceFee())}
                          </span>
                        </div>
                      )}
                      {taxaEntrega > 0 && (
                        <div className="flex justify-between text-gray-400">
                          <span>Taxa de entrega</span>
                          <span>{formatCurrency(taxaEntrega)}</span>
                        </div>
                      )}

                      {/* Sprint 56: Seção de Gorjeta */}
                      <div className="border-t border-gray-700 pt-3 mt-3">
                        <div className="flex items-center gap-2 mb-3">
                          <Heart className="w-5 h-5 text-pink-400" />
                          <span className="text-gray-300 font-medium">Adicionar gorjeta (opcional)</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          {[
                            { value: 'none', label: 'Nenhuma' },
                            { value: 5, label: '5%' },
                            { value: 10, label: '10%' },
                            { value: 15, label: '15%' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSelectedTip(option.value);
                                setCustomTip('');
                              }}
                              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                selectedTip === option.value
                                  ? 'bg-pink-500 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedTip('custom')}
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                              selectedTip === 'custom'
                                ? 'bg-pink-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Outro valor
                          </button>
                          {selectedTip === 'custom' && (
                            <div className="flex-1 flex items-center gap-2">
                              <span className="text-gray-400">R$</span>
                              <input
                                type="number"
                                value={customTip}
                                onChange={(e) => setCustomTip(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                              />
                            </div>
                          )}
                        </div>
                        {tipAmount > 0 && (
                          <div className="flex justify-between text-pink-400 mt-3">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              Gorjeta
                            </span>
                            <span>+{formatCurrency(tipAmount)}</span>
                          </div>
                        )}
                      </div>

                      {/* Seção de Cashback */}
                      {userCashbackBalance > 0 && (
                        <div className="border-t border-gray-700 pt-3 mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Coins className="w-5 h-5 text-yellow-400" />
                              <span className="text-gray-300">Usar Cashback</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={useCashback}
                                onChange={(e) => {
                                  setUseCashback(e.target.checked);
                                  if (!e.target.checked) setCashbackAmount(0);
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--theme-primary)]"></div>
                            </label>
                          </div>

                          {useCashback && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-2"
                            >
                              <div className="flex items-center justify-between text-sm text-gray-400">
                                <span>Saldo disponível:</span>
                                <span className="text-yellow-400 font-medium">{formatCurrency(userCashbackBalance)}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={maxCashbackToUse}
                                step="0.01"
                                value={cashbackAmount}
                                onChange={(e) => setCashbackAmount(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--theme-primary)]"
                              />
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Usando:</span>
                                <span className="text-green-400 font-semibold">-{formatCurrency(cashbackDiscount)}</span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {cashbackDiscount > 0 && (
                        <div className="flex justify-between text-green-400">
                          <span className="flex items-center gap-1">
                            <Gift className="w-4 h-4" />
                            Desconto Cashback
                          </span>
                          <span>-{formatCurrency(cashbackDiscount)}</span>
                        </div>
                      )}

                      <div className="border-t border-gray-700 pt-3 flex justify-between text-white font-semibold text-xl">
                        <span>Total</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {checkoutData.observacoes && (
                    <div className="bg-gray-800 rounded-xl p-6">
                      <h3 className="font-semibold text-white mb-2">Observações</h3>
                      <p className="text-gray-400">{checkoutData.observacoes}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Voltar
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="flex-1 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] hover:opacity-90 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Continuar
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleFinalizarPedido}
                  disabled={isProcessing || loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-[var(--theme-secondary)] hover:from-green-700 hover:to-[var(--theme-secondary)] disabled:from-neutral-600 disabled:to-neutral-600 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing || loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Confirmar Pedido
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
