# 🛠️ FLAME - DEV BRIEF

## QUICK START

### Requisitos
- Node.js 20.x LTS
- PostgreSQL 15.x (produção) / SQLite (dev)
- npm ou yarn

### Instalação (5 minutos)

```bash
# 1. Clone o repositório
git clone [repo-url]
cd flame

# 2. Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev
# Acesse: http://localhost:3001

# 3. Backend (outro terminal)
cd backend
npm install
cp .env.example .env
npm run dev
# API: http://localhost:3000
```

### Credenciais de Teste

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | admin@flame.com.br | 123456 |
| Gerente | gerente@flame.com.br | 123456 |
| Cozinha | cozinha@flame.com.br | 123456 |
| Bar | bar@flame.com.br | 123456 |
| Atendente | atendente@flame.com.br | 123456 |
| Caixa | caixa@flame.com.br | 123456 |
| Cliente | cliente@test.com | 123456 |

**SMS em modo dev:** Qualquer código de 6 dígitos funciona.

---

## ESTRUTURA DO PROJETO

```
flame/
├── frontend/           # Next.js 14
│   ├── src/
│   │   ├── pages/      # Rotas
│   │   ├── components/ # Componentes React
│   │   ├── stores/     # Zustand stores
│   │   ├── services/   # API e Socket
│   │   ├── hooks/      # Custom hooks
│   │   └── styles/     # CSS
│   └── public/         # Assets
│
├── backend/            # Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/     # Sequelize
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── socket/
│   └── migrations/
│
└── docs/               # Documentação
```

---

## CONVENÇÕES DE CÓDIGO

### Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes | PascalCase | `ProductCard.js` |
| Páginas | kebab-case | `meus-pedidos.js` |
| Hooks | camelCase com "use" | `useCart.js` |
| Stores | camelCase com "Store" | `cartStore.js` |
| Services | camelCase | `api.js` |
| Constantes | SCREAMING_SNAKE | `API_BASE_URL` |
| CSS Classes | kebab-case | `btn-primary` |
| Variáveis | camelCase | `orderTotal` |
| Funções | camelCase | `calculateTotal()` |

### Estrutura de Componente

```jsx
// 1. Imports (externos primeiro, depois internos)
import { useState } from 'react'
import { motion } from 'framer-motion'

import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/common/Button'

// 2. Types (se TypeScript)
// interface Props { ... }

// 3. Componente
export function ProductCard({ product, onAdd }) {
  // 3.1 Hooks
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  // 3.2 Handlers
  const handleAdd = () => {
    addItem(product, quantity)
    onAdd?.()
  }

  // 3.3 Render
  return (
    <div className="card">
      {/* ... */}
    </div>
  )
}

// 4. Default export (se necessário)
export default ProductCard
```

### Commits

```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração sem mudança de comportamento
style: formatação, espaços, ponto e vírgula
docs: documentação
test: testes
chore: manutenção, dependências
perf: performance
```

**Exemplos:**
```bash
git commit -m "feat: adiciona módulo de narguilé"
git commit -m "fix: corrige cálculo de pontos"
git commit -m "refactor: extrai lógica de estoque para service"
```

### Branches

```
main              # Produção
develop           # Desenvolvimento
feature/nome      # Novas funcionalidades
fix/nome          # Correções
hotfix/nome       # Correções urgentes em prod
```

**Workflow:**
```bash
# Nova feature
git checkout develop
git pull
git checkout -b feature/modulo-estoque

# Trabalhar...
git add .
git commit -m "feat: implementa entrada de estoque"
git push origin feature/modulo-estoque

# Criar PR para develop
```

---

## PADRÕES DE CÓDIGO

### React/Next.js

```jsx
// ✅ BOM - Componentes funcionais com hooks
export function OrderList() {
  const [orders, setOrders] = useState([])
  
  useEffect(() => {
    fetchOrders()
  }, [])
  
  return <div>...</div>
}

// ❌ RUIM - Class components
class OrderList extends Component { ... }
```

```jsx
// ✅ BOM - Destructuring de props
function Button({ label, onClick, variant = 'primary' }) {
  return <button className={`btn-${variant}`} onClick={onClick}>{label}</button>
}

// ❌ RUIM - Props genéricas
function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>
}
```

```jsx
// ✅ BOM - Conditional rendering limpo
{isLoading ? (
  <Spinner />
) : orders.length > 0 ? (
  <OrderList orders={orders} />
) : (
  <EmptyState message="Nenhum pedido" />
)}

// ❌ RUIM - Ternários aninhados inline
{isLoading ? <Spinner /> : orders.length > 0 ? orders.map(...) : <p>Vazio</p>}
```

### Tailwind CSS

```jsx
// ✅ BOM - Classes organizadas (layout → spacing → visual)
<div className="flex flex-col gap-4 p-6 bg-neutral-100 rounded-xl border border-neutral-300">

// ❌ RUIM - Classes desorganizadas
<div className="border rounded-xl bg-neutral-100 p-6 flex gap-4 border-neutral-300 flex-col">
```

```jsx
// ✅ BOM - Usar design tokens
<button className="bg-flame-magenta text-white">

// ❌ RUIM - Hardcode de cores
<button className="bg-[#FF006E] text-white">
```

### API Calls

```javascript
// ✅ BOM - Usar service layer
import { api } from '@/services/api'

const orders = await api.get('/orders')

// ❌ RUIM - Fetch direto no componente
const res = await fetch('http://localhost:3000/api/orders')
```

