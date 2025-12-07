# FLAME - TASKS & PROJETO

## STATUS ATUAL DO PROJETO

**Data Atualização**: 07/12/2024
**Versão**: 3.6.0
**Status**: ✅ SISTEMA COMPLETO + GOOGLE OAUTH + DEPLOY
**Sincronizado com**: PRD v3.3.0 e User Flows v3.3.0

> **SPRINTS 21-27 COMPLETAS + GOOGLE OAUTH FUNCIONANDO**:
> - Sprint 21: Melhorias de UX (componentes reutilizáveis)
> - Sprint 22: Testes E2E (Cypress)
> - Sprint 23: Correção de fluxos, segurança, QR codes, no-show
> - Sprint 24: Cashback no checkout
> - Sprint 25: Bônus automáticos (aniversário + boas-vindas)
> - Sprint 26-27: Ficha técnica/Insumos (backend + frontend)
> - ✅ Google OAuth: Login com Google funcionando em produção

### ✅ PROBLEMAS DE SEGURANÇA CORRIGIDOS

| # | Problema | Status |
|---|----------|--------|
| 1 | Webhook sem autenticação | ✅ Corrigido Sprint 23 |
| 2 | CRUD produtos sem role | ✅ Corrigido Sprint 23 |
| 3 | Google credentials expostas | ✅ Configurado via env vars |
| 4 | WhatsApp número pessoal | ⚠️ Pendente config manual |
| 5 | VAPID keys hardcoded | ⚠️ Geradas por env vars |
| 6 | Stripe em modo teste | ⚠️ Trocar para produção quando live |

### ✅ BUGS DE FUNCIONAMENTO CORRIGIDOS

| Bug | Status |
|-----|--------|
| QR Code URL errada | ✅ Corrigido Sprint 23 |
| Job no-show quebrado | ✅ Corrigido Sprint 23 |
| Caixa desincronizado | ⚠️ Verificar integração |
| Socket hookah faltando | ⚠️ Verificar integração |

### ✅ CONFIRMAÇÕES DA AUDITORIA

1. **Narguilé migrado para /atendente** - Sprint 23 concluída
2. **Baixa de estoque automática** - Funciona corretamente
3. **Cashback automático** - Crédito ao entregar pedido OK
4. **Tiers de fidelidade** - Bronze/Silver/Gold/Platinum funcionando
5. **Cashback no checkout** - Sprint 24 implementada
6. **Bônus automáticos** - Sprint 25 implementada
7. **Ficha técnica/Insumos** - Sprints 26-27 implementadas

---

## 🌐 URLS DE PRODUÇÃO

### Frontend (Vercel)
- **URL Atual**: https://flame-lounge.vercel.app (domínio permanente)
- **URL Deploy**: https://flame-rjx23nmh1-leopalhas-projects.vercel.app
- **Dashboard**: https://vercel.com/leopalhas-projects/flame

### Backend (Railway)
- **URL API**: https://backend-production-28c3.up.railway.app
- **Dashboard**: https://railway.com/project/81506789-d7c8-49b9-a47c-7a6dc22442f7

---

## ✅ FUNCIONALIDADES ATIVAS

### Sistema Completo Deployado:
- ✅ **48 páginas** funcionais (incluindo dinâmicas)
- ✅ **15 Models** no backend
- ✅ **15 Controllers** + **15 Route files** (~100+ endpoints)
- ✅ **14 Services** de negócio
- ✅ **45 Components** reutilizáveis
- ✅ **16 Zustand Stores** para gerenciamento de estado
- ✅ **20+ Custom Hooks**

### Funcionalidades Operacionais:
- ✅ Autenticação (SMS OTP + Email/Senha)
- ✅ Google OAuth (funcionando em produção)
- ✅ Sistema de Pedidos + Tracking Real-time (Socket.IO)
- ✅ Cardápio Digital com 6 categorias
- ✅ Sistema de Cashback com 4 tiers (2%, 5%, 8%, 10%)
- ✅ Uso de cashback no checkout (Sprint 24)
- ✅ Bônus automáticos: cadastro R$10, aniversário por tier (Sprint 25)
- ✅ Reservas de Mesa
- ✅ Narguilé/Tabacaria (timer, sessões)
- ✅ Admin Dashboard completo
- ✅ Staff (Cozinha, Bar, Atendente, Caixa)
- ✅ PWA configurado com offline support
- ✅ 6 Temas dinâmicos via CSS variables
- ✅ Push Notifications (VAPID configurado)
- ✅ SMS via Twilio
- ✅ Stripe configurado (modo teste)
- ✅ Ficha Técnica/Insumos (Sprints 26-27)
- ✅ Componentes UI reutilizáveis (Sprint 21)

---

## ⚠️ DIVERGÊNCIAS CRÍTICAS (PRD vs Sistema)

> **Ver documento completo:** [ANALISE_PRD_VS_SISTEMA.md](./ANALISE_PRD_VS_SISTEMA.md)

| # | Problema | Impacto | Prioridade | Status |
|---|----------|---------|------------|--------|
| 1 | **Fluxo de Status**: Qualquer staff pode mudar qualquer status | Alto - integridade operacional | P0 | ✅ Sprint 23 |
| 2 | **Narguilé no Bar**: Deveria estar no Atendente | Médio - UX operacional | P1 | ✅ Sprint 23 |
| 3 | **Cashback no Checkout**: Uso como desconto não implementado | Alto - receita/fidelização | P0 | ✅ Sprint 24 |
| 4 | **Bônus Automáticos**: Cadastro R$10, aniversário - todos manuais | Baixo - marketing | P2 | ✅ Sprint 25 |
| 5 | **Ficha Técnica**: Baixa estoque direto no produto, sem insumos | Médio - controle estoque | P1 | ✅ Sprint 26 |
| 6 | **Notificação Atendente**: Não é notificado de novos pedidos | Médio - operação | P1 | ✅ Sprint 23 |

---

## 🎨 DESIGN SYSTEM - 100% COMPLETO

### Status Final
- ✅ **100% das páginas** usam CSS variables
- ✅ **0 cores hard-coded** restantes
- ✅ **369 botões** verificados e funcionais
- ✅ **Temas dinâmicos** funcionando

### CSS Variables Oficiais
```css
--theme-primary: #FF006E;      /* Magenta */
--theme-accent: #B266FF;       /* Purple */
--theme-secondary: #00D4FF;    /* Cyan */
--theme-primary-rgb: 255,0,110;
--theme-accent-rgb: 178,102,255;
--theme-secondary-rgb: 0,212,255;
```

### Páginas Corrigidas (Migração para CSS Variables)
1. ✅ `/filosofia` - Consolidada em `/conceito` (página excluída)
2. ✅ `/reservas` - Orange/Amber → Magenta/Cyan
3. ✅ `/complete-profile` - Purple/Pink → Tema padrão
4. ✅ `/termos` - Orange → Magenta

