# FLAME - TASKS & PROJETO

## STATUS ATUAL DO PROJETO

**Data Atualização**: 08/12/2024
**Versão**: 4.0.0
**Status**: ✅ SISTEMA COMPLETO + SPRINTS 41-46 IMPLEMENTADAS
**Sincronizado com**: PRD v3.5.0 e User Flows v3.5.0

> **SPRINTS 21-30 COMPLETAS**:
> - Sprint 21: Melhorias de UX (componentes reutilizáveis)
> - Sprint 22: Testes E2E (Cypress)
> - Sprint 23: Correção de fluxos, segurança, QR codes, no-show
> - Sprint 24: Cashback no checkout
> - Sprint 25: Bônus automáticos (aniversário + boas-vindas)
> - Sprint 26-27: Ficha técnica/Insumos (backend + frontend)
> - ✅ Sprint 28: Push Notifications (Service Worker ativo)
> - ✅ Sprint 29: Sistema de Indicação (R$15) + Bônus Avaliação (R$2)
> - ✅ Sprint 30: Upload de Imagens + Gestão de Estoque Melhorada
>
> **SPRINTS 41-47 COMPLETAS (08/12/2024)**:
> - ✅ Sprint 41: Cadastro Internacional (PhoneInput com seletor de país, countries.js)
> - ✅ Sprint 42: Taxa de Serviço 10% (serviceFee, removível pelo cliente)
> - ✅ Sprint 43: Pagamento com Atendente (pay_later, card_at_table, pending_payment)
> - ✅ Sprint 44: Cashback Instagram (InstagramCashback model, routes, admin UI)
> - ✅ Sprint 46: Fix Imagens Cardápio (next.config.js com Railway domain)
> - ✅ Sprint 47: Timeline Pedido (calculateTimeline em orderStatus.service.js)
>
> - ✅ Sprint 31: Ficha Técnica UI (modal em admin/products.js com CRUD de RecipeItem)
> - ✅ Sprint 33: Alertas Push Automáticos (push.service.js - notifyOrderReady, notifyOrderStatus)
> - ✅ Sprint 45: Painel Retirada Bar (staff/bar.js - seção "Prontos para Retirada")
>
> **TODAS AS SPRINTS PLANEJADAS IMPLEMENTADAS!**

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

### SPRINT 28 - PUSH NOTIFICATIONS ✅ COMPLETA

**Objetivo**: Ativar Push Notifications para usuários e staff

**Prioridade**: P1 (Engajamento/Operação)
**Status**: ✅ COMPLETA (07/12/2024)

#### Realizações da Sprint 28:
1. ✅ **Service Worker Reativado**: `usePWA.js` agora registra SW
2. ✅ **VAPID Keys Configuradas**: Chaves em variáveis de ambiente
3. ✅ **Autorização em Rotas Admin**:
   - `POST /push/send` - admin, gerente
   - `POST /push/broadcast` - admin only
   - `DELETE /push/cleanup` - admin only
4. ✅ **Rotas Públicas**:
   - `GET /push/vapid-key` - público
   - Subscription e test - qualquer autenticado

---

### SPRINT 29 - SISTEMA DE INDICAÇÃO + BÔNUS AVALIAÇÃO ✅ COMPLETA

**Objetivo**: Implementar referral system e bônus por avaliação

**Prioridade**: P1 (Marketing/Fidelização)
**Status**: ✅ COMPLETA (07/12/2024)

#### Realizações da Sprint 29:
1. ✅ **Sistema de Indicação**:
   - Campos: referralCode, referredBy, referralBonusGiven, totalReferrals
   - Referido recebe R$10 ao completar perfil
   - Quem indicou recebe R$15 após primeira compra do indicado
   - Códigos únicos formato FLAME#### gerados automaticamente
2. ✅ **Job de Processamento**: `referralBonus.job.js`
   - Valida código de indicação
   - Processa bônus de novos usuários
   - Processa bônus de referrer após primeira compra
3. ✅ **Bônus de Avaliação**: R$2 por avaliação de pedido
   - Integrado em `orderController.rateOrder()`
   - Evita duplicação via CashbackHistory
4. ✅ **Migration**: `20251207_add_referral_fields.js`
   - 4 colunas adicionadas
   - 13 códigos gerados para usuários existentes

---

### SPRINT 30 - GESTÃO DE PRODUTOS MELHORADA ✅ COMPLETA

**Objetivo**: Upload de imagens e filtros avançados de estoque

**Prioridade**: P1 (UX Admin)
**Status**: ✅ COMPLETA (07/12/2024)

#### Realizações da Sprint 30:
1. ✅ **Upload de Imagens**:
   - Middleware multer: JPEG, PNG, GIF, WebP (max 5MB)
   - Armazenamento local: `/uploads/products/`
   - Preview antes de salvar
   - URL alternativa como fallback
2. ✅ **Endpoints de Upload**:
   - `POST /api/upload/product/:id` - Upload para produto
   - `POST /api/upload/image` - Upload genérico
   - `DELETE /api/upload/image/:fn` - Deletar imagem
3. ✅ **Cards de Estatísticas**:
   - Total de produtos
   - Ativos / Inativos
   - Em estoque / Baixo / Zerado
4. ✅ **Filtros Avançados**:
   - Filtro por status (ativos/inativos)
   - Filtro por nível de estoque
   - Resumo de filtros ativos
   - Botão "Limpar todos"

---

## 🚨 CONSOLIDAÇÃO DE PENDÊNCIAS (MAPEAMENTO COMPLETO)

> **Data**: 07/12/2024
> **Fonte**: PRD v3.4.0, User Flows v3.4.0, ANALISE_PRD_VS_SISTEMA.md

### 📊 RESUMO EXECUTIVO

| Prioridade | Quantidade | Status |
|------------|------------|--------|
| **P0 (Bloqueadores)** | 4 | 🔴 Sprints 41-43, 46 |
| **P1 (Importantes)** | 6 | 🟡 Sprints 31, 33, 44-45, 47 |
| **P2 (Melhorias)** | 8 | 📋 Sprints 32, 34-40, 48 |

### 🔴 P0 - BLOQUEADORES (Fazer PRIMEIRO!)

| # | Feature | Sprint | Descrição | Estimativa |
|---|---------|--------|-----------|------------|
| 1 | **Fix Imagens Cardápio** | 46 | next.config.js sem domínio Railway | 0.5 dia |
| 2 | **Cadastro CPF/Idade/Telefone** | 41 | Seletor de país, CPF, 18+, libphonenumber-js | 3-4 dias |
| 3 | **Taxa de Serviço 10%** | 42 | Incluída por padrão, removível | 1-2 dias |
| 4 | **Pagamento com Atendente** | 43 | Dinheiro, cartão mesa, dividir conta | 3-4 dias |

### 🟡 P1 - IMPORTANTES

| # | Feature | Sprint | Descrição | Estimativa |
|---|---------|--------|-----------|------------|
| 5 | **Ficha Técnica UI** | 31 | Modal integrado ao produto | 1-2 dias |
| 6 | **Alertas Push Automáticos** | 33 | Estoque baixo, pedido pronto, etc | 1-2 dias |
| 7 | **Cashback Instagram** | 44 | 5% por postagem @flamelounge_ | 2-3 dias |
| 8 | **Painel Retirada Bar** | 45 | Pedidos de balcão prontos | 1 dia |
| 9 | **Acompanhamento Pedido** | 47 | Timeline detalhada | 1 dia |
| 10 | **Google OAuth Credenciais** | - | Configurar Google Cloud Console | Config |

### 📋 P2 - MELHORIAS

