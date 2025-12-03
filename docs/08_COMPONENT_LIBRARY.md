# 📦 FLAME - COMPONENT LIBRARY

## ÍNDICE

1. [Common Components](#1-common-components)
2. [Layout Components](#2-layout-components)
3. [Customer Components](#3-customer-components)
4. [Staff Components](#4-staff-components)
5. [Admin Components](#5-admin-components)
6. [Hooks](#6-hooks)
7. [Stores](#7-stores)

---

## 1. COMMON COMPONENTS

### Button

```jsx
// components/common/Button.js

/**
 * Botão reutilizável com variantes FLAME
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} loading - Estado de loading
 * @param {boolean} disabled - Desabilitado
 * @param {boolean} fullWidth - Largura total
 * @param {ReactNode} leftIcon - Ícone à esquerda
 * @param {ReactNode} rightIcon - Ícone à direita
 * @param {function} onClick - Handler de click
 * @param {ReactNode} children - Conteúdo
 */

// Uso:
<Button variant="primary" size="lg" loading={isSubmitting}>
  Confirmar Pedido
</Button>

<Button variant="secondary" leftIcon={<PlusIcon />}>
  Adicionar Item
</Button>

<Button variant="ghost" size="sm">
  Cancelar
</Button>
```

**Estilos por Variante:**

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| primary | gradient magenta→cyan | white | none |
| secondary | transparent | magenta | magenta 2px |
| ghost | transparent | white/80 | none |
| danger | error-500 | white | none |

---

### Input

```jsx
// components/common/Input.js

/**
 * Input de formulário
 * 
 * @param {string} type - 'text' | 'email' | 'password' | 'tel' | 'number'
 * @param {string} label - Label do campo
 * @param {string} placeholder - Placeholder
 * @param {string} error - Mensagem de erro
 * @param {string} hint - Texto de ajuda
 * @param {boolean} disabled - Desabilitado
 * @param {ReactNode} leftIcon - Ícone à esquerda
 * @param {ReactNode} rightIcon - Ícone à direita
 * @param {string} value - Valor controlado
 * @param {function} onChange - Handler de mudança
 */

// Uso:
<Input
  label="Celular"
  type="tel"
  placeholder="(21) 99999-9999"
  leftIcon={<PhoneIcon />}
  error={errors.phone?.message}
/>

<Input
  label="Senha"
  type="password"
  rightIcon={<EyeIcon />}
/>
```

---

### Card

```jsx
// components/common/Card.js

/**
 * Card container
 * 
 * @param {string} variant - 'default' | 'elevated' | 'gradient' | 'outline'
 * @param {boolean} hoverable - Efeito hover
 * @param {boolean} clickable - Cursor pointer + efeitos
 * @param {string} padding - 'none' | 'sm' | 'md' | 'lg'
 * @param {function} onClick - Handler de click
 * @param {ReactNode} children - Conteúdo
 */

// Uso:
<Card variant="elevated" hoverable padding="lg">
  <h3>Título</h3>
  <p>Conteúdo do card</p>
</Card>

<Card variant="gradient" clickable onClick={handleClick}>
  ...
</Card>
```

---

### Modal

```jsx
// components/common/Modal.js

/**
 * Modal/Dialog
 * 
 * @param {boolean} isOpen - Estado de abertura
 * @param {function} onClose - Handler de fechamento
 * @param {string} title - Título do modal
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @param {boolean} closeOnOverlay - Fecha ao clicar no overlay
 * @param {boolean} showCloseButton - Mostra botão X
 * @param {ReactNode} footer - Conteúdo do footer
 * @param {ReactNode} children - Conteúdo
 */

// Uso:
<Modal
  isOpen={isProductModalOpen}
  onClose={() => setIsProductModalOpen(false)}
  title="Adicionar ao Carrinho"
  size="md"
  footer={
    <Button onClick={handleAdd}>Adicionar - R$ 35,00</Button>
  }
>
  <ProductDetails product={selectedProduct} />
</Modal>
```

---

### Toast

```jsx
// components/common/Toast.js (via store)

/**
 * Sistema de notificações toast
 * Controlado via useToast hook
 */

// Uso:
import { useToast } from '@/hooks/useToast'

const { toast } = useToast()

toast.success('Pedido confirmado!')
toast.error('Erro ao processar pagamento')
toast.warning('Estoque baixo')
toast.info('Você tem 340 pontos')

// Com opções
toast.success('Item adicionado', {
  duration: 3000,
  position: 'bottom-center'
})
```

---

### Badge

```jsx
// components/common/Badge.js

/**
 * Badge/Tag
 * 
 * @param {string} variant - 'default' | 'success' | 'warning' | 'error' | 'info' | 'flame'
 * @param {string} size - 'sm' | 'md'
 * @param {boolean} dot - Mostra dot indicator
 * @param {boolean} pulse - Animação de pulse
 * @param {ReactNode} children - Conteúdo
 */

// Uso:
<Badge variant="success">Pronto</Badge>
<Badge variant="warning" pulse>Preparando</Badge>
<Badge variant="flame">VIP</Badge>
<Badge variant="error" dot>3</Badge>
```

---

### Avatar

```jsx
// components/common/Avatar.js

/**
 * Avatar de usuário
 * 
 * @param {string} src - URL da imagem
 * @param {string} name - Nome (para fallback)
 * @param {string} size - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} online - Indicador online
 * @param {string} tier - 'bronze' | 'silver' | 'gold' | 'platinum' (borda)
 */

// Uso:
<Avatar 
  src={user.avatar} 
  name={user.name} 
  size="lg" 
  tier="gold"
  online
/>
```

---

### Spinner

```jsx
// components/common/Spinner.js

/**
 * Loading spinner
 * 
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} color - 'flame' | 'white' | 'muted'
 * @param {string} text - Texto opcional
 * @param {boolean} fullScreen - Tela inteira
 */

// Uso:
<Spinner size="lg" color="flame" />

<Spinner fullScreen text="Carregando cardápio..." />
```

---

### Skeleton

```jsx
// components/common/Skeleton.js

/**
 * Placeholder de loading
 * 
 * @param {string} variant - 'text' | 'circular' | 'rectangular' | 'card'
 * @param {string|number} width - Largura
 * @param {string|number} height - Altura
 * @param {number} count - Quantidade (para listas)
 */

// Uso:
<Skeleton variant="text" width="80%" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="card" count={3} />
```

---

### EmptyState

```jsx
// components/common/EmptyState.js

/**
 * Estado vazio
 * 
 * @param {ReactNode} icon - Ícone
 * @param {string} title - Título
 * @param {string} description - Descrição
 * @param {ReactNode} action - Botão de ação
 */

// Uso:
<EmptyState
  icon={<ShoppingCartIcon />}
  title="Carrinho vazio"
  description="Adicione itens do cardápio para começar"
  action={<Button>Ver Cardápio</Button>}
/>
```

---

## 2. LAYOUT COMPONENTS

### Layout

```jsx
// components/layout/Layout.js

/**
 * Layout principal da aplicação
 * 
 * @param {boolean} showHeader - Mostra header
 * @param {boolean} showFooter - Mostra footer
 * @param {boolean} showBottomNav - Mostra nav mobile
 * @param {string} variant - 'default' | 'clean' | 'staff'
 * @param {ReactNode} children - Conteúdo
 */

// Uso:
<Layout showHeader showBottomNav>
  <main>{children}</main>
</Layout>

// Staff layout
<Layout variant="staff" showHeader={false}>
  <StaffDashboard />
</Layout>
```

---

### Header

```jsx
// components/layout/Header.js

/**
 * Header da aplicação
 * 
 * @param {boolean} transparent - Fundo transparente
 * @param {boolean} sticky - Fixo no topo
 * @param {ReactNode} leftAction - Ação esquerda (back button)
 * @param {ReactNode} rightAction - Ação direita
 * @param {string} title - Título central (opcional)
 */

// Uso:
<Header 
  sticky 
  rightAction={<CartButton />}
/>

<Header 
  leftAction={<BackButton />}
  title="Meu Carrinho"
/>
```

---

### BottomNav

```jsx
// components/layout/BottomNav.js

/**
 * Navegação inferior mobile
 * Itens: Home, Cardápio, Carrinho, Pedidos, Perfil
 */

// Uso (interno do Layout):
<BottomNav />

// Items configuráveis via prop
<BottomNav items={[
  { icon: HomeIcon, label: 'Início', href: '/' },
  { icon: MenuIcon, label: 'Cardápio', href: '/cardapio' },
  { icon: CartIcon, label: 'Carrinho', href: '/carrinho', badge: cartCount },
  { icon: ListIcon, label: 'Pedidos', href: '/pedidos' },
  { icon: UserIcon, label: 'Perfil', href: '/perfil' },
]} />
```

---

### Logo

```jsx
// components/layout/Logo.js

/**
 * Logo FLAME
 * 
 * @param {string} variant - 'full' | 'icon' | 'text'
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} animated - Animação de chama
 */

// Uso:
<Logo variant="full" size="lg" />
<Logo variant="icon" size="md" animated />
```

---

## 3. CUSTOMER COMPONENTS

### ProductCard

```jsx
// components/customer/ProductCard.js

/**
 * Card de produto no cardápio
 * 
 * @param {Object} product - Dados do produto
 * @param {function} onAdd - Handler de adicionar
 * @param {function} onClick - Handler de detalhes
 * @param {string} variant - 'default' | 'compact' | 'horizontal'
 */

// Uso:
<ProductCard
  product={product}
  onAdd={(quantity) => addToCart(product, quantity)}
  onClick={() => openProductModal(product)}
/>
```

---

### CartItem

```jsx
// components/customer/CartItem.js

/**
 * Item no carrinho
 * 
 * @param {Object} item - Item do carrinho
 * @param {function} onQuantityChange - Handler de quantidade
 * @param {function} onRemove - Handler de remover
 * @param {function} onNoteChange - Handler de observação
 */

// Uso:
<CartItem
  item={cartItem}
  onQuantityChange={(qty) => updateQuantity(item.id, qty)}
  onRemove={() => removeItem(item.id)}
/>
```

---

### OrderCard

```jsx
// components/customer/OrderCard.js

/**
 * Card de pedido (histórico/tracking)
 * 
 * @param {Object} order - Dados do pedido
 * @param {boolean} expanded - Mostra detalhes
 * @param {function} onClick - Handler de click
 */

// Uso:
<OrderCard
  order={order}
  onClick={() => router.push(`/pedido/${order.id}`)}
/>
```

---

### OrderTimeline

```jsx
// components/customer/OrderTimeline.js

/**
 * Timeline de status do pedido
 * 
 * @param {Object} order - Dados do pedido
 * @param {boolean} realtime - Atualização em tempo real
 */

// Uso:
<OrderTimeline order={order} realtime />

// Estados:
// - pending_payment
// - confirmed
// - preparing
// - ready
// - picked_up
// - delivered
```

---

### TableSelector

```jsx
// components/customer/TableSelector.js

/**
 * Seletor de mesa (grid)
 * 
 * @param {Array} tables - Lista de mesas
 * @param {number} selectedId - Mesa selecionada
 * @param {function} onSelect - Handler de seleção
 * @param {boolean} showBalcao - Mostra opção balcão
 */

// Uso:
<TableSelector
  tables={tables}
  selectedId={selectedTable}
  onSelect={setSelectedTable}
  showBalcao
/>
```

---

### PointsDisplay

```jsx
// components/customer/PointsDisplay.js

/**
 * Display de pontos do usuário
 * 
 * @param {number} balance - Saldo de pontos
 * @param {string} tier - Tier atual
 * @param {number} nextTierPoints - Pontos para próximo tier
 * @param {boolean} compact - Versão compacta
 */

// Uso:
<PointsDisplay
  balance={340}
  tier="silver"
  nextTierPoints={160}
/>
```

---

### HookahTimer

```jsx
// components/customer/HookahTimer.js

/**
 * Timer de sessão de narguilé
 * 
 * @param {Object} session - Dados da sessão
 * @param {function} onRequestCoal - Solicitar carvão
 * @param {function} onEnd - Encerrar sessão
 */

// Uso:
<HookahTimer
  session={hookahSession}
  onRequestCoal={handleRequestCoal}
  onEnd={handleEndSession}
/>
```

---

### ReservationCalendar

```jsx
// components/customer/ReservationCalendar.js

/**
 * Calendário de reservas
 * 
 * @param {Array} availability - Disponibilidade
 * @param {Date} selectedDate - Data selecionada
 * @param {string} selectedTime - Hora selecionada
 * @param {function} onDateSelect - Handler de data
 * @param {function} onTimeSelect - Handler de hora
 */

// Uso:
<ReservationCalendar
  availability={availability}
  selectedDate={date}
  onDateSelect={setDate}
  selectedTime={time}
  onTimeSelect={setTime}
/>
```

---

## 4. STAFF COMPONENTS

### OrderQueue

```jsx
// components/staff/OrderQueue.js

/**
 * Fila de pedidos (cozinha/bar)
 * 
 * @param {Array} orders - Pedidos
 * @param {string} sector - 'kitchen' | 'bar'
 * @param {function} onStartPreparing - Iniciar preparo
 * @param {function} onMarkReady - Marcar pronto
 */

// Uso:
<OrderQueue
  orders={kitchenOrders}
  sector="kitchen"
  onStartPreparing={handleStart}
  onMarkReady={handleReady}
/>
```

---

### OrderQueueCard

```jsx
// components/staff/OrderQueueCard.js

/**
 * Card individual na fila
 * 
 * @param {Object} order - Pedido
 * @param {string} status - 'pending' | 'preparing' | 'ready'
 * @param {number} elapsedTime - Tempo decorrido (segundos)
 * @param {function} onAction - Ação principal
 */

// Uso:
<OrderQueueCard
  order={order}
  status="preparing"
  elapsedTime={720}
  onAction={() => markReady(order.id)}
/>
```

---

### HookahControl

```jsx
// components/staff/HookahControl.js

/**
 * Controle de narguilé (bar)
 * 
 * @param {Array} activeSessions - Sessões ativas
 * @param {Array} pendingSessions - Aguardando preparo
 * @param {function} onStart - Iniciar sessão
 * @param {function} onCoalChange - Trocar carvão
 * @param {function} onEnd - Finalizar
 */

// Uso:
<HookahControl
  activeSessions={active}
  pendingSessions={pending}
  onStart={handleStart}
  onCoalChange={handleCoal}
  onEnd={handleEnd}
/>
```

---

### DeliveryQueue

```jsx
// components/staff/DeliveryQueue.js

/**
 * Fila de entregas (atendente)
 * 
 * @param {Array} readyOrders - Pedidos prontos
 * @param {Array} myOrders - Pedidos comigo
 * @param {Array} counterOrders - Pedidos balcão
 * @param {function} onPickup - Pegar pedido
 * @param {function} onDeliver - Entregar
 * @param {function} onCallCustomer - Chamar cliente
 */

// Uso:
<DeliveryQueue
  readyOrders={ready}
  myOrders={mine}
  counterOrders={counter}
  onPickup={handlePickup}
  onDeliver={handleDeliver}
  onCallCustomer={handleCall}
/>
```

---

### CashierPanel

```jsx
// components/staff/CashierPanel.js

/**
 * Painel do caixa
 * 
 * @param {Object} cashier - Dados do caixa atual
 * @param {Array} movements - Movimentações
 * @param {function} onWithdrawal - Sangria
 * @param {function} onDeposit - Suprimento
 * @param {function} onClose - Fechar caixa
 */

// Uso:
<CashierPanel
  cashier={currentCashier}
  movements={todayMovements}
  onWithdrawal={handleWithdrawal}
  onDeposit={handleDeposit}
  onClose={handleClose}
/>
```

---

## 5. ADMIN COMPONENTS

### DashboardStats

```jsx
// components/admin/DashboardStats.js

/**
 * Cards de estatísticas
 * 
 * @param {Array} stats - Array de estatísticas
 * @param {boolean} loading - Loading state
 */

// Uso:
<DashboardStats stats={[
  { label: 'Vendas', value: 'R$ 7.5k', change: '+15%', trend: 'up' },
  { label: 'Pedidos', value: '67', change: '+8%', trend: 'up' },
  { label: 'Ticket Médio', value: 'R$ 112', change: '+3%', trend: 'up' },
  { label: 'Mesas Ativas', value: '12', change: null, trend: null },
]} />
```

---

### SalesChart

```jsx
// components/admin/SalesChart.js

/**
 * Gráfico de vendas
 * 
 * @param {Array} data - Dados do gráfico
 * @param {string} period - 'day' | 'week' | 'month'
 * @param {string} type - 'bar' | 'line' | 'area'
 */

// Uso:
<SalesChart
  data={salesByHour}
  period="day"
  type="bar"
/>
```

---

### StockTable

```jsx
// components/admin/StockTable.js

/**
 * Tabela de estoque
 * 
 * @param {Array} items - Itens de estoque
 * @param {function} onEdit - Editar item
 * @param {function} onEntry - Registrar entrada
 * @param {function} onExit - Registrar saída
 */

// Uso:
<StockTable
  items={stockItems}
  onEdit={handleEdit}
  onEntry={handleEntry}
  onExit={handleExit}
/>
```

---

### ProductTable

```jsx
// components/admin/ProductTable.js

/**
 * Tabela de produtos (cardápio)
 * 
 * @param {Array} products - Produtos
 * @param {function} onEdit - Editar
 * @param {function} onToggleAvailability - Toggle disponibilidade
 * @param {function} onDelete - Deletar
 */

// Uso:
<ProductTable
  products={products}
  onEdit={handleEdit}
  onToggleAvailability={handleToggle}
  onDelete={handleDelete}
/>
```

---

## 6. HOOKS

### useAuth

```jsx
// hooks/useAuth.js

/**
 * Hook de autenticação
 * 
 * @returns {Object} { user, isAuthenticated, login, logout, register }
 */

const { user, isAuthenticated, login, logout } = useAuth()

// Login
await login({ phone: '21999999999', code: '123456' })

// Logout
await logout()

// Registro
await register({ name: 'João', phone: '21999999999' })
```

---

### useCart

```jsx
// hooks/useCart.js

/**
 * Hook do carrinho
 * 
 * @returns {Object} { items, total, count, addItem, removeItem, updateQuantity, clear }
 */

const { items, total, addItem, removeItem, clear } = useCart()

addItem(product, 2)
removeItem(productId)
updateQuantity(productId, 3)
clear()
```

---

### useSocket

```jsx
// hooks/useSocket.js

/**
 * Hook de Socket.IO
 * 
 * @param {string} namespace - Namespace do socket
 * @returns {Object} { socket, isConnected, emit, on, off }
 */

const { socket, isConnected, on, emit } = useSocket('/kitchen')

useEffect(() => {
  on('new_order', handleNewOrder)
  return () => off('new_order', handleNewOrder)
}, [])

emit('start_preparing', { orderId })
```

---

### useOrders

```jsx
// hooks/useOrders.js

/**
 * Hook de pedidos
 * 
 * @returns {Object} { orders, activeOrders, createOrder, cancelOrder }
 */

const { orders, activeOrders, createOrder } = useOrders()

await createOrder({
  items: cartItems,
  tableId: selectedTable,
  paymentMethod: 'pix'
})
```

---

### usePoints

```jsx
// hooks/usePoints.js

/**
 * Hook do programa de pontos
 * 
 * @returns {Object} { balance, tier, history, rewards, redeem }
 */

const { balance, tier, rewards, redeem } = usePoints()

await redeem(rewardId)
```

---

### useHookah

```jsx
// hooks/useHookah.js

/**
 * Hook de narguilé
 * 
 * @returns {Object} { activeSession, startSession, requestCoal, endSession }
 */

const { activeSession, startSession, endSession } = useHookah()

await startSession({ flavorId, tableId })
await endSession(sessionId)
```

---

### useReservation

```jsx
// hooks/useReservation.js

/**
 * Hook de reservas
 * 
 * @returns {Object} { reservations, availability, create, cancel }
 */

const { reservations, availability, create } = useReservation()

await create({
  date: '2024-12-08',
  time: '20:00',
  partySize: 4
})
```

---

## 7. STORES

### authStore

```jsx
// stores/authStore.js

/**
 * Estado de autenticação
 */

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}))
```

---

### cartStore

```jsx
// stores/cartStore.js

/**
 * Estado do carrinho
 */

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      tableId: null,
      
      addItem: (product, quantity) => { ... },
      removeItem: (productId) => { ... },
      updateQuantity: (productId, quantity) => { ... },
      setTable: (tableId) => set({ tableId }),
      clear: () => set({ items: [], tableId: null }),
      
      get total() { ... },
      get count() { ... },
    }),
    { name: 'flame-cart' }
  )
)
```

---

### notificationStore

```jsx
// stores/notificationStore.js

/**
 * Estado de notificações/toasts
 */

const useNotificationStore = create((set) => ({
  notifications: [],
  
  add: (notification) => { ... },
  remove: (id) => { ... },
  clear: () => set({ notifications: [] }),
}))
```

---

### staffStore

```jsx
// stores/staffStore.js

/**
 * Estado do staff (cozinha, bar, atendente)
 */

const useStaffStore = create((set) => ({
  sector: null,
  orders: [],
  hookahSessions: [],
  
  setSector: (sector) => set({ sector }),
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => { ... },
  updateOrder: (orderId, data) => { ... },
  setHookahSessions: (sessions) => set({ hookahSessions: sessions }),
}))
```

---

*FLAME Component Library v1.0*
