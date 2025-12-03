# FLAME - TASKS & SPRINT PLANNING

## LEGENDA DE STATUS

- [ ] Nao iniciado
- [~] Em andamento
- [x] Concluido
- [!] Bloqueado
- [-] Pausado

---

## ESTADO ATUAL DO PROJETO (Dezembro 2024)

### Resumo da Analise

O projeto foi migrado de **EXXQUEMA** para **FLAME**.

**Design System FLAME implementado em 03/12/2024:**
- Cores magenta (#FF006E) e cyan (#00D4FF) configuradas no `tailwind.config.js`
- Variaveis CSS FLAME no `globals.css` (--flame-magenta, --flame-cyan, gradientes)
- Fontes configuradas via next/font (Inter, Montserrat, Bebas Neue)
- Build compilando sem erros

### O que ja esta implementado:
- [x] Estrutura basica do frontend (Next.js 14)
- [x] Estrutura basica do backend (Express + Sequelize)
- [x] Modelos de dados core (User, Product, Order, OrderItem, Table)
- [x] Autenticacao JWT basica
- [x] Sistema de pedidos basico
- [x] Socket.IO para real-time
- [x] PWA configurado
- [x] Paginas principais (cardapio, carrinho, checkout, pedidos)
- [x] Painel cozinha basico
- [x] Painel atendente basico
- [x] Componente Logo FLAME

### O que precisa ser feito (prioridade):
1. ~~**URGENTE**: Atualizar Design System (cores FLAME)~~ **CONCLUIDO**
2. Atualizar componentes visuais para usar novas classes FLAME
3. Implementar modulos faltantes (estoque, CRM, fidelidade, narguilé, reservas, caixa)

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

### 1.4 Paginas Core (Atualizacao Visual)

| # | Task | Status | Notas |
|---|------|--------|-------|
| 1.4.1 | Atualizar Landing page (index.js) | [ ] | Hero com gradiente FLAME |
| 1.4.2 | Atualizar Cardapio | [ ] | ProductCard com novas cores |
| 1.4.3 | Atualizar Carrinho | [ ] | Botoes e totais |
| 1.4.4 | Atualizar Checkout | [ ] | Fluxo de pagamento |
| 1.4.5 | Atualizar Tracking (pedido/[id].js) | [ ] | Timeline visual |
| 1.4.6 | Atualizar Login/Register | [ ] | Formularios |
| 1.4.7 | Atualizar Perfil | [ ] | Avatar, dados |

### 1.5 Fluxo QR Code + Balcao

| # | Task | Status | Notas |
|---|------|--------|-------|
| 1.5.1 | Revisar fluxo QR Code (qr/[mesaId].js) | [ ] | Mesa auto-detectada |
| 1.5.2 | Adicionar opcao "Retirar no Balcao" | [ ] | Toggle no checkout |
| 1.5.3 | Notificacao push para balcao | [ ] | Quando pedido pronto |

---

## SPRINT PROXIMO: FASE 2 - ESTOQUE

### 2.1 Backend - Modelos

| # | Task | Status | Notas |
|---|------|--------|-------|
| 2.1.1 | Criar modelo Stock (insumos) | [ ] | nome, categoria, unidade, quantidade, minimo |
| 2.1.2 | Criar modelo StockMovement | [ ] | entrada, saida, ajuste |
| 2.1.3 | Criar modelo Supplier (fornecedores) | [ ] | nome, cnpj, contato |
| 2.1.4 | Criar modelo ProductRecipe (ficha tecnica) | [ ] | produto -> insumos |
| 2.1.5 | Criar migracoes | [ ] | npx sequelize-cli migration:generate |
| 2.1.6 | Criar seeders de teste | [ ] | Dados iniciais |

### 2.2 Backend - API

| # | Task | Status | Notas |
|---|------|--------|-------|
| 2.2.1 | CRUD /api/stock | [ ] | Lista, detalhes, criar, atualizar |
| 2.2.2 | POST /api/stock/:id/entry | [ ] | Entrada de estoque |
| 2.2.3 | POST /api/stock/:id/exit | [ ] | Saida manual |
| 2.2.4 | GET /api/stock/alerts | [ ] | Itens abaixo do minimo |
| 2.2.5 | GET /api/stock/movements | [ ] | Historico de movimentacoes |
| 2.2.6 | CRUD /api/suppliers | [ ] | Fornecedores |

### 2.3 Backend - Integracao Vendas

| # | Task | Status | Notas |
|---|------|--------|-------|
| 2.3.1 | Criar StockService | [ ] | Logica de baixa |
| 2.3.2 | Baixa automatica ao confirmar pedido | [ ] | Hooks no Order |
| 2.3.3 | Verificar estoque antes de confirmar | [ ] | Validacao |
| 2.3.4 | Gerar alerta quando < minimo | [ ] | Socket.IO |
| 2.3.5 | Job de verificacao periodica | [ ] | node-cron |

### 2.4 Frontend - Admin

| # | Task | Status | Notas |
|---|------|--------|-------|
| 2.4.1 | Pagina /admin/estoque | [ ] | Lista de insumos |
| 2.4.2 | Componente StockTable | [ ] | Tabela com acoes |
| 2.4.3 | Modal de entrada de estoque | [ ] | Form com quantidade, custo |
| 2.4.4 | Modal de saida manual | [ ] | Motivo, quantidade |
| 2.4.5 | Tela de alertas | [ ] | Itens baixos |
| 2.4.6 | Historico de movimentacoes | [ ] | Timeline |

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

### 4.3 Reservas - Backend

| # | Task | Status | Notas |
|---|------|--------|-------|
| 4.3.1 | Criar modelo Reservation | [ ] | Data, hora, pessoas, status |
| 4.3.2 | GET /api/reservations/availability | [ ] | Horarios disponiveis |
| 4.3.3 | POST /api/reservations | [ ] | Criar reserva |
| 4.3.4 | PUT /api/reservations/:id/confirm | [ ] | Staff confirma |
| 4.3.5 | PUT /api/reservations/:id/cancel | [ ] | Cancelar |
| 4.3.6 | Job de lembrete (2h antes) | [ ] | node-cron + SMS |
| 4.3.7 | Job de no-show (15min apos) | [ ] | Marca automatico |

### 4.4 Reservas - Frontend

| # | Task | Status | Notas |
|---|------|--------|-------|
| 4.4.1 | Pagina /reservas | [ ] | Cliente |
| 4.4.2 | Componente ReservationCalendar | [ ] | Selecao de data |
| 4.4.3 | Seletor de horarios | [ ] | Slots disponiveis |
| 4.4.4 | Lista "Minhas Reservas" | [ ] | Historico |
| 4.4.5 | Admin: lista de reservas do dia | [ ] | Staff view |
| 4.4.6 | Admin: confirmar/cancelar | [ ] | Acoes |

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

---

*Ultima atualizacao: 03/12/2024*
*Agente de Desenvolvimento: Claude FLAME*
