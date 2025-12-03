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
| Cadastro | Registro com telefone + SMS | P0 |
| Login | SMS OTP ou email/senha | P0 |
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
| Pontos | Ver saldo, trocar | P1 |
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
Pedido entregue → Avaliar (opcional) → Pontos creditados
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
├── pontos_saldo
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

### 2.5 MÓDULO FIDELIDADE (PONTOS)

#### Regras de Acúmulo

| Ação | Pontos |
|------|--------|
| R$1 gasto | 1 ponto |
| Cadastro | 50 pontos bônus |
| Aniversário | 100 pontos bônus |
| Indicação | 50 pontos (quem indica) |
| Avaliação | 10 pontos |

#### Tiers

| Tier | Requisito | Multiplicador | Benefícios |
|------|-----------|---------------|------------|
| Bronze | 0 pontos | 1x | Padrão |
| Silver | 500 pontos | 1.2x | +20% pontos |
| Gold | 2000 pontos | 1.5x | +50% pontos, reserva priority |
| Platinum | 5000 pontos | 2x | +100% pontos, mesa VIP, drink cortesia/mês |

#### Resgate

| Recompensa | Custo |
|------------|-------|
| Drink básico | 100 pontos |
| Drink premium | 200 pontos |
| Porção | 150 pontos |
| 30min narguilé | 250 pontos |
| R$10 desconto | 100 pontos |
| R$50 desconto | 450 pontos |

#### Modelo de Dados

```
PontosTransacao
├── id
├── cliente_id
├── tipo (credito, debito)
├── quantidade
├── motivo (compra, bonus, resgate, expiracao)
├── referencia_id
├── data
├── expira_em (12 meses)

Recompensa
├── id
├── nome
├── descricao
├── custo_pontos
├── tipo (produto, desconto, experiencia)
├── produto_id (se aplicável)
├── valor_desconto (se aplicável)
├── ativo
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
- [ ] Módulo CRM
- [ ] Sistema de pontos
- [ ] Tiers
- [ ] Resgates

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
| Clientes com pontos | > 60% |

---

*FLAME PRD v3.0.0 - Dezembro 2024*
