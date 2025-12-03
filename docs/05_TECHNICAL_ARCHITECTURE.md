# 🏗️ FLAME - TECHNICAL ARCHITECTURE

## VISÃO GERAL

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FLAME ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                         CLIENTS                                │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │ │
│  │  │ Cliente │  │  Staff  │  │  Admin  │  │ Tablet  │          │ │
│  │  │  (PWA)  │  │  (PWA)  │  │  (Web)  │  │  (PWA)  │          │ │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘          │ │
│  └───────┼────────────┼────────────┼────────────┼────────────────┘ │
│          │            │            │            │                   │
│          └────────────┴─────┬──────┴────────────┘                   │
│                             │                                       │
│  ┌──────────────────────────┴──────────────────────────────────┐   │
│  │                      FRONTEND (Next.js)                      │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │   │
│  │  │  Pages  │ │Components│ │  Hooks  │ │ Stores  │           │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│          ┌──────────────────┼──────────────────┐                   │
│          │                  │                  │                   │
│          ▼                  ▼                  ▼                   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐          │
│  │   REST API    │  │  Socket.IO    │  │    Stripe     │          │
│  │   (Express)   │  │  (Real-time)  │  │  (Payments)   │          │
│  └───────┬───────┘  └───────┬───────┘  └───────────────┘          │
│          │                  │                                       │
│          └────────┬─────────┘                                       │
│                   │                                                 │
│  ┌────────────────┴────────────────────────────────────────────┐   │
│  │                      BACKEND (Node.js)                       │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │   │
│  │  │Controllers│ │ Services │ │ Models   │ │Middleware│       │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │   │
│  └────────────────────────────┬────────────────────────────────┘   │
│                               │                                     │
│  ┌────────────────────────────┴────────────────────────────────┐   │
│  │                      DATABASE (PostgreSQL)                   │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │   │
│  │  │Users │ │Orders│ │Stock │ │Points│ │Tables│ │Hookah│    │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. STACK TECNOLÓGICA

### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Next.js | 14.x | Framework React SSR/SSG |
| React | 18.x | Biblioteca UI |
| Tailwind CSS | 3.x | Styling |
| Zustand | 4.x | State Management |
| Socket.IO Client | 4.x | Real-time |
| Framer Motion | 10.x | Animações |
| React Hook Form | 7.x | Formulários |
| Zod | 3.x | Validação |
| Axios | 1.x | HTTP Client |
| next-pwa | 5.x | PWA Support |

### Backend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Node.js | 20.x LTS | Runtime |
| Express.js | 4.x | Framework Web |
| Sequelize | 6.x | ORM |
| PostgreSQL | 15.x | Database |
| Socket.IO | 4.x | WebSockets |
| JWT | 9.x | Autenticação |
| bcryptjs | 2.x | Hashing |
| node-cron | 3.x | Scheduled Tasks |

### Serviços Externos

| Serviço | Propósito |
|---------|-----------|
| Stripe | Pagamentos (Cartão, PIX) |
| Twilio | SMS (verificação, notificações) |
| Web Push | Push Notifications |
| Cloudinary | Upload de imagens (futuro) |

---

## 2. ESTRUTURA DE PASTAS

