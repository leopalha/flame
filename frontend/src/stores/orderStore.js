import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';

// Status dos pedidos (valores em inglês para match com backend)
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  ON_WAY: 'on_way',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Labels em português para exibição
export const ORDER_STATUS_LABELS = {
  pending: 'Aguardando',
  confirmed: 'Confirmado',
  preparing: 'Em Preparo',
  ready: 'Pronto',
  on_way: 'Saiu para Entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado'
};

// Formas de pagamento
// Sprint 43: Adicionada opcao "Pagar com Atendente"
export const PAYMENT_METHODS = [
  { id: 'pix', nome: 'PIX', icon: 'qr-code', descricao: 'Pagamento instantaneo' },
  { id: 'credit', nome: 'Cartao de Credito', icon: 'credit-card', descricao: 'Ate 12x sem juros' },
  { id: 'debit', nome: 'Cartao de Debito', icon: 'credit-card', descricao: 'Debito na hora' },
  { id: 'cash', nome: 'Dinheiro', icon: 'banknotes', descricao: 'Pagamento na entrega' },
  { id: 'pay_later', nome: 'Pagar com Atendente', icon: 'user', descricao: 'Solicite a conta ao atendente' }
];

// Tipos de consumo
export const CONSUMPTION_TYPES = [
  { id: 'table', nome: 'Consumir no Local', icon: 'utensils', descricao: 'Escolha sua mesa' },
  { id: 'pickup', nome: 'Retirar no Balcao', icon: 'shopping-bag', descricao: 'Retire quando pronto' },
  { id: 'delivery', nome: 'Delivery', icon: 'truck', descricao: 'Receba em casa' }
];

// Pedidos iniciais vazios - dados reais vem da API