### Temas Disponíveis
1. FLAME (magenta/purple/cyan) - Padrão
2. INFERNO (red/purple)
3. PASSION (wine/pink)
4. NEON (purple/green)
5. TWILIGHT (purple/lavender)
6. AMBER (gold/pink)

---

## 📋 PÁGINAS DO SISTEMA (46 TOTAL)

### Públicas (12)
- `/` - Homepage
- `/login` - Login
- `/register` - Cadastro
- `/cardapio` - Cardápio
- `/historia` - Nossa História
- `/conceito` - Nosso Conceito ⭐ (consolidou /filosofia)
- `/logos` - Brand Assets
- `/404` - Página de Erro
- `/offline` - PWA Offline
- `/apresentacao` - Apresentação
- `/roadmap` - Roadmap
- `/termos` - Termos de Uso

### Cliente (6)
- `/perfil` - Perfil do Usuário
- `/checkout` - Finalizar Pedido
- `/recuperar-senha` - Recuperação
- `/complete-profile` - Completar Cadastro
- `/reservas` - Reservas
- `/cashback` - Cashback

### Admin (10)
- `/admin` - Dashboard
- `/admin/products` - Produtos
- `/admin/estoque` - Estoque
- `/admin/orders` - Pedidos
- `/admin/reports` - Relatórios
- `/admin/settings` - Configurações
- `/admin/clientes` - CRM
- `/admin/reservas` - Reservas
- `/admin/campanhas` - Campanhas
- `/admin/logs` - Logs

### Staff (5)
- `/staff/bar` - Bar
- `/atendente` - Atendente
- `/cozinha` - Cozinha
- `/staff/caixa` - Caixa
- `/staff/relatorios` - Relatórios

### Outros (13)
- `/pedidos`, `/avaliacoes`, `/qr-codes`, `/mesa`, `/amsterdam`, `/lampiao`, `/limpar-cache`, `/programacao`, etc.

---

## 🔑 VARIÁVEIS DE AMBIENTE

### Backend (Railway) - 21 variáveis
```bash
NODE_ENV=production
PORT=7000
DATABASE_URL=(auto via PostgreSQL)
JWT_SECRET=(configurado no Railway)
JWT_EXPIRE=7d

# Twilio SMS
TWILIO_ACCOUNT_SID=(configurado no Railway)
TWILIO_AUTH_TOKEN=(configurado no Railway)
TWILIO_PHONE_NUMBER=(configurado no Railway)

# Push Notifications
VAPID_PUBLIC_KEY=(configurado no Railway)
VAPID_PRIVATE_KEY=(configurado no Railway)
VAPID_SUBJECT=mailto:contato@flamelounge.com.br

# Jobs
JOBS_TIMEZONE=America/Sao_Paulo
JOBS_STOCK_ALERTS_ENABLED=true
JOBS_CASHBACK_EXPIRY_ENABLED=true

# Cashback
CASHBACK_BRONZE_RATE=0.02
CASHBACK_SILVER_RATE=0.05
CASHBACK_GOLD_RATE=0.08
CASHBACK_PLATINUM_RATE=0.10
CASHBACK_EXPIRY_DAYS=90

# Stripe (configurado)
STRIPE_SECRET_KEY=sk_test_51SVcch...
STRIPE_PUBLISHABLE_KEY=pk_test_51SVcch...

# Frontend
FRONTEND_URL=https://flame-lounge.vercel.app
```

### Frontend (Vercel) - 4 variáveis
```bash
NEXT_PUBLIC_API_URL=https://backend-production-28c3.up.railway.app/api
NEXT_PUBLIC_SOCKET_URL=https://backend-production-28c3.up.railway.app
NEXT_PUBLIC_VAPID_PUBLIC_KEY=(configurado no Railway)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SVcch...
```

---

## 🚀 SPRINTS

### SPRINT 23 - CORREÇÃO DE FLUXOS DE OPERAÇÃO ✅ COMPLETA

**Objetivo**: Corrigir toda a lógica de fluxo de pedidos, notificações e atribuições de responsabilidade

**Prioridade**: P0 (CRÍTICA - Operação do restaurante incorreta)
**Status**: ✅ COMPLETA (07/12/2024)

#### Realizações da Sprint 23:
1. ✅ **Status Machine** - `orderStatus.service.js` já implementado com transições e permissões
2. ✅ **Campos Timeline** - Model Order já tem confirmedAt, startedAt, finishedAt, pickedUpAt, deliveredAt
3. ✅ **Notificações Socket.IO** - Atendentes e Admins já são notificados corretamente
4. ✅ **Tab Novos Pedidos** - Adicionada ao painel do Atendente (pending/preparing)
5. ✅ **Narguilé no Atendente** - Já estava migrado para `/atendente` com tab funcional
6. ✅ **Webhook Seguro** - `/payment/confirm` agora requer autenticação
7. ✅ **CRUD Produtos Seguro** - Rotas protegidas com `requireRole(['admin', 'gerente'])`
8. ✅ **QR Code Corrigido** - URL agora gera `/cardapio?mesa=X` em vez de `/table/X`
9. ✅ **Job No-Show Corrigido** - Não usava mais campo inexistente `r.time`

---

### SPRINT 24 - CASHBACK NO CHECKOUT ✅ COMPLETA

**Objetivo**: Permitir que clientes usem saldo de cashback como desconto no checkout

**Prioridade**: P0 (CRÍTICA - Fidelização e receita)
**Status**: ✅ COMPLETA (07/12/2024)

#### Realizações da Sprint 24:
1. ✅ **Backend**: Campos `cashbackUsed` e `discount` no Order model
2. ✅ **Backend**: Migration `20251207_add_cashback_to_orders.js`
3. ✅ **Backend**: `createOrder` atualizado para aceitar `useCashback`
   - Valida saldo do usuário
   - Limita ao mínimo entre (saldo, total, solicitado)
   - Debita via `user.useCashback()` registrando no histórico
4. ✅ **Frontend**: UI de cashback no Checkout
   - Toggle para ativar/desativar uso
   - Slider para escolher valor
   - Exibe saldo disponível
5. ✅ **Frontend**: Resumo do pedido atualizado
   - Linha "Desconto Cashback: -R$ X,XX"
   - Total recalculado em tempo real

---

### SPRINT 25 - BÔNUS AUTOMÁTICOS ✅ COMPLETA

**Objetivo**: Implementar bônus automáticos de cadastro e aniversário

**Prioridade**: P2 (Marketing/Fidelização)
**Status**: ✅ COMPLETA (07/12/2024)

#### Realizações da Sprint 25:
1. ✅ **Backend**: Job `welcomeBonus.job.js` para bônus de cadastro
   - R$10 para novos usuários com perfil completo
   - Executa a cada hora
   - Verifica se já recebeu via CashbackHistory
2. ✅ **Backend**: Job `birthdayBonus.job.js` para bônus de aniversário
   - Bronze R$10, Silver R$50, Gold R$100, Platinum R$200
   - Executa diariamente às 8h
   - Usa campo `lastBirthdayBonusYear` para evitar duplicação