```
flame/
├── frontend/
│   ├── public/
│   │   ├── icons/              # PWA icons
│   │   ├── images/             # Assets estáticos
│   │   └── manifest.json       # PWA manifest
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Buttons, Inputs, Cards
│   │   │   ├── layout/         # Header, Footer, Layout
│   │   │   ├── customer/       # Componentes do cliente
│   │   │   ├── staff/          # Componentes do staff
│   │   │   └── admin/          # Componentes admin
│   │   │
│   │   ├── pages/
│   │   │   ├── index.js                # Landing
│   │   │   ├── cardapio.js             # Cardápio
│   │   │   ├── carrinho.js             # Carrinho
│   │   │   ├── checkout.js             # Checkout
│   │   │   ├── qr/[mesaId].js          # Entrada QR
│   │   │   ├── pedido/[id].js          # Tracking
│   │   │   ├── reservas.js             # Reservas
│   │   │   ├── pontos.js               # Programa fidelidade
│   │   │   ├── narguilé/[id].js        # Timer narguilé
│   │   │   │
│   │   │   ├── staff/
│   │   │   │   ├── login.js            # Login staff
│   │   │   │   ├── cozinha.js          # Painel cozinha
│   │   │   │   ├── bar.js              # Painel bar
│   │   │   │   ├── atendente.js        # Painel atendente
│   │   │   │   └── caixa.js            # PDV
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── index.js            # Dashboard
│   │   │       ├── cardapio.js         # Gestão cardápio
│   │   │       ├── estoque.js          # Gestão estoque
│   │   │       ├── usuarios.js         # Gestão usuários
│   │   │       ├── relatorios.js       # Relatórios
│   │   │       ├── fidelidade.js       # Config pontos
│   │   │       └── config.js           # Configurações
│   │   │
│   │   ├── stores/
│   │   │   ├── authStore.js            # Autenticação
│   │   │   ├── cartStore.js            # Carrinho
│   │   │   ├── orderStore.js           # Pedidos
│   │   │   ├── staffStore.js           # Estado staff
│   │   │   └── notificationStore.js    # Notificações
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                  # Axios instance
│   │   │   ├── socket.js               # Socket.IO client
│   │   │   └── push.js                 # Push notifications
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   ├── useSocket.js
│   │   │   ├── useOrders.js
│   │   │   └── usePWA.js
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.js           # Formatação
│   │   │   ├── validators.js           # Validações
│   │   │   └── constants.js            # Constantes
│   │   │
│   │   └── styles/
│   │       ├── globals.css             # Estilos globais
│   │       └── components.css          # Componentes
│   │
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js             # Sequelize config
│   │   │   ├── socket.js               # Socket.IO config
│   │   │   └── stripe.js               # Stripe config
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── stock.controller.js
│   │   │   ├── points.controller.js
│   │   │   ├── hookah.controller.js
│   │   │   ├── reservation.controller.js
│   │   │   ├── cashier.controller.js
│   │   │   └── report.controller.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── sms.service.js
│   │   │   ├── payment.service.js
│   │   │   ├── stock.service.js
│   │   │   ├── points.service.js
│   │   │   ├── hookah.service.js
│   │   │   ├── notification.service.js
│   │   │   └── report.service.js
│   │   │
│   │   ├── models/
│   │   │   ├── index.js                # Sequelize init
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── ProductRecipe.js        # Ficha técnica
│   │   │   ├── Order.js
│   │   │   ├── OrderItem.js
│   │   │   ├── Table.js
│   │   │   ├── Stock.js
│   │   │   ├── StockMovement.js
│   │   │   ├── Supplier.js
│   │   │   ├── Points.js
│   │   │   ├── PointsTransaction.js
│   │   │   ├── Reward.js
│   │   │   ├── HookahSession.js
│   │   │   ├── HookahFlavor.js
│   │   │   ├── Reservation.js
│   │   │   ├── Cashier.js
│   │   │   └── CashierMovement.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   └── rateLimit.middleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── stock.routes.js
│   │   │   ├── points.routes.js
│   │   │   ├── hookah.routes.js
│   │   │   ├── reservation.routes.js
│   │   │   ├── cashier.routes.js
│   │   │   └── report.routes.js
│   │   │
│   │   ├── socket/
│   │   │   ├── index.js                # Socket handlers
│   │   │   ├── orderEvents.js
│   │   │   ├── kitchenEvents.js
│   │   │   └── hookahEvents.js
│   │   │
│   │   ├── jobs/
│   │   │   ├── stockAlerts.job.js
│   │   │   ├── pointsExpiry.job.js
│   │   │   └── reservationReminder.job.js
│   │   │
│   │   └── utils/
│   │       ├── helpers.js
│   │       └── errors.js
│   │
│   ├── migrations/
│   ├── seeders/
│   └── package.json
│
└── docs/
    ├── CONCEITO_FLAME.md
    ├── DESIGN_SYSTEM.md
    ├── PRD.md
    ├── USER_FLOWS.md
    └── TECHNICAL_ARCHITECTURE.md
```

---

## 3. MODELOS DE DADOS

### 3.1 Users

