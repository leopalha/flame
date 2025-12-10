import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { safeLocalStorage } from '../utils/storage';

// Taxa de serviço padrão (10%)
const SERVICE_FEE_RATE = 0.10;

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      tableId: null,
      tableNumber: null,
      notes: '',
      isLoading: false,
      includeServiceFee: true, // Sprint 42: Taxa de serviço incluída por padrão

      // Computed values
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.discount > 0
            ? item.product.price * (1 - item.product.discount / 100)
            : item.product.price;
          return total + (price * item.quantity);
        }, 0);
      },

      // Sprint 42: Taxa de serviço (10%)
      getServiceFee: () => {
        if (!get().includeServiceFee) return 0;
        return get().getSubtotal() * SERVICE_FEE_RATE;
      },

      // Sprint 42: Toggle taxa de serviço
      toggleServiceFee: () => {
        set({ includeServiceFee: !get().includeServiceFee });
      },

      setIncludeServiceFee: (include) => {
        set({ includeServiceFee: include });
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const serviceFee = get().getServiceFee();
        return subtotal + serviceFee;
      },

      // Actions
      addItem: (product, quantity = 1, notes = '') => {
        const items = get().items;
        const existingItemIndex = items.findIndex(item => item.product.id === product.id);

        if (existingItemIndex >= 0) {
          // Item já existe, atualizar quantidade
          const updatedItems = [...items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
            notes: notes || updatedItems[existingItemIndex].notes,
          };
          set({ items: updatedItems });
        } else {
          // Novo item
          const newItem = {
            id: `${product.id}-${Date.now()}`, // ID único para o item no carrinho
            product,
            quantity,
            notes,
            addedAt: new Date(),
          };
          set({ items: [...items, newItem] });
        }
      },

      updateItemQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const items = get().items;
        const updatedItems = items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },

      updateItemNotes: (itemId, notes) => {
        const items = get().items;
        const updatedItems = items.map(item =>
          item.id === itemId ? { ...item, notes } : item
        );
        set({ items: updatedItems });
      },

      removeItem: (itemId) => {
        const items = get().items;
        const updatedItems = items.filter(item => item.id !== itemId);
        set({ items: updatedItems });
        toast.success('Item removido do carrinho');
      },

      clearCart: () => {
        set({
          items: [],
          tableId: null,
          tableNumber: null,
          notes: '',
          includeServiceFee: true, // Reset to default
        });
      },

      setTable: (tableId, tableNumber) => {
        set({ tableId, tableNumber });
      },

      setNotes: (notes) => {
        set({ notes });
      },

      // Increment item quantity
      incrementItem: (itemId) => {
        const items = get().items;
        const item = items.find(item => item.id === itemId);
        if (item) {
          const newQuantity = item.quantity + 1;
          
          // Check stock if product has stock control
          if (item.product.hasStock && newQuantity > item.product.stock) {
            toast.error(`Estoque insuficiente. Máximo: ${item.product.stock}`);
            return;
          }
          
          get().updateItemQuantity(itemId, newQuantity);
        }
      },

      // Decrement item quantity
      decrementItem: (itemId) => {
        const items = get().items;
        const item = items.find(item => item.id === itemId);
        if (item) {
          const newQuantity = Math.max(0, item.quantity - 1);
          get().updateItemQuantity(itemId, newQuantity);
        }
      },

      // Get cart summary for checkout
      getCartSummary: () => {
        const items = get().items;
        const subtotal = get().getSubtotal();
        const serviceFee = get().getServiceFee();
        const total = get().getTotal();
        const totalItems = get().getTotalItems();

        return {
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            notes: item.notes,
            unitPrice: item.product.discount > 0
              ? item.product.price * (1 - item.product.discount / 100)
              : item.product.price,
          })),
          subtotal,
          serviceFee,
          includeServiceFee: get().includeServiceFee,
          total,
          totalItems,
          tableId: get().tableId,
          notes: get().notes,
        };
      },

      // Validate cart before checkout
      validateCart: () => {
        const { items, tableId } = get();
        const errors = [];

        if (items.length === 0) {
          errors.push('Carrinho está vazio');
        }

        if (!tableId) {
          errors.push('Selecione uma mesa');
        }

        // Check product availability and stock
        items.forEach(item => {
          if (!item.product.isActive) {
            errors.push(`${item.product.name} não está mais disponível`);
          }

          if (item.product.hasStock && item.quantity > item.product.stock) {
            errors.push(`Estoque insuficiente para ${item.product.name}. Disponível: ${item.product.stock}`);
          }
        });

        // Pedido mínimo removido - Sprint 62
        // const minimumOrderValue = 15.00;
        // const total = get().getTotal();
        // if (total < minimumOrderValue) {
        //   errors.push(`Valor mínimo do pedido: R$ ${minimumOrderValue.toFixed(2)}`);
        // }

        return {
          isValid: errors.length === 0,
          errors,
        };
      },

      // Apply coupon/discount
      applyCoupon: async (couponCode) => {
        set({ isLoading: true });
        try {
          // Implementar lógica de cupom se necessário
          toast.success('Cupom aplicado com sucesso!');
          return { success: true };
        } catch (error) {
          toast.error('Cupom inválido ou expirado');
          return { success: false, error: 'Cupom inválido' };
        } finally {
          set({ isLoading: false });
        }
      },

      // Save cart for later (for authenticated users)
      saveCart: async () => {
        try {
          const cartData = {
            items: get().items,
            tableId: get().tableId,
            tableNumber: get().tableNumber,
            notes: get().notes,
            savedAt: new Date(),
          };

          safeLocalStorage.setItem('redlight-saved-cart', JSON.stringify(cartData));
          toast.success('Carrinho salvo!');
          return { success: true };
        } catch (error) {
          toast.error('Erro ao salvar carrinho');
          return { success: false, error: 'Erro ao salvar' };
        }
      },

      // Load saved cart
      loadSavedCart: () => {
        try {
          const savedCart = safeLocalStorage.getItem('redlight-saved-cart');
          if (savedCart) {
            const cartData = JSON.parse(savedCart);

            // Check if saved cart is not too old (e.g., 24 hours)
            const savedAt = new Date(cartData.savedAt);
            const now = new Date();
            const hoursDiff = (now - savedAt) / (1000 * 60 * 60);

            if (hoursDiff < 24) {
              set({
                items: cartData.items || [],
                tableId: cartData.tableId,
                tableNumber: cartData.tableNumber,
                notes: cartData.notes || '',
              });

              safeLocalStorage.removeItem('redlight-saved-cart');
              toast.success('Carrinho restaurado!');
              return { success: true };
            }
          }

          return { success: false, error: 'Nenhum carrinho salvo encontrado' };
        } catch (error) {
          return { success: false, error: 'Erro ao carregar carrinho' };
        }
      },

      // Quick add multiple items (for combos or suggestions)
      addMultipleItems: (products) => {
        products.forEach(({ product, quantity, notes }) => {
          get().addItem(product, quantity, notes);
        });
        
        if (products.length > 1) {
          toast.success(`${products.length} itens adicionados ao carrinho!`);
        }
      },

      // Get recommendations based on current cart
      getRecommendations: () => {
        // Logic to recommend products based on current cart items
        // This could be implemented with API call to get smart recommendations
        return [];
      },

      // Calculate estimated preparation time
      getEstimatedTime: () => {
        const items = get().items;
        if (items.length === 0) return 0;

        // Get maximum preparation time from all items
        const maxTime = Math.max(
          ...items.map(item => item.product.preparationTime || 15)
        );

        // Add extra time based on quantity and complexity
        const totalItems = get().getTotalItems();
        const extraTime = Math.ceil(totalItems / 3) * 2; // 2 minutes per 3 items

        return maxTime + extraTime;
      },
    }),
    {
      name: 'flame-cart',
      partialize: (state) => ({
        items: state.items,
        tableId: state.tableId,
        tableNumber: state.tableNumber,
        notes: state.notes,
        includeServiceFee: state.includeServiceFee,
      }),
    }
  )
);

export { useCartStore };