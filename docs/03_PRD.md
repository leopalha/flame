# 📋 FLAME - PRODUCT REQUIREMENTS DOCUMENT (PRD)

## VISÃO GERAL

**Produto:** FLAME - Plataforma Digital Integrada  
**Versão:** 3.0.0  
**Tipo:** PWA (Progressive Web App) Full-Stack  
**Objetivo:** Ecossistema completo que conecta clientes, funcionários e gestão em tempo real

---

## 1. ARQUITETURA DO ECOSSISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                    FLAME ECOSYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐               │
│   │ CLIENTE │    │  STAFF  │    │  ADMIN  │               │
│   └────┬────┘    └────┬────┘    └────┬────┘               │
│        │              │              │                     │
│        └──────────────┼──────────────┘                     │
│                       │                                     │
│              ┌────────▼────────┐                           │
│              │   FLAME CORE    │                           │
│              │                 │                           │
│              │  • Pedidos      │                           │
│              │  • Estoque      │                           │
│              │  • CRM          │                           │
│              │  • Fidelidade   │                           │
│              │  • Financeiro   │                           │
│              │  • Real-time    │                           │
│              └────────┬────────┘                           │
│                       │                                     │
│              ┌────────▼────────┐                           │
│              │    DATABASE     │                           │
│              └─────────────────┘                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. MÓDULOS DO SISTEMA

### 2.1 MÓDULO CLIENTE (App Público)

#### Funcionalidades

| Feature | Descrição | Prioridade |
|---------|-----------|------------|
| Cadastro | Registro com telefone + SMS, email/senha ou Google OAuth | P0 |
| Login | SMS OTP, email/senha ou Google OAuth | P0 |
| Cardápio Digital | Browse, busca, filtros | P0 |
| Carrinho | Adicionar, remover, editar | P0 |
| Mesa via QR | Scan QR = mesa auto | P0 |
| Pedido Mesa | Pedir estando na mesa | P0 |
| Pedido Balcão | Retirada no balcão | P0 |
| Reserva Mesa | Agendar mesa antecipada | P1 |
| Narguilé | Solicitar, escolher sabor | P1 |
| Pagamento | Cartão, PIX, Dinheiro | P0 |
| Acompanhamento | Status em tempo real | P0 |
| Histórico | Pedidos anteriores | P1 |
| Avaliação | Avaliar pedido | P2 |
| Cashback | Ver saldo, usar desconto | P1 |
| Perfil | Dados, preferências | P1 |

#### Fluxo Principal (Mesa)

```
QR Code Mesa → Site abre → Mesa detectada auto
    ↓
Usuário logado? 
    → Sim: Vai para cardápio
    → Não: Tela login/cadastro
    ↓
Cardápio → Adiciona itens → Carrinho
    ↓
Checkout → Confirma mesa → Pagamento
    ↓
Pedido criado → Tracking em tempo real
    ↓
Pedido entregue → Avaliar (opcional) → Cashback creditado
```

#### Fluxo Balcão

```
Site direto (sem QR) → Login/Cadastro
    ↓
Cardápio → Adiciona itens → Carrinho
    ↓
Checkout → Marca "Retirar no Balcão"
    ↓
Pagamento → Pedido criado
    ↓
Notificação "Pedido Pronto" → Retira no balcão
```

---

### 2.1.1 AUTENTICAÇÃO E CADASTRO

#### Métodos de Autenticação Suportados

O sistema oferece **3 métodos de autenticação** para máxima flexibilidade:

| Método | Descrição | Campos Obrigatórios | profileComplete | Uso Recomendado |
|--------|-----------|---------------------|-----------------|-----------------|
| **Cadastro Tradicional** | Email + Senha + Celular + SMS | nome, email, celular, senha | ✅ true após SMS | Clientes que preferem cadastro completo |
| **Cadastro por Telefone** | Apenas Celular + SMS | celular | ❌ false | Cadastro rápido, completar depois |
| **Google OAuth 2.0** | Login com conta Google | email, nome (do Google) | ✅ true automático | Experiência mais rápida e segura |

#### Fluxo de Autenticação Completo

```
┌─────────────────────────────────────────────────────────────┐
│                  TELA DE LOGIN/CADASTRO                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Opção 1: [Entrar com Google] ────────┐                    │
│                                        │                    │
│  Opção 2: Cadastro Completo           │                    │
│  ├─ Nome                               │                    │
│  ├─ Email                              ├──► Backend        │
│  ├─ Celular                            │    Valida         │
│  └─ Senha                              │    Cria User      │
│                                        │    Envia SMS      │
│  Opção 3: Cadastro Rápido (só celular)│                    │
│  └─ Celular ───────────────────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
            ┌──────────────────┐
            │  SMS Verificação │  (Exceto Google)
            └──────────────────┘
                       │
                       ▼
            ┌──────────────────┐
            │ profileComplete? │
            └──────────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
      ✅ true              ❌ false
 (Google / Tradicional)   (Phone-only)
            │                     │
            ▼                     ▼
     ┌──────────┐        ┌────────────────┐
     │   Home   │        │ Complete-Profile│
     └──────────┘        └────────────────┘
                                  │
                         Nome + Email + Senha?
                                  │
                                  ▼
                         profileComplete = true
                                  │
                                  ▼
                            ┌──────────┐
                            │   Home   │
                            └──────────┘
```

#### Regras de Validação

**Cadastro Tradicional:**
- Nome: Mínimo 2 caracteres, máximo 100
- Email: Formato válido
- Celular: Formato internacional (+5521XXXXXXXXX)
- Senha: Mínimo 6 caracteres
- SMS: Código 6 dígitos, válido 5 minutos, máximo 3 tentativas

**Cadastro por Telefone:**
- Celular: Formato internacional obrigatório
- Nome temporário: "Usuário XXXX" (últimos 4 dígitos)
- Email: null (será preenchido no complete-profile)
- profileComplete: false até completar dados

**Google OAuth 2.0:**
- Validação de token ID no backend
- Email e nome extraídos do perfil Google
- profileComplete: true automaticamente
- Celular: opcional (pode adicionar depois)

#### Sistema de profileComplete

O campo `profileComplete` controla o acesso a funcionalidades críticas:

| profileComplete | Pode fazer Pedidos | Pode fazer Reservas | Comportamento |
|-----------------|-------------------|---------------------|---------------|
| ✅ true | ✅ | ✅ | Acesso total |
| ❌ false | ❌ | ❌ | Redireciona /complete-profile |

**Middleware de Proteção:**
- Endpoint `POST /api/orders` requer profileComplete = true
- Endpoint `POST /api/reservations` requer profileComplete = true
- Retorna 403 com redirect para `/complete-profile`

#### Integração com Google OAuth

**Backend:**
- Biblioteca: `google-auth-library` (oficial)
- Endpoint: `POST /api/auth/google`
- Validação: Token ID verificado com API Google
- Criação: Usuário criado automaticamente no primeiro login
- Vinculação: Se email já existe, vincula googleId à conta

**Frontend:**
- SDK: Google Identity Services (CDN nativo)
- Componente: `<GoogleLoginButton />`
- Callback: Envia credential JWT para backend
- Store: Método `googleLogin(credential)` no authStore

**Campos no Modelo User:**
```javascript
googleId: STRING (unique) // ID único do Google
googleProfilePicture: STRING // URL da foto
authProvider: ENUM ('local', 'google') // Provedor usado
```

#### Segurança

- **Tokens JWT**: Expiração 7 dias, renovação automática
- **SMS Verification**: Rate limit 3 tentativas, código expira 5min
- **Google OAuth**: Token validado server-side, nunca exposto
- **Password Hash**: bcrypt com 12 rounds
- **Rate Limiting**: 100 requisições / 15min por IP