```javascript
User = {
  id: UUID (PK),
  name: STRING,
  phone: STRING (unique),
  email: STRING (unique, nullable),
  password: STRING (hashed),
  cpf: STRING (nullable),
  birthDate: DATE (nullable),
  
  // Role & Permissions
  role: ENUM('customer', 'kitchen', 'bar', 'attendant', 'cashier', 'manager', 'admin'),
  isActive: BOOLEAN (default: true),
  
  // SMS Verification
  smsCode: STRING (nullable),
  smsCodeExpiry: DATE (nullable),
  isVerified: BOOLEAN (default: false),
  
  // Customer specific
  tier: ENUM('bronze', 'silver', 'gold', 'platinum') (default: 'bronze'),
  pointsBalance: INTEGER (default: 0),
  totalSpent: DECIMAL (default: 0),
  
  // Preferences
  favoriteHookahFlavor: STRING (nullable),
  favoriteDrink: STRING (nullable),
  notes: TEXT (nullable),
  
  // Timestamps
  lastVisit: DATE (nullable),
  createdAt: DATE,
  updatedAt: DATE
}
```

### 3.2 Products

```javascript
Product = {
  id: UUID (PK),
  name: STRING,
  description: TEXT,
  price: DECIMAL,
  category: ENUM('drink', 'beer', 'wine', 'food', 'hookah', 'tobacco', 'other'),
  subcategory: STRING (nullable),
  image: STRING (URL),
  
  // Stock
  trackStock: BOOLEAN (default: true),
  stockQuantity: INTEGER (default: 0),
  stockMinimum: INTEGER (default: 5),
  stockUnit: ENUM('un', 'ml', 'g', 'kg'),
  
  // Pricing
  costPrice: DECIMAL,
  
  // Status
  isActive: BOOLEAN (default: true),
  isAvailable: BOOLEAN (default: true),
  
  // Points
  pointsValue: INTEGER (default: 0), // Pontos que vale se resgatado
  
  createdAt: DATE,
  updatedAt: DATE
}

// Relação: Product hasMany ProductRecipe
```

### 3.3 ProductRecipe (Ficha Técnica)

```javascript
ProductRecipe = {
  id: UUID (PK),
  productId: UUID (FK -> Product),
  ingredientId: UUID (FK -> Stock), // Insumo
  quantity: DECIMAL,
  unit: ENUM('un', 'ml', 'g', 'kg'),
  
  createdAt: DATE,
  updatedAt: DATE
}

// Exemplo: Caipirinha usa:
// - 50ml Cachaça
// - 1un Limão
// - 20g Açúcar
// - 100g Gelo
```

### 3.4 Stock (Insumos)

```javascript
Stock = {
  id: UUID (PK),
  name: STRING,
  category: ENUM('beverage', 'food', 'tobacco', 'supply', 'other'),
  unit: ENUM('un', 'ml', 'L', 'g', 'kg'),
  
  currentQuantity: DECIMAL,
  minimumQuantity: DECIMAL,
  averageCost: DECIMAL,
  
  supplierId: UUID (FK -> Supplier, nullable),
  
  isActive: BOOLEAN (default: true),
  
  createdAt: DATE,
  updatedAt: DATE
}
```

### 3.5 StockMovement

```javascript
StockMovement = {
  id: UUID (PK),
  stockId: UUID (FK -> Stock),
  
  type: ENUM('entry', 'exit', 'adjustment', 'loss'),
  quantity: DECIMAL,
  unitCost: DECIMAL (nullable),
  totalCost: DECIMAL (nullable),
  
  reason: STRING,
  reference: STRING (nullable), // Pedido ID, NF, etc
  
  userId: UUID (FK -> User), // Quem registrou
  
  createdAt: DATE
}
```

### 3.6 Orders