| # | Feature | Sprint | Descrição | Estimativa |
|---|---------|--------|-----------|------------|
| 11 | **Relatórios CMV** | 32 | Gráficos e análise de custos | 2-3 dias |
| 12 | **Fornecedores** | 34 | Cadastro e histórico | 1-2 dias |
| 13 | **Automações CRM** | 35 | Campanhas automáticas | 2 dias |
| 14 | **Job No-Show** | 36 | Marcar após 15min | 1 dia |
| 15 | **Dashboard Admin** | 37 | Melhorias visuais | 2 dias |
| 16 | **QR Code + Happy Hour** | 38 | QR dinâmico, descontos por horário | 1-2 dias |
| 17 | **Venda Manual Caixa** | 39 | PDV para venda sem app | 1 dia |
| 18 | **Testes E2E + Docs** | 40 | Cypress + documentação | 2-3 dias |
| 19 | **Notificação Cashback** | 48 | Push/SMS ao receber | 0.5 dia |

### 📱 NOVAS FEATURES DO PRD (User Flows Atualizados)

**Cadastro com Seletor de País (Sprint 41)**:
- Campo telefone com dropdown de países
- Validação libphonenumber-js por país
- Detecção automática de nacionalidade
- CPF para brasileiros, ID estrangeiro para outros
- Data de nascimento obrigatória (18+)

**Fluxo de Pagamento com Atendente (Sprint 43)**:
- Opções: PIX/Cartão (app) ou Dinheiro/Cartão Mesa/Dividir (atendente)
- Notificação Socket.IO para atendente
- Painel de pagamentos pendentes
- Cálculo de troco automático

**Divisão de Conta (Sprint 43)**:
- Dividir igualmente ou valores diferentes
- Registrar pagamento de cada pessoa
- Confirmar quando todos pagaram

**Cashback Instagram (Sprint 44)**:
- Opt-in no checkout com @instagram
- Atendente verifica postagem na entrega
- 5% de cashback extra (1x por dia)

### ⚠️ PENDÊNCIAS DE CONFIGURAÇÃO (Não são sprints)

| Item | Status | Ação |
|------|--------|------|
| Google OAuth | ⚠️ Código pronto | Configurar credenciais no Google Cloud |
| Stripe Produção | ⚠️ Modo teste | Trocar para credenciais de produção |
| WhatsApp número | ⚠️ Pendente | Configurar número Twilio |
| Domínio personalizado | ⚠️ Opcional | Configurar DNS para domínio próprio |

---

## 📋 ROADMAP DE SPRINTS (31-40)

> **Análise baseada em**: PRD v3.4.0, User Flows v3.4.0, ANALISE_PRD_VS_SISTEMA.md
> **Critério de priorização**: P0 (Bloqueador) → P1 (Importante) → P2 (Melhoria)

---

### SPRINT 31 - FICHA TÉCNICA INTEGRADA (P1)

**Objetivo**: Integrar ficha técnica à gestão de produtos para controle preciso de CMV

**Prioridade**: P1 (Controle de custos)
**Estimativa**: 1-2 dias
**Dependências**: Sprint 26-27 (backend de insumos já implementado)

#### Tarefas:
1. [ ] **Modal de Ficha Técnica no Produto**
   - Abrir via botão "Ficha Técnica" no card do produto
   - Listar insumos vinculados com quantidades
   - Permitir adicionar/remover/editar insumos
   - Arquivo: `frontend/src/pages/admin/products.js`

2. [ ] **Cálculo de Custo Automático**
   - Somar custo de todos insumos da ficha
   - Exibir custo unitário e margem de lucro
   - Arquivo: `backend/src/services/ingredient.service.js`

3. [ ] **Indicador Visual de Disponibilidade**
   - Badge vermelho se algum insumo está sem estoque
   - Badge amarelo se algum insumo está baixo
   - Arquivo: `frontend/src/components/ProductCard.js`

4. [ ] **Validação na Criação de Pedido**
   - Verificar disponibilidade de insumos antes de aceitar pedido
   - Alertar cliente se produto indisponível
   - Arquivo: `backend/src/controllers/orderController.js`

#### Arquivos Envolvidos:
```
Backend:
├── services/ingredient.service.js (novo método: getProductCost)
├── controllers/ingredientController.js (já existe)
└── routes/ingredients.js (já existe)

Frontend:
├── pages/admin/products.js (adicionar modal)
├── components/RecipeModal.js (NOVO)
└── stores/ingredientStore.js (já existe)
```

#### Critérios de Aceitação:
- [ ] Admin pode vincular insumos a qualquer produto
- [ ] Custo do produto é calculado automaticamente
- [ ] Produtos sem insumos suficientes aparecem como "indisponível"

---

### SPRINT 32 - RELATÓRIOS CMV E GRÁFICOS (P2)

**Objetivo**: Dashboard visual de CMV, margem e análise de vendas

**Prioridade**: P2 (Gestão financeira)
**Estimativa**: 2-3 dias
**Dependências**: Sprint 31 (custos de produtos)

#### Tarefas:
1. [ ] **Instalar Biblioteca de Gráficos**
   - Adicionar Recharts ou Chart.js ao frontend
   - Arquivo: `frontend/package.json`

2. [ ] **Dashboard CMV**
   - Gráfico de barras: CMV por categoria
   - Gráfico de linha: CMV ao longo do tempo
   - Tabela: Top 10 produtos por custo
   - Arquivo: `frontend/src/pages/admin/reports.js`

3. [ ] **Relatório de Margem**
   - Calcular margem = (preço - custo) / preço
   - Destacar produtos com margem baixa (<30%)
   - Sugestões de reajuste de preço
   - Arquivo: `backend/src/controllers/report.controller.js`

4. [ ] **Exportação para Excel/PDF**
   - Botão "Exportar" em cada relatório
   - Usar xlsx e jspdf
   - Arquivo: `frontend/src/utils/export.js` (NOVO)

5. [ ] **Análise ABC de Produtos**
   - Classificar produtos: A (80% receita), B (15%), C (5%)
   - Visualização em gráfico de Pareto
   - Arquivo: `backend/src/services/report.service.js`

#### Arquivos Envolvidos:
```
Backend:
├── controllers/report.controller.js (novos endpoints)
├── services/report.service.js (novas análises)
└── routes/report.routes.js (novas rotas)

Frontend:
├── pages/admin/reports.js (refatorar)
├── components/charts/CMVChart.js (NOVO)
├── components/charts/MarginChart.js (NOVO)
├── components/charts/ABCChart.js (NOVO)
└── utils/export.js (NOVO)
```

#### Critérios de Aceitação:
- [ ] Dashboard mostra CMV mensal com gráfico
- [ ] Margem de cada produto visível
- [ ] Exportação funciona para Excel e PDF

---

### SPRINT 33 - ALERTAS PUSH AUTOMÁTICOS (P1)

**Objetivo**: Push notifications automáticas para eventos críticos

**Prioridade**: P1 (Operação em tempo real)
**Estimativa**: 1-2 dias
**Dependências**: Sprint 28 (push service ativo)

#### Tarefas:
1. [ ] **Push de Estoque Baixo**
   - Enviar para gerente/admin quando produto atinge minStock
   - Agendar job diário às 8h
   - Arquivo: `backend/src/jobs/stockAlert.job.js`

2. [ ] **Push de Pedido Pronto**
   - Enviar para cliente quando status = 'ready'
   - Incluir número do pedido e mesa
   - Arquivo: `backend/src/services/push.service.js`