---

### 2.2 MÓDULO STAFF (Funcionários)

#### Roles e Permissões

| Role | Acesso |
|------|--------|
| **Cozinha** | Fila produção, marcar status |
| **Bar** | Fila drinks, narguilé |
| **Atendente** | Pedidos prontos, entregas |
| **Caixa** | PDV, abertura/fechamento |
| **Gerente** | Tudo + relatórios + ajustes |

#### Funcionalidades por Role

**COZINHA**
- Ver fila de pedidos (tempo real)
- Filtrar por categoria (comida)
- Iniciar preparo (timer começa)
- Marcar pronto
- Alertas de atraso (>15min)
- Histórico do turno

**BAR**
- Ver fila de drinks
- Ver fila de narguilés
- Controle de tempo narguilé
- Marcar pronto
- Solicitar reposição estoque

**ATENDENTE**
- Notificação pedido pronto
- Fazer pickup
- Entregar na mesa / balcão
- Confirmar entrega
- Chamar cliente (balcão)

**CAIXA**
- Abrir caixa (valor inicial)
- Registrar vendas manuais
- Sangrias
- Fechar caixa (conferência)
- Receber pagamentos
- Emitir comprovantes

**GERENTE**
- Dashboard tempo real
- Ajustar preços
- Cancelar pedidos
- Estornar pagamentos
- Ver todos os módulos
- Relatórios

---

### 2.3 MÓDULO ESTOQUE

#### Funcionalidades

| Feature | Descrição |
|---------|-----------|
| Cadastro Produtos | Nome, categoria, unidade, custo |
| Entrada | Registrar compras, NF, fornecedor |
| Saída | Automática (venda) ou manual (perda) |
| Saldo | Quantidade atual por produto |
| Custo Médio | Calculado automaticamente |
| Alerta Mínimo | Notifica quando baixo |
| Fornecedores | Cadastro, histórico |
| Inventário | Contagem física, ajustes |

#### Modelo de Dados

```
Produto
├── id
├── nome
├── categoria (bebida, comida, tabaco, insumo)
├── unidade (un, kg, L, ml)
├── custo_medio
├── estoque_atual
├── estoque_minimo
├── ativo

MovimentoEstoque
├── id
├── produto_id
├── tipo (entrada, saida, ajuste)
├── quantidade
├── custo_unitario
├── motivo
├── referencia (pedido_id ou nf)
├── usuario_id
├── data

Fornecedor
├── id
├── nome
├── cnpj
├── contato
├── produtos[] (relação)
```

#### Integração com Vendas

```
Pedido confirmado
    ↓
Para cada item do pedido:
    ↓
Buscar ficha técnica do produto
    ↓
Para cada insumo da ficha:
    → Criar MovimentoEstoque (saída)
    → Atualizar estoque_atual
    → Verificar se < estoque_minimo
        → Se sim: Criar alerta
```

---

### 2.4 MÓDULO CRM

#### Dados do Cliente

```
Cliente
├── id
├── nome
├── telefone (único)
├── email
├── cpf
├── data_nascimento
├── data_cadastro
├── cashback_saldo (R$)
├── tier (bronze, silver, gold, platinum)
├── preferencias
│   ├── sabor_narguilé_favorito
│   ├── drink_favorito
│   ├── mesa_preferida
│   └── observacoes
└── metricas
    ├── total_pedidos
    ├── total_gasto
    ├── ticket_medio
    ├── ultima_visita
    ├── frequencia_mensal
    └── ltv (lifetime value)
```

#### Funcionalidades

| Feature | Descrição |
|---------|-----------|
| Histórico Completo | Todos os pedidos, interações |
| Segmentação | Filtros por comportamento |
| Aniversariantes | Lista do mês, ações |
| Inativos | Clientes sem visita >30 dias |
| VIPs | Top clientes por gasto |
| Tags | Marcação manual |
| Notas | Observações por cliente |