```javascript
Order = {
  id: UUID (PK),
  orderNumber: STRING (unique), // #0001, #0002...
  
  userId: UUID (FK -> User),
  tableId: UUID (FK -> Table, nullable),
  
  type: ENUM('dine_in', 'counter'), // Mesa ou Balcão
  
  status: ENUM(
    'pending_payment',
    'confirmed',
    'preparing',
    'ready',
    'picked_up',
    'delivered',
    'cancelled'
  ),
  
  // Valores
  subtotal: DECIMAL,
  serviceFee: DECIMAL,
  discount: DECIMAL (default: 0),
  pointsUsed: INTEGER (default: 0),
  total: DECIMAL,
  
  // Pagamento
  paymentMethod: ENUM('credit_card', 'debit_card', 'pix', 'cash', 'points'),
  paymentStatus: ENUM('pending', 'paid', 'refunded'),
  stripePaymentId: STRING (nullable),
  
  // Staff
  pickedUpBy: UUID (FK -> User, nullable),
  deliveredBy: UUID (FK -> User, nullable),
  
  // Timestamps
  confirmedAt: DATE (nullable),
  preparedAt: DATE (nullable),
  readyAt: DATE (nullable),
  deliveredAt: DATE (nullable),
  
  notes: TEXT (nullable),
  
  createdAt: DATE,
  updatedAt: DATE
}
```

### 3.7 OrderItem

```javascript
OrderItem = {
  id: UUID (PK),
  orderId: UUID (FK -> Order),
  productId: UUID (FK -> Product),
  
  quantity: INTEGER,
  unitPrice: DECIMAL,
  totalPrice: DECIMAL,
  
  notes: TEXT (nullable), // "Sem gelo"
  
  // Status por item (para setores diferentes)
  status: ENUM('pending', 'preparing', 'ready'),
  sector: ENUM('kitchen', 'bar'), // Onde vai ser preparado
  
  preparedBy: UUID (FK -> User, nullable),
  
  createdAt: DATE,
  updatedAt: DATE
}
```

### 3.8 Tables

```javascript
Table = {
  id: UUID (PK),
  number: INTEGER (unique),
  capacity: INTEGER,
  
  status: ENUM('available', 'occupied', 'reserved', 'maintenance'),
  
  qrCode: STRING (unique), // Código único para QR
  
  currentOrderId: UUID (FK -> Order, nullable),
  
  isActive: BOOLEAN (default: true),
  
  createdAt: DATE,
  updatedAt: DATE
}
```

### 3.9 HookahSession

```javascript
HookahSession = {
  id: UUID (PK),
  orderId: UUID (FK -> Order),
  tableId: UUID (FK -> Table),
  userId: UUID (FK -> User),
  
  flavorId: UUID (FK -> HookahFlavor),
  
  startTime: DATE,
  endTime: DATE (nullable),
  durationMinutes: INTEGER (nullable),
  
  coalChanges: INTEGER (default: 0),
  
  hourlyRate: DECIMAL,
  totalValue: DECIMAL (nullable),
  
  status: ENUM('pending', 'active', 'finished', 'cancelled'),
  
  createdAt: DATE,
  updatedAt: DATE
}
```

### 3.10 HookahFlavor

```javascript
HookahFlavor = {
  id: UUID (PK),
  name: STRING,
  category: ENUM('classic', 'premium', 'signature'),
  additionalPrice: DECIMAL (default: 0),
  
  stockId: UUID (FK -> Stock, nullable),
  
  isActive: BOOLEAN (default: true),
  
  createdAt: DATE,
  updatedAt: DATE
}
```

### 3.11 PointsTransaction

```javascript
PointsTransaction = {
  id: UUID (PK),
  userId: UUID (FK -> User),
  
  type: ENUM('credit', 'debit'),
  amount: INTEGER,
  
  reason: ENUM('purchase', 'bonus', 'redemption', 'expiry', 'adjustment'),
  
  referenceId: STRING (nullable), // Order ID, Reward ID, etc
  
  expiresAt: DATE (nullable), // 12 meses para créditos
  
  createdAt: DATE
}
```

### 3.12 Reward

```javascript
Reward = {
  id: UUID (PK),
  name: STRING,
  description: TEXT,
  
  pointsCost: INTEGER,
  
  type: ENUM('product', 'discount', 'experience'),
  
  productId: UUID (FK -> Product, nullable),
  discountValue: DECIMAL (nullable),
  discountPercent: INTEGER (nullable),
  
  isActive: BOOLEAN (default: true),
  
  createdAt: DATE,
  updatedAt: DATE
}
```

### 3.13 Reservation