3. [ ] **Push de Reserva Confirmada**
   - Enviar para cliente quando admin confirma
   - Incluir data, hora e código
   - Arquivo: `backend/src/controllers/reservationController.js`

4. [ ] **Push de Pedido Entregue + Avaliar**
   - Enviar quando status = 'delivered'
   - Link para avaliação com bônus R$2
   - Arquivo: `backend/src/controllers/orderController.js`

5. [ ] **Configuração de Preferências**
   - Tela para usuário ativar/desativar tipos de push
   - Salvar em User.pushPreferences (JSON)
   - Arquivo: `frontend/src/pages/perfil.js`

#### Arquivos Envolvidos:
```
Backend:
├── services/push.service.js (adicionar métodos)
├── jobs/stockAlert.job.js (NOVO)
├── models/User.js (campo pushPreferences)
└── controllers (adicionar chamadas push)

Frontend:
├── pages/perfil.js (seção de notificações)
└── hooks/usePWA.js (já configurado)
```

#### Critérios de Aceitação:
- [ ] Gerente recebe push de estoque baixo
- [ ] Cliente recebe push quando pedido fica pronto
- [ ] Usuário pode desativar notificações específicas

---

### SPRINT 34 - CADASTRO DE FORNECEDORES (P2)

**Objetivo**: Gerenciar fornecedores de insumos

**Prioridade**: P2 (Gestão de compras)
**Estimativa**: 1-2 dias
**Dependências**: Sprint 26 (model Ingredient)

#### Tarefas:
1. [ ] **Model Supplier**
   - Campos: name, cnpj, email, phone, address, notes
   - Relação: Supplier hasMany Ingredients
   - Arquivo: `backend/src/models/Supplier.js` (NOVO)

2. [ ] **CRUD de Fornecedores**
   - Listar, criar, editar, desativar
   - Arquivo: `backend/src/controllers/supplier.controller.js` (NOVO)

3. [ ] **Página Admin de Fornecedores**
   - Listagem com busca
   - Modal de criação/edição
   - Arquivo: `frontend/src/pages/admin/fornecedores.js` (NOVO)

4. [ ] **Vincular Insumo a Fornecedor**
   - Dropdown de fornecedor no cadastro de insumo
   - Histórico de compras por fornecedor
   - Arquivo: `frontend/src/pages/admin/insumos.js`

5. [ ] **Relatório de Compras por Fornecedor**
   - Total comprado por período
   - Arquivo: `backend/src/services/report.service.js`

#### Arquivos Envolvidos:
```
Backend:
├── models/Supplier.js (NOVO)
├── models/Ingredient.js (adicionar supplierId)
├── controllers/supplier.controller.js (NOVO)
├── routes/supplier.routes.js (NOVO)
└── server.js (registrar rota)

Frontend:
├── pages/admin/fornecedores.js (NOVO)
├── pages/admin/insumos.js (atualizar)
└── stores/supplierStore.js (NOVO)
```

#### Critérios de Aceitação:
- [ ] CRUD completo de fornecedores
- [ ] Insumos vinculados a fornecedores
- [ ] Relatório de compras por fornecedor

---

### SPRINT 35 - AUTOMAÇÕES CRM (P2)

**Objetivo**: Automações de marketing e fidelização

**Prioridade**: P2 (Marketing automatizado)
**Estimativa**: 2 dias
**Dependências**: Sprint 29 (bônus implementados)

#### Tarefas:
1. [ ] **Notificação de Upgrade de Tier**
   - Quando cliente atinge novo tier, enviar SMS + Push
   - Incluir novos benefícios
   - Arquivo: `backend/src/models/User.js` (afterUpdate hook)

2. [ ] **Campanha Automática de Inativos**
   - Job semanal para clientes >30 dias sem pedido
   - Enviar SMS com cupom de 10%
   - Arquivo: `backend/src/jobs/inactiveCustomers.job.js` (NOVO)

3. [ ] **Lembrete de Cashback Expirando**
   - Notificar 7 dias antes da expiração
   - SMS + Push
   - Arquivo: `backend/src/jobs/cashbackExpiry.job.js`

4. [ ] **Mensagem de Boas-Vindas Personalizada**
   - Após primeiro pedido entregue
   - Explicar sistema de cashback
   - Arquivo: `backend/src/controllers/orderController.js`

5. [ ] **Dashboard de Automações**
   - Listar automações ativas
   - Histórico de envios
   - Arquivo: `frontend/src/pages/admin/campanhas.js`

#### Arquivos Envolvidos:
```
Backend:
├── jobs/inactiveCustomers.job.js (NOVO)
├── jobs/cashbackExpiry.job.js (atualizar)
├── models/User.js (hooks)
└── services/sms.service.js (novos templates)

Frontend:
├── pages/admin/campanhas.js (atualizar)
└── components/AutomationCard.js (NOVO)
```

#### Critérios de Aceitação:
- [ ] Cliente recebe notificação ao subir de tier
- [ ] Inativos recebem mensagem automática
- [ ] Admin vê histórico de automações

---

### SPRINT 36 - JOB NO-SHOW E RESERVAS (P2)

**Objetivo**: Automatizar marcação de no-show e melhorar reservas

**Prioridade**: P2 (Operação de reservas)
**Estimativa**: 1 dia
**Dependências**: Nenhuma

#### Tarefas:
1. [ ] **Job de No-Show Automático**
   - Executar a cada 15 min
   - Marcar reservas não confirmadas como no_show
   - Arquivo: `backend/src/jobs/noShow.job.js` (NOVO)

2. [ ] **Penalização por No-Show**
   - Bloquear reservas após 3 no-shows
   - Flag `reservationBlocked` no User
   - Arquivo: `backend/src/models/User.js`

3. [ ] **Histórico de No-Shows**
   - Visível no CRM do cliente
   - Contador de no-shows
   - Arquivo: `frontend/src/pages/admin/clientes.js`

4. [ ] **Lembrete 2h Antes**
   - WhatsApp automático
   - Confirmar presença via link
   - Arquivo: `backend/src/services/whatsapp.service.js`

#### Arquivos Envolvidos:
```
Backend:
├── jobs/noShow.job.js (NOVO)
├── models/User.js (campo noShowCount, reservationBlocked)
├── services/reservationService.js (atualizar markNoShows)
└── services/whatsapp.service.js (lembrete)

Frontend:
├── pages/admin/clientes.js (mostrar no-shows)
└── pages/admin/reservas.js (indicador visual)
```

---

### SPRINT 37 - MELHORIAS DASHBOARD ADMIN (P2)

**Objetivo**: Dashboard mais completo e informativo

**Prioridade**: P2 (UX Admin)
**Estimativa**: 2 dias
**Dependências**: Sprints anteriores

#### Tarefas:
1. [ ] **Widgets Configuráveis**
   - Arrastar e soltar widgets
   - Salvar layout em localStorage
   - Arquivo: `frontend/src/pages/admin/index.js`

2. [ ] **Métricas em Tempo Real**
   - Faturamento do dia (atualiza via Socket)
   - Pedidos ativos
   - Mesas ocupadas
   - Arquivo: `frontend/src/components/DashboardWidget.js`

3. [ ] **Comparativo com Período Anterior**
   - % crescimento vs ontem/semana passada
   - Gráfico de tendência
   - Arquivo: `backend/src/controllers/adminController.js`

4. [ ] **Alertas no Dashboard**
   - Pedidos atrasados (>20min)
   - Estoque crítico
   - Reservas do dia
   - Arquivo: `frontend/src/components/AlertsWidget.js` (NOVO)

---

### SPRINT 38 - QR CODE DINÂMICO E HAPPY HOUR (P2)