3. ✅ **Backend**: Novos campos no User model
   - `birthDate` (DATEONLY) - Data de nascimento
   - `lastBirthdayBonusYear` (INTEGER) - Controle de bônus anual
4. ✅ **Backend**: Migration `20251207_add_birthday_fields.js`

---

### SPRINT 26 - FICHA TÉCNICA/INSUMOS ✅ COMPLETA (Backend)

**Objetivo**: Sistema de controle de estoque por insumos

**Prioridade**: P1 (Controle de estoque)
**Status**: ✅ BACKEND COMPLETO (07/12/2024)

#### Realizações da Sprint 26:
1. ✅ **Model `Ingredient`**: Insumos com estoque, custo, fornecedor
   - Categorias: bebidas, carnes, frios, hortifruti, etc.
   - Unidades: kg, g, l, ml, un, cx, pct, dz
   - Métodos: isLowStock(), isOutOfStock(), getAvailablePortions()
2. ✅ **Model `RecipeItem`**: Ficha técnica (BOM)
   - Vincula produtos a insumos com quantidades
   - Constraint único produto-insumo
   - Campos: quantity, unit, isOptional, notes
3. ✅ **Model `IngredientMovement`**: Rastreamento de movimentações
   - Tipos: entrada, saida, ajuste, perda, transferencia
   - Razões: compra, producao, vencimento, quebra, inventario
4. ✅ **Service `ingredient.service.js`**: Lógica de negócio
   - deductIngredientsForOrder() - baixa automática
   - addStock(), adjustStock(), registerLoss()
   - calculateProductCost(), getCMVReport()
5. ✅ **Controller `ingredientController.js`**: Endpoints completos
   - CRUD de insumos
   - Gestão de estoque (entrada, ajuste, perda)
   - Ficha técnica (add/update/remove items)
   - Relatórios CMV
6. ✅ **Routes `ingredients.js`**: Rotas protegidas por role
   - GET /ingredients - Lista (admin, gerente, cozinha, bar)
   - POST /ingredients - Criar (admin, gerente)
   - POST /:id/stock/add - Entrada (admin, gerente)
   - GET /recipe/product/:id - Ficha técnica
   - GET /reports/cmv - Relatório CMV
7. ✅ **Migration `20251207_create_ingredients_tables.js`**
   - Cria 3 tabelas: ingredients, recipe_items, ingredient_movements
   - Índices otimizados para consultas frequentes

#### Pendente (Sprint 27 - Frontend):
- [ ] UI de cadastro de insumos
- [ ] UI de ficha técnica por produto
- [ ] Dashboard de estoque com alertas
- [ ] Relatórios visuais de CMV

---

### SPRINT 27 - FRONTEND DE INSUMOS ✅ COMPLETA

**Objetivo**: Interface para gerenciamento de insumos e ficha técnica

**Prioridade**: P1 (Complementa Sprint 26)
**Status**: ✅ COMPLETA (07/12/2024)

#### Realizações da Sprint 27:
1. ✅ **Store `ingredientStore.js`**: Gerenciamento de estado Zustand
   - CRUD de insumos, operações de estoque
   - Ficha técnica (recipe), movimentações
   - Relatórios CMV
2. ✅ **Página `/admin/insumos`**: Interface completa
   - Listagem com filtros (busca, categoria)
   - Cards de estatísticas (total, críticos, alertas, valor)
   - Tabs: Todos / Estoque Baixo
   - Tabela com status visual (OK, Baixo, Sem estoque)
   - Modal de criação/edição de insumos
   - Modal de operações de estoque (entrada, ajuste, perda)
   - Modal de histórico de movimentações
3. ✅ **Dashboard Admin**: Link para Insumos e Estoque adicionados
4. ✅ **Permissões**: Verificação de role (admin, gerente)

#### Pendente (futuras sprints):
- [ ] Modal de ficha técnica integrado à página de produtos
- [ ] Relatórios CMV com gráficos
- [ ] Alertas push de estoque baixo

---

## PROBLEMAS IDENTIFICADOS

### 1. FLUXO DE PEDIDOS INCORRETO
**Problema Atual**: Pedidos chegam fora de sequência, marcar como "pronto" causa comportamento inesperado.

**Fluxo ATUAL (Errado)**:
```
Pedido criado → pending → preparing → ready → on_way → delivered
                  ↑
           (qualquer um pode mudar)
```

**Fluxo CORRETO (A implementar)**:
```
1. Cliente faz pedido → status: "pending"
2. Cozinha ACEITA pedido → status: "preparing" (inicia timer)
3. Cozinha FINALIZA preparo → status: "ready"
4. Atendente BUSCA na cozinha → status: "on_way"
5. Atendente ENTREGA ao cliente → status: "delivered"
6. (opcional) Cliente PAGA → status: "paid"
```

### 2. NOTIFICAÇÕES DO ATENDENTE FALTANDO
**Problema**: Atendente não é notificado quando pedido é criado.

**Comportamento Atual**:
- Cozinha e Bar recebem notificação de novo pedido
- Atendente NÃO recebe notificação inicial

**Comportamento Correto**:
- Atendente deve receber notificação de TODOS pedidos novos
- Atendente deve saber que terá que buscar pedido quando estiver pronto
- Atendente deve receber alerta destacado quando pedido ficar "ready"

### 3. DASHBOARD ADMIN/GERENTE INCOMPLETO
**Problema**: Admin/Gerente não vê ciclo completo de todos os pedidos.

**Falta**:
- Visão de todos pedidos em tempo real
- Status de cada pedido desde criação até pagamento
- Métricas de tempo em cada etapa
- Alertas de pedidos atrasados

### 4. NARGUILÉ NO LUGAR ERRADO
**Problema**: Narguilé está no painel do Bar, mas deveria ser do Atendente.

**Motivo**: Atendente é quem:
- Acende o narguilé
- Troca carvão
- Controla sessão na mesa
- Interage com cliente

---

## PLANO DE CORREÇÃO

### FASE 1: Backend - Lógica de Status (1-2 dias)

#### 1.1 Criar Status Machine
**Arquivo**: `backend/src/services/orderStatus.service.js` (NOVO)

```javascript
// Regras de transição de status
const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],      // Cozinha aceita OU cliente cancela
  confirmed: ['preparing', 'cancelled'],    // Cozinha inicia preparo
  preparing: ['ready', 'cancelled'],        // Cozinha finaliza
  ready: ['on_way'],                        // Atendente busca
  on_way: ['delivered'],                    // Atendente entrega
  delivered: ['paid', 'rated'],             // Cliente paga ou avalia
  paid: ['rated'],                          // Cliente avalia
  cancelled: []                             // Estado final
};

// Quem pode fazer cada transição
const STATUS_PERMISSIONS = {
  'pending→confirmed': ['cozinha', 'bar', 'admin'],
  'confirmed→preparing': ['cozinha', 'bar', 'admin'],
  'preparing→ready': ['cozinha', 'bar', 'admin'],
  'ready→on_way': ['atendente', 'admin'],
  'on_way→delivered': ['atendente', 'admin'],
  'delivered→paid': ['caixa', 'admin'],
  '*→cancelled': ['cliente', 'admin', 'gerente']
};
```