```javascript
Reservation = {
  id: UUID (PK),
  userId: UUID (FK -> User),
  tableId: UUID (FK -> Table, nullable),
  
  date: DATEONLY,
  time: TIME,
  partySize: INTEGER,
  
  status: ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show'),
  
  notes: TEXT (nullable),
  
  confirmedBy: UUID (FK -> User, nullable),
  
  reminderSent: BOOLEAN (default: false),
  
  createdAt: DATE,
  updatedAt: DATE
}
```

### 3.14 Cashier

```javascript
Cashier = {
  id: UUID (PK),
  date: DATEONLY,
  
  openedBy: UUID (FK -> User),
  closedBy: UUID (FK -> User, nullable),
  
  openingAmount: DECIMAL,
  closingAmountSystem: DECIMAL (nullable),
  closingAmountReal: DECIMAL (nullable),
  difference: DECIMAL (nullable),
  
  status: ENUM('open', 'closed'),
  
  openedAt: DATE,
  closedAt: DATE (nullable),
  
  createdAt: DATE,
  updatedAt: DATE
}
```

### 3.15 CashierMovement

```javascript
CashierMovement = {
  id: UUID (PK),
  cashierId: UUID (FK -> Cashier),
  
  type: ENUM('sale', 'withdrawal', 'deposit', 'refund'),
  amount: DECIMAL,
  
  paymentMethod: ENUM('cash', 'credit_card', 'debit_card', 'pix'),
  
  orderId: UUID (FK -> Order, nullable),
  reason: STRING (nullable),
  
  userId: UUID (FK -> User),
  
  createdAt: DATE
}
```

---

## 4. API ENDPOINTS

### 4.1 Autenticação

```
POST   /api/auth/register         # Cadastro
POST   /api/auth/send-sms         # Envia SMS
POST   /api/auth/verify-sms       # Verifica código
POST   /api/auth/login            # Login email/senha
POST   /api/auth/login-sms        # Login SMS
POST   /api/auth/refresh          # Refresh token
POST   /api/auth/logout           # Logout
```

### 4.2 Usuários

```
GET    /api/users/me              # Perfil atual
PUT    /api/users/me              # Atualizar perfil
GET    /api/users                 # Lista (admin)
POST   /api/users                 # Criar (admin)
PUT    /api/users/:id             # Atualizar (admin)
DELETE /api/users/:id             # Desativar (admin)
```

### 4.3 Produtos

```
GET    /api/products              # Lista (com filtros)
GET    /api/products/:id          # Detalhes
POST   /api/products              # Criar (admin)
PUT    /api/products/:id          # Atualizar (admin)
DELETE /api/products/:id          # Desativar (admin)
PUT    /api/products/:id/availability  # Toggle disponibilidade
```

### 4.4 Pedidos

```
POST   /api/orders                # Criar pedido
GET    /api/orders                # Meus pedidos (cliente)
GET    /api/orders/:id            # Detalhes
GET    /api/orders/active         # Pedidos ativos (staff)
PUT    /api/orders/:id/status     # Atualizar status (staff)
POST   /api/orders/:id/cancel     # Cancelar
```

### 4.5 Estoque

```
GET    /api/stock                 # Lista insumos
GET    /api/stock/:id             # Detalhes
POST   /api/stock                 # Criar insumo
PUT    /api/stock/:id             # Atualizar
POST   /api/stock/:id/entry       # Entrada
POST   /api/stock/:id/exit        # Saída manual
GET    /api/stock/alerts          # Alertas de mínimo
GET    /api/stock/movements       # Histórico movimentações
```

### 4.6 Pontos

```
GET    /api/points/balance        # Saldo
GET    /api/points/history        # Histórico
GET    /api/points/rewards        # Recompensas disponíveis
POST   /api/points/redeem/:rewardId  # Resgatar
```

### 4.7 Narguilé

```
GET    /api/hookah/flavors        # Sabores disponíveis
POST   /api/hookah/sessions       # Iniciar sessão
GET    /api/hookah/sessions/active  # Sessões ativas (staff)
PUT    /api/hookah/sessions/:id/coal  # Registrar troca carvão
PUT    /api/hookah/sessions/:id/end   # Finalizar sessão
```

### 4.8 Reservas