#### Automações

- **Aniversário**: Notificação + cupom especial
- **Inativo 30d**: Lembrete "sentimos sua falta"
- **Upgrade Tier**: Notificação de benefícios
- **Novo cliente**: Welcome message

---

### 2.5 MÓDULO FIDELIDADE (CASHBACK)

#### Sistema de Cashback

O sistema de fidelidade funciona com **cashback em dinheiro (R$)** ao invés de pontos abstratos. O cliente acumula automaticamente uma porcentagem de cada compra como crédito que pode ser usado em pedidos futuros.

**Por que Cashback > Pontos:**
- ✅ **Valor transparente**: Cliente vê R$ real, não precisa converter
- ✅ **Automático**: Sem necessidade de trocar pontos manualmente
- ✅ **Motivador**: Desconto direto é mais atrativo
- ✅ **Simplicidade**: Uma única métrica (R$) ao invés de pontos + recompensas

#### Regras de Acúmulo

| Ação | Cashback |
|------|----------|
| Compra | % do valor baseado no tier |
| Cadastro | R$ 10,00 bônus |
| Aniversário | Baseado no tier |
| Indicação | R$ 15,00 (quem indica) |
| Avaliação | R$ 2,00 |

#### Tiers (baseados em Total Gasto)

| Tier | Requisito (gasto total) | Cashback | Benefícios |
|------|-------------------------|----------|------------|
| Bronze | R$ 0 - R$ 999 | 2% | Cashback padrão |
| Silver | R$ 1.000 - R$ 4.999 | 5% | +Prioridade em reservas, +R$ 50 no aniversário |
| Gold | R$ 5.000 - R$ 9.999 | 8% | +Mesa reservada, +R$ 100 no aniversário, +1 drink cortesia/mês |
| Platinum | R$ 10.000+ | 10% | +Mesa VIP, +R$ 200 no aniversário, +2 drinks cortesia/mês, +Eventos exclusivos |

**Progressão Automática**: O tier é calculado automaticamente baseado no totalSpent (total gasto histórico). Quando o cliente atinge o threshold de um novo tier, é promovido automaticamente.

#### Uso do Cashback

O cashback acumulado pode ser usado como desconto em qualquer pedido:
- Aplicado automaticamente no checkout (cliente escolhe quanto usar)
- Pode cobrir até 50% do valor do pedido
- Não expira enquanto o cliente estiver ativo (compra nos últimos 12 meses)
- Saldo visível em tempo real no app

#### Modelo de Dados

```
CashbackHistory
├── id
├── cliente_id
├── pedido_id (se aplicável)
├── valor (R$) - positivo = ganho, negativo = uso
├── tipo (earned, redeemed, expired, bonus, adjustment)
├── descricao
├── saldo_antes (R$)
├── saldo_depois (R$)
├── data
├── expira_em (opcional)

User
├── cashback_saldo (R$) - saldo atual disponível
├── tier (bronze, silver, gold, platinum) - calculado de totalSpent
├── totalSpent (R$) - total gasto histórico
```

---

### 2.6 MÓDULO NARGUILÉ

#### Modelo de Operação

```
Cliente solicita narguilé
    ↓
Escolhe sabor (lista de disponíveis)
    ↓
Funcionário prepara
    ↓
Entrega na mesa → Timer inicia
    ↓
A cada 15min: Troca de carvão (automática/incluída)
    ↓
Cliente solicita encerrar OU tempo máximo
    ↓
Calcula valor (tempo × taxa/hora)
    ↓
Adiciona à conta da mesa
```

#### Modelo de Dados

```
SessaoNarguilé
├── id
├── mesa_id
├── cliente_id
├── sabor_id
├── hora_inicio
├── hora_fim
├── duracao_minutos
├── trocas_carvao
├── valor_total
├── status (ativo, finalizado, cancelado)

Sabor
├── id
├── nome
├── categoria (classico, premium, signature)
├── preco_adicional
├── estoque_atual
├── ativo

ConfigNarguilé
├── valor_hora: R$ 60
├── valor_hora_premium: R$ 80
├── tempo_minimo: 30min
├── tempo_maximo: 4h
├── intervalo_carvao: 15min
```

#### Interface (Bar/Staff)

- Lista de narguilés ativos
- Timer por mesa (countdown visual)
- Alerta troca de carvão
- Botão "Trocar Carvão" (registra)
- Botão "Finalizar"
- Histórico do dia

---

### 2.7 MÓDULO RESERVAS

#### Funcionalidades

| Feature | Descrição |
|---------|-----------|
| Calendário | Visualizar disponibilidade |
| Solicitar | Cliente pede reserva |
| Confirmar | Staff aprova/rejeita |
| Lembrete | Notificação 2h antes |
| No-show | Marcar não compareceu |
| Walk-in | Registrar sem reserva |

#### Modelo de Dados

```
Reserva
├── id
├── cliente_id
├── mesa_id (pode ser null = qualquer)
├── data
├── hora
├── duracao_estimada
├── num_pessoas
├── observacoes
├── status (pendente, confirmada, cancelada, concluida, no_show)
├── confirmada_por (staff_id)
├── created_at
```

#### Regras

- Antecedência mínima: 2 horas
- Antecedência máxima: 30 dias
- Tolerância chegada: 15 minutos
- Após 15min sem aparecer: No-show automático
- No-show penaliza pontos: -50 pontos

---

### 2.8 MÓDULO CAIXA/PDV

#### Funcionalidades

| Feature | Descrição |
|---------|-----------|
| Abertura | Registrar valor inicial |
| Vendas | Registro de pedidos (auto via app) |
| Venda Manual | Para casos excepcionais |
| Sangria | Retirada de dinheiro |
| Suprimento | Entrada de dinheiro |
| Fechamento | Conferência, relatório |

#### Modelo de Dados

```
Caixa
├── id
├── data
├── usuario_abertura_id
├── usuario_fechamento_id
├── valor_abertura
├── valor_fechamento_sistema
├── valor_fechamento_real
├── diferenca
├── status (aberto, fechado)
├── hora_abertura
├── hora_fechamento

MovimentoCaixa
├── id
├── caixa_id
├── tipo (venda, sangria, suprimento, estorno)
├── valor
├── forma_pagamento (dinheiro, cartao_credito, cartao_debito, pix)
├── pedido_id (se venda)
├── motivo (se sangria/suprimento)
├── usuario_id
├── hora
```

#### Fechamento

```
Total Vendas (por forma):
├── Dinheiro: R$ X
├── Cartão Crédito: R$ Y
├── Cartão Débito: R$ Z
├── PIX: R$ W
├── TOTAL: R$ (X+Y+Z+W)

(-) Sangrias: R$ S
(+) Suprimentos: R$ U

Esperado em Caixa (dinheiro): R$ (Abertura + Dinheiro - Sangrias + Suprimentos)
Real em Caixa: R$ [input]
Diferença: R$ [calculado]
```

---

### 2.9 MÓDULO FINANCEIRO

#### Dashboards

**Visão Geral**
- Faturamento do dia/semana/mês
- Ticket médio
- Número de pedidos
- Comparativo período anterior

**DRE Simplificado**

```
RECEITA BRUTA
├── Vendas Cardápio
├── Narguilé
├── Taxa de Serviço
└── Outros

(-) DEDUÇÕES
├── Descontos
├── Cancelamentos
└── Estornos

= RECEITA LÍQUIDA

(-) CMV (Custo Mercadoria Vendida)
├── Calculado via estoque/ficha técnica

= LUCRO BRUTO

(-) DESPESAS OPERACIONAIS
├── Folha (input manual)
├── Aluguel (fixo)
├── Energia (input)
├── Outros (input)

= RESULTADO OPERACIONAL
```