**Objetivo**: QR codes por mesa e configuração de happy hour

**Prioridade**: P2 (Marketing/Operação)
**Estimativa**: 1-2 dias
**Dependências**: Nenhuma

#### Tarefas:
1. [ ] **Geração de QR Code por Mesa**
   - Gerar automaticamente ao criar mesa
   - Download em PNG/SVG
   - Arquivo: `backend/src/controllers/tableController.js`

2. [ ] **Configuração de Happy Hour**
   - Definir horários e % desconto
   - Categorias participantes
   - Arquivo: `backend/src/models/Settings.js`

3. [ ] **Aplicação Automática de Desconto**
   - Verificar horário no checkout
   - Aplicar desconto aos produtos elegíveis
   - Arquivo: `backend/src/controllers/orderController.js`

4. [ ] **Banner de Happy Hour**
   - Exibir no cardápio durante o período
   - Countdown para fim
   - Arquivo: `frontend/src/pages/cardapio.js`

---

### SPRINT 39 - VENDA MANUAL NO CAIXA (P2)

**Objetivo**: Permitir registro de vendas sem pedido no app

**Prioridade**: P2 (Operação)
**Estimativa**: 1 dia
**Dependências**: Sprint caixa já implementado

#### Tarefas:
1. [ ] **Modal de Venda Rápida**
   - Selecionar produtos do cardápio
   - Informar forma de pagamento
   - Arquivo: `frontend/src/pages/staff/caixa.js`

2. [ ] **Criar Pedido Manual**
   - Endpoint para pedido sem usuário
   - Flag `isManualSale = true`
   - Arquivo: `backend/src/controllers/orderController.js`

3. [ ] **Relatório de Vendas Manuais**
   - Separar vendas app vs manuais
   - Arquivo: `backend/src/services/report.service.js`

---

### SPRINT 40 - TESTES E2E E DOCUMENTAÇÃO (P1)

**Objetivo**: Garantir qualidade e documentar sistema

**Prioridade**: P1 (Qualidade)
**Estimativa**: 2-3 dias
**Dependências**: Todas as sprints anteriores

#### Tarefas:
1. [ ] **Testes E2E Completos**
   - Fluxo cliente: login → pedido → avaliação
   - Fluxo staff: cozinha → bar → atendente
   - Fluxo admin: produtos → estoque → relatórios
   - Arquivo: `frontend/cypress/e2e/`

2. [ ] **Atualizar PRD Final**
   - Marcar todas features como ✅
   - Remover seções de "não implementado"
   - Arquivo: `docs/03_PRD.md`

3. [ ] **Atualizar User Flows**
   - Adicionar fluxos das novas features
   - Diagramas atualizados
   - Arquivo: `docs/04_USER_FLOWS.md`

4. [ ] **README de Deploy**
   - Instruções completas de setup
   - Variáveis de ambiente
   - Arquivo: `docs/DEPLOY.md` (NOVO)

---

---

## 🔥 ROADMAP PRIORITÁRIO (Sprints 41-48) - NOVOS REQUISITOS

> **Data**: 07/12/2024
> **Origem**: Requisitos do cliente - funcionalidades críticas pendentes
> **Prioridade**: P0-P1 (Bloqueadores de operação)

---

### SPRINT 41 - CADASTRO COMPLETO (CPF/ESTRANGEIRO/IDADE/TELEFONE INTERNACIONAL) ⚠️ P0

**Objetivo**: Reformular cadastro com validações legais obrigatórias e suporte internacional

**Prioridade**: P0 (Bloqueador legal - venda de bebidas)
**Estimativa**: 3-4 dias
**Dependências**: Nenhuma

#### Tarefas:
1. [ ] **Campos Novos no Model User**
   - `birthDate` (DATE, OBRIGATÓRIO)
   - `foreignId` (STRING, alternativa ao CPF)
   - `countryCode` (STRING(5), código do país ex: "BR", "US", "PT")
   - `phoneCountryCode` (STRING(5), código telefone ex: "+55", "+1", "+351")
   - Arquivo: `backend/src/models/User.js`

2. [ ] **Migration para Novos Campos**
   - Adicionar campos ao banco
   - Arquivo: `backend/src/migrations/20251207_user_age_fields.js`

3. [ ] **Validação de CPF Completa**
   - Algoritmo de dígitos verificadores
   - Não apenas formato
   - Arquivo: `backend/src/utils/validators.js`

4. [ ] **Validação de Idade 18+**
   - Verificar birthDate >= 18 anos
   - Bloquear cadastro se menor
   - Mensagem: "Você precisa ter 18 anos ou mais"
   - Arquivo: `backend/src/controllers/authController.js`

5. [ ] **Seletor de País para Telefone (NOVO)**
   - Dropdown com lista de países ao clicar no campo telefone
   - Cada país mostra: bandeira + nome + código (+55, +1, etc)
   - Ao selecionar país, sistema detecta automaticamente nacionalidade
   - Validação de telefone específica por país usando libphonenumber-js
   - Arquivo: `frontend/src/components/PhoneCountrySelector.js` (NOVO)

6. [ ] **Biblioteca libphonenumber-js**
   - Instalar: `npm install libphonenumber-js`
   - Validação de formato por país
   - Formatação automática durante digitação
   - Arquivo: `frontend/src/utils/phoneValidation.js` (NOVO)

7. [ ] **Lista de Países com Códigos e Validação**
   - Mapeamento completo de países
   - Arquivo: `frontend/src/data/countries.js` (NOVO)

---

#### 📞 TABELA COMPLETA DE PAÍSES - TELEFONE INTERNACIONAL

> **Referência**: Padrão E.164 (ITU-T) - Máximo 15 dígitos total
> **Uso**: Copiar direto para `frontend/src/data/countries.js`

##### 🌎 AMÉRICA DO SUL (Prioridade Alta - Região do Negócio)

| País | ISO | DDI | Dígitos Nacionais | Móvel Inicia | Exemplo E.164 | Bandeira |
|------|-----|-----|-------------------|--------------|---------------|----------|
| Brasil | BR | +55 | 10-11 | 9 | +5521999998888 | 🇧🇷 |
| Argentina | AR | +54 | 10 | 9 | +5491155551234 | 🇦🇷 |
| Chile | CL | +56 | 9 | 9 | +56912345678 | 🇨🇱 |
| Colômbia | CO | +57 | 10 | 3 | +573001234567 | 🇨🇴 |
| Peru | PE | +51 | 9 | 9 | +51912345678 | 🇵🇪 |
| Venezuela | VE | +58 | 10 | 4 | +584121234567 | 🇻🇪 |
| Equador | EC | +593 | 9 | 9 | +593991234567 | 🇪🇨 |
| Bolívia | BO | +591 | 8 | 6,7 | +59171234567 | 🇧🇴 |
| Paraguai | PY | +595 | 9 | 9 | +595981234567 | 🇵🇾 |
| Uruguai | UY | +598 | 8 | 9 | +59894123456 | 🇺🇾 |
| Guiana | GY | +592 | 7 | 6 | +5926001234 | 🇬🇾 |
| Suriname | SR | +597 | 7 | 8 | +5978123456 | 🇸🇷 |
| Guiana Francesa | GF | +594 | 9 | 6 | +594694123456 | 🇬🇫 |

##### 🌎 AMÉRICA DO NORTE E CENTRAL