```
GET    /api/reservations/availability  # Disponibilidade
POST   /api/reservations              # Criar reserva
GET    /api/reservations              # Minhas reservas (cliente)
GET    /api/reservations/all          # Todas (staff)
PUT    /api/reservations/:id/confirm  # Confirmar (staff)
PUT    /api/reservations/:id/cancel   # Cancelar
```

### 4.9 Caixa

```
POST   /api/cashier/open          # Abrir caixa
GET    /api/cashier/current       # Caixa atual
POST   /api/cashier/withdrawal    # Sangria
POST   /api/cashier/deposit       # Suprimento
POST   /api/cashier/close         # Fechar caixa
GET    /api/cashier/history       # Histórico
```

### 4.10 Relatórios

```
GET    /api/reports/sales         # Vendas (período)
GET    /api/reports/products      # Por produto
GET    /api/reports/categories    # Por categoria
GET    /api/reports/hourly        # Por hora
GET    /api/reports/customers     # Clientes
GET    /api/reports/dre           # DRE simplificado
GET    /api/reports/stock         # Movimentação estoque
```

---

## 5. EVENTOS SOCKET.IO

### 5.1 Namespaces

```javascript
// Customer namespace
io.of('/customer')

// Staff namespaces
io.of('/kitchen')
io.of('/bar')
io.of('/attendant')

// Admin namespace
io.of('/admin')
```

### 5.2 Eventos

```javascript
// === PEDIDOS ===

// Server -> Kitchen/Bar
'new_order'           // { order, items }
'order_cancelled'     // { orderId }

// Kitchen/Bar -> Server
'start_preparing'     // { orderId, itemIds }
'item_ready'          // { orderId, itemId }

// Server -> Attendant
'order_ready'         // { order }

// Attendant -> Server
'pickup_order'        // { orderId }
'deliver_order'       // { orderId }

// Server -> Customer
'order_status_update' // { orderId, status, items }
'order_delivered'     // { orderId }

// === NARGUILÉ ===

// Server -> Bar
'new_hookah_request'  // { session }
'hookah_coal_alert'   // { sessionId, tableNumber }

// Bar -> Server
'hookah_started'      // { sessionId }
'hookah_coal_changed' // { sessionId }
'hookah_ended'        // { sessionId }

// Server -> Customer
'hookah_timer_update' // { sessionId, elapsed, nextCoal }

// === ADMIN ===

// Server -> Admin
'dashboard_update'    // { sales, orders, tables }
'stock_alert'         // { item, quantity }
'new_reservation'     // { reservation }
```

---

## 6. JOBS AGENDADOS

```javascript
// Stock Alerts - A cada 1 hora
cron.schedule('0 * * * *', () => {
  checkStockAlerts()
})

// Points Expiry - Todo dia às 00:00
cron.schedule('0 0 * * *', () => {
  expireOldPoints()
})

// Reservation Reminders - A cada 30 min
cron.schedule('*/30 * * * *', () => {
  sendReservationReminders()
})

// No-show check - A cada 15 min
cron.schedule('*/15 * * * *', () => {
  markNoShowReservations()
})

// Daily Reports - Todo dia às 06:00
cron.schedule('0 6 * * *', () => {
  generateDailyReport()
})
```

---

## 7. SEGURANÇA

### 7.1 Autenticação

- JWT com access token (15min) + refresh token (7 dias)
- SMS OTP com expiração de 5 minutos
- Rate limiting: 5 tentativas de login / 15 min

### 7.2 Autorização

```javascript
// Middleware de roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}

// Uso
router.get('/admin/reports', 
  authenticate, 
  authorize('manager', 'admin'), 
  getReports
)
```

### 7.3 Validação

- Zod para validação de schemas
- Sanitização de inputs
- Prepared statements (Sequelize)

### 7.4 Headers

```javascript
// Helmet configuration
helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: true,
  xssFilter: true
})
```

---

## 8. DEPLOY

### 8.1 Ambientes

| Ambiente | Propósito |
|----------|-----------|
| Development | Local |
| Staging | Testes |
| Production | Produção |

### 8.2 Variáveis de Ambiente

```env
# App
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://flame.com.br

# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=...
JWT_REFRESH_SECRET=...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Twilio
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Push
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

---

*FLAME Technical Architecture v3.0.0*