#### 1.2 Refatorar orderController.updateOrderStatus
- Validar transições permitidas
- Verificar permissão do usuário
- Registrar timestamp de cada mudança
- Emitir eventos WebSocket corretos

#### 1.3 Adicionar Campos ao Model Order
```javascript
// Novos campos para rastrear timeline
confirmedAt: DataTypes.DATE,
preparingStartedAt: DataTypes.DATE,
readyAt: DataTypes.DATE,
pickedUpAt: DataTypes.DATE,   // Atendente buscou
deliveredAt: DataTypes.DATE,
paidAt: DataTypes.DATE,
// Quem fez cada ação
confirmedBy: DataTypes.UUID,
preparedBy: DataTypes.UUID,
deliveredBy: DataTypes.UUID,
receivedBy: DataTypes.UUID    // Caixa que recebeu pagamento
```

---

### FASE 2: Backend - Notificações Corrigidas (1 dia)

#### 2.1 Corrigir socket.service.js - Notificar Atendente
**Arquivo**: `backend/src/services/socket.service.js`

```javascript
// ATUAL: Só notifica kitchen/bar
notifyNewOrder(order) {
  this.io.to('kitchen').emit('order_created', order);
  this.io.to('bar').emit('order_created', order);
}

// CORRETO: Incluir atendentes
notifyNewOrder(order) {
  this.io.to('kitchen').emit('order_created', order);
  this.io.to('bar').emit('order_created', order);
  this.io.to('attendants').emit('order_created', order); // ← ADICIONAR
  this.io.to('admins').emit('order_created', order);     // ← ADICIONAR
}
```

#### 2.2 Criar Eventos de Status Específicos
```javascript
// Quando pedido fica READY
notifyOrderReady(order) {
  // Alerta URGENTE para atendente
  this.io.to('attendants').emit('order_ready_alert', {
    order,
    priority: 'high',
    message: `Pedido #${order.orderNumber} PRONTO para entrega!`,
    table: order.tableId ? order.table.number : 'Balcão'
  });

  // SMS para cliente (se tiver celular)
  if (order.user.celular) {
    smsService.send(order.user.celular, `Seu pedido #${order.orderNumber} está pronto!`);
  }
}

// Quando atendente pega o pedido
notifyOrderPickedUp(order, attendantId) {
  this.io.to('kitchen').emit('order_picked_up', { order, attendantId });
  this.io.to('bar').emit('order_picked_up', { order, attendantId });
}
```

---

### FASE 3: Frontend - Dashboard Atendente (1 dia)

#### 3.1 Adicionar Tab "Novos Pedidos"
**Arquivo**: `frontend/src/pages/atendente/index.js`

```javascript
// ATUAL: Tabs = ["Prontos", "Entregues", "Balcão"]
// CORRETO: Tabs = ["Novos", "Prontos", "Entregues", "Balcão"]