| País | ISO | DDI | Dígitos Nacionais | Móvel Inicia | Exemplo E.164 | Bandeira |
|------|-----|-----|-------------------|--------------|---------------|----------|
| Estados Unidos | US | +1 | 10 | Qualquer | +12025551234 | 🇺🇸 |
| Canadá | CA | +1 | 10 | Qualquer | +14165551234 | 🇨🇦 |
| México | MX | +52 | 10 | 1 | +525512345678 | 🇲🇽 |
| Guatemala | GT | +502 | 8 | 3-5 | +50231234567 | 🇬🇹 |
| Honduras | HN | +504 | 8 | 3,8,9 | +50431234567 | 🇭🇳 |
| El Salvador | SV | +503 | 8 | 6,7 | +50371234567 | 🇸🇻 |
| Nicarágua | NI | +505 | 8 | 8 | +50581234567 | 🇳🇮 |
| Costa Rica | CR | +506 | 8 | 6,7,8 | +50661234567 | 🇨🇷 |
| Panamá | PA | +507 | 8 | 6 | +50761234567 | 🇵🇦 |
| Cuba | CU | +53 | 8 | 5 | +5351234567 | 🇨🇺 |
| República Dominicana | DO | +1 | 10 | 809,829,849 | +18091234567 | 🇩🇴 |
| Haiti | HT | +509 | 8 | 3,4 | +50931234567 | 🇭🇹 |
| Jamaica | JM | +1 | 10 | 876 | +18761234567 | 🇯🇲 |
| Porto Rico | PR | +1 | 10 | 787,939 | +17871234567 | 🇵🇷 |
| Trinidad e Tobago | TT | +1 | 10 | 868 | +18681234567 | 🇹🇹 |
| Bahamas | BS | +1 | 10 | 242 | +12421234567 | 🇧🇸 |
| Barbados | BB | +1 | 10 | 246 | +12461234567 | 🇧🇧 |
| Belize | BZ | +501 | 7 | 6 | +5016012345 | 🇧🇿 |

##### 🌍 EUROPA OCIDENTAL

| País | ISO | DDI | Dígitos Nacionais | Móvel Inicia | Exemplo E.164 | Bandeira |
|------|-----|-----|-------------------|--------------|---------------|----------|
| Portugal | PT | +351 | 9 | 9 | +351912345678 | 🇵🇹 |
| Espanha | ES | +34 | 9 | 6,7 | +34612345678 | 🇪🇸 |
| França | FR | +33 | 9 | 6,7 | +33612345678 | 🇫🇷 |
| Itália | IT | +39 | 10 | 3 | +393123456789 | 🇮🇹 |
| Alemanha | DE | +49 | 10-11 | 15,16,17 | +4915123456789 | 🇩🇪 |
| Reino Unido | GB | +44 | 10 | 7 | +447911123456 | 🇬🇧 |
| Irlanda | IE | +353 | 9 | 8 | +353871234567 | 🇮🇪 |
| Holanda | NL | +31 | 9 | 6 | +31612345678 | 🇳🇱 |
| Bélgica | BE | +32 | 9 | 4 | +32471234567 | 🇧🇪 |
| Suíça | CH | +41 | 9 | 7 | +41791234567 | 🇨🇭 |
| Áustria | AT | +43 | 10-11 | 6 | +436641234567 | 🇦🇹 |
| Luxemburgo | LU | +352 | 9 | 6 | +352621234567 | 🇱🇺 |
| Mônaco | MC | +377 | 8 | 6 | +37761234567 | 🇲🇨 |
| Andorra | AD | +376 | 6 | 3,6 | +376312345 | 🇦🇩 |

##### 🌍 EUROPA NÓRDICA E ORIENTAL

| País | ISO | DDI | Dígitos Nacionais | Móvel Inicia | Exemplo E.164 | Bandeira |
|------|-----|-----|-------------------|--------------|---------------|----------|
| Suécia | SE | +46 | 9 | 7 | +46701234567 | 🇸🇪 |
| Noruega | NO | +47 | 8 | 4,9 | +4791234567 | 🇳🇴 |
| Dinamarca | DK | +45 | 8 | 2-9 | +4521234567 | 🇩🇰 |
| Finlândia | FI | +358 | 9-10 | 4,5 | +358401234567 | 🇫🇮 |
| Islândia | IS | +354 | 7 | 6,7,8 | +3546123456 | 🇮🇸 |
| Polônia | PL | +48 | 9 | 5,6,7,8 | +48501234567 | 🇵🇱 |
| Rússia | RU | +7 | 10 | 9 | +79161234567 | 🇷🇺 |
| Ucrânia | UA | +380 | 9 | 5,6,9 | +380501234567 | 🇺🇦 |
| República Tcheca | CZ | +420 | 9 | 6,7 | +420601234567 | 🇨🇿 |
| Hungria | HU | +36 | 9 | 2,3,7 | +36201234567 | 🇭🇺 |
| Romênia | RO | +40 | 9 | 7 | +40721234567 | 🇷🇴 |
| Bulgária | BG | +359 | 9 | 8,9 | +359881234567 | 🇧🇬 |
| Grécia | GR | +30 | 10 | 6,9 | +306912345678 | 🇬🇷 |
| Turquia | TR | +90 | 10 | 5 | +905321234567 | 🇹🇷 |
| Croácia | HR | +385 | 9 | 9 | +385911234567 | 🇭🇷 |
| Sérvia | RS | +381 | 9 | 6 | +381641234567 | 🇷🇸 |
| Eslováquia | SK | +421 | 9 | 9 | +421901234567 | 🇸🇰 |
| Eslovênia | SI | +386 | 8 | 3,4,5,6,7 | +38631123456 | 🇸🇮 |
| Estônia | EE | +372 | 7-8 | 5 | +3725123456 | 🇪🇪 |
| Letônia | LV | +371 | 8 | 2 | +37121234567 | 🇱🇻 |
| Lituânia | LT | +370 | 8 | 6 | +37061234567 | 🇱🇹 |
| Belarus | BY | +375 | 9 | 25,29,33,44 | +375291234567 | 🇧🇾 |

##### 🌏 ÁSIA

| País | ISO | DDI | Dígitos Nacionais | Móvel Inicia | Exemplo E.164 | Bandeira |
|------|-----|-----|-------------------|--------------|---------------|----------|
| Japão | JP | +81 | 10 | 70,80,90 | +819012345678 | 🇯🇵 |
| China | CN | +86 | 11 | 1 | +8613912345678 | 🇨🇳 |
| Coreia do Sul | KR | +82 | 10 | 1 | +821012345678 | 🇰🇷 |
| Índia | IN | +91 | 10 | 6,7,8,9 | +919876543210 | 🇮🇳 |
| Indonésia | ID | +62 | 10-12 | 8 | +6281234567890 | 🇮🇩 |
| Tailândia | TH | +66 | 9 | 8,9 | +66812345678 | 🇹🇭 |
| Vietnã | VN | +84 | 9-10 | 3,5,7,8,9 | +84912345678 | 🇻🇳 |
| Filipinas | PH | +63 | 10 | 9 | +639171234567 | 🇵🇭 |
| Malásia | MY | +60 | 9-10 | 1 | +60123456789 | 🇲🇾 |
| Singapura | SG | +65 | 8 | 8,9 | +6581234567 | 🇸🇬 |
| Hong Kong | HK | +852 | 8 | 5,6,9 | +85291234567 | 🇭🇰 |
| Taiwan | TW | +886 | 9 | 9 | +886912345678 | 🇹🇼 |
| Paquistão | PK | +92 | 10 | 3 | +923001234567 | 🇵🇰 |
| Bangladesh | BD | +880 | 10 | 1 | +8801712345678 | 🇧🇩 |
| Sri Lanka | LK | +94 | 9 | 7 | +94712345678 | 🇱🇰 |
| Nepal | NP | +977 | 10 | 98 | +9779812345678 | 🇳🇵 |
| Cazaquistão | KZ | +7 | 10 | 7 | +77011234567 | 🇰🇿 |

