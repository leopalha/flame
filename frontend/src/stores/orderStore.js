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

// Mock de pedidos
const mockOrders = [
  {
    id: 'ORD-001',
    userId: '6',
    items: [
      { productId: '1', nome: 'Bruschetta Tradicional', quantidade: 2, precoUnitario: 32.00 },
      { productId: '5', nome: 'Cerveja Artesanal IPA', quantidade: 2, precoUnitario: 18.00 }
    ],
    subtotal: 100.00,
    taxaServico: 10.00,
    taxaEntrega: 0,
    total: 110.00,
    status: ORDER_STATUS.DELIVERED,
    consumptionType: 'table',
    tableNumber: 5,
    paymentMethod: 'credit',
    paymentStatus: 'pago',
    observacoes: '',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString()
  },
  {
    id: 'ORD-002',
    userId: '6',
    items: [
      { productId: '15', nome: 'Picanha na Brasa', quantidade: 1, precoUnitario: 89.00 },
      { productId: '20', nome: 'Caipirinha Tradicional', quantidade: 2, precoUnitario: 22.00 }
    ],
    subtotal: 133.00,
    taxaServico: 13.30,
    taxaEntrega: 0,
    total: 146.30,
    status: ORDER_STATUS.DELIVERED,
    consumptionType: 'table',
    tableNumber: 12,
    paymentMethod: 'pix',
    paymentStatus: 'pago',
    observacoes: 'Carne ao ponto',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString()
  }
];

export const useOrderStore = create(
  persist(
    (set, get) => ({
      // Estado
      orders: mockOrders,
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
        return get().orders.find(o => o.id === id);
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
      createOrder: async (cartItems, cartTotal, userId, userName, useCashback = 0) => {
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
            useCashback: useCashback || 0
          });

          const response = await api.post('/orders', {
            tableId,
            items,
            notes: checkoutData.observacoes || null,
            paymentMethod: paymentMethodMap[checkoutData.paymentMethod] || checkoutData.paymentMethod,
            useCashback: useCashback || 0 // Cashback a ser usado como desconto
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

      // Cancelar pedido
      cancelOrder: async (orderId) => {
        set({ loading: true });

        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          const order = get().getOrderById(orderId);

          if (!order) {
            toast.error('Pedido nao encontrado');
            return { success: false };
          }

          if ([ORDER_STATUS.READY, ORDER_STATUS.DELIVERED].includes(order.status)) {
            toast.error('Este pedido nao pode mais ser cancelado');
            return { success: false };
          }

          set(state => ({
            orders: state.orders.map(o =>
              o.id === orderId
                ? { ...o, status: ORDER_STATUS.CANCELLED, cancelledAt: new Date().toISOString() }
                : o
            )
          }));

          toast.success('Pedido cancelado');
          return { success: true };
        } catch (error) {
          toast.error('Erro ao cancelar pedido');
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