// Nova tab mostra pedidos:
// - status: pending, confirmed, preparing
// - Atendente sabe o que está vindo
// - Badge com contagem de novos
```

#### 3.2 Melhorar Alertas Visuais
- Som de notificação quando pedido fica READY
- Badge piscante para pedidos prontos
- Cor diferente para pedidos atrasados (>15min em ready)

---

### FASE 4: Frontend - Migrar Narguilé para Atendente (0.5 dia)

#### 4.1 Mover Tab Narguilé
**De**: `frontend/src/pages/staff/bar.js`
**Para**: `frontend/src/pages/atendente/index.js`

#### 4.2 Atualizar Permissões Backend
**Arquivo**: `backend/src/routes/hookah.js`
- Mudar validação de `['bar']` para `['atendente']`
- Manter acesso de admin/gerente

#### 4.3 Remover Narguilé do Bar
- Remover tab "Narguilé" do painel Bar
- Bar foca apenas em bebidas

---

### FASE 5: Dashboard Admin/Gerente (1 dia)

#### 5.1 Criar Visão Unificada de Pedidos
**Arquivo**: `frontend/src/pages/admin/orders.js` (refatorar)

```javascript
// Mostrar TODOS pedidos em grid/lista com:
// - Número do pedido
// - Mesa/Balcão
// - Status atual (com cor)
// - Tempo em cada etapa
// - Responsável por cada ação
// - Timeline visual do pedido
```

#### 5.2 Adicionar Filtros Rápidos
- Por status
- Por mesa
- Por atendente
- Por período
- Atrasados (highlight)

#### 5.3 Métricas em Tempo Real
- Pedidos pendentes
- Tempo médio de preparo
- Pedidos atrasados
- Faturamento do dia

---

### FASE 6: Testes E2E (0.5 dia)

#### 6.1 Testar Fluxo Completo
1. Cliente faz pedido
2. Cozinha recebe e aceita
3. Cozinha marca como preparando
4. Cozinha marca como pronto
5. Atendente recebe alerta
6. Atendente busca e entrega
7. Admin vê todo o ciclo

#### 6.2 Testar Notificações
- WebSocket para cada role
- SMS para cliente
- Push notifications

#### 6.3 Testar Permissões
- Cozinha não pode marcar "delivered"
- Atendente não pode marcar "ready"
- Cliente não pode mudar status

---

## ARQUIVOS A MODIFICAR

### Backend
1. `src/services/orderStatus.service.js` - NOVO
2. `src/services/socket.service.js` - Refatorar notificações
3. `src/controllers/orderController.js` - Usar status machine
4. `src/models/Order.js` - Adicionar campos timeline
5. `src/routes/hookah.js` - Mudar permissões
6. `src/controllers/staffController.js` - Atualizar dashboards

### Frontend
1. `src/pages/atendente/index.js` - Adicionar tab Novos + Narguilé
2. `src/pages/staff/bar.js` - Remover tab Narguilé
3. `src/pages/admin/orders.js` - Visão unificada
4. `src/stores/staffStore.js` - Novos eventos WebSocket
5. `src/services/socket.js` - Handlers de eventos

---

## CHECKLIST SPRINT 23

### Fase 1 - Status Machine
- [ ] Criar orderStatus.service.js
- [ ] Definir transições permitidas
- [ ] Definir permissões por role
- [ ] Adicionar campos timeline ao Order
- [ ] Refatorar updateOrderStatus

### Fase 2 - Notificações
- [ ] Notificar atendente em novo pedido
- [ ] Notificar admin em novo pedido
- [ ] Criar evento order_ready_alert
- [ ] Criar evento order_picked_up
- [ ] SMS quando pedido fica pronto

### Fase 3 - Dashboard Atendente
- [ ] Adicionar tab "Novos Pedidos"
- [ ] Badge de contagem
- [ ] Som de notificação
- [ ] Alertas visuais para ready

### Fase 4 - Migrar Narguilé
- [ ] Mover tab para atendente
- [ ] Atualizar permissões backend
- [ ] Remover do bar
- [ ] Testar funcionalidades

### Fase 5 - Dashboard Admin
- [ ] Grid de todos pedidos
- [ ] Timeline visual
- [ ] Filtros rápidos
- [ ] Métricas tempo real

### Fase 6 - Testes
- [ ] Fluxo completo E2E
- [ ] Notificações WebSocket
- [ ] Permissões de cada role
- [ ] Deploy e validação

---

### SPRINT 19.1 - HOTFIX BACKEND ✅ RESOLVIDO

**Objetivo**: Restaurar backend que estava offline (Error 502)

**Status**: ✅ COMPLETO

#### Problemas Resolvidos:
- ✅ Erro `Order.total cannot be null` - Sequelize validava antes do hook
- ✅ Erro `paymentResult is not defined` - Escopo de variável
- ✅ Erro PostgreSQL `tableId NOT NULL` - Constraint no banco incompatível com model
- ✅ Erro login `identifier` vs `email` - Frontend enviava `identifier`

#### Soluções Aplicadas:
- Calcular total/serviceFee/taxes ANTES do Order.create()
- Declarar paymentResult no escopo externo do try
- Executar ALTER TABLE para permitir tableId NULL
- Aceitar ambos `email` e `identifier` no login

**Data**: 06/12/2024

---

### SPRINT 20 - GOOGLE OAUTH ⚠️ 90% COMPLETO - AGUARDANDO CREDENCIAIS

**Objetivo**: Implementar autenticação com Google OAuth 2.0

**Prioridade**: P0 (Alta) - Feature de acessibilidade crítica
**Estimativa**: 2-3 dias
**Status Atual**: 🟡 Código 100% pronto, aguardando configuração manual

#### Checklist Resumido:
- [ ] **MANUAL**: Criar projeto no Google Cloud Console
- [ ] **MANUAL**: Configurar OAuth 2.0 Client ID e copiar credenciais
- [x] Backend: Instalar google-auth-library
- [x] Backend: Adicionar campos ao modelo User (googleId, googleProfilePicture, authProvider)
- [x] Backend: Criar google.service.js
- [x] Backend: Adicionar rota POST /auth/google
- [x] Frontend: Carregar Google SDK no _app.js
- [x] Frontend: Criar GoogleLoginButton component
- [x] Frontend: Adicionar método googleLogin() no authStore
- [x] Frontend: Adicionar botões em /login e /register
- [ ] Configurar variáveis GOOGLE_CLIENT_ID (Railway + Vercel)
- [ ] Deploy e testes E2E

**📝 Guia Completo**: [PROXIMOS_PASSOS_GOOGLE_OAUTH.md](../PROXIMOS_PASSOS_GOOGLE_OAUTH.md)
**Detalhes Técnicos**: Ver seção "SPRINT 20 DETALHADA" abaixo

---

### SPRINT 21 - MELHORIAS DE UX ✅ COMPLETA

**Objetivo**: Melhorar experiência do usuário

**Prioridade**: P2
**Status**: ✅ COMPLETA (07/12/2024)

#### Realizações da Sprint 21:
1. ✅ **Componente Button** (`components/Button.js`)
   - 8 variantes: primary, secondary, accent, ghost, danger, success, outline, dark
   - 5 tamanhos: xs, sm, md, lg, xl
   - Suporte a loading, disabled, fullWidth
   - Suporte a ícones (leftIcon, rightIcon)
   - Componentes: Button, IconButton, ButtonGroup
2. ✅ **Componente Input** (`components/Input.js`)
   - Input base com label, error, hint, ícones
   - PasswordInput com toggle de visibilidade
   - SearchInput com botão de limpar
   - TextArea para textos longos
   - Select com dropdown estilizado
   - Checkbox e Toggle/Switch
3. ✅ **Loading Skeletons** (`components/LoadingSpinner.js`)
   - SkeletonProductCard, SkeletonOrderCard
   - SkeletonProfile, SkeletonStats
   - SkeletonMenu, SkeletonForm
   - InlineLoader, PageLoader
4. ✅ **Design System Guide** (`docs/11_DESIGN_SYSTEM_GUIDE.md`)
   - Documentação completa de cores, tipografia
   - Exemplos de uso de todos componentes
   - Padrões de layout e animações
   - Temas disponíveis

---

### SPRINT 22 - TESTES E2E ✅ COMPLETA

**Objetivo**: Cobertura completa de testes E2E

**Prioridade**: P2
**Status**: ✅ COMPLETA (07/12/2024)

#### Realizações da Sprint 22:
1. ✅ **Cypress Configurado** (`cypress.config.js`)
   - Configuração para dev e produção
   - Suporte a variáveis de ambiente
   - Retry automático em CI/CD
   - Logging de resultados por spec
2. ✅ **Commands Customizados** (`cypress/support/commands.js`)
   - `mockLogin`, `mockLoginAsAdmin`, `mockLoginAsKitchen`, etc.
   - `mockCart`, `clearCart`
   - `checkToast`, `waitForLoading`
   - `interceptApi`, `interceptApiWithFixture`
   - `setMobileViewport`, `setTabletViewport`, `setDesktopViewport`
   - `fillForm`, `selectOption`, `toggleCheckbox`
3. ✅ **Testes de Autenticação** (`cypress/e2e/auth.cy.js`)
   - Login page, Register page
   - Protected routes
   - Authenticated user flows
   - Logout
4. ✅ **Testes de Pedidos** (`cypress/e2e/orders.cy.js`)
   - Cart management
   - Checkout process
   - Order tracking
   - Mesa (table) orders
   - Order status flow (Kitchen/Attendant views)
5. ✅ **Testes de Cashback** (`cypress/e2e/cashback.cy.js`)
   - Cashback display
   - Tier levels (Bronze, Silver, Gold, Platinum)
   - Cashback in checkout
   - Earning and usage
   - Bonus system
6. ✅ **Testes de Admin** (`cypress/e2e/admin.cy.js`)
   - Dashboard access
   - Products management
   - Orders management
   - Customers (CRM)
   - Reports
   - Stock management
   - Ingredients (Insumos)
   - Reservations
   - Staff dashboards (Kitchen, Bar, Attendant, Cashier)
   - Access control by role
7. ✅ **Fixtures** (`cypress/fixtures/`)
   - `user.json` - Usuários de teste
   - `products.json` - Produtos e categorias
   - `orders.json` - Pedidos em diversos estados
   - `cashback.json` - Tiers, bônus, transações

#### Como Executar:
```bash
# Abrir Cypress UI (desenvolvimento)
npm run cypress

# Executar todos os testes headless
npm run cypress:run

# Executar com servidor de desenvolvimento
npm run e2e