##### 🌍 ORIENTE MÉDIO

| País | ISO | DDI | Dígitos Nacionais | Móvel Inicia | Exemplo E.164 | Bandeira |
|------|-----|-----|-------------------|--------------|---------------|----------|
| Emirados Árabes | AE | +971 | 9 | 5 | +971501234567 | 🇦🇪 |
| Arábia Saudita | SA | +966 | 9 | 5 | +966512345678 | 🇸🇦 |
| Israel | IL | +972 | 9 | 5 | +972501234567 | 🇮🇱 |
| Líbano | LB | +961 | 8 | 3,7 | +96171123456 | 🇱🇧 |
| Jordânia | JO | +962 | 9 | 7 | +962791234567 | 🇯🇴 |
| Kuwait | KW | +965 | 8 | 5,6,9 | +96551234567 | 🇰🇼 |
| Qatar | QA | +974 | 8 | 3,5,6,7 | +97431234567 | 🇶🇦 |
| Bahrein | BH | +973 | 8 | 3 | +97331234567 | 🇧🇭 |
| Omã | OM | +968 | 8 | 9 | +96891234567 | 🇴🇲 |
| Iraque | IQ | +964 | 10 | 7 | +9647712345678 | 🇮🇶 |
| Irã | IR | +98 | 10 | 9 | +989121234567 | 🇮🇷 |
| Egito | EG | +20 | 10 | 1 | +201012345678 | 🇪🇬 |

##### 🌍 ÁFRICA

| País | ISO | DDI | Dígitos Nacionais | Móvel Inicia | Exemplo E.164 | Bandeira |
|------|-----|-----|-------------------|--------------|---------------|----------|
| África do Sul | ZA | +27 | 9 | 6,7,8 | +27611234567 | 🇿🇦 |
| Nigéria | NG | +234 | 10 | 7,8,9 | +2348012345678 | 🇳🇬 |
| Quênia | KE | +254 | 9 | 7 | +254712345678 | 🇰🇪 |
| Gana | GH | +233 | 9 | 2,5 | +233201234567 | 🇬🇭 |
| Marrocos | MA | +212 | 9 | 6,7 | +212612345678 | 🇲🇦 |
| Argélia | DZ | +213 | 9 | 5,6,7 | +213551234567 | 🇩🇿 |
| Tunísia | TN | +216 | 8 | 2,4,5,9 | +21621234567 | 🇹🇳 |
| Etiópia | ET | +251 | 9 | 9 | +251911234567 | 🇪🇹 |
| Tanzânia | TZ | +255 | 9 | 6,7 | +255712345678 | 🇹🇿 |
| Uganda | UG | +256 | 9 | 7 | +256712345678 | 🇺🇬 |
| Angola | AO | +244 | 9 | 9 | +244912345678 | 🇦🇴 |
| Moçambique | MZ | +258 | 9 | 8 | +258821234567 | 🇲🇿 |
| Cabo Verde | CV | +238 | 7 | 9 | +2389123456 | 🇨🇻 |
| São Tomé e Príncipe | ST | +239 | 7 | 9 | +2399912345 | 🇸🇹 |
| Guiné-Bissau | GW | +245 | 7 | 9 | +2459123456 | 🇬🇼 |

##### 🌏 OCEANIA

| País | ISO | DDI | Dígitos Nacionais | Móvel Inicia | Exemplo E.164 | Bandeira |
|------|-----|-----|-------------------|--------------|---------------|----------|
| Austrália | AU | +61 | 9 | 4 | +61412345678 | 🇦🇺 |
| Nova Zelândia | NZ | +64 | 9 | 2 | +64212345678 | 🇳🇿 |
| Fiji | FJ | +679 | 7 | 7,8,9 | +6797123456 | 🇫🇯 |
| Papua Nova Guiné | PG | +675 | 8 | 7 | +67571234567 | 🇵🇬 |

---

##### 📋 RESUMO PARA IMPLEMENTAÇÃO

**Total de países mapeados**: 100+

**Estrutura do arquivo `countries.js`**:
```javascript
export const countries = [
  { code: 'BR', name: 'Brasil', dial: '+55', flag: '🇧🇷', digits: { min: 10, max: 11 }, mobileStart: ['9'] },
  { code: 'US', name: 'Estados Unidos', dial: '+1', flag: '🇺🇸', digits: { min: 10, max: 10 }, mobileStart: null },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹', digits: { min: 9, max: 9 }, mobileStart: ['9'] },
  // ... continuar com todos os países
];

export const getCountryByCode = (code) => countries.find(c => c.code === code);
export const getCountryByDial = (dial) => countries.find(c => c.dial === dial);
export const isBrazilian = (countryCode) => countryCode === 'BR';
```

**Validação com libphonenumber-js**:
```javascript
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const validatePhone = (phone, countryCode) => {
  try {
    return isValidPhoneNumber(phone, countryCode);
  } catch {
    return false;
  }
};

export const formatPhone = (phone, countryCode) => {
  try {
    const parsed = parsePhoneNumber(phone, countryCode);
    return parsed.formatInternational();
  } catch {
    return phone;
  }
};
```

---

8. [ ] **Detecção Automática de Nacionalidade**
   - Se countryCode = "BR" → brasileiro (requer CPF)
   - Se countryCode != "BR" → estrangeiro (requer foreignId)
   - NÃO mostrar toggle manual brasileiro/estrangeiro
   - Sistema detecta pelo país do telefone
   - Arquivo: `frontend/src/pages/register.js`

9. [ ] **UI do Formulário de Cadastro (Atualizado)**
   - Campo telefone com seletor de país integrado
   - Ao clicar: abre lista pesquisável de países
   - Formatação automática do número conforme país
   - Se Brasil: mostra campo CPF
   - Se outro país: mostra campo ID Estrangeiro
   - Data de nascimento com datepicker
   - Checkbox: "Declaro ter 18 anos ou mais"
   - Arquivo: `frontend/src/pages/register.js`

10. [ ] **Validação Backend (E.164)**
    - Armazenar telefone em formato E.164: +[código país][número]
    - Máximo 15 dígitos total
    - Validar formato antes de salvar
    - Arquivo: `backend/src/utils/validators.js`

11. [ ] **profileComplete Atualizado**
    - Agora requer: nome + email + (cpf OU foreignId) + birthDate + celular válido
    - Arquivo: `backend/src/models/User.js`

#### Arquivos Envolvidos:
```
Backend:
├── models/User.js (novos campos: countryCode, phoneCountryCode)
├── migrations/20251207_user_age_fields.js (NOVO)
├── controllers/authController.js (validações)
├── utils/validators.js (CPF + telefone internacional)
└── middlewares/validation.middleware.js (atualizar)

Frontend:
├── pages/register.js (refatorar formulário)
├── pages/complete-profile.js (adicionar campos)
├── components/PhoneCountrySelector.js (NOVO - seletor de país)
├── components/DatePicker.js (se não existir)
├── data/countries.js (NOVO - lista de países)
├── utils/phoneValidation.js (NOVO - validação libphonenumber)
└── package.json (adicionar libphonenumber-js)
```

#### Critérios de Aceitação:
- [ ] Seletor de país funcional com busca
- [ ] Telefone valida conforme país selecionado
- [ ] Nacionalidade detectada automaticamente pelo país
- [ ] CPF validado com algoritmo completo (brasileiros)
- [ ] Estrangeiros usam ID alternativo
- [ ] Menores de 18 bloqueados
- [ ] Telefone armazenado em formato E.164
- [ ] Formatação visual durante digitação

