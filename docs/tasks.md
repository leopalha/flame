# FLAME - TASKS & SPRINT PLANNING

## LEGENDA DE STATUS

- [ ] Nao iniciado
- [~] Em andamento
- [x] Concluido
- [!] Bloqueado
- [-] Pausado

---

## ESTADO ATUAL DO PROJETO (Dezembro 2024 - 04/12)

### Resumo da Analise

O projeto foi migrado de **EXXQUEMA** para **FLAME** e está em **FASE 2 COMPLETA**.

**FASE 2 - SISTEMA DE ESTOQUE - IMPLEMENTADO EM 04/12/2024:**
- Backend: Model InventoryMovement, Service com 8 métodos, Controller com 8 endpoints, Rotas protegidas
- OrderController e ProductController integrados para registrar movimentos automáticos
- Frontend: Zustand Store com 8 ações, InventoryTable com filtros, InventoryChart com análises
- Dashboard completo em /admin/estoque com modais de ajuste e histórico
- Rastreabilidade completa de movimentações com tipos (entrada, saída, ajuste, devolução)
- Previsão de falta de estoque baseada em consumo dos últimos 30 dias
- Build compilando sem erros (39 páginas)

**Design System FLAME implementado em 03/12/2024 - REFATORADO 04/12/2024:**
- Cores magenta (#FF006E) e cyan (#00D4FF) configuradas no `tailwind.config.js`
- Variaveis CSS dinâmicas (--theme-primary, --theme-secondary, --theme-accent)
- 6 Paletas de cores: FLAME, INFERNO, PASSION, NEON (roxo #2d1b4e), TWILIGHT, AMBER
- Fontes configuradas via next/font (Inter, Montserrat, Bebas Neue)
- **NOVO**: Sistema de seletor de temas no Header (dinâmico)

### O que ja esta implementado:
- [x] Estrutura basica do frontend (Next.js 14)
- [x] Estrutura basica do backend (Express + Sequelize)
- [x] Modelos de dados core (User, Product, Order, OrderItem, Table)
- [x] Autenticacao JWT basica
- [x] Sistema de pedidos completo (4 etapas)
- [x] Socket.IO para real-time
- [x] PWA configurado
- [x] **FASE 1.4 COMPLETA**: Todas 8 páginas core com visual FLAME
- [x] Painel cozinha basico
- [x] Painel atendente basico
- [x] Componente Logo FLAME
- [x] Sistema de Narguilé (mockado)
- [x] Sistema de Reservas (mockado)
- [x] Sistema de Avaliações (mockado)
- [x] Sistema de Temas Dinâmicos (6 paletas)

### O que precisa ser feito (prioridade):
1. ~~**URGENTE**: Atualizar Design System (cores FLAME)~~ **CONCLUIDO**
2. ~~Atualizar componentes visuais para usar novas classes FLAME~~ **CONCLUIDO**
3. ~~**FASE 1.5 - Fluxo QR Code + Balcao~~ **JA ESTAVA IMPLEMENTADO**
4. ~~**FASE 2 - Sistema de Estoque~~ **CONCLUIDO 04/12/2024**
5. **PROXIMO**: FASE 3 - Staff (Cozinha, Bar, Atendente)
6. **FUTURO**: FASE 4 - Narguile + Reservas, FASE 5 - CRM + Fidelidade

---

## SPRINT ATUAL: FASE 1 - CORE VISUAL

### 1.1 Design System (PRIORIDADE MAXIMA) - CONCLUIDO

| # | Task | Status | Notas |
|---|------|--------|-------|
| 1.1.1 | Atualizar `tailwind.config.js` com cores FLAME | [x] | Paleta magenta/cyan implementada |
| 1.1.2 | Atualizar `globals.css` com variaveis CSS FLAME | [x] | --flame-magenta, --flame-cyan, gradientes |
| 1.1.3 | Criar utilitarios CSS para gradiente FLAME | [x] | .gradient-flame, .text-gradient-flame, .flame-glow |
| 1.1.4 | Atualizar fontes (Bebas Neue, Inter, Montserrat) | [x] | Configurado via next/font no _app.js |
| 1.1.5 | Criar tokens de sombra/glow FLAME | [x] | glow-magenta, glow-cyan, glow-flame |

### 1.2 Componentes Base - CONCLUIDO

| # | Task | Status | Notas |
|---|------|--------|-------|
| 1.2.1 | Criar/Refatorar Button com variantes FLAME | [x] | primary, secondary, ghost, danger, success |
| 1.2.2 | Criar/Refatorar Card com novas cores | [x] | default, elevated, gradient, glass, outline |
| 1.2.3 | Criar/Refatorar Input com focus FLAME | [x] | Borda magenta, Textarea incluido |
| 1.2.4 | Criar Badge com variantes | [x] | flame, magenta, cyan, success, warning, error |
| 1.2.5 | Criar Spinner FLAME | [x] | Dual ring animado + LoadingOverlay |
| 1.2.6 | Criar Skeleton loading | [x] | SkeletonText, SkeletonCard, SkeletonAvatar |

### 1.3 Layout Components - CONCLUIDO

| # | Task | Status | Notas |
|---|------|--------|-------|
| 1.3.1 | Refatorar Header com cores FLAME | [x] | Logo + nav + botoes gradiente |
| 1.3.2 | Refatorar BottomNav mobile | [x] | Icones com gradiente ativo |
| 1.3.3 | Refatorar Footer | [x] | Links sociais + newsletter |
| 1.3.4 | Criar Logo.js com branding FLAME | [x] | Chama + gradiente magenta->cyan |

### 1.4 Paginas Core (Atualizacao Visual) - CONCLUIDO

| # | Task | Status | Notas |
|---|------|--------|-------|
| 1.4.1 | Atualizar Landing page (index.js) | [x] | Hero com gradiente FLAME |
| 1.4.2 | Atualizar Cardapio | [x] | ProductCard com novas cores |
| 1.4.3 | Atualizar Carrinho | [x] | Botoes e totais |
| 1.4.4 | Atualizar Checkout | [x] | Fluxo de pagamento |
| 1.4.5 | Atualizar Tracking (pedido/[id].js) | [x] | Timeline visual |
| 1.4.6 | Atualizar Login/Register | [x] | Formularios |
| 1.4.7 | Atualizar Perfil | [x] | Refatorado para temas dinâmicos |

### 1.5 Fluxo QR Code + Balcao

| # | Task | Status | Notas |
|---|------|--------|-------|
| 1.5.1 | Revisar fluxo QR Code (qr/[mesaId].js) | [ ] | Mesa auto-detectada |
| 1.5.2 | Adicionar opcao "Retirar no Balcao" | [ ] | Toggle no checkout |
| 1.5.3 | Notificacao push para balcao | [ ] | Quando pedido pronto |

---

## SPRINT COMPLETO: FASE 2 - ESTOQUE (CONCLUIDO 04/12/2024)

### 2.1 Backend - Modelos [x] CONCLUIDO

| # | Task | Status | Notas |
|---|------|--------|-------|
| 2.1.1 | Criar InventoryMovement model | [x] | 13 campos: id, productId, orderId, type, quantity, reason, previousStock, newStock, notes, userId, createdAt |
| 2.1.2 | Implementar 4 metodos helpers | [x] | getTypeLabel(), getReasonLabel(), getStockDifference(), isSaleMovement() |
| 2.1.3 | Criar indexes otimizados | [x] | productId, orderId, createdAt, type, reason, (productId, createdAt) |
| 2.1.4 | Definir associacoes Sequelize | [x] | Product.hasMany, Order.hasMany, User.belongsTo |

### 2.2 Backend - Service & API [x] CONCLUIDO

| # | Task | Status | Notas |
|---|------|--------|-------|
| 2.2.1 | Criar inventoryService.js | [x] | 8 metodos: recordMovement, getProductMovements, getLowStockProducts, getStockAlerts, generateReport, getConsumptionByProduct, getConsumptionByCategory, predictStockOut |
| 2.2.2 | Criar inventoryController.js | [x] | 8 endpoints com respostas JSON normalizadas |
| 2.2.3 | Criar rotas inventory.js | [x] | GET /dashboard, /movements, /products/:id/movements, /alerts, /report, /forecast, /consumption + POST /adjust |
| 2.2.4 | Integrar rotas ao /api | [x] | Autenticacao e requireAdmin middleware |
| 2.2.5 | Modificar orderController | [x] | recordMovement ao criar/cancelar pedidos automaticamente |
| 2.2.6 | Modificar productController | [x] | recordMovement ao ajustar estoque manualmente |

### 2.3 Frontend - Store & Components [x] CONCLUIDO

| # | Task | Status | Notas |
|---|------|--------|-------|
| 2.3.1 | Criar inventoryStore.js | [x] | Zustand store com 8 acoes (fetch/adjust), paginacao, loading, error |
| 2.3.2 | Criar InventoryTable.js | [x] | Tabela interativa, filtros por status (ok/warning/critical), busca, expandir linhas |
| 2.3.3 | Criar InventoryChart.js | [x] | Graficos de consumo, top produtos, previsao de falta, barras animadas |
| 2.3.4 | Criar dashboard /admin/estoque | [x] | Cards de resumo (críticos, alertas, urgentes), tabela, graficos, modais |
| 2.3.5 | Modal de ajuste de estoque | [x] | Form com quantidade, motivo, notas, confirmacao |
| 2.3.6 | Modal de historico | [x] | Timeline de movimentacoes com filtros |

### 2.4 Integracao & Funcionalidades [x] CONCLUIDO

| # | Task | Status | Notas |
|---|------|--------|-------|
| 2.4.1 | Rastreabilidade completa | [x] | Cada movimento registrado com: tipo, razao, estoque antes/depois, usuario, timestamp, orderId |
| 2.4.2 | Estoque automatico ao vender | [x] | Decremento ao criar pedido, incremento ao cancelar |
| 2.4.3 | Alertas de estoque baixo | [x] | GET /alerts retorna criticos (zerados), warnings (abaixo do minimo) |
| 2.4.4 | Previsao de stockout | [x] | Calcula dias ate acabar baseado em consumo 30 dias, sugere quantidade a encomendar |
| 2.4.5 | Relatorios de consumo | [x] | Por produto e categoria, com valor total e media diaria |
| 2.4.6 | Build sem erros | [x] | 39 paginas compiladas, frontend + backend integrados |

---

## FASE 3: STAFF (Semanas 5-6)

### 3.1 Sistema de Roles

| # | Task | Status | Notas |
|---|------|--------|-------|
| 3.1.1 | Verificar/adicionar campo role no modelo User | [ ] | kitchen, bar, attendant, cashier, manager, admin |
| 3.1.2 | Criar middleware role.middleware.js | [ ] | Verificar permissoes |
| 3.1.3 | Criar tela de login staff | [ ] | /staff/login |
| 3.1.4 | Redirect por role apos login | [ ] | Cada role -> seu painel |

### 3.2 Painel Cozinha

| # | Task | Status | Notas |
|---|------|--------|-------|
| 3.2.1 | Refatorar /staff/cozinha (existe parcialmente) | [ ] | Melhorar UX |
| 3.2.2 | Componente OrderQueue | [ ] | Fila visual |
| 3.2.3 | Filtro por categoria | [ ] | So comida |
| 3.2.4 | Timer por pedido | [ ] | Tempo desde criacao |
| 3.2.5 | Alerta de atraso (>15min) | [ ] | Visual + som |
| 3.2.6 | Som de notificacao | [ ] | Audio API |

### 3.3 Painel Bar

| # | Task | Status | Notas |
|---|------|--------|-------|
| 3.3.1 | Criar /staff/bar | [ ] | Nova pagina |
| 3.3.2 | Aba Drinks (igual cozinha) | [ ] | Fila de drinks |
| 3.3.3 | Aba Narguile | [ ] | Sessoes ativas |
| 3.3.4 | Lista de sessoes ativas | [ ] | Cards com timer |
| 3.3.5 | Timer por narguile | [ ] | Real-time |
| 3.3.6 | Alerta troca de carvao | [ ] | A cada 15min |

### 3.4 Painel Atendente

| # | Task | Status | Notas |
|---|------|--------|-------|
| 3.4.1 | Refatorar /staff/atendente (existe) | [ ] | Melhorar |
| 3.4.2 | Aba Prontos para entrega | [ ] | Pedidos ready |
| 3.4.3 | Aba Minhas entregas | [ ] | Pedidos comigo |
| 3.4.4 | Aba Balcao | [ ] | Retiradas |
| 3.4.5 | Botao "Chamar cliente" | [ ] | Push notification |

### 3.5 Real-time Aprimorado

| # | Task | Status | Notas |
|---|------|--------|-------|
| 3.5.1 | Revisar eventos Socket.IO | [ ] | Padronizar |
| 3.5.2 | Separar por namespace | [ ] | /kitchen, /bar, /attendant |
| 3.5.3 | Implementar rooms por setor | [ ] | Isolamento |
| 3.5.4 | Notificacoes sonoras | [ ] | Web Audio API |

---

## FASE 4: NARGUILE + RESERVAS (Semanas 7-8)

### 4.1 Narguile - Backend

| # | Task | Status | Notas |
|---|------|--------|-------|
| 4.1.1 | Criar modelo HookahSession | [ ] | Mesa, sabor, timer |
| 4.1.2 | Criar modelo HookahFlavor | [ ] | Sabores disponiveis |
| 4.1.3 | CRUD /api/hookah/flavors | [ ] | Admin |
| 4.1.4 | POST /api/hookah/sessions | [ ] | Iniciar sessao |
| 4.1.5 | PUT /api/hookah/sessions/:id/coal | [ ] | Troca carvao |
| 4.1.6 | PUT /api/hookah/sessions/:id/end | [ ] | Finalizar |
| 4.1.7 | Calculo de valor por tempo | [ ] | R$/hora |

### 4.2 Narguile - Frontend

| # | Task | Status | Notas |
|---|------|--------|-------|
| 4.2.1 | Categoria Narguile no cardapio | [ ] | Produtos especiais |
| 4.2.2 | Seletor de sabores | [ ] | Modal |
| 4.2.3 | Componente HookahTimer (cliente) | [ ] | Visualizacao |
| 4.2.4 | Componente HookahControl (bar) | [ ] | Controles staff |
| 4.2.5 | Real-time timer sync | [ ] | Socket.IO |

### 4.3 Reservas - Backend (MOCK) - CONCLUIDO (03/12/2024)

| # | Task | Status | Notas |
|---|------|--------|-------|
| 4.3.1 | Criar modelo Reservation | [x] | Data, hora, pessoas, status (reservationStore.js) |
| 4.3.2 | GET /api/reservations/availability | [x] | Slots mock via getAvailableSlots() |
| 4.3.3 | POST /api/reservations | [x] | createReservation() no store |
| 4.3.4 | PUT /api/reservations/:id/confirm | [x] | confirmReservation() |
| 4.3.5 | PUT /api/reservations/:id/cancel | [x] | cancelReservation() |
| 4.3.6 | Job de lembrete (2h antes) | [ ] | node-cron + SMS (futuro) |
| 4.3.7 | Job de no-show (15min apos) | [ ] | Marca automatico (futuro) |

### 4.4 Reservas - Frontend - CONCLUIDO (03/12/2024)

| # | Task | Status | Notas |
|---|------|--------|-------|
| 4.4.1 | Pagina /reservas | [x] | Cliente - calendario + formulario |
| 4.4.2 | Componente ReservationCalendar | [x] | Selecao de data inline |
| 4.4.3 | Seletor de horarios | [x] | Slots disponiveis visuais |
| 4.4.4 | Lista "Minhas Reservas" | [x] | Historico com cancelamento |
| 4.4.5 | Admin: lista de reservas do dia | [x] | Integrado no dashboard |
| 4.4.6 | Admin: confirmar/cancelar | [x] | Acoes disponiveis

---

## FASE 5: CRM + FIDELIDADE (Semanas 9-10)

### 5.1 CRM - Backend

| # | Task | Status | Notas |
|---|------|--------|-------|
| 5.1.1 | Expandir modelo User (metricas) | [ ] | totalSpent, orderCount, lastVisit |
| 5.1.2 | Calcular metricas automaticamente | [ ] | Hooks |
| 5.1.3 | GET /api/customers (admin) | [ ] | Lista com filtros |
| 5.1.4 | GET /api/customers/:id (detalhes) | [ ] | Perfil completo |
| 5.1.5 | Filtros de segmentacao | [ ] | VIP, inativos, aniversariantes |

### 5.2 CRM - Frontend

| # | Task | Status | Notas |
|---|------|--------|-------|
| 5.2.1 | Pagina /admin/clientes | [ ] | Lista |
| 5.2.2 | Lista com busca e filtros | [ ] | Componente |
| 5.2.3 | Detalhes do cliente | [ ] | Modal/pagina |
| 5.2.4 | Historico de pedidos | [ ] | Timeline |
| 5.2.5 | Notas/tags | [ ] | Admin pode adicionar |

### 5.3 Fidelidade - Backend

| # | Task | Status | Notas |
|---|------|--------|-------|
| 5.3.1 | Criar modelo PointsTransaction | [ ] | Credito/debito |
| 5.3.2 | Criar modelo Reward | [ ] | Recompensas |
| 5.3.3 | Logica de tiers | [ ] | Bronze, Silver, Gold, Platinum |
| 5.3.4 | Credito automatico pos-entrega | [ ] | R$1 = 1 ponto |
| 5.3.5 | POST /api/points/redeem/:rewardId | [ ] | Resgatar |
| 5.3.6 | Job de expiracao (12 meses) | [ ] | node-cron |

### 5.4 Fidelidade - Frontend

| # | Task | Status | Notas |
|---|------|--------|-------|
| 5.4.1 | Pagina /pontos | [ ] | Dashboard cliente |
| 5.4.2 | Componente PointsDisplay | [ ] | Saldo + tier |
| 5.4.3 | Barra de progresso proximo tier | [ ] | Visual |
| 5.4.4 | Lista de recompensas | [ ] | Grid |
| 5.4.5 | Fluxo de resgate | [ ] | Modal |
| 5.4.6 | Historico de transacoes | [ ] | Lista |
| 5.4.7 | Usar pontos no checkout | [ ] | Integracao |

---

## FASE 6: FINANCEIRO (Semanas 11-12)

### 6.1 Caixa - Backend

| # | Task | Status | Notas |
|---|------|--------|-------|
| 6.1.1 | Criar modelo Cashier | [ ] | Abertura/fechamento |
| 6.1.2 | Criar modelo CashierMovement | [ ] | Vendas, sangrias |
| 6.1.3 | POST /api/cashier/open | [ ] | Abrir caixa |
| 6.1.4 | POST /api/cashier/withdrawal | [ ] | Sangria |
| 6.1.5 | POST /api/cashier/deposit | [ ] | Suprimento |
| 6.1.6 | POST /api/cashier/close | [ ] | Fechar caixa |
| 6.1.7 | Relatorio de fechamento | [ ] | Resumo |

### 6.2 Caixa - Frontend

| # | Task | Status | Notas |
|---|------|--------|-------|
| 6.2.1 | Pagina /staff/caixa | [ ] | PDV |
| 6.2.2 | Componente CashierPanel | [ ] | Resumo |
| 6.2.3 | Modal abertura de caixa | [ ] | Valor inicial |
| 6.2.4 | Modal sangria | [ ] | Motivo, valor |
| 6.2.5 | Modal suprimento | [ ] | Motivo, valor |
| 6.2.6 | Fluxo de fechamento | [ ] | Conferencia |

### 6.3 Relatorios - Backend

| # | Task | Status | Notas |
|---|------|--------|-------|
| 6.3.1 | GET /api/reports/sales | [ ] | Vendas por periodo |
| 6.3.2 | GET /api/reports/products | [ ] | Por produto |
| 6.3.3 | GET /api/reports/categories | [ ] | Por categoria |
| 6.3.4 | GET /api/reports/hourly | [ ] | Por hora |
| 6.3.5 | GET /api/reports/dre | [ ] | DRE simplificado |

### 6.4 Relatorios - Frontend

| # | Task | Status | Notas |
|---|------|--------|-------|
| 6.4.1 | Pagina /admin/relatorios | [ ] | Dashboard |
| 6.4.2 | Componente SalesChart | [ ] | Grafico |
| 6.4.3 | Tabela de produtos | [ ] | Ranking |
| 6.4.4 | Mapa de calor por hora | [ ] | Visual |
| 6.4.5 | DRE simplificado | [ ] | Receita - Custo |
| 6.4.6 | Exportar para Excel | [ ] | CSV/XLSX |

---

## BACKLOG (Futuro)

| Task | Prioridade | Notas |
|------|------------|-------|
| Delivery (entregas externas) | Alta | Fase futura |
| Integracao WhatsApp | Media | Notificacoes |
| App nativo (React Native) | Baixa | Avaliar necessidade |
| Multiplas unidades | Baixa | Escala |
| BI avancado | Baixa | Dashboards |

---

## BUGS CONHECIDOS

| Bug | Severidade | Status | Notas |
|-----|------------|--------|-------|
| - | - | - | - |

---

## NOTAS TECNICAS

- Priorizar mobile-first em todas as telas
- Manter real-time funcionando em todas as operacoes de staff
- Testar offline mode do PWA
- Garantir que estoque e atualizado atomicamente

---

## HISTORICO DE SPRINTS

### Sprint 0 (Fundacao) - CONCLUIDO
- [x] Setup inicial do projeto
- [x] Estrutura frontend/backend
- [x] Modelos basicos
- [x] Autenticacao

### Sprint 1.1 (Design System) - CONCLUIDO (03/12/2024)
- [x] Atualizar tailwind.config.js com cores FLAME (magenta #FF006E, cyan #00D4FF)
- [x] Atualizar globals.css com variaveis CSS FLAME
- [x] Criar utilitarios CSS (.gradient-flame, .text-gradient-flame, .flame-glow)
- [x] Configurar fontes via next/font (Inter, Montserrat, Bebas Neue)
- [x] Criar tokens de sombra/glow (glow-magenta, glow-cyan, glow-flame)
- [x] Build compilando sem erros

### Sprint 1.2 (Componentes Base + Config) - CONCLUIDO (03/12/2024)
- [x] Configurar backend para porta 7000 (.env, server.js, frontend .env.local)
- [x] Criar componente Button (primary, secondary, ghost, danger, success)
- [x] Criar componente Card (default, elevated, gradient, glass, outline)
- [x] Criar componente Input (com Textarea)
- [x] Criar componente Badge (flame, magenta, cyan, semanticos)
- [x] Criar componente Spinner (flame dual-ring, LoadingOverlay)
- [x] Criar componente Skeleton (text, card, avatar, table-row)
- [x] Criar index.js para exportar componentes ui/
- [x] Build compilando sem erros

### Sprint 1.3 (Layout Components) - CONCLUIDO (03/12/2024)
- [x] Criar novo Logo.js com branding FLAME (chama + gradiente magenta->cyan)
- [x] Refatorar Header.js com cores FLAME (botoes, links ativos, avatar)
- [x] Refatorar Footer.js com cores FLAME (icones, newsletter, social)
- [x] Criar BottomNav.js para navegacao mobile (gradiente ativo, badge carrinho)
- [x] Atualizar Layout.js (integrar BottomNav, cores FLAME no toast, loading)
- [x] Corrigir erros de rotas backend (validate -> handleValidationErrors)
- [x] Backend e frontend rodando sem erros

### Sprint 3 (Narguile Integration) - CONCLUIDO (03/12/2024)
- [x] Criar hookahStore.js com Zustand (sabores, sessoes, timers)
- [x] Criar pagina /narguile com catalogo de sabores
- [x] Adicionar sessao ativa com timer real-time
- [x] Criar HookahCard e HookahSessionCard components
- [x] Integrar categoria Narguile no cardapio
- [x] Build compilando sem erros (37 paginas)

### Sprint 4 (Sistema de Reservas) - CONCLUIDO (03/12/2024)
- [x] Criar reservationStore.js com Zustand
- [x] Implementar getAvailableSlots() para horarios
- [x] Criar pagina /reservas com calendario
- [x] Adicionar formulario de nova reserva
- [x] Lista "Minhas Reservas" com cancelamento
- [x] Integrar com admin dashboard
- [x] Build compilando sem erros

### Sprint 5 (Sistema de Pedidos Online) - CONCLUIDO (03/12/2024)
- [x] Criar orderStore.js com Zustand + persist
- [x] Implementar ORDER_STATUS, PAYMENT_METHODS, CONSUMPTION_TYPES
- [x] Criar pagina /checkout com fluxo 4 etapas
- [x] Etapa 1: Revisao do carrinho
- [x] Etapa 2: Tipo de consumo (mesa, balcao, delivery)
- [x] Etapa 3: Forma de pagamento (PIX, credito, debito, dinheiro)
- [x] Etapa 4: Confirmacao do pedido
- [x] Atualizar pagina /pedidos para usar orderStore
- [x] Modal de detalhes do pedido
- [x] Build compilando sem erros (37 paginas)

### Sprint 6 (Dashboard Admin Melhorado) - CONCLUIDO (03/12/2024)
- [x] Integrar orderStore no admin/index.js
- [x] Integrar reservationStore no admin/index.js
- [x] Adicionar contadores dinamicos (pedidos ativos, reservas)
- [x] Calcular receita do dia a partir dos pedidos
- [x] Adicionar botao "Reservas" nas acoes rapidas
- [x] Atualizar cores dos botoes para tema FLAME
- [x] Deploy no Vercel (flame-lounge.vercel.app)

### Sprint 6.5 (Atualizacoes de Branding) - CONCLUIDO (03/12/2024)
- [x] Atualizar telefone em todos os arquivos (99999-9999 -> 99554-6492)
- [x] Atualizar links WhatsApp na pagina programacao.js
- [x] Atualizar Footer.js com telefone correto
- [x] Atualizar termos.js com branding FLAME
- [x] Criar themeStore.js para sistema de paletas de cores
- [x] Adicionar seletor de paleta no Header
- [x] 3 paletas: FLAME Original, Inferno (vermelho/roxo), Solar (vermelho/amarelo)
- [x] Build compilando sem erros (37 paginas)

### Sprint 7 (Sistema de Avaliacoes) - CONCLUIDO (03/12/2024)
- [x] Criar reviewStore.js com Zustand + persist
- [x] Implementar REVIEW_STATUS, REVIEW_CATEGORIES
- [x] Criar pagina /avaliacoes com listagem publica
- [x] Estatisticas: media geral, distribuicao, medias por categoria
- [x] Filtros e ordenacao de avaliacoes
- [x] Integrar pagina avaliacao/[pedidoId].js com reviewStore
- [x] Adicionar link "Avaliacoes" no Header
- [x] Build compilando sem erros (38 paginas)

### Sprint 7.5 (Tipografia de Logos) - CONCLUIDO (03/12/2024)
- [x] Atualizar 3 logos principais em /logos.js
- [x] Implementar tipografia Microgramma EF Bold Extended para "FLAME"
- [x] Implementar tipografia Besides para "LOUNGE BAR"
- [x] Layout vertical: icone acima, texto centralizado abaixo
- [x] Atualizar secao Design System com fontes corretas
- [x] Atualizar diretrizes de uso com novas fontes
- [x] Build compilando sem erros (38 paginas)

### Sprint 8 (FASE 1.4 Completa + Tema NEON) - CONCLUIDO (04/12/2024)
- [x] Refatorar perfil.js para usar variáveis CSS dinâmicas
- [x] Atualizar todos os botões para gradientes tema dinâmicos
- [x] Implementar toggles de notificações com cores dinâmicas
- [x] Atualizar ícones de seções para usar --theme-primary
- [x] Validar FASE 1.4: todas 8 páginas com visual FLAME
- [x] Atualizar tema NEON para roxo mais vibrante (#2d1b4e)
- [x] Build compilando sem erros (38 páginas)

---

*Ultima atualizacao: 04/12/2024*
*Agente de Desenvolvimento: Claude FLAME*