# Para produção
CYPRESS_BASE_URL=https://flame-lounge.vercel.app npm run cypress:run
```

---

## 📊 HISTÓRICO DE SPRINTS COMPLETADAS

### SPRINT 19 - AUDITORIA E MIGRAÇÃO DE DESIGN SYSTEM ✅
**Data**: 05/12/2024
**Status**: ✅ COMPLETO

**Realizações**:
- ✅ Auditoria de 47 páginas
- ✅ Catalogação de 369 botões
- ✅ Migração de 4 páginas para CSS variables
- ✅ Consolidação de /filosofia em /conceito
- ✅ 100% conformidade com design system
- ✅ Deploy em produção

**Commits**:
- `62bfb0d` - feat: migrar todas as páginas para CSS variables do tema
- `acea02c` - refactor: consolidar /filosofia em /conceito e finalizar migração

---

### SPRINT 18 - DEPLOY COMPLETO ✅
**Data**: 04/12/2024
**Status**: ✅ COMPLETO

**Realizações**:
- ✅ Backend no Railway com PostgreSQL
- ✅ Frontend no Vercel
- ✅ 45 páginas compiladas
- ✅ Twilio configurado
- ✅ VAPID gerado
- ✅ Stripe configurado
- ✅ Domínio permanente: flame-lounge.vercel.app

---

## 🛠️ COMANDOS ÚTEIS

### Deploy
```bash
# Backend
cd backend
railway up

# Frontend
cd frontend
vercel --prod
```

### Logs
```bash
# Backend
railway logs

# Frontend
vercel logs
```

### Variáveis
```bash
# Backend
railway variables

# Frontend
vercel env ls
```

### Dashboards
```bash
railway open
vercel inspect
```

---

## 🔐 CREDENCIAIS E ACESSOS

### Google Cloud (Para Sprint 20)
- Console: https://console.cloud.google.com/
- Projeto: FLAME Lounge (a criar)

### Stripe
- Dashboard: https://dashboard.stripe.com/
- Modo: Test
- Keys: Configuradas no Railway e Vercel

### Twilio
- Console: https://console.twilio.com/
- Account SID: (ver Railway)
- Phone: (ver Railway)

### Railway
- Dashboard: https://railway.com/project/81506789-d7c8-49b9-a47c-7a6dc22442f7
- Service: backend (496634b3-f564-4015-b081-ec1f4955d4cc)
- Database: Postgres-9QOL

### Vercel
- Dashboard: https://vercel.com/leopalhas-projects/flame
- Domínio: flame-lounge.vercel.app

---

## 📞 INFORMAÇÕES DO PROJETO

### FLAME Lounge Bar & Tabacaria
- **Endereço**: Rua Arnaldo Quintela 19, Botafogo - RJ
- **Instagram**: @flamelounge_
- **WhatsApp**: +55 21 99554-6492
- **Email**: contato@flamelounge.com.br

### Conceito
"Fogo que aquece, não que queima"
- Lounge bar + Gastronomia + Narguilé premium
- Localização: 8ª rua mais cool do mundo (Time Out 2024)
- Tagline: "Prepare-se, vai esquentar"

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. **Decidir Sprint**: Google OAuth (Sprint 20) ou Melhorias UX (Sprint 21)?
2. **Testes**: Validar todas funcionalidades em produção
3. **Monitoramento**: Acompanhar logs Railway e Vercel
4. **Opcional**: Configurar Stripe webhook para notificações

---

---

# SPRINT 20 DETALHADA - GOOGLE OAUTH IMPLEMENTATION

**Objetivo**: Implementar autenticação com Google OAuth 2.0 para cadastro e login

**Prioridade**: P0 (Alta) - Feature de acessibilidade crítica
**Estimativa**: 2-3 dias
**Status**: [ ] Não Iniciado

---

## LEGENDA DE STATUS

- [ ] Não iniciado
- [~] Em andamento
- [x] Concluído
- [!] Bloqueado
- [-] Pausado

---

## FASE 1: PREPARAÇÃO E CONFIGURAÇÃO

### [ ] 1.1 Criar Projeto no Google Cloud Console

**Ações**:
1. Acessar https://console.cloud.google.com/
2. Criar novo projeto "FLAME Lounge" ou usar existente
3. Ativar "Google+ API"
4. Ir em "Credentials" > "Create Credentials"
5. Configurar OAuth 2.0 Client ID:
   - Application Type: Web Application
   - Name: FLAME OAuth Client
   - Authorized JavaScript origins:
     - `http://localhost:3000` (dev)
     - `https://flame-lounge.vercel.app` (prod)
   - Authorized redirect URIs:
     - `http://localhost:3000` (dev)
     - `https://flame-lounge.vercel.app` (prod)
6. Copiar Client ID
7. Copiar Client Secret

**Dependências**: Nenhuma
**Bloqueadores**: Acesso ao Google Cloud Console
**Tempo Estimado**: 30min

---

## FASE 2: BACKEND - MODELO E SERVIÇOS

### [ ] 2.1 Instalar Dependências

```bash
cd backend
npm install google-auth-library
```

**Arquivo**: `backend/package.json`
**Tempo Estimado**: 5min

---

### [ ] 2.2 Adicionar Campos ao Modelo User

**Arquivo**: `backend/src/models/User.js`

**Campos a adicionar** (~linha 220-240):
```javascript
googleId: {
  type: DataTypes.STRING,
  allowNull: true,
  unique: true,
  comment: 'ID único do Google OAuth'
},
googleProfilePicture: {
  type: DataTypes.STRING,
  allowNull: true,
  comment: 'URL da foto de perfil do Google'
},
authProvider: {
  type: DataTypes.TEXT,
  defaultValue: 'local',
  allowNull: false,
  validate: {
    isIn: [['local', 'google']]
  },
  comment: 'Provedor de autenticação utilizado'
}
```

**Atualizar método** `hasCompleteProfile()`:
```javascript
hasCompleteProfile() {
  if (this.authProvider === 'google') {
    return !!(this.nome && this.email && this.googleId);
  }
  return !!(this.nome && this.email && this.profileComplete);
}
```

**Tempo Estimado**: 15min

---

### [ ] 2.3 Criar Google Service

**Arquivo**: `backend/src/services/google.service.js` (NOVO)

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class GoogleService {
  async verifyToken(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      return {
        sub: payload.sub,
        email: payload.email,
        email_verified: payload.email_verified,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name
      };
    } catch (error) {
      throw new Error('Token do Google inválido');
    }
  }
}