---

### SPRINT 42 - TAXA DE SERVIÇO 10% ⚠️ P0

**Objetivo**: Implementar taxa de serviço padrão removível

**Prioridade**: P0 (Receita operacional)
**Estimativa**: 1-2 dias
**Dependências**: Nenhuma

#### Tarefas:
1. [ ] **Campos no Model Order**
   - `serviceFee` (DECIMAL)
   - `serviceFeeIncluded` (BOOLEAN, default true)
   - Arquivo: `backend/src/models/Order.js`

2. [ ] **Migration**
   - Arquivo: `backend/src/migrations/20251207_service_fee.js`

3. [ ] **Cálculo Automático no Backend**
   - serviceFee = subtotal * 0.10
   - Incluído por padrão
   - Arquivo: `backend/src/controllers/orderController.js`

4. [ ] **UI no Carrinho/Checkout**
   - Exibir taxa de serviço
   - Botão discreto [x] para remover
   - Modal de confirmação sutil
   - "A taxa valoriza nossos colaboradores"
   - Arquivo: `frontend/src/pages/checkout.js`

5. [ ] **Recálculo de Totais**
   - total = subtotal + serviceFee - discount
   - Atualizar em tempo real
   - Arquivo: `frontend/src/stores/cartStore.js`

#### Critérios de Aceitação:
- [ ] Taxa 10% incluída por padrão
- [ ] Cliente pode remover de forma discreta
- [ ] Modal de confirmação ao remover
- [ ] Total recalculado corretamente

---

### SPRINT 43 - PAGAMENTO COM ATENDENTE ⚠️ P0

**Objetivo**: Fluxo completo de pagamento dinheiro/cartão/divisão

**Prioridade**: P0 (Operação básica de restaurante)
**Estimativa**: 3-4 dias
**Dependências**: Nenhuma

#### Tarefas:
1. [ ] **Novos Campos no Model Order**
   - `paymentMethod` (ENUM: credit_card, debit_card, pix, cash, card_at_table, split)
   - `paidViaApp` (BOOLEAN)
   - `attendantPayment` (BOOLEAN)
   - `splitPayments` (JSON)
   - Arquivo: `backend/src/models/Order.js`

2. [ ] **Opções de Pagamento no Checkout**
   - Seção "Pagar pelo App" (crédito, débito, PIX)
   - Seção "Pagar com Atendente" (dinheiro, cartão mesa, dividir)
   - Arquivo: `frontend/src/pages/checkout.js`

3. [ ] **Notificação para Atendente**
   - Socket.IO quando cliente escolhe pagamento presencial
   - Push notification para atendentes
   - Exibir: mesa, pedido, valor, forma
   - Arquivo: `backend/src/services/socket.service.js`

4. [ ] **Painel de Pagamentos Pendentes (Atendente)**
   - Lista de mesas aguardando pagamento
   - Botão "Confirmar Pagamento Recebido"
   - Calcular troco para dinheiro
   - Arquivo: `frontend/src/pages/atendente/index.js`

5. [ ] **Fluxo de Divisão de Conta**
   - Escolher número de pessoas
   - Dividir igualmente ou valores diferentes
   - Registrar forma de pagamento de cada pessoa
   - Confirmar quando todos pagaram
   - Arquivo: `frontend/src/components/SplitBillModal.js` (NOVO)

6. [ ] **Status pending_payment**
   - Novo status para pedidos aguardando pagamento presencial
   - Arquivo: `backend/src/services/orderStatus.service.js`

#### Arquivos Envolvidos:
```
Backend:
├── models/Order.js (campos de pagamento)
├── migrations/20251207_payment_methods.js (NOVO)
├── controllers/orderController.js (confirmarPagamento)
├── services/orderStatus.service.js (novo status)
└── services/socket.service.js (notificação atendente)

Frontend:
├── pages/checkout.js (opções de pagamento)
├── pages/atendente/index.js (painel pagamentos)
├── components/SplitBillModal.js (NOVO)
├── components/PaymentPendingCard.js (NOVO)
└── stores/orderStore.js (status pending_payment)
```

#### Critérios de Aceitação:
- [ ] Cliente escolhe forma de pagamento
- [ ] Atendente notificado para ir à mesa
- [ ] Divisão de conta funcional
- [ ] Pagamento confirmado pelo atendente

---

### SPRINT 44 - CASHBACK INSTAGRAM ⚠️ P1

**Objetivo**: Sistema de cashback via postagem no Instagram

**Prioridade**: P1 (Marketing/Engajamento)
**Estimativa**: 2-3 dias
**Dependências**: Nenhuma

#### Tarefas:
1. [ ] **Campos no Model User**
   - `instagramHandle` (STRING)
   - `instagramPromoOptIn` (BOOLEAN)
   - `lastInstagramPostDate` (DATE)
   - Arquivo: `backend/src/models/User.js`

2. [ ] **Campos no Model Order**
   - `instagramPromoOptIn` (BOOLEAN)
   - `instagramHandle` (STRING)
   - `instagramCashbackPending` (BOOLEAN)
   - `instagramCashbackConfirmed` (BOOLEAN)
   - `instagramCashbackAmount` (DECIMAL)
   - Arquivo: `backend/src/models/Order.js`

3. [ ] **UI no Checkout**
   - Seção "Ganhe 5% de cashback extra!"
   - Campo para informar @instagram
   - Checkbox "Quero participar"
   - Exibir termos resumidos
   - Exibir valor potencial de cashback
   - Arquivo: `frontend/src/pages/checkout.js`

4. [ ] **Verificação pelo Atendente**
   - Ao entregar pedido, mostrar se cliente participa
   - Exibir @ do Instagram
   - Instruções: pedir para mostrar postagem
   - Botões: [Confirmou] [Não postou]
   - Arquivo: `frontend/src/pages/atendente/index.js`

5. [ ] **Endpoints de Confirmação**
   - `POST /orders/:id/instagram-confirm`
   - `POST /orders/:id/instagram-reject`
   - Arquivo: `backend/src/controllers/orderController.js`

6. [ ] **Creditar Cashback Instagram**
   - Calcular 5% do valor do pedido
   - Verificar limite de 1x por dia
   - Adicionar via user.addCashback()
   - Notificar cliente
   - Arquivo: `backend/src/services/cashback.service.js`

#### Arquivos Envolvidos:
```
Backend:
├── models/User.js (campos Instagram)
├── models/Order.js (campos Instagram)
├── migrations/20251207_instagram_cashback.js (NOVO)
├── controllers/orderController.js (endpoints)
└── services/cashback.service.js (creditar)

Frontend:
├── pages/checkout.js (opt-in Instagram)
├── pages/atendente/index.js (verificação)
└── components/InstagramCashbackSection.js (NOVO)
```

#### Critérios de Aceitação:
- [ ] Cliente opta por participar no checkout
- [ ] Atendente verifica postagem na entrega
- [ ] Cashback 5% creditado automaticamente
- [ ] Limite 1x por dia respeitado

---

### SPRINT 45 - PAINEL RETIRADA NO BAR ⚠️ P1

**Objetivo**: Painel para exibir pedidos prontos para retirada

**Prioridade**: P1 (Operação balcão)
**Estimativa**: 1 dia
**Dependências**: Nenhuma

#### Tarefas:
1. [ ] **Filtro de Pedidos Balcão**
   - Pedidos com tableId = null e status = ready
   - Arquivo: `backend/src/controllers/staffController.js`