export const useOrderStore = create(
  persist(
    (set, get) => ({
      // Estado
      orders: [],
      currentOrder: null,
      loading: false,

      // Checkout state
      checkoutData: {
        consumptionType: null,
        tableNumber: null,
        paymentMethod: null,
        address: null,
        observacoes: ''
      },

      // Getters
      getActiveOrders: () => {
        return get().orders
          .filter(o => ![ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(o.status))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },

      getOrderHistory: () => {
        return get().orders
          .filter(o => [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(o.status))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },

      getOrderById: (id) => {
        return get().orders.find(o => o.id === id || o.orderId === id);
      },

      // Buscar pedidos da API
      fetchOrders: async () => {
        set({ loading: true });
        try {
          const response = await api.get('/orders/my-orders');
          if (response.data.success) {
            const apiOrders = response.data.data.orders || [];

            // Formatar pedidos da API para o formato local
            const formattedOrders = apiOrders.map(order => ({
              id: order.orderNumber || order.id,
              orderId: order.id,
              userId: order.userId,
              items: order.items?.map(item => ({
                productId: item.productId,
                nome: item.productName || item.product?.name,
                quantidade: item.quantity,
                precoUnitario: parseFloat(item.unitPrice),
                observacoes: item.notes
              })) || [],
              subtotal: parseFloat(order.subtotal || 0),
              taxaServico: parseFloat(order.serviceFee || 0),
              taxaEntrega: 0,
              total: parseFloat(order.total),
              status: order.status || ORDER_STATUS.PENDING,
              consumptionType: order.tableId ? 'table' : 'pickup',
              tableNumber: order.table?.number || null,
              paymentMethod: order.paymentMethod,
              paymentStatus: order.paymentStatus || 'pendente',
              observacoes: order.notes,
              createdAt: order.createdAt,
              estimatedTime: order.estimatedTime || 25
            }));

            set({ orders: formattedOrders });
            return { success: true, orders: formattedOrders };
          }
          return { success: false };
        } catch (error) {
          console.error('Erro ao buscar pedidos:', error);
          return { success: false, error: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Checkout actions
      setConsumptionType: (type) => {
        set(state => ({
          checkoutData: { ...state.checkoutData, consumptionType: type }
        }));
      },

      setTableNumber: (number) => {
        set(state => ({
          checkoutData: { ...state.checkoutData, tableNumber: number }
        }));
      },

      setPaymentMethod: (method) => {
        set(state => ({
          checkoutData: { ...state.checkoutData, paymentMethod: method }
        }));
      },

      setDeliveryAddress: (address) => {
        set(state => ({
          checkoutData: { ...state.checkoutData, address }
        }));
      },

      setObservacoes: (observacoes) => {
        set(state => ({
          checkoutData: { ...state.checkoutData, observacoes }
        }));
      },

      resetCheckout: () => {
        set({
          checkoutData: {
            consumptionType: null,
            tableNumber: null,
            paymentMethod: null,
            address: null,
            observacoes: ''
          }
        });
      },

      // Criar pedido - Envia para API real
      createOrder: async (cartItems, cartTotal, userId, userName, useCashback = 0, tipAmount = 0) => {
        set({ loading: true });

        try {
          const { checkoutData } = get();

          // Validacoes locais
          if (!checkoutData.consumptionType) {
            toast.error('Selecione o tipo de consumo');
            return { success: false, error: 'Tipo de consumo nao selecionado' };
          }

          if (checkoutData.consumptionType === 'table' && !checkoutData.tableNumber) {
            toast.error('Selecione o numero da mesa');
            return { success: false, error: 'Mesa nao selecionada' };
          }

          if (!checkoutData.paymentMethod) {
            toast.error('Selecione a forma de pagamento');
            return { success: false, error: 'Forma de pagamento nao selecionada' };
          }

          // Se for mesa, buscar o tableId (UUID) pelo numero da mesa
          let tableId = null;
          if (checkoutData.consumptionType === 'table' && checkoutData.tableNumber) {
            try {
              const tableResponse = await api.get(`/tables/number/${checkoutData.tableNumber}`);
              if (tableResponse.data.success && tableResponse.data.data?.table?.id) {
                tableId = tableResponse.data.data.table.id;
              } else {
                toast.error('Mesa nao encontrada');
                return { success: false, error: 'Mesa nao encontrada' };
              }
            } catch (tableError) {
              console.error('Erro ao buscar mesa:', tableError);
              toast.error('Mesa nao encontrada ou indisponivel');
              return { success: false, error: 'Mesa nao encontrada' };
            }
          }

          // Preparar itens para a API
          const items = cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            notes: item.notes || null
          }));

          // Mapear metodo de pagamento para formato backend
          // Sprint 43: Adicionado pay_later
          const paymentMethodMap = {
            'pix': 'pix',
            'credit': 'credit_card',
            'debit': 'debit_card',
            'cash': 'cash',
            'pay_later': 'pay_later' // Pagar com atendente
          };

          // Criar pedido via API
          console.log('📦 Enviando pedido para API:', {
            tableId,
            items,
            notes: checkoutData.observacoes,
            paymentMethod: paymentMethodMap[checkoutData.paymentMethod] || checkoutData.paymentMethod,
            useCashback: useCashback || 0,
            tip: tipAmount || 0
          });

          const response = await api.post('/orders', {
            tableId,
            items,
            notes: checkoutData.observacoes || null,
            paymentMethod: paymentMethodMap[checkoutData.paymentMethod] || checkoutData.paymentMethod,
            useCashback: useCashback || 0, // Cashback a ser usado como desconto
            tip: tipAmount || 0 // Gorjeta opcional
          });

          console.log('📥 Resposta do servidor:', response.data);

          if (response.data.success) {
            const order = response.data.data.order;

            // Formatar pedido para o estado local
            const formattedOrder = {
              id: order.orderNumber || order.id,
              orderId: order.id,
              userId,
              userName,
              items: order.items?.map(item => ({
                productId: item.productId,
                nome: item.productName || item.product?.name,
                quantidade: item.quantity,
                precoUnitario: parseFloat(item.unitPrice),
                observacoes: item.notes
              })) || [],
              subtotal: parseFloat(order.subtotal),
              taxaServico: parseFloat(order.serviceFee || 0),
              taxaEntrega: 0,
              total: parseFloat(order.total),
              status: order.status || ORDER_STATUS.PENDING,
              consumptionType: checkoutData.consumptionType,
              tableNumber: checkoutData.tableNumber,
              paymentMethod: checkoutData.paymentMethod,
              paymentStatus: order.paymentStatus || 'pendente',
              address: checkoutData.address,
              observacoes: checkoutData.observacoes,
              createdAt: order.createdAt,
              estimatedTime: order.estimatedTime || 25
            };

            set(state => ({
              orders: [formattedOrder, ...state.orders],
              currentOrder: formattedOrder
            }));

            toast.success(`Pedido #${formattedOrder.id} realizado com sucesso!`);
            return { success: true, order: formattedOrder };
          } else {
            toast.error(response.data.message || 'Erro ao criar pedido');
            return { success: false, error: response.data.message };
          }
        } catch (error) {
          console.error('❌ Erro ao criar pedido:', error);
          const message = error.response?.data?.message || 'Erro ao criar pedido';
          toast.error(message);
          return { success: false, error: message };
        } finally {
          set({ loading: false });
        }
      },

      // Atualizar status do pedido
      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  ...(status === ORDER_STATUS.DELIVERED ? { completedAt: new Date().toISOString() } : {})
                }
              : o
          )
        }));

        const statusMessages = {
          [ORDER_STATUS.CONFIRMED]: 'Pedido confirmado!',
          [ORDER_STATUS.PREPARING]: 'Seu pedido esta sendo preparado!',
          [ORDER_STATUS.READY]: 'Seu pedido esta pronto!',
          [ORDER_STATUS.ON_WAY]: 'Seu pedido saiu para entrega!',
          [ORDER_STATUS.DELIVERED]: 'Pedido entregue! Obrigado pela preferencia!'
        };

        if (statusMessages[status]) {
          toast.success(statusMessages[status]);
        }
      },

      // Cancelar pedido - Chama API real
      cancelOrder: async (orderId) => {
        set({ loading: true });

        try {
          // Buscar o pedido local para pegar o ID real (UUID)
          const order = get().getOrderById(orderId);

          if (!order) {
            toast.error('Pedido nao encontrado');
            return { success: false };
          }

          // Verificar localmente se pode cancelar
          if ([ORDER_STATUS.READY, ORDER_STATUS.DELIVERED].includes(order.status)) {
            toast.error('Este pedido nao pode mais ser cancelado');
            return { success: false };
          }

          // Usar o orderId (UUID) se disponivel, senao usar o id do pedido
          const realOrderId = order.orderId || orderId;

          console.log('🚫 Cancelando pedido:', realOrderId);

          // Chamar API real para cancelar
          const response = await api.patch(`/orders/${realOrderId}/cancel`);

          console.log('📥 Resposta do cancelamento:', response.data);

          if (response.data.success) {
            // Atualizar estado local
            set(state => ({
              orders: state.orders.map(o =>
                (o.id === orderId || o.orderId === realOrderId)
                  ? { ...o, status: ORDER_STATUS.CANCELLED, cancelledAt: new Date().toISOString() }
                  : o
              )
            }));

            // Mostrar mensagem apropriada (com ou sem estorno)
            const message = response.data.message || 'Pedido cancelado com sucesso';
            toast.success(message, { duration: 5000 });

            // Se houve estorno, mostrar info adicional
            if (response.data.data?.refund) {
              const refund = response.data.data.refund;
              toast(`Estorno de R$${refund.amount.toFixed(2)} sera creditado em ${refund.estimatedDays}`, {
                icon: '💳',
                duration: 8000
              });
            }

            return { success: true, refund: response.data.data?.refund };
          } else {
            toast.error(response.data.message || 'Erro ao cancelar pedido');
            return { success: false };
          }
        } catch (error) {
          console.error('❌ Erro ao cancelar pedido:', error);
          const message = error.response?.data?.message || 'Erro ao cancelar pedido';
          toast.error(message);
          return { success: false };
        } finally {
          set({ loading: false });
        }
      },

      // Repetir pedido
      repeatOrder: (orderId) => {
        const order = get().getOrderById(orderId);
        if (order) {
          return order.items;
        }
        return [];
      },

      // Limpar pedidos (para testes)
      clearOrders: () => {
        set({ orders: [], currentOrder: null });
      }
    }),
    {
      name: 'flame-orders-storage',
      partialize: (state) => ({
        orders: state.orders,
        checkoutData: state.checkoutData
      })
    }
  )
);

export default useOrderStore;