#### Relatórios

| Relatório | Conteúdo |
|-----------|----------|
| Vendas por Período | Faturamento, qtd pedidos |
| Vendas por Produto | Ranking, quantidade, receita |
| Vendas por Categoria | Agrupado |
| Vendas por Hora | Mapa de calor |
| ABC Produtos | Curva ABC |
| CMV | Custo vs Receita por produto |
| Margem | Margem por produto/categoria |
| Clientes | Top clientes, frequência |

---

### 2.10 MÓDULO ADMIN

#### Configurações

| Área | Itens |
|------|-------|
| Cardápio | Produtos, categorias, preços, disponibilidade |
| Mesas | Numeração, capacidade, QR codes |
| Usuários | Staff, roles, permissões |
| Horários | Funcionamento, happy hour |
| Pagamentos | Métodos, taxas |
| Fidelidade | Regras pontos, recompensas |
| Narguilé | Preços, sabores |
| Notificações | Templates, automações |
| Integrações | Stripe, Twilio, etc |

---

## 3. REQUISITOS NÃO-FUNCIONAIS

### Performance

| Métrica | Target |
|---------|--------|
| Tempo de carregamento | < 3s |
| Time to Interactive | < 5s |
| First Contentful Paint | < 1.5s |
| API Response | < 200ms (p95) |

### Disponibilidade

- Uptime: 99.5%
- RPO: 1 hora
- RTO: 4 horas

### Segurança

- HTTPS obrigatório
- JWT com refresh tokens
- Senhas com bcrypt
- Rate limiting
- Sanitização de inputs
- LGPD compliance

### Escalabilidade

- Suportar 100 usuários simultâneos
- 1000 pedidos/dia
- 10 tablets staff conectados

---

## 4. INTEGRAÇÕES

| Serviço | Propósito | Status |
|---------|-----------|--------|
| Stripe | Pagamentos | ✅ Configurado |
| Twilio | SMS | ✅ Configurado |
| Google OAuth 2.0 | Autenticação Social | 🔄 Planejado |
| Socket.IO | Real-time | ✅ Implementado |
| Push Notifications | Alertas PWA | 🔄 Pendente |
| WhatsApp Business | Notificações | 🔄 Futuro |

---

## 5. ROADMAP DE IMPLEMENTAÇÃO

### Fase 1: Core (Semanas 1-2)
- [ ] Atualizar Design System (cores FLAME)
- [ ] Refatorar componentes visuais
- [ ] Ajustar fluxo QR Code mesa
- [ ] Implementar opção balcão

### Fase 2: Estoque (Semanas 3-4)
- [ ] Modelo de dados estoque
- [ ] CRUD produtos/insumos
- [ ] Movimentações
- [ ] Integração com vendas
- [ ] Alertas de mínimo

### Fase 3: Staff (Semanas 5-6)
- [ ] Sistema de roles
- [ ] Telas por função
- [ ] Real-time aprimorado
- [ ] Login funcionário

### Fase 4: Narguilé & Reservas (Semanas 7-8)
- [ ] Módulo narguilé completo
- [ ] Sistema de reservas
- [ ] Calendário

### Fase 5: CRM & Fidelidade (Semanas 9-10)
- [x] Módulo CRM
- [x] Sistema de cashback
- [x] Tiers baseados em gasto total
- [x] Uso automático de cashback

### Fase 6: Financeiro (Semanas 11-12)
- [ ] Módulo caixa
- [ ] DRE
- [ ] Relatórios

---

## 6. MÉTRICAS DE SUCESSO

| Indicador | Meta |
|-----------|------|
| Adoção digital | 80% pedidos via app |
| Tempo médio pedido | < 2 minutos |
| Erro de estoque | < 5% |
| NPS staff | > 70 |
| Clientes com cashback | > 60% |

---

*FLAME PRD v3.0.0 - Dezembro 2024*
