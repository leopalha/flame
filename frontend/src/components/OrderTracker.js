/**
 * Sprint 57: Order Tracker - Janela flutuante estilo iFood/Uber
 * Mostra o status do pedido em tempo real para o cliente
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Clock,
  CheckCircle,
  ChefHat,
  Package,
  Truck,
  X,
  ChevronUp,
  ChevronDown,
  MessageCircle
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import useOrderStore from '../stores/orderStore';
import socketService from '../services/socket';
import { toast } from 'react-hot-toast';

// Status flow para o tracker
const STATUS_STEPS = [
  { key: 'pending', label: 'Recebido', icon: Clock, color: '#f59e0b' },
  { key: 'pending_payment', label: 'Aguardando', icon: Clock, color: '#f59e0b' },
  { key: 'confirmed', label: 'Confirmado', icon: CheckCircle, color: '#3b82f6' },
  { key: 'preparing', label: 'Preparando', icon: ChefHat, color: '#f59e0b' },
  { key: 'ready', label: 'Pronto', icon: Package, color: '#10b981' },
  { key: 'on_way', label: 'A caminho', icon: Truck, color: '#8b5cf6' },
  { key: 'delivered', label: 'Entregue', icon: CheckCircle, color: '#10b981' }
];

export default function OrderTracker() {
  const { user, isAuthenticated } = useAuthStore();
  const { orders, getActiveOrders, updateOrderStatus, fetchOrders } = useOrderStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Polling para buscar pedidos da API periodicamente
  useEffect(() => {
    if (!isAuthenticated) return;

    // Buscar pedidos imediatamente e depois a cada 20 segundos
    fetchOrders();
    const fetchInterval = setInterval(() => {
      fetchOrders();
    }, 20000);

    return () => clearInterval(fetchInterval);
  }, [isAuthenticated, fetchOrders]);

  // Obter token do localStorage
  const getAuthToken = useCallback(() => {
    try {
      const stored = localStorage.getItem('flame-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed?.state?.token || null;
      }
    } catch (e) {
      return null;
    }
    return null;
  }, []);

  // Buscar pedido ativo mais recente
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateCurrentOrder = () => {
      const activeOrders = getActiveOrders();
      if (activeOrders.length > 0) {
        // Pegar o pedido mais recente que nao esta entregue/cancelado
        const mostRecent = activeOrders
          .filter(o => !['delivered', 'cancelled'].includes(o.status))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        if (mostRecent) {
          setCurrentOrder(prev => {
            // Só atualiza se o status mudou para evitar re-renders desnecessários
            if (!prev || prev.status !== mostRecent.status || prev.id !== mostRecent.id) {
              return mostRecent;
            }
            return prev;
          });
          setIsDismissed(false);
        }
      }
    };

    updateCurrentOrder();

    // Polling como fallback - verifica a cada 15 segundos
    const pollingInterval = setInterval(updateCurrentOrder, 15000);

    return () => clearInterval(pollingInterval);
  }, [orders, isAuthenticated, getActiveOrders]);

  // Conectar ao Socket.IO e escutar atualizacoes
  useEffect(() => {
    const token = getAuthToken();
    if (!token || !currentOrder) return;

    // Conectar socket se nao estiver conectado
    if (!socketService.isConnected) {
      socketService.connect(token);
    }

    // Listener para atualizacao de status
    const handleStatusUpdate = (data) => {
      console.log('📡 [TRACKER] Status atualizado:', data);

      if (data.orderId === currentOrder.id || data.orderId === currentOrder.orderId) {
        // Atualizar pedido no store
        updateOrderStatus(data.orderId, data.status);

        // Atualizar estado local
        setCurrentOrder(prev => prev ? { ...prev, status: data.status } : null);

        // Mostrar toast com o novo status
        const step = STATUS_STEPS.find(s => s.key === data.status);
        if (step) {
          const orderId = currentOrder.orderNumber || (typeof currentOrder.id === 'string' ? currentOrder.id.slice(-6) : currentOrder.id);
          toast.success(`Pedido #${orderId}: ${step.label}!`, {
            icon: getStatusEmoji(data.status),
            duration: 4000
          });
        }

        // Se entregue, minimizar apos 5 segundos
        if (data.status === 'delivered') {
          setTimeout(() => setIsDismissed(true), 5000);
        }
      }
    };

    // Listener para pedido pronto
    const handleOrderReady = (data) => {
      console.log('🔔 [TRACKER] Pedido pronto:', data);
      if (data.orderId === currentOrder.id || data.orderId === currentOrder.orderId) {
        toast.success('Seu pedido esta PRONTO para retirada!', {
          icon: '🎉',
          duration: 8000
        });
      }
    };

    socketService.on('order_status_updated', handleStatusUpdate);
    socketService.on('order_ready', handleOrderReady);

    return () => {
      socketService.off('order_status_updated', handleStatusUpdate);
      socketService.off('order_ready', handleOrderReady);
    };
  }, [currentOrder, getAuthToken, updateOrderStatus]);

  // Helper para emoji do status
  const getStatusEmoji = (status) => {
    const emojis = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '👨‍🍳',
      ready: '🎉',
      on_way: '🚶',
      delivered: '✨'
    };
    return emojis[status] || '📋';
  };

  // Calcular progresso
  const getProgress = () => {
    if (!currentOrder) return 0;
    const index = STATUS_STEPS.findIndex(s => s.key === currentOrder.status);
    return ((index + 1) / STATUS_STEPS.length) * 100;
  };

  // Nao mostrar se nao autenticado, sem pedido ou dismissado
  if (!isAuthenticated || !currentOrder || isDismissed) {
    return null;
  }

  const currentStep = STATUS_STEPS.find(s => s.key === currentOrder.status);
  const CurrentIcon = currentStep?.icon || Clock;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto"
      >
        <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header - sempre visivel */}
          <div
            className="px-4 py-3 flex items-center justify-between cursor-pointer"
            onClick={() => setIsMinimized(!isMinimized)}
            style={{ background: `${currentStep?.color}20` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: currentStep?.color }}
              >
                <CurrentIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  Pedido #{currentOrder.orderNumber || (typeof currentOrder.id === 'string' ? currentOrder.id.slice(-6) : currentOrder.id)}
                </p>
                <p className="text-xs" style={{ color: currentStep?.color }}>
                  {currentStep?.label}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                {isMinimized ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDismissed(true);
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Conteudo expandido */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Progress bar */}
                <div className="px-4 py-2">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: currentStep?.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgress()}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Timeline de status */}
                <div className="px-4 py-3">
                  <div className="flex justify-between items-center">
                    {STATUS_STEPS.filter(s => s.key !== 'confirmed').map((step, index) => {
                      const stepIndex = STATUS_STEPS.findIndex(s => s.key === currentOrder.status);
                      const thisIndex = STATUS_STEPS.findIndex(s => s.key === step.key);
                      const isCompleted = thisIndex <= stepIndex;
                      const isCurrent = step.key === currentOrder.status;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isCurrent ? 'scale-110 ring-2 ring-offset-2 ring-offset-gray-900' : ''
                            }`}
                            style={{
                              background: isCompleted ? step.color : '#374151',
                              ringColor: isCurrent ? step.color : 'transparent'
                            }}
                          >
                            <StepIcon className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-gray-500'}`} />
                          </div>
                          <span className={`text-[10px] mt-1 ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Acoes */}
                <div className="px-4 pb-4 flex gap-2">
                  <Link
                    href={`/pedido/${currentOrder.id}`}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors"
                  >
                    Ver detalhes
                  </Link>
                  <Link
                    href="/pedidos"
                    className="flex-1 text-white py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors"
                    style={{ background: 'var(--theme-primary)' }}
                  >
                    Meus pedidos
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