2. [ ] **Tab "Retirada" no Bar**
   - Lista de pedidos prontos
   - Número do pedido grande e visível
   - Nome do cliente
   - Lista de itens
   - Tempo desde que ficou pronto
   - Arquivo: `frontend/src/pages/staff/bar.js`

3. [ ] **Botão "Chamar Cliente"**
   - Enviar push notification
   - Enviar SMS
   - Arquivo: `backend/src/controllers/staffController.js`

4. [ ] **Botão "Entregue"**
   - Marcar pedido como delivered
   - Remover da lista
   - Arquivo: `frontend/src/pages/staff/bar.js`

#### Critérios de Aceitação:
- [ ] Pedidos de balcão aparecem no painel
- [ ] Cliente pode ser chamado via push/SMS
- [ ] Entrega confirmada remove da lista

---

### SPRINT 46 - FIX IMAGENS CARDÁPIO 🔧 P0

**Objetivo**: Corrigir exibição de imagens de produtos

**Prioridade**: P0 (Bug crítico de UX)
**Estimativa**: 0.5 dia
**Dependências**: Nenhuma

#### Problema Identificado:
O `next.config.js` não inclui o domínio do Railway nas imagens permitidas.

#### Tarefas:
1. [ ] **Adicionar Domínio Railway**
   - `backend-production-28c3.up.railway.app`
   - Arquivo: `frontend/next.config.js`

2. [ ] **Usar remotePatterns (Next 13+)**
   - Migrar de `domains` para `remotePatterns`
   - Mais flexível para subdomínios
   - Arquivo: `frontend/next.config.js`

3. [ ] **Fallback para Imagens Inválidas**
   - onError no Image component
   - Mostrar placeholder
   - Arquivo: `frontend/src/components/ProductCard.js`

#### Arquivo a Editar:
```javascript
// next.config.js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**.railway.app' },
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'source.unsplash.com' },
  ]
}
```

---

### SPRINT 47 - ACOMPANHAMENTO DE PEDIDO MELHORADO ⚠️ P1

**Objetivo**: Timeline detalhada do status do pedido

**Prioridade**: P1 (UX Cliente)
**Estimativa**: 1 dia
**Dependências**: Nenhuma

#### Tarefas:
1. [ ] **Timeline Visual**
   - Todos os status com timestamps
   - Indicador do status atual
   - Animação de progresso
   - Arquivo: `frontend/src/pages/pedido/[id].js`

2. [ ] **Detalhes do Pedido**
   - Lista de itens com imagens
   - Valores individuais
   - Desconto aplicado (se houver)
   - Taxa de serviço
   - Total final
   - Arquivo: `frontend/src/components/OrderDetails.js`

3. [ ] **Botão "Preciso de Ajuda"**
   - Chamar atendente via Socket
   - Notificar com mesa e pedido
   - Arquivo: `frontend/src/pages/pedido/[id].js`

---

### SPRINT 48 - NOTIFICAÇÃO DE CASHBACK ⚠️ P2

**Objetivo**: Notificar cliente quando recebe cashback

**Prioridade**: P2 (Engajamento)
**Estimativa**: 0.5 dia
**Dependências**: Sprint 44

#### Tarefas:
1. [ ] **Push de Cashback Recebido**
   - Após pedido entregue
   - Após confirmação Instagram
   - Após bônus automático
   - Arquivo: `backend/src/services/push.service.js`

2. [ ] **SMS de Cashback**
   - Opcional, configurável
   - Arquivo: `backend/src/services/sms.service.js`

3. [ ] **Histórico na Tela de Cashback**
   - Listar últimos créditos
   - Mostrar origem (pedido, instagram, bônus)
   - Arquivo: `frontend/src/pages/cashback.js`

---

## 📊 RESUMO DO ROADMAP

| Sprint | Nome | Prioridade | Estimativa | Status |
|--------|------|------------|------------|--------|
| 31 | Ficha Técnica Integrada | P1 | 1-2 dias | Pendente |
| 32 | Relatórios CMV e Gráficos | P2 | 2-3 dias | Pendente |
| 33 | Alertas Push Automáticos | P1 | 1-2 dias | Pendente |
| 34 | Cadastro de Fornecedores | P2 | 1-2 dias | Pendente |
| 35 | Automações CRM | P2 | 2 dias | Pendente |
| 36 | Job No-Show e Reservas | P2 | 1 dia | Pendente |
| 37 | Melhorias Dashboard Admin | P2 | 2 dias | Pendente |
| 38 | QR Code e Happy Hour | P2 | 1-2 dias | Pendente |
| 39 | Venda Manual no Caixa | P2 | 1 dia | Pendente |
| 40 | Testes E2E e Documentação | P1 | 2-3 dias | Pendente |
| **41** | **Cadastro CPF/Idade/Telefone Internacional** | **P0** | 3-4 dias | **🔴 Pendente** |
| **42** | **Taxa de Serviço 10%** | **P0** | 1-2 dias | **🔴 Pendente** |
| **43** | **Pagamento com Atendente** | **P0** | 3-4 dias | **🔴 Pendente** |
| **44** | **Cashback Instagram** | **P1** | 2-3 dias | **🟡 Pendente** |
| **45** | **Painel Retirada Bar** | **P1** | 1 dia | **🟡 Pendente** |
| **46** | **Fix Imagens Cardápio** | **P0** | 0.5 dia | **🔴 Pendente** |
| **47** | **Acompanhamento Pedido** | **P1** | 1 dia | **🟡 Pendente** |
| **48** | **Notificação Cashback** | **P2** | 0.5 dia | Pendente |

**Total estimado (31-40)**: 15-22 dias
**Total estimado (41-48)**: 13-18 dias
**TOTAL GERAL**: 28-40 dias

---

## 🎯 ORDEM DE EXECUÇÃO SUGERIDA (ATUALIZADA)

### 🚨 PRIORIDADE MÁXIMA (P0 - Fazer PRIMEIRO!)

**Sprint 46** → Fix Imagens Cardápio (0.5 dia)
- Bug crítico que afeta todos os clientes

**Sprint 41** → Cadastro CPF/Idade/Telefone Internacional (3-4 dias)
- Bloqueador LEGAL - venda de bebidas para menores
- Seletor de país para telefone com detecção automática de nacionalidade
- Validação de telefone internacional (libphonenumber-js)

**Sprint 42** → Taxa de Serviço 10% (1-2 dias)
- Receita operacional básica

**Sprint 43** → Pagamento com Atendente (3-4 dias)
- Fluxo básico de restaurante

### 🟡 ALTA PRIORIDADE (P1)

**Sprint 44** → Cashback Instagram (2-3 dias)
- Marketing e engajamento

**Sprint 45** → Painel Retirada Bar (1 dia)
- Operação de balcão

**Sprint 47** → Acompanhamento Pedido (1 dia)
- UX do cliente

### 📋 SPRINTS ORIGINAIS (31-40)

**Fase 1 - Essenciais (Sprints 31, 33)**
- Ficha técnica + Alertas push
- Completa gestão de estoque e operação em tempo real

**Fase 2 - Análise (Sprints 32, 37)**
- Relatórios + Dashboard
- Visão gerencial completa

**Fase 3 - Automação (Sprints 35, 36)**
- CRM + No-show
- Marketing automatizado

**Fase 4 - Extras (Sprints 34, 38, 39)**
- Fornecedores + QR + Venda manual
- Funcionalidades complementares

**Fase 5 - Qualidade (Sprint 40)**
- Testes + Documentação
- Preparação para produção

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

