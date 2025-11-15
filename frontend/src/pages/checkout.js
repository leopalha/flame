import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { formatCurrency, formatDuration } from '../utils/format';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import {
  CreditCard,
  Smartphone,
  DollarSign,
  Lock,
  ChevronRight,
  ChevronDown,
  User,
  MapPin,
  Clock,
  Check,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

export default function Checkout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const {
    items,
    tableNumber,
    notes,
    getTotalItems,
    getSubtotal,
    getTotal,
    getEstimatedTime,
    clearCart,
    validateCart,
    setTable
  } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState(''); // 'card', 'pix', 'cash'
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [showPixQR, setShowPixQR] = useState(false);
  const [selectedTable, setSelectedTable] = useState(tableNumber || null);
  const [showTableSelection, setShowTableSelection] = useState(!tableNumber);

  // Card form states
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para continuar');
      router.push('/login?returnTo=/checkout');
      return;
    }

    if (items.length === 0) {
      toast.error('Seu carrinho está vazio');
      router.push('/cardapio');
      return;
    }

    // Update selected table when tableNumber changes
    if (tableNumber) {
      setSelectedTable(tableNumber);
      setShowTableSelection(false);
    }
  }, [isAuthenticated, items, tableNumber, router]);

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

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'number') {
      // Format: 1234 5678 9012 3456
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      formattedValue = formattedValue.slice(0, 19);
    } else if (field === 'expiry') {
      // Format: MM/YY
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const generatePixCode = () => {
    // Mock PIX code generation
    const mockPixCode = '00020126580014BR.GOV.BCB.PIX0136' +
      Math.random().toString(36).substring(2, 15) +
      '5204000053039865802BR5913EXXQUEMA BAR6009Botafogo62070503***63041D3D';
    setPixCode(mockPixCode);
    return mockPixCode;
  };

  const handlePayment = async () => {
    // Validate table selection
    if (!tableNumber) {
      toast.error('Selecione uma mesa antes de continuar');
      setShowTableSelection(true);
      return;
    }

    if (!paymentMethod) {
      toast.error('Selecione uma forma de pagamento');
      return;
    }

    // Validate card data if card payment
    if (paymentMethod === 'card') {
      if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
        toast.error('Preencha todos os dados do cartão');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (paymentMethod === 'pix') {
        // Generate PIX code
        const code = generatePixCode();
        setShowPixQR(true);
        toast.success('QR Code PIX gerado!');

        // Simulate waiting for payment
        setTimeout(() => {
          completeOrder();
        }, 5000);
      } else {
        // Direct payment (card/cash)
        completeOrder();
      }
    } catch (error) {
      console.error('Erro no pagamento:', error);
      toast.error('Erro ao processar pagamento');
      setIsProcessing(false);
    }
  };

  const completeOrder = async () => {
    try {
      // Preparar dados do pedido
      const orderData = {
        tableId: tableNumber,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          notes: item.notes || '',
          price: item.preco
        })),
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'pix' ? 'pending' : 'paid',
        subtotal: subtotal,
        total: total
      };

      // Enviar pedido para o backend
      const response = await api.post('/orders', orderData);
      const createdOrder = response.data;

      toast.success('Pedido confirmado!');
      clearCart();

      // Redirecionar para acompanhamento do pedido
      router.push(`/pedido/${createdOrder.id}`);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast.error(error.response?.data?.message || 'Erro ao finalizar pedido');
      setIsProcessing(false);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast.success('Código PIX copiado!');
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Checkout | Exxquema</title>
        <meta name="description" content="Finalize seu pedido" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Finalizar Pedido</h1>
                <p className="text-gray-400">Revise e escolha a forma de pagamento</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Info */}
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-400" />
                    Seus Dados
                  </h2>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Nome:</strong> {user?.name || 'Usuário'}</p>
                    <p><strong>Email:</strong> {user?.email || 'email@exemplo.com'}</p>
                  </div>
                </div>

                {/* Table Info */}
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-400" />
                    Mesa
                  </h2>

                  {!showTableSelection && tableNumber ? (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300">
                        Mesa <strong className="text-orange-400">#{tableNumber}</strong>
                      </p>
                      <button
                        onClick={() => setShowTableSelection(true)}
                        className="text-orange-400 hover:text-red-300 text-sm"
                      >
                        Alterar
                      </button>
                    </div>
                  ) : (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        {!tableNumber && (
                          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                            <p className="text-yellow-400 text-sm">
                              Selecione sua mesa para continuar com o pedido
                            </p>
                          </div>
                        )}

                        {/* Table Grid */}
                        <div className="grid grid-cols-5 gap-2 mb-4">
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((tableNum) => (
                            <motion.button
                              key={tableNum}
                              onClick={() => handleTableSelect(tableNum)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`
                                relative aspect-square rounded-lg font-bold text-sm
                                transition-all duration-200
                                ${selectedTable === tableNum
                                  ? 'bg-orange-500 text-white shadow-lg shadow-red-600/50'
                                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                                }
                              `}
                            >
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <MapPin className={`w-3 h-3 mb-0.5 ${selectedTable === tableNum ? 'text-white' : 'text-gray-500'}`} />
                                <span>{tableNum}</span>
                              </div>

                              {selectedTable === tableNum && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                                >
                                  <Check className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>

                        {/* Confirm Button */}
                        <button
                          onClick={handleConfirmTable}
                          disabled={!selectedTable}
                          className={`
                            w-full py-3 px-4 rounded-lg font-semibold text-sm
                            transition-all flex items-center justify-center gap-2
                            ${selectedTable
                              ? 'bg-orange-500 hover:bg-orange-600 text-white'
                              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }
                          `}
                        >
                          <Check className="w-4 h-4" />
                          Confirmar Mesa {selectedTable ? `#${selectedTable}` : ''}
                        </button>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                {/* Order Details */}
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                  <button
                    onClick={() => setShowOrderDetails(!showOrderDetails)}
                    className="w-full flex items-center justify-between mb-4"
                  >
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      Itens do Pedido ({getTotalItems()})
                    </h2>
                    {showOrderDetails ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showOrderDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-800 last:border-0">
                            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
                              {item.product.image && (
                                <Image
                                  src={item.product.image}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-medium">{item.product.name}</h3>
                              <p className="text-gray-400 text-sm">{item.quantity}x {formatCurrency(item.product.price)}</p>
                              {item.notes && (
                                <p className="text-gray-500 text-xs mt-1">Obs: {item.notes}</p>
                              )}
                            </div>
                            <div className="text-white font-semibold">
                              {formatCurrency(item.product.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Forma de Pagamento</h2>

                  <div className="space-y-3">
                    {/* Card */}
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                        paymentMethod === 'card'
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        paymentMethod === 'card' ? 'bg-orange-500' : 'bg-gray-800'
                      }`}>
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-white font-semibold">Cartão de Crédito/Débito</p>
                        <p className="text-gray-400 text-sm">Pagamento instantâneo</p>
                      </div>
                      {paymentMethod === 'card' && (
                        <Check className="w-5 h-5 text-orange-400" />
                      )}
                    </button>

                    {/* PIX */}
                    <button
                      onClick={() => setPaymentMethod('pix')}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                        paymentMethod === 'pix'
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        paymentMethod === 'pix' ? 'bg-orange-500' : 'bg-gray-800'
                      }`}>
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-white font-semibold">PIX</p>
                        <p className="text-gray-400 text-sm">QR Code ou copia e cola</p>
                      </div>
                      {paymentMethod === 'pix' && (
                        <Check className="w-5 h-5 text-orange-400" />
                      )}
                    </button>

                    {/* Cash */}
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                        paymentMethod === 'cash'
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        paymentMethod === 'cash' ? 'bg-orange-500' : 'bg-gray-800'
                      }`}>
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-white font-semibold">Dinheiro</p>
                        <p className="text-gray-400 text-sm">Pagar na entrega</p>
                      </div>
                      {paymentMethod === 'cash' && (
                        <Check className="w-5 h-5 text-orange-400" />
                      )}
                    </button>
                  </div>

                  {/* Card Form */}
                  <AnimatePresence>
                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 space-y-4 overflow-hidden"
                      >
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Número do Cartão</label>
                          <input
                            type="text"
                            value={cardData.number}
                            onChange={(e) => handleCardInputChange('number', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Nome no Cartão</label>
                          <input
                            type="text"
                            value={cardData.name}
                            onChange={(e) => handleCardInputChange('name', e.target.value.toUpperCase())}
                            placeholder="NOME SOBRENOME"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Validade</label>
                            <input
                              type="text"
                              value={cardData.expiry}
                              onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                              placeholder="MM/AA"
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">CVV</label>
                            <input
                              type="text"
                              value={cardData.cvv}
                              onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                              placeholder="123"
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* PIX QR Code */}
                  <AnimatePresence>
                    {showPixQR && paymentMethod === 'pix' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 overflow-hidden"
                      >
                        <div className="bg-white p-6 rounded-lg text-center">
                          <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                            <p className="text-gray-600 text-sm">QR Code PIX</p>
                          </div>
                          <div className="bg-gray-100 p-3 rounded mb-3">
                            <p className="text-xs text-gray-600 break-all font-mono">{pixCode}</p>
                          </div>
                          <button
                            onClick={copyPixCode}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Copiar Código
                          </button>
                          <p className="text-gray-600 text-sm mt-3">Aguardando pagamento...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 sticky top-24">
                  <h3 className="text-xl font-semibold text-white mb-6">Resumo</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal ({getTotalItems()} itens)</span>
                      <span>{formatCurrency(getSubtotal())}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Tempo estimado: {formatDuration(getEstimatedTime())}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">Total</span>
                      <span className="text-2xl font-bold text-orange-400">
                        {formatCurrency(getTotal())}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={!paymentMethod || isProcessing || showPixQR}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <LoadingSpinner size="small" color="white" />
                        Processando...
                      </>
                    ) : showPixQR ? (
                      'Aguardando Pagamento PIX...'
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Confirmar Pedido
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Pagamento seguro e criptografado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