```javascript
// ✅ BOM - Tratamento de erro
try {
  const { data } = await api.post('/orders', orderData)
  toast.success('Pedido criado!')
  return data
} catch (error) {
  toast.error(error.response?.data?.message || 'Erro ao criar pedido')
  throw error
}

// ❌ RUIM - Sem tratamento
const { data } = await api.post('/orders', orderData)
```

### Backend

```javascript
// ✅ BOM - Controller fino, service gordo
// controller
async createOrder(req, res) {
  try {
    const order = await orderService.create(req.body, req.user.id)
    res.status(201).json(order)
  } catch (error) {
    next(error)
  }
}

// service
async create(data, userId) {
  // Toda lógica de negócio aqui
  const order = await Order.create({ ...data, userId })
  await this.processStock(order)
  await this.calculatePoints(order)
  await this.notifyKitchen(order)
  return order
}

// ❌ RUIM - Lógica no controller
async createOrder(req, res) {
  const order = await Order.create(req.body)
  // 100 linhas de lógica aqui...
}
```

---

## SCRIPTS DISPONÍVEIS

### Frontend

```bash
npm run dev           # Inicia dev server (porta 3001)
npm run build         # Build de produção
npm run start         # Inicia servidor de produção
npm run lint          # Roda ESLint
npm run lint:fix      # Corrige problemas de lint
npm run analyze       # Analisa bundle size
```

### Backend

```bash
npm run dev           # Inicia com nodemon (porta 3000)
npm start             # Inicia servidor
npm run migrate       # Roda migrações pendentes
npm run migrate:undo  # Desfaz última migração
npm run seed          # Popula banco com dados de teste
npm run seed:undo     # Remove dados de seed
npm test              # Roda testes
npm run test:watch    # Testes em modo watch
npm run test:coverage # Cobertura de testes
```

### Utilitários

```bash
# Limpar cache
rm -rf frontend/.next
rm -rf frontend/node_modules/.cache

# Resetar banco (dev)
cd backend
rm database.sqlite
npm run migrate
npm run seed

# Verificar portas em uso
lsof -i :3000
lsof -i :3001
```

---

## VARIÁVEIS DE AMBIENTE

### Frontend (.env.local)

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# Stripe (público)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# PWA
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
```

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/flame
# ou para SQLite em dev:
# DATABASE_DIALECT=sqlite
# DATABASE_STORAGE=./database.sqlite

# Auth
JWT_SECRET=seu-secret-aqui
JWT_REFRESH_SECRET=outro-secret-aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# Push Notifications
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_EMAIL=mailto:admin@flame.com.br
```

---

## DEBUG

### Frontend

```javascript
// Console com contexto
console.log('[Cart]', 'Adding item:', product)

// React DevTools
// Instale a extensão do Chrome

// Zustand DevTools
// Já integrado, veja no Redux DevTools
```

### Backend

```javascript
// Debug de queries Sequelize
// Em config/database.js:
logging: console.log

// Debug de Socket.IO
DEBUG=socket.io:* npm run dev
```

### Network

```bash
# Ver requisições
# Chrome DevTools > Network

# Testar API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flame.com.br","password":"123456"}'
```

---

## TESTES

### Estrutura

```
tests/
├── unit/           # Testes unitários
│   ├── services/
│   └── utils/
├── integration/    # Testes de integração
│   └── api/
└── e2e/           # Testes end-to-end
    └── flows/
```

### Rodar Testes

```bash
# Todos os testes
npm test

# Apenas um arquivo
npm test -- --testPathPattern=order.service

# Com coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Exemplo de Teste

```javascript
// order.service.test.js
describe('OrderService', () => {
  describe('create', () => {
    it('should create order and update stock', async () => {
      const orderData = {
        items: [{ productId: 1, quantity: 2 }],
        tableId: 1
      }
      
      const order = await orderService.create(orderData, userId)
      
      expect(order.status).toBe('confirmed')
      expect(order.items).toHaveLength(1)
      // Verificar estoque foi atualizado
    })
    
    it('should throw if product unavailable', async () => {
      // ...
    })
  })
})
```

---

## DEPLOY

### Checklist Pré-Deploy

- [ ] Testes passando
- [ ] Lint sem erros
- [ ] Build sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações prontas
- [ ] Assets otimizados

### Comandos

```bash
# Build frontend
cd frontend
npm run build

# Testar build local
npm start

# Backend
cd backend
npm run migrate
npm start
```

---

## TROUBLESHOOTING

### Problemas Comuns

**Porta em uso**
```bash
# Matar processo na porta
kill -9 $(lsof -t -i:3000)
```

**Erro de CORS**
```javascript
// backend/src/index.js - verificar origin
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

**Socket não conecta**
- Verificar NEXT_PUBLIC_SOCKET_URL
- Verificar se backend está rodando
- Verificar console do browser

**Migração falha**
```bash
# Resetar banco (dev only!)
npm run migrate:undo:all
npm run migrate
npm run seed
```

**Build falha**
```bash
# Limpar cache
rm -rf .next
rm -rf node_modules/.cache
npm run build
```

---

## CONTATOS

- **Tech Lead:** [nome]
- **Backend:** [nome]
- **Frontend:** [nome]
- **DevOps:** [nome]

---

*FLAME Dev Brief v1.0*