module.exports = new GoogleService();
```

**Tempo Estimado**: 10min
**Dependências**: 2.1 instalação concluída

---

## FASE 3: BACKEND - CONTROLLER E ROTAS

### [ ] 3.1 Adicionar Método googleAuth no AuthController

**Arquivo**: `backend/src/controllers/authController.js`
**Linha**: Após método `completeProfile` (~920)

**Adicionar import**:
```javascript
const googleService = require('../services/google.service');
```

**Adicionar método**:
```javascript
async googleAuth(req, res) {
  try {
    const { credential } = req.body;
    console.log('🔐 GOOGLE AUTH:', { credentialLength: credential.length });

    // 1. Validar token com Google
    const googleUser = await googleService.verifyToken(credential);
    const { sub: googleId, email, name, picture } = googleUser;

    console.log('✅ GOOGLE USER:', { googleId, email, name });

    // 2. Buscar usuário por googleId OU email
    let user = await User.findOne({
      where: {
        [Op.or]: [{ googleId }, { email }]
      }
    });

    let isNewUser = false;

    // 3. SE NÃO EXISTIR: Criar novo
    if (!user) {
      console.log('📝 Criando novo usuário via Google');
      user = await User.create({
        googleId,
        email,
        nome: name,
        googleProfilePicture: picture,
        authProvider: 'google',
        profileComplete: true,
        phoneVerified: false,
        emailVerified: true,
        role: 'cliente'
      });
      isNewUser = true;
    }
    // 4. SE EXISTIR MAS SEM GOOGLE_ID: Vincular conta
    else if (!user.googleId) {
      console.log('🔗 Vinculando conta Google a usuário existente');
      await user.update({
        googleId,
        googleProfilePicture: picture,
        authProvider: 'google'
      });
    }

    // 5. Gerar JWT
    const token = generateToken(user.id);

    // 6. Atualizar último login
    await user.update({ lastLogin: new Date() });

    console.log('✅ GOOGLE AUTH SUCCESS:', { userId: user.id, isNewUser });

    // 7. Retornar
    res.status(200).json({
      success: true,
      message: isNewUser ? 'Cadastro realizado com sucesso!' : 'Login realizado com sucesso',
      data: {
        user: user.toJSON(),
        token,
        isNewUser,
        needsPhone: !user.celular
      }
    });
  } catch (error) {
    console.error('❌ GOOGLE AUTH ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao autenticar com Google',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
```

**Tempo Estimado**: 20min

---

### [ ] 3.2 Adicionar Rota POST /auth/google

**Arquivo**: `backend/src/routes/auth.js`
**Linha**: Após rota `/complete-profile` (~91)

```javascript
/**
 * @route   POST /api/auth/google
 * @desc    Autenticar/Cadastrar com Google OAuth 2.0
 * @access  Public
 * @body    { credential: string (JWT) }
 */
router.post('/google', authController.googleAuth);
```

**Tempo Estimado**: 5min
**Dependências**: 2.3, 3.1 concluídos

---

## FASE 4: FRONTEND - GOOGLE SDK E COMPONENTE

### [ ] 4.1 Carregar Google Identity Services no _app.js

**Arquivo**: `frontend/src/pages/_app.js`

```javascript
import Script from 'next/script';

// ...no return
<>
  {/* Google Identity Services */}
  <Script
    src="https://accounts.google.com/gsi/client"
    strategy="beforeInteractive"
  />

  <Component {...pageProps} />
</>
```

**Tempo Estimado**: 5min

---

### [ ] 4.2 Criar Componente GoogleLoginButton

**Arquivo**: `frontend/src/components/GoogleLoginButton.js` (NOVO)

```javascript
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function GoogleLoginButton({ text = 'continue_with' }) {
  const { googleLogin } = useAuthStore();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    window.google.accounts.id.renderButton(
      buttonRef.current,
      {
        theme: 'filled_black',
        size: 'large',
        text: text,
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 320
      }
    );
  }, []);

  const handleCredentialResponse = async (response) => {
    console.log('📱 Google Credential recebido');
    await googleLogin(response.credential);
  };

  return (
    <div className="flex justify-center">
      <div ref={buttonRef} />
    </div>
  );
}
```

**Tempo Estimado**: 10min
**Dependências**: 4.1 concluído

---

## FASE 5: FRONTEND - AUTHSTORE E INTEGRAÇÃO

### [ ] 5.1 Adicionar googleLogin() no authStore

**Arquivo**: `frontend/src/stores/authStore.js`
**Linha**: Após método `completeProfile` (~692)

```javascript
googleLogin: async (credential) => {
  set({ isLoading: true });
  try {
    console.log('🔐 GOOGLE LOGIN:', { credentialLength: credential.length });

    const response = await api.post('/auth/google', { credential });

    console.log('✅ GOOGLE LOGIN RESPONSE:', response.data);

    if (response.data.success) {
      const { user, token, isNewUser, needsPhone } = response.data.data;

      // Salvar no estado
      set({
        user,
        token,
        isAuthenticated: true
      });

      // Configurar token na API
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Mensagem de sucesso
      if (isNewUser) {
        toast.success('Bem-vindo ao FLAME! 🔥');

        if (needsPhone) {
          toast('Adicione seu celular para receber atualizações por SMS', {
            icon: '📱',
            duration: 5000
          });
        }
      } else {
        toast.success('Login realizado com sucesso!');
      }

      return { success: true, user, isNewUser };
    } else {
      toast.error(response.data.message || 'Erro no login com Google');
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    console.error('❌ GOOGLE LOGIN ERROR:', error.response?.data);
    const message = error.response?.data?.message || 'Erro ao fazer login com Google';
    toast.error(message);
    return { success: false, error: message };
  } finally {
    set({ isLoading: false });
  }
}
```

**Tempo Estimado**: 15min

---

### [ ] 5.2 Adicionar GoogleLoginButton na página login

**Arquivo**: `frontend/src/pages/login.js`

**Import**:
```javascript
import GoogleLoginButton from '../components/GoogleLoginButton';
```

**Adicionar antes do formulário**:
```jsx
<div className="mb-6">
  <GoogleLoginButton text="signin_with" />

  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-purple-300/30"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-slate-950 text-purple-300">ou</span>
    </div>
  </div>
</div>
```

**Tempo Estimado**: 10min

---

### [ ] 5.3 Adicionar GoogleLoginButton na página register

**Arquivo**: `frontend/src/pages/register.js`

**Import**:
```javascript
import GoogleLoginButton from '../components/GoogleLoginButton';
```

**Adicionar antes do formulário**:
```jsx
<div className="mb-6">
  <GoogleLoginButton text="signup_with" />

  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-purple-300/30"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-slate-950 text-purple-300">ou</span>
    </div>
  </div>
</div>
```

**Tempo Estimado**: 10min
**Dependências**: 4.2, 5.1 concluídos

---

## FASE 6: VARIÁVEIS DE AMBIENTE

### [ ] 6.1 Configurar Backend (.env)

**Arquivo**: `backend/.env`

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Tempo Estimado**: 2min

---

### [ ] 6.2 Configurar Frontend (.env.production)

**Arquivo**: `frontend/.env.production`

```bash
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Tempo Estimado**: 2min

---

### [ ] 6.3 Configurar Frontend (.env.local) para Dev

**Arquivo**: `frontend/.env.local`

Copiar mesmas variáveis de `.env.production`

**Tempo Estimado**: 1min

---

### [ ] 6.4 Atualizar Backend .env.example

**Arquivo**: `backend/.env.example`

Adicionar após seção Twilio:
```bash
# ============================================
# Google OAuth Configuration
# ============================================
# Get credentials at: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Tempo Estimado**: 2min
**Dependências**: Fase 1 concluída

---

## FASE 7: DEPLOY E CONFIGURAÇÃO

### [ ] 7.1 Atualizar Variáveis no Railway

```bash
railway variables --service backend --set "GOOGLE_CLIENT_ID=..."
railway variables --service backend --set "GOOGLE_CLIENT_SECRET=..."
```

**Tempo Estimado**: 5min

---

### [ ] 7.2 Atualizar Variáveis no Vercel

```bash
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID production
# Cole o Client ID
```

**Tempo Estimado**: 5min

---

### [ ] 7.3 Deploy Backend

```bash
cd backend
railway up
```

**Tempo Estimado**: 3min

---

### [ ] 7.4 Deploy Frontend

```bash
cd frontend
vercel --prod
```

**Tempo Estimado**: 3min
**Dependências**: Todas as fases anteriores

---

## FASE 8: TESTES E VALIDAÇÃO

### [ ] 8.1 Teste: Novo Usuário via Google

**Cenário**: Primeiro acesso

**Passos**:
1. Acessar `/login` em produção
2. Clicar "Entrar com Google"
3. Escolher conta Google (nova, sem cadastro prévio)

**Verificações**:
- ✅ Usuário criado automaticamente
- ✅ `profileComplete = true`
- ✅ Redireciona para `/cardapio`
- ✅ Pode fazer pedido imediatamente
- ✅ Toast: "Bem-vindo ao FLAME! 🔥"
- ✅ Toast secundário: "Adicione celular..."

**Tempo Estimado**: 5min

---

### [ ] 8.2 Teste: Login Google com Conta Existente

**Cenário**: Segundo acesso

**Passos**:
1. Fazer logout
2. Fazer login Google com mesma conta do teste anterior

**Verificações**:
- ✅ Login bem-sucedido
- ✅ Mesmo usuário retornado (não cria duplicado)
- ✅ Toast: "Login realizado com sucesso"
- ✅ Mantém dados anteriores

**Tempo Estimado**: 3min

---

### [ ] 8.3 Teste: Vinculação de Contas (Email Duplicado)

**Cenário**: Unificação de contas

**Passos**:
1. Criar conta tradicional com email X
2. Fazer logout
3. Fazer login Google com mesmo email X

**Verificações**:
- ✅ Vincula `googleId` ao usuário existente
- ✅ Não cria usuário duplicado
- ✅ Mantém dados originais (celular, pedidos, etc)
- ✅ `authProvider` atualizado para 'google'

**Tempo Estimado**: 5min

---

### [ ] 8.4 Teste: Fazer Pedido após Login Google

**Cenário**: Fluxo completo de pedido

**Passos**:
1. Login com Google
2. Acessar `/cardapio`
3. Adicionar itens ao carrinho
4. Ir para checkout
5. Confirmar pedido

**Verificações**:
- ✅ Pedido criado com sucesso
- ✅ Não exige completar perfil
- ✅ Aparece na fila da cozinha/bar

**Tempo Estimado**: 5min

---

### [ ] 8.5 Teste: Adicionar Celular Posteriormente

**Cenário**: Opcional - complementar perfil

**Passos**:
1. Login com Google (sem celular)
2. Acessar `/perfil`
3. Adicionar número de celular

**Verificações**:
- ✅ Celular salvo no perfil
- ✅ `phoneVerified` pode ser atualizado

**Tempo Estimado**: 3min

---

### [ ] 8.6 Teste: Console de Erros

**Cenário**: Validação técnica

**Passos**:
1. Verificar console do navegador (F12)
2. Verificar logs do Railway

**Verificações**:
- ✅ Sem erros JavaScript
- ✅ Sem erros 500 no backend
- ✅ Logs de debug aparecem corretamente

**Tempo Estimado**: 3min

---

## CHECKLIST FINAL

### Backend
- [ ] `google-auth-library` instalado
- [ ] Modelo User com 3 campos novos
- [ ] `google.service.js` criado
- [ ] Método `googleAuth()` no authController
- [ ] Rota `POST /auth/google` criada
- [ ] Variáveis `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` configuradas
- [ ] Deploy no Railway concluído

### Frontend
- [ ] Google SDK carregado no `_app.js`
- [ ] `GoogleLoginButton.js` criado
- [ ] Método `googleLogin()` no authStore
- [ ] Botão Google na página `/login`
- [ ] Botão Google na página `/register`
- [ ] Variável `NEXT_PUBLIC_GOOGLE_CLIENT_ID` configurada
- [ ] Deploy no Vercel concluído

### Testes
- [ ] Novo usuário via Google
- [ ] Login usuário existente
- [ ] Vinculação de contas
- [ ] Fazer pedido após login
- [ ] Adicionar celular posteriormente
- [ ] Sem erros no console

### Documentação
- [ ] Atualizar tasks.md com status
- [ ] Documentar credenciais Google

---

## NOTAS IMPORTANTES

### Segurança
- ✅ Token Google validado no backend (nunca confiar no frontend)
- ✅ JWT gerado após validação bem-sucedida
- ✅ Usuário criado com `profileComplete = true` automaticamente
- ✅ Celular opcional (pode adicionar depois)

### Compatibilidade
- ✅ Sistema de `profileComplete` continua funcionando
- ✅ Usuários Google têm acesso total imediato
- ✅ Usuários phone-only ainda precisam completar perfil
- ✅ Middleware `requireCompleteProfile` compatível

### Próximos Passos (Futuro)
- [ ] Apple Sign In (similar ao Google)
- [ ] Facebook Login
- [ ] Login com WhatsApp
- [ ] Two-Factor Authentication (2FA)

---

**Última Atualização**: 07/12/2024
**Responsável**: Claude + Leo
**Progresso**: 90% (Código pronto, aguardando credenciais Google)

---

## 📚 DOCUMENTAÇÃO ATUALIZADA

| Documento | Versão | Última Atualização | Descrição |
|-----------|--------|-------------------|-----------|
| [03_PRD.md](./03_PRD.md) | 3.2.0 | 07/12/2024 | PRD com mapeamento completo User/Auth (seções 2.1.1 e 2.1.2) |
| [04_USER_FLOWS.md](./04_USER_FLOWS.md) | 3.2.0 | 07/12/2024 | Fluxos de auth atualizados com mapeamento técnico |
| [ANALISE_PRD_VS_SISTEMA.md](./ANALISE_PRD_VS_SISTEMA.md) | 1.0.0 | 07/12/2024 | Comparação detalhada PRD vs código |
| [tasks.md](./tasks.md) | 3.2.0 | 07/12/2024 | Este documento |

### Mapeamento Detalhado Disponível (PRD 2.1.1 e 2.1.2):
- **Model User.js**: 26 campos documentados com tipos e defaults
- **Métodos User**: 10 métodos de instância (checkPassword, toJSON, calculateTier, etc.)
- **Endpoints Auth**: 17 rotas documentadas com payloads
- **authStore.js**: 16 actions mapeadas
- **Fluxos Visuais**: Cadastro completo, phone-only, Google OAuth, complete-profile, reset password

---

