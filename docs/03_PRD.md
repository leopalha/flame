# 📋 FLAME - PRODUCT REQUIREMENTS DOCUMENT (PRD)

## VISÃO GERAL

**Produto:** FLAME - Plataforma Digital Integrada
**Versão:** 3.6.0
**Última Atualização:** 09/12/2024
**Auditoria Completa:** Todos os módulos mapeados
**Tipo:** PWA (Progressive Web App) Full-Stack
**Objetivo:** Ecossistema completo que conecta clientes, funcionários e gestão em tempo real

### URLs de Produção
- **Frontend:** https://flame-lounge.vercel.app
- **Backend API:** https://backend-production-28c3.up.railway.app/api

### Estatísticas do Sistema
| Categoria | Quantidade |
|-----------|------------|
| Models (Backend) | 15 |
| Controllers | 15 |
| Rotas/Endpoints | ~100+ |
| Services | 14 |
| Páginas (Frontend) | 48 |
| Componentes | 45 |
| Stores (Zustand) | 16 |
| Hooks Customizados | 20+ |

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

| Feature | Descrição | Prioridade | Status | Componentes |
|---------|-----------|------------|--------|-------------|
| Cadastro | Registro com telefone + SMS, email/senha ou Google OAuth | P0 | ✅ | `authController`, `authStore`, `/register` |
| Login | SMS OTP, email/senha ou Google OAuth | P0 | ✅ | `authController`, `authStore`, `/login` |
| Cardápio Digital | Browse, busca, filtros | P0 | ✅ | `productController`, `productStore`, `/cardapio` |
| Carrinho | Adicionar, remover, editar | P0 | ✅ | `cartStore`, `CartItem.js`, `/checkout` |
| Mesa via QR | Scan QR → acesso rápido ao site (mesa sugerida) | P0 | ✅ | `/qr/[mesaId]`, `tableController` |
| Pedido Mesa | Pedir estando na mesa | P0 | ✅ | `orderController`, `orderStore` |
| Pedido Balcão | Retirada no balcão | P0 | ✅ | `tableId = null` no pedido |
| Reserva Mesa | Agendar mesa antecipada | P1 | ✅ | `reservationController`, `reservationStore`, `/reservas` |
| Narguilé | Solicitar, escolher sabor | P1 | ✅ | `hookahController`, `hookahStore` |
| Pagamento | Cartão Crédito/Débito, PIX, Dinheiro, Cartão na Mesa | P0 | ✅ | `payment.controller`, `payment.service` (Stripe) - Sprint 43/58 |
| Taxa de Serviço | 10% incluída por padrão (removível) | P0 | ✅ | \, \ (Sprint 42) |
| Divisão de Conta | Atendente vai à mesa dividir | P1 | ❌ | **NÃO IMPLEMENTADO** |
| Acompanhamento | Status em tempo real | P0 | ✅ | `socket.service`, `socket.js`, `/pedido/[id]` |
| Histórico | Pedidos anteriores | P1 | ✅ | `orderController.getUserOrders()`, `/pedidos` |
| Avaliação | Avaliar pedido | P2 | ✅ | `orderController.rateOrder()`, `/avaliacao/[id]` |
| Cashback | Ver saldo, ~~usar desconto~~ | P1 | ⚠️ | `cashbackStore`, `/cashback` - **USO NÃO IMPLEMENTADO** |
| Perfil | Dados, preferências | P1 | ✅ | `authStore.updateProfile()`, `/perfil` |
| Gorjeta | Adicionar gorjeta no checkout (5%, 10%, 15%, custom) | P2 | ✅ | `CheckoutCart.js`, Sprint 55 |
| Chat Staff | Conversar com atendente sobre o pedido | P2 | ✅ | `Message` model, `/chat` routes, Sprint 56/58 |

#### Fluxo Principal (Mesa)

```
QR Code Mesa → Site abre (/qr/{numeroMesa}) → Mesa sugerida (opcional)
    ↓
Usuário logado? 
    → Sim: Vai para cardápio
    → Não: Tela login/cadastro
    ↓
Cardápio → Adiciona itens → Carrinho
    ↓
Checkout → Seleciona/Confirma mesa → Pagamento
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

### 2.1.0.1 TAXA DE SERVIÇO (10%)

**Conceito:**
A taxa de serviço de 10% é **sempre incluída por padrão** em todos os pedidos, cobrindo o serviço prestado pelos funcionários.

**Regras:**
- Taxa de 10% calculada sobre o subtotal (antes de descontos)
- Exibida de forma clara no carrinho e checkout
- Cliente pode remover (de forma sutil/implícita)
- Não é obrigatória (lei brasileira não obriga)

**Apresentação no Checkout:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  RESUMO DO PEDIDO                                                    │
│                                                                     │
│  Subtotal:                                    R$ 100,00             │
│  Taxa de serviço (10%):                       R$ 10,00    [Remover] │
│  ─────────────────────────────────────────────────────────          │
│  TOTAL:                                       R$ 110,00             │
│                                                                     │
│  ℹ️ A taxa de serviço é opcional e valoriza nossos colaboradores   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Botão "Remover":**
- Pequeno, discreto (texto link, não botão destacado)
- Ao clicar: modal de confirmação sutil
- Mensagem: "A taxa de serviço ajuda a valorizar nosso time. Deseja realmente remover?"
- Botões: [Manter taxa] [Remover]

**Campos no Order:**
```javascript
{
  subtotal: Decimal,          // Valor dos itens
  serviceFee: Decimal,        // Valor da taxa (10% ou 0)
  serviceFeeIncluded: Boolean, // Se taxa foi mantida
  total: Decimal              // subtotal + serviceFee - descontos
}
```

---

### 2.1.0.2 FORMAS DE PAGAMENTO (COMPLETO)

**Formas Disponíveis:**

| Forma | Via Plataforma | Ação do Atendente | Status |
|-------|----------------|-------------------|--------|
| Cartão de Crédito | ✅ Stripe | Nenhuma | ✅ Implementado |
| Cartão de Débito | ✅ Stripe | Nenhuma | ✅ Implementado |
| PIX | ✅ Stripe | Nenhuma | ✅ Implementado |
| Dinheiro | ❌ | Notificado para ir à mesa | ✅ Implementado (Sprint 43/58) |
| Cartão na Mesa | ❌ | Notificado para ir à mesa com máquina | ✅ Implementado (Sprint 58) |
| Dividir Conta | ❌ | Notificado para ir à mesa | ❌ Não implementado |

**Fluxo de Pagamento Completo:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CHECKOUT - PAGAMENTO                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Como você quer pagar?                                              │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 💳 PAGAR PELO APP (Mais rápido!)                            │    │
│  │                                                             │    │
│  │   ○ Cartão de Crédito                                       │    │
│  │   ○ Cartão de Débito                                        │    │
│  │   ● PIX (Recomendado)                                       │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 🙋 PAGAR COM ATENDENTE                                      │    │
│  │                                                             │    │
│  │   ○ Dinheiro                                                │    │
│  │     (Atendente irá até sua mesa)                            │    │
│  │                                                             │    │
│  │   ○ Cartão na Mesa                                          │    │
│  │     (Atendente levará a máquina)                            │    │
│  │                                                             │    │
│  │   ○ Dividir Conta                                           │    │
│  │     (Atendente ajudará na divisão)                          │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  [Confirmar Pedido]                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Fluxo "Pagar com Atendente":**

```
Cliente seleciona "Dinheiro" ou "Cartão na Mesa" ou "Dividir Conta"
    ↓
Pedido criado com status: pending_payment
    ↓
NOTIFICAÇÃO PUSH/SOCKET para ATENDENTE:
┌─────────────────────────────────────────────────────────────────────┐
│ 🔔 PAGAMENTO NA MESA                                                │
│                                                                     │
│ Mesa 07 │ Pedido #0127 │ R$ 110,00                                  │
│                                                                     │
│ Forma de pagamento: DINHEIRO / CARTÃO / DIVIDIR                     │
│                                                                     │
│ Cliente aguardando!                                                 │
│                                                                     │
│ [Ir para mesa]                                                      │
└─────────────────────────────────────────────────────────────────────┘
    ↓
Atendente vai à mesa
    ↓
Recebe pagamento (máquina, dinheiro, divide conta)
    ↓
Confirma no app: [Pagamento Recebido]
    ↓
Pedido muda para: confirmed → vai para preparo
```

**Fluxo "Dividir Conta":**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DIVISÃO DE CONTA                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Painel do Atendente:                                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Mesa 07 │ Dividir Conta                                     │    │
│  │                                                             │    │
│  │ Total: R$ 220,00                                            │    │
│  │                                                             │    │
│  │ Dividir por:                                                │    │
│  │ ○ Partes iguais: [2] [3] [4] [5] [6]                       │    │
│  │   R$ 110,00 cada (2 pessoas)                                │    │
│  │                                                             │    │
│  │ ○ Valor personalizado                                       │    │
│  │   Pessoa 1: R$ [____]  [Crédito] [Débito] [PIX] [Dinheiro]  │    │
│  │   Pessoa 2: R$ [____]  [Crédito] [Débito] [PIX] [Dinheiro]  │    │
│  │   + Adicionar pessoa                                        │    │
│  │                                                             │    │
│  │ Restante: R$ 0,00                                           │    │
│  │                                                             │    │
│  │ [Confirmar Divisão]                                         │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  O atendente registra cada pagamento recebido                       │
│  Quando todos pagaram → Pedido confirmado                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Campos no Order:**
```javascript
{
  paymentMethod: ENUM('credit_card', 'debit_card', 'pix', 'cash',
                      'card_at_table', 'split'),
  paymentStatus: ENUM('pending', 'processing', 'paid', 'failed', 'refunded'),
  paidViaApp: Boolean,           // true = processado via Stripe
  attendantPayment: Boolean,     // true = atendente recebeu na mesa
  splitPayments: JSON,           // Array de pagamentos se dividido
  // splitPayments: [
  //   { amount: 110, method: 'credit_card', paidAt: Date },
  //   { amount: 110, method: 'cash', paidAt: Date }
  // ]
}
```

---

### 2.1.0.3 PAINEL DO BAR (Retirada Balcão)

Quando o cliente escolhe "Retirar no Balcão", precisa haver um painel no bar exibindo os pedidos prontos para retirada.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PAINEL DO BAR - RETIRADA                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PEDIDOS PRONTOS PARA RETIRADA                                      │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ #0127 │ JOÃO SILVA                                          │    │
│  │                                                             │    │
│  │ • 2x Caipirinha                                             │    │
│  │ • 1x Cerveja Artesanal                                      │    │
│  │ • 1x Porção de Fritas                                       │    │
│  │                                                             │    │
│  │ Pronto há: 2 min                                            │    │
│  │                                                             │    │
│  │ [Chamar Cliente] [Entregue]                                 │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ #0128 │ MARIA SANTOS                                        │    │
│  │                                                             │    │
│  │ • 1x Gin Tônica                                             │    │
│  │                                                             │    │
│  │ Pronto há: < 1 min                                          │    │
│  │                                                             │    │
│  │ [Chamar Cliente] [Entregue]                                 │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Exibe número do pedido bem visível
- Nome do cliente
- Lista de itens
- Tempo desde que ficou pronto
- Botão para chamar cliente (envia notificação push)
- Botão para marcar como entregue

---

### 2.1.1 MODELO DE USUÁRIO (User.js)

#### Campos Completos do Modelo

O modelo User é a entidade central do sistema. Abaixo está o mapeamento **COMPLETO** de todos os campos:

| Campo | Tipo | Obrigatório | Default | Descrição |
|-------|------|-------------|---------|-----------|
| `id` | UUID | ✅ | auto | Identificador único |
| `nome` | STRING(100) | ✅ | - | Nome completo (2-100 chars) |
| `email` | STRING | ✅ | - | Email único (OBRIGATÓRIO para pedidos) |
| `celular` | STRING(20) | ✅ | - | Celular único formato E.164 (+[código país][número]) |
| `countryCode` | STRING(5) | ✅ | 'BR' | Código ISO do país (detectado pelo telefone) |
| `phoneCountryCode` | STRING(5) | ✅ | '+55' | DDI do país selecionado |
| `cpf` | STRING(14) | ⚠️ Condicional | null | CPF validado (obrigatório se countryCode = 'BR') |
| `foreignId` | STRING(50) | ⚠️ Condicional | null | Número de identificação (obrigatório se countryCode != 'BR') |
| `birthDate` | DATE | ✅ | - | Data de nascimento (OBRIGATÓRIO - verificação 18+) |
| `password` | STRING | ❌ | null | Hash bcrypt (pode ser null para SMS-only) |
| `instagramPromoOptIn` | BOOLEAN | ✅ | false | Aceitou participar do programa de cashback via Instagram |
| `instagramHandle` | STRING(50) | ❌ | null | @ do Instagram do cliente |
| `lastInstagramPostDate` | DATE | ❌ | null | Última data que postou para cashback Instagram |
| `role` | ENUM | ✅ | 'cliente' | Papel: cliente, atendente, cozinha, bar, caixa, gerente, admin |
| `isActive` | BOOLEAN | ✅ | true | Conta ativa |
| `emailVerified` | BOOLEAN | ✅ | false | Email verificado |
| `phoneVerified` | BOOLEAN | ✅ | false | Celular verificado via SMS |
| `profileComplete` | BOOLEAN | ✅ | false | Perfil completo (nome + email) |
| `smsCode` | STRING(6) | ❌ | null | Código OTP atual |
| `smsAttempts` | INTEGER | ✅ | 0 | Tentativas de verificação |
| `smsCodeExpiry` | DATE | ❌ | null | Expiração do código (5 min) |
| `lastLogin` | DATE | ❌ | null | Última data de login |
| `googleId` | STRING | ❌ | null | ID único Google OAuth |
| `googleProfilePicture` | STRING | ❌ | null | URL foto perfil Google |
| `authProvider` | ENUM | ✅ | 'local' | Provedor: 'local' ou 'google' |
| `totalOrders` | INTEGER | ✅ | 0 | Total de pedidos (CRM) |
| `totalSpent` | DECIMAL(10,2) | ✅ | 0 | Total gasto R$ (CRM) |
| `lastVisit` | DATE | ❌ | null | Última visita (CRM) |
| `lastOrderDate` | DATE | ❌ | null | Último pedido (CRM) |
| `cashbackBalance` | DECIMAL(10,2) | ✅ | 0 | Saldo cashback R$ |
| `loyaltyTier` | ENUM | ✅ | 'bronze' | Tier: bronze, silver, gold, platinum |

#### Métodos do Modelo User

```javascript
// Verificação de senha
async checkPassword(password) → boolean

// Serialização (remove dados sensíveis)
toJSON() → { ...user sem password, smsCode, smsAttempts, smsCodeExpiry }

// Verificações de role
isAdmin() → boolean (role === 'admin')
isEmployee() → boolean (role in ['admin', 'atendente', 'cozinha'])

// Verificação de perfil completo
hasCompleteProfile() → boolean
  // Google: nome + email + googleId
  // Local/Phone: nome + email + profileComplete

// Sistema de Cashback
calculateTier() → 'bronze' | 'silver' | 'gold' | 'platinum'
  // bronze: R$ 0 - 999
  // silver: R$ 1.000 - 4.999
  // gold: R$ 5.000 - 9.999
  // platinum: R$ 10.000+

async updateTier() → newTier | null
async addCashback(amount, orderId?, description?) → void
async useCashback(maxAmount, description?) → amountUsed
getTierBenefits() → { name, cashbackRate, perks[] }
getNextTierInfo() → { currentTier, nextTier, remaining, progress }
```

#### Hooks do Modelo

```javascript
beforeSave: async (user) => {
  // 1. Hash password se alterada (bcrypt 12 rounds)
  // 2. Normalizar email para lowercase + trim
  // 3. Normalizar nome com trim
  // 4. Normalizar celular para formato E.164
}
```

#### Validações de Cadastro

##### Telefone Internacional (libphonenumber-js)

O sistema usa a biblioteca `libphonenumber-js` para validação de telefones internacionais.

**Formato E.164**: `+[código país][número nacional]` (máximo 15 dígitos)

**Tabela de Países Suportados (Resumo):**

> **TABELA COMPLETA**: Ver `docs/tasks.md` → Sprint 41 → "TABELA COMPLETA DE PAÍSES"
> **100+ países mapeados** com ISO, DDI, dígitos, prefixos móveis e bandeiras

| Região | Países | Prioridade |
|--------|--------|------------|
| América do Sul | Brasil, Argentina, Chile, Colômbia, Peru, Venezuela, Equador, Bolívia, Paraguai, Uruguai, Guiana, Suriname | Alta |
| América do Norte/Central | EUA, Canadá, México, Guatemala, Costa Rica, Panamá, Cuba, Rep. Dominicana, Jamaica, Porto Rico | Média |
| Europa Ocidental | Portugal, Espanha, França, Itália, Alemanha, Reino Unido, Irlanda, Holanda, Bélgica, Suíça | Média |
| Europa Nórdica/Oriental | Suécia, Noruega, Polônia, Rússia, Ucrânia, Rep. Tcheca, Hungria, Romênia, Grécia, Turquia | Baixa |
| Ásia | Japão, China, Coreia do Sul, Índia, Indonésia, Tailândia, Filipinas, Singapura, Hong Kong | Baixa |
| Oriente Médio | Emirados, Arábia Saudita, Israel, Líbano, Jordânia, Kuwait, Qatar | Baixa |
| África | África do Sul, Nigéria, Quênia, Marrocos, Angola, Moçambique, Cabo Verde | Baixa |
| Oceania | Austrália, Nova Zelândia | Baixa |

**Países Prioritários (América do Sul + Lusófonos):**

| País | ISO | DDI | Dígitos | Móvel Inicia | Exemplo E.164 | Bandeira |
|------|-----|-----|---------|--------------|---------------|----------|
| Brasil | BR | +55 | 10-11 | 9 | +5521999998888 | 🇧🇷 |
| Portugal | PT | +351 | 9 | 9 | +351912345678 | 🇵🇹 |
| Argentina | AR | +54 | 10 | 9 | +5491155551234 | 🇦🇷 |
| Chile | CL | +56 | 9 | 9 | +56912345678 | 🇨🇱 |
| Colômbia | CO | +57 | 10 | 3 | +573001234567 | 🇨🇴 |
| Peru | PE | +51 | 9 | 9 | +51912345678 | 🇵🇪 |
| Uruguai | UY | +598 | 8 | 9 | +59894123456 | 🇺🇾 |
| Paraguai | PY | +595 | 9 | 9 | +595981234567 | 🇵🇾 |
| Angola | AO | +244 | 9 | 9 | +244912345678 | 🇦🇴 |
| Moçambique | MZ | +258 | 9 | 8 | +258821234567 | 🇲🇿 |
| Cabo Verde | CV | +238 | 7 | 9 | +2389123456 | 🇨🇻 |
| EUA | US | +1 | 10 | Qualquer | +12025551234 | 🇺🇸 |

**Fluxo de Seleção de País:**
1. Usuário clica no campo de telefone
2. Abre dropdown pesquisável com bandeira + nome + DDI
3. Usuário seleciona país ou digita para filtrar
4. Sistema atualiza: `countryCode` e `phoneCountryCode`
5. Input de telefone formata automaticamente conforme país
6. Sistema detecta nacionalidade: Brasil = brasileiro, outros = estrangeiro

##### Validação de CPF (Brasileiros)

```javascript
// Algoritmo completo de validação
function validateCPF(cpf) {
  // 1. Remove formatação (., -)
  // 2. Verifica 11 dígitos
  // 3. Rejeita sequências (111.111.111-11, etc)
  // 4. Calcula primeiro dígito verificador
  // 5. Calcula segundo dígito verificador
  // 6. Compara com dígitos informados
  return isValid; // boolean
}
```

**CPFs inválidos conhecidos (rejeitados):**
- 000.000.000-00, 111.111.111-11, ..., 999.999.999-99
- Qualquer CPF com menos de 11 dígitos
- CPF com dígitos verificadores incorretos

##### Validação de Idade (18+)

```javascript
function validateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 18;
}
```

**Mensagem de erro**: "Você precisa ter 18 anos ou mais para se cadastrar."

---

### 2.1.2 AUTENTICAÇÃO E CADASTRO

#### Métodos de Autenticação Implementados

| Método | Endpoint | Campos Entrada | profileComplete | Estado Final |
|--------|----------|----------------|-----------------|--------------|
| **Cadastro Completo** | `POST /auth/register` | nome, email, celular, password | ✅ true | phoneVerified: true após SMS |
| **Cadastro por Celular** | `POST /auth/register-phone` | celular | ❌ false | nome: "Usuário XXXX" |
| **Login SMS** | `POST /auth/login-sms` | celular | - | Cria usuário se não existe |
| **Login Email/Senha** | `POST /auth/login` | email, password | - | lastLogin atualizado |
| **Google OAuth** | `POST /auth/google` | credential (JWT) | ✅ true | authProvider: 'google' |
| **Completar Perfil** | `POST /auth/complete-profile` | nome, email, cpf?, password? | ✅ true | profileComplete: true |

#### Endpoints de Autenticação (17 rotas)

```
POST   /api/auth/register           → Cadastro completo (nome, email, celular, senha)
POST   /api/auth/register-phone     → Cadastro só celular → perfil incompleto
POST   /api/auth/verify-sms         → Verificar código SMS (6 dígitos)
POST   /api/auth/resend-sms         → Reenviar código SMS
POST   /api/auth/login-sms          → Login SMS → cria usuário se não existe!
POST   /api/auth/login              → Login email/senha
POST   /api/auth/google             → OAuth Google
POST   /api/auth/complete-profile   → Completar perfil (nome, email, cpf?, senha?)
PUT    /api/auth/profile            → Atualizar perfil (nome, email)
POST   /api/auth/logout             → Logout
POST   /api/auth/forgot-password    → Solicitar reset (envia SMS)
POST   /api/auth/verify-reset-code  → Verificar código reset
POST   /api/auth/reset-password     → Redefinir senha
GET    /api/auth/me                 → Dados usuário logado
DELETE /api/auth/delete-unverified/:email → Debug: deletar não verificado
GET    /api/auth/debug-sms/:celular → Debug: ver código SMS
```

#### Fluxo de Cadastro Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                         /register                                    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  [Nome Completo    ]  [Email           ]                    │    │
│  │                                                             │    │
│  │  TELEFONE COM SELETOR DE PAÍS:                              │    │
│  │  ┌──────────────────────────────────────────────────────┐   │    │
│  │  │ [🇧🇷 Brasil +55 ▼] [  (21) 99999-9999  ]              │   │    │
│  │  └──────────────────────────────────────────────────────┘   │    │
│  │  Ao clicar no seletor, abre lista pesquisável de países:    │    │
│  │  ┌──────────────────────────────────────────────────────┐   │    │
│  │  │ 🔍 Buscar país...                                    │   │    │
│  │  │ ─────────────────────────────────────────────────────│   │    │
│  │  │ 🇧🇷 Brasil                                    +55    │   │    │
│  │  │ 🇺🇸 Estados Unidos                            +1     │   │    │
│  │  │ 🇵🇹 Portugal                                  +351   │   │    │
│  │  │ 🇦🇷 Argentina                                 +54    │   │    │
│  │  │ 🇪🇸 Espanha                                   +34    │   │    │
│  │  │ 🇫🇷 França                                    +33    │   │    │
│  │  │ ... (mais países)                                    │   │    │
│  │  └──────────────────────────────────────────────────────┘   │    │
│  │                                                             │    │
│  │  ⚡ Sistema detecta automaticamente:                        │    │
│  │     - Se país = Brasil → mostra campo CPF                   │    │
│  │     - Se país != Brasil → mostra campo ID Estrangeiro       │    │
│  │                                                             │    │
│  │  [CPF: 123.456.789-00] (se Brasil)                          │    │
│  │      OU                                                     │    │
│  │  [ID Estrangeiro: ABC123456] (se outro país)                │    │
│  │                                                             │    │
│  │  [Data de Nascimento: DD/MM/AAAA] (OBRIGATÓRIO - 18+)       │    │
│  │  [Senha           ] [Confirmar Senha ]                      │    │
│  │  [ ] Aceito os termos de uso                                │    │
│  │  [ ] Declaro ter 18 anos ou mais                            │    │
│  │  [         Criar Conta          ]                           │    │
│  │  ─────────────── ou ───────────────                         │    │
│  │  [         Entrar com Google    ]                           │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                     POST /api/auth/register
                    { nome, email, celular, countryCode,
                      phoneCountryCode, cpf?, foreignId?,
                      birthDate, password }
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend:                                                            │
│  1. Verifica duplicidade (email, celular, cpf)                      │
│  2. Valida telefone usando libphonenumber-js (formato por país)     │
│  3. Valida CPF com algoritmo completo (se brasileiro)               │
│  4. Valida idade >= 18 anos via birthDate                           │
│  5. Armazena celular em formato E.164 (+[código][número])           │
│  6. Gera código SMS 6 dígitos                                       │
│  7. Cria User com profileComplete: true, phoneVerified: false       │
│  8. Envia SMS via Twilio (suporta internacional)                    │
│  9. Retorna { userId, celular, smsExpiry }                          │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Tela de Verificação SMS                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Código enviado para +55 21 99999-9999                      │    │
│  │  [  0  ] [  0  ] [  0  ] [  0  ] [  0  ] [  0  ]            │    │
│  │  [         Verificar Código         ]                       │    │
│  │  Não recebeu? [Reenviar]                                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                     POST /api/auth/verify-sms
                    { celular, code }
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend:                                                            │
│  1. Verifica código (3 tentativas máx, 5 min expiração)             │
│  2. Atualiza: phoneVerified: true, smsCode: null                    │
│  3. Gera JWT token                                                  │
│  4. Envia SMS de boas-vindas                                        │
│  5. Retorna { user, token }                                         │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                       Redirect para Home
                     (profileComplete: true)
```

#### Fluxo de Cadastro por Celular (Rápido)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         /login (aba SMS)                            │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  [Celular +55 21 99999-9999    ]                            │    │
│  │  [         Enviar Código         ]                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                     POST /api/auth/login-sms
                    { celular }
                                │
                   ┌────────────┴────────────┐
                   │                         │
           Usuário EXISTE              Usuário NÃO EXISTE
                   │                         │
                   │                         ▼
                   │             ┌────────────────────────────┐
                   │             │ Cria User automaticamente: │
                   │             │ - nome: "Usuário XXXX"     │
                   │             │ - celular: +55...          │
                   │             │ - profileComplete: false   │
                   │             │ - phoneVerified: false     │
                   │             └────────────────────────────┘
                   │                         │
                   └────────────┬────────────┘
                                │
                    Envia SMS com código
                                │
                                ▼
                     POST /api/auth/verify-sms
                                │
                                ▼
                   ┌────────────┴────────────┐
                   │                         │
           profileComplete: true    profileComplete: false
                   │                         │
                   ▼                         ▼
                Home                /complete-profile
```

#### Fluxo de Google OAuth

```
┌─────────────────────────────────────────────────────────────────────┐
│                    /login ou /register                              │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  [  G  Entrar com Google    ]                               │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                    Google Identity Services
                    (popup de autenticação)
                                │
                                ▼
                    Callback com credential (JWT)
                                │
                     POST /api/auth/google
                    { credential }
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend (googleService.verifyToken):                               │
│  1. Valida JWT com Google API                                       │
│  2. Extrai: googleId, email, name, picture                          │
│  3. Busca User por googleId OU email                                │
│     ├─ NÃO EXISTE: Cria User novo                                   │
│     │   - googleId, email, nome, googleProfilePicture               │
│     │   - authProvider: 'google'                                    │
│     │   - profileComplete: true (Google já tem nome+email)          │
│     │   - celular: null (não obrigatório)                           │
│     │                                                               │
│     └─ EXISTE sem googleId: Vincula conta                           │
│         - Atualiza: googleId, googleProfilePicture, authProvider    │
│                                                                      │
│  4. Gera JWT token                                                  │
│  5. Retorna { user, token, isNewUser, needsPhone }                  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                       Redirect para Home
                 (toast: "Bem-vindo, {nome}!")

           ⚠️ Se needsPhone: true, sugere adicionar celular
```

#### Fluxo de Completar Perfil

```
┌─────────────────────────────────────────────────────────────────────┐
│                      /complete-profile                              │
│  (Usuário já autenticado mas profileComplete: false)               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Complete seu Cadastro                                      │    │
│  │  Para fazer pedidos, precisamos de mais informações         │    │
│  │                                                             │    │
│  │  Nome Completo *    [                        ]              │    │
│  │  Email *            [                        ]              │    │
│  │  CPF (opcional)     [000.000.000-00         ]              │    │
│  │  Senha (opcional)   [                        ]              │    │
│  │                                                             │    │
│  │  Celular: +55 21 99999-9999 (já verificado)                │    │
│  │                                                             │    │
│  │  [         Completar Cadastro       ]                       │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                     POST /api/auth/complete-profile
                    { nome, email, cpf?, password? }
                    (Requer: token JWT no header)
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend:                                                            │
│  1. Verifica se profileComplete já é true (erro se sim)             │
│  2. Verifica duplicidade de email/cpf                               │
│  3. Atualiza User:                                                  │
│     - nome, email (lowercase)                                       │
│     - cpf (se fornecido, formato 000.000.000-00)                    │
│     - password (se fornecido, min 6 chars, hashado)                 │
│     - profileComplete: true                                         │
│     - emailVerified: false (precisa verificar)                      │
│  4. Retorna { user atualizado }                                     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                       Redirect para Home
              (toast: "Perfil completado! Faça seus pedidos")
```

#### Fluxo de Recuperação de Senha

```
┌─────────────────────────────────────────────────────────────────────┐
│                      /recuperar-senha                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Recuperar Senha                                            │    │
│  │  [Email           ]                                         │    │
│  │  [         Enviar Código         ]                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                     POST /api/auth/forgot-password
                    { email }
                                │
                                ▼
          Backend busca user por email, envia SMS para celular
          (Se não encontra, retorna sucesso mesmo assim - segurança)
          Código 6 dígitos, 15 min expiração, 5 tentativas
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Tela de Verificação:                                               │
│  "Código enviado para ****-9999"                                    │
│  [Código 6 dígitos    ]                                             │
│  [         Verificar         ]                                      │
└─────────────────────────────────────────────────────────────────────┘
                                │
                     POST /api/auth/verify-reset-code
                    { email, code }
                                │
                                ▼
          Código válido → Gera resetToken (32 bytes hex, 10 min)
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Tela de Nova Senha:                                                │
│  [Nova Senha (min 6)  ]                                             │
│  [         Redefinir         ]                                      │
└─────────────────────────────────────────────────────────────────────┘
                                │
                     POST /api/auth/reset-password
                    { email, resetToken, newPassword }
                                │
                                ▼
          Atualiza password (hashado), limpa tokens
          Gera novo JWT, retorna { user, token }
                                │
                                ▼
                       Redirect para Home
                     (Já logado com nova senha)
```

#### Regras de Negócio - Validações

**Código SMS:**
- 6 dígitos numéricos
- Expira em 5 minutos
- Máximo 3 tentativas por código
- Após 3 erros: aguardar 15 min ou solicitar novo
- Rate limit: 3 códigos por hora por usuário

**Senhas:**
- Mínimo 6 caracteres
- Hash bcrypt com 12 rounds
- Opcional para cadastro por celular

**Email:**
- Normalizado para lowercase
- Único no sistema
- OBRIGATÓRIO para fazer pedidos (perfil completo)

**CPF ou Identificação Estrangeira:**
- CPF obrigatório para brasileiros (formato: 000.000.000-00)
- Validação completa de CPF (algoritmo de dígitos verificadores)
- Estrangeiros: número de identificação alternativo (passaporte, RNE)
- Usuário escolhe: "Sou brasileiro" ou "Sou estrangeiro"
- Se brasileiro → CPF obrigatório e validado
- Se estrangeiro → foreignId obrigatório (sem validação específica)

**Data de Nascimento:**
- OBRIGATÓRIO para todos os usuários
- Verificação de idade mínima: 18 anos
- Motivo legal: venda de bebidas alcoólicas
- Formato: DD/MM/AAAA
- Bloqueia cadastro se menor de 18 anos
- Mensagem: "Você precisa ter 18 anos ou mais para utilizar nossos serviços"

**profileComplete:**
- `true` se: nome + email + (cpf OU foreignId) + birthDate (18+) + celular verificado
- Bloqueia criação de pedidos/reservas se `false`

#### Segurança

| Aspecto | Implementação |
|---------|---------------|
| JWT | Expiração 7 dias, payload: { userId } |
| Password | bcrypt 12 rounds |
| SMS Code | 6 dígitos, 5 min expiry, 3 tentativas |
| Reset Token | 32 bytes hex, 10 min expiry |
| Rate Limit | 100 req/15min por IP (global) |
| Google OAuth | Token validado server-side via API |
| XSS | Tokens em localStorage, httpOnly desativado |
| CORS | Configurado para domínio de produção |

#### Mapeamento Técnico Completo - Autenticação

```
┌─────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  models/User.js                                                      │
│  ├── 26 campos (ver tabela acima)                                   │
│  ├── 10 métodos de instância                                        │
│  └── hook beforeSave (hash + normalize)                             │
│                                                                      │
│  controllers/authController.js (16 métodos)                         │
│  ├── register()           → Cadastro completo                       │
│  ├── registerPhone()      → Cadastro só celular                     │
│  ├── verifySMS()          → Verificar código                        │
│  ├── resendSMS()          → Reenviar código                         │
│  ├── loginSMS()           → Login SMS (cria se não existe!)         │
│  ├── loginPassword()      → Login email/senha                       │
│  ├── googleAuth()         → OAuth Google                            │
│  ├── completeProfile()    → Completar perfil                        │
│  ├── updateProfile()      → Atualizar perfil                        │
│  ├── getMe()              → Dados usuário logado                    │
│  ├── logout()             → Logout                                  │
│  ├── forgotPassword()     → Solicitar reset                         │
│  ├── verifyResetCode()    → Verificar código reset                  │
│  ├── resetPassword()      → Redefinir senha                         │
│  ├── deleteUnverifiedUser() → Debug                                 │
│  └── debugSMSCode()       → Debug                                   │
│                                                                      │
│  routes/auth.js (17 rotas)                                          │
│  ├── POST /register, /register-phone, /verify-sms, /resend-sms     │
│  ├── POST /login-sms, /login, /google, /complete-profile           │
│  ├── PUT  /profile                                                  │
│  ├── POST /logout, /forgot-password, /verify-reset-code            │
│  ├── POST /reset-password                                           │
│  ├── GET  /me, /debug-sms/:celular                                  │
│  └── DELETE /delete-unverified/:email                               │
│                                                                      │
│  services/sms.service.js (Twilio)                                   │
│  ├── generateSMSCode()        → Gera código 6 dígitos              │
│  ├── sendVerificationCode()   → Envia código                        │
│  ├── sendWelcomeMessage()     → Boas-vindas                         │
│  └── sendPasswordResetCode()  → Código de reset                     │
│                                                                      │
│  services/google.service.js                                         │
│  └── verifyToken(credential)  → Valida JWT Google                   │
│                                                                      │
│  middlewares/auth.middleware.js                                     │
│  ├── authenticate()           → Verifica JWT                        │
│  └── generateToken(userId)    → Gera JWT                            │
│                                                                      │
│  middlewares/validation.middleware.js                               │
│  ├── validateUserRegistration → Valida campos cadastro              │
│  ├── validateSMSCode          → Valida código SMS                   │
│  └── validateUserLogin        → Valida campos login                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  pages/                                                              │
│  ├── login.js                                                       │
│  │   ├── Toggle: SMS ou Email/Senha                                 │
│  │   ├── Campo celular com máscara internacional                    │
│  │   ├── Campo email/senha                                          │
│  │   ├── Botão Google OAuth                                         │
│  │   └── Step de verificação SMS                                    │
│  │                                                                   │
│  ├── register.js                                                    │
│  │   ├── Campos: nome, email, celular, senha, confirmação           │
│  │   ├── Checkbox aceitar termos                                    │
│  │   ├── Botão Google OAuth                                         │
│  │   └── Step de verificação SMS                                    │
│  │                                                                   │
│  ├── complete-profile.js                                            │
│  │   ├── Campos: nome*, email*, cpf (opcional), senha (opcional)    │
│  │   ├── Exibe celular já verificado                                │
│  │   ├── Máscara CPF: 000.000.000-00                                │
│  │   └── Redirect se profileComplete já true                        │
│  │                                                                   │
│  └── recuperar-senha.js                                             │
│      ├── Step 1: Informar email                                     │
│      ├── Step 2: Verificar código SMS                               │
│      └── Step 3: Nova senha                                         │
│                                                                      │
│  stores/authStore.js (Zustand + persist)                            │
│  ├── State:                                                         │
│  │   ├── user: null | User                                          │
│  │   ├── token: null | string                                       │
│  │   ├── refreshToken: null | string                                │
│  │   ├── isAuthenticated: boolean                                   │
│  │   └── isLoading: boolean                                         │
│  │                                                                   │
│  ├── Actions:                                                       │
│  │   ├── setAuth(authData)         → Salva user + token             │
│  │   ├── clearAuth()               → Limpa autenticação             │
│  │   ├── register(userData)        → POST /register                 │
│  │   ├── registerPhone(celular)    → POST /register-phone           │
│  │   ├── verifySMS(celular, code)  → POST /verify-sms               │
│  │   ├── loginWithSMS(celular)     → POST /login-sms                │
│  │   ├── loginWithPassword(e,p)    → POST /login                    │
│  │   ├── verifySMSLogin(cel, code) → POST /verify-sms               │
│  │   ├── googleLogin(credential)   → POST /google                   │
│  │   ├── completeProfile(data)     → POST /complete-profile         │
│  │   ├── updateProfile(data)       → PUT /profile                   │
│  │   ├── logout()                  → POST /logout                   │
│  │   ├── checkAuth()               → GET /me                        │
│  │   ├── refreshAuthToken()        → POST /refresh                  │
│  │   ├── changePassword(old, new)  → PUT /change-password           │
│  │   ├── resetPassword(email)      → POST /reset-password           │
│  │   └── resendSMS(celular)        → POST /resend-sms               │
│  │                                                                   │
│  └── Persistência: localStorage key 'flame-auth'                    │
│      (user, token, refreshToken, isAuthenticated)                   │
│                                                                      │
│  components/                                                         │
│  ├── GoogleLoginButton.js    → Wrapper Google Identity              │
│  ├── PhoneInput.js           → Input celular com país              │
│  └── LoadingSpinner.js       → Indicador de loading                │
│                                                                      │
│  utils/                                                              │
│  └── roleRedirect.js         → Redirect baseado em role             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Estados do Usuário

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ESTADOS DO USUÁRIO                                │
└─────────────────────────────────────────────────────────────────────┘

1. CADASTRO INICIADO (Tradicional)
   ├── phoneVerified: false
   ├── profileComplete: true (já tem nome+email)
   └── Estado: Aguardando verificação SMS

2. CADASTRO INICIADO (Celular)
   ├── phoneVerified: false
   ├── profileComplete: false
   ├── nome: "Usuário XXXX"
   └── Estado: Aguardando verificação SMS

3. SMS VERIFICADO (Tradicional)
   ├── phoneVerified: true
   ├── profileComplete: true
   └── Estado: ATIVO - Acesso total

4. SMS VERIFICADO (Celular)
   ├── phoneVerified: true
   ├── profileComplete: false
   └── Estado: Precisa completar perfil

5. PERFIL COMPLETO
   ├── phoneVerified: true
   ├── profileComplete: true
   └── Estado: ATIVO - Acesso total

6. GOOGLE OAUTH
   ├── phoneVerified: false (não tem celular)
   ├── profileComplete: true (Google tem nome+email)
   ├── authProvider: 'google'
   └── Estado: ATIVO - Acesso total
       ⚠️ Sugestão: adicionar celular

7. CONTA VINCULADA
   ├── Conta local existia com email
   ├── Usuário fez login com Google
   ├── googleId vinculado à conta
   └── Estado: ATIVO - Dois métodos de login
```

---

### 2.2 MÓDULO STAFF (Funcionários)

#### Roles e Permissões

| Role | Acesso | Página | Status |
|------|--------|--------|--------|
| **Cozinha** | Fila produção (comida), marcar status | `/cozinha` | ✅ |
| **Bar** | Fila drinks APENAS | `/staff/bar` | ✅ |
| **Atendente** | Pedidos prontos, entregas, pagamentos, chat, narguilé | `/atendente` | ✅ Sprint 54/57/58 |
| **Caixa** | PDV, abertura/fechamento | `/staff/caixa` | ✅ |
| **Gerente** | Tudo + relatórios + ajustes | `/admin` | ✅ |
| **Admin** | Configurações completas do sistema | `/admin` | ✅ |

> **✅ RESOLVIDO Sprint 58**: O Narguilé foi migrado para `/atendente` e agora requer mesa para pedidos (não permite balcão).

#### Funcionalidades por Role

**COZINHA** (`/cozinha`)
- Ver fila de pedidos (tempo real)
- Filtrar por categoria (comida)
- Botão "Preparar" (pending → preparing)
- Botão "Pronto" (preparing → ready)
- Alertas de atraso (>15min)
- Timer visual por pedido
- Histórico do turno

**BAR** (`/staff/bar`)
- Ver fila de drinks (tempo real)
- Botão "Preparar" (pending → preparing)
- Botão "Pronto" (preparing → ready)
- Alertas de atraso (>15min)
- Timer visual por pedido
- **NOTA**: NÃO controla narguilé (migrado para Atendente)

**ATENDENTE** (`/atendente`) - Sprint 54/57/58
- Notificação quando pedido fica "ready" (som padronizado)
- Ver pedidos prontos para retirar
- Botão "Retirar" (ready → on_way) - bloqueado até estar pronto
- Botão "Entregar" (on_way → delivered)
- Chamar cliente via SMS
- **PAGAMENTOS** (Sprint 43/58):
  - Ver pedidos aguardando pagamento (pending_payment)
  - Confirmar pagamento com seletor de metodo (Dinheiro, Credito, Debito, PIX)
  - Calcular troco automatico
- **CHAT** (Sprint 56/58):
  - Conversar com cliente sobre o pedido
  - Ver mensagens nao lidas
  - Notificacao de nova mensagem
- **NARGUILÉ** (Sprint 58):
  - Controle completo de sessões
  - Criar/iniciar sessões
  - Trocar carvão
  - Pausar/retomar
  - Finalizar sessão
  - Requer mesa (balcão bloqueado)

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

#### Mapeamento Técnico - Staff

```
BACKEND                                 FRONTEND
───────────────────────────────────────────────────────────────
controllers/staffController.js          pages/cozinha/index.js
├── getDashboard()                      pages/staff/bar.js
├── getOrders()                         pages/staff/caixa.js
├── getOrderDetails()                   pages/staff/relatorios.js
├── updateOrderStatus()                 pages/atendente/index.js
├── getAlerts()
└── callCustomer()                      stores/staffStore.js
                                        ├── fetchDashboard()
controllers/hookahController.js         ├── fetchOrders()
├── createSession()                     ├── updateOrderStatus()
├── registerCoalChange()                └── timers management
├── pauseSession()
├── resumeSession()                     stores/hookahStore.js
└── endSession()                        stores/cashierStore.js

services/hookahService.js               components/StaffOrderCard.js
services/cashier.service.js             components/HookahSessionCard.js

models/HookahSession.js
models/HookahFlavor.js
models/Cashier.js
models/CashierMovement.js

routes/staff.js (7 endpoints)
routes/hookah.js (12 endpoints)
routes/cashier.routes.js (8 endpoints)
```

---

### 2.3 MÓDULO ESTOQUE

#### Funcionalidades

| Feature | Descrição | Status |
|---------|-----------|--------|
| Cadastro Produtos | Nome, categoria, unidade, custo | ✅ |
| Entrada | Registrar compras, NF, fornecedor | ✅ |
| Saída | Automática (venda) ou manual (perda) | ✅ |
| Saldo | Quantidade atual por produto | ✅ |
| Custo Médio | Calculado automaticamente | ⚠️ Parcial |
| Alerta Mínimo | Notifica quando baixo | ✅ |
| Fornecedores | Cadastro, histórico | ❌ Não implementado |
| Inventário | Contagem física, ajustes | ✅ |
| Ficha Técnica | Insumos por produto para baixa | ❌ Não implementado |

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

> **⚠️ ESTADO ATUAL**: A ficha técnica (receita com insumos) **não está implementada**. Atualmente a baixa de estoque é feita diretamente no campo `stock` do Product, sem decomposição em insumos.

#### Mapeamento Técnico - Estoque

```
BACKEND                                 FRONTEND
───────────────────────────────────────────────────────────────
controllers/inventoryController.js      pages/admin/estoque.js
├── getDashboard()
├── getMovements()                      stores/inventoryStore.js
├── getProductMovements()               ├── fetchDashboard()
├── getAlerts()                         ├── fetchMovements()
├── adjustStock()                       ├── adjustStock()
├── getReport()                         └── fetchAlerts()
├── getForecast()
└── getConsumption()                    components/InventoryChart.js
                                        components/InventoryTable.js
services/inventoryService.js
├── recordMovement()
├── getLowStockProducts()
├── getStockAlerts()
├── generateInventoryReport()
└── predictStockOut()

models/Product.js (campos: stock, minStock, hasStock)
models/InventoryMovement.js

routes/inventory.js (8 endpoints)
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

| Automação | Descrição | Status |
|-----------|-----------|--------|
| Aniversário | Notificação + cupom especial | ❌ Manual via Admin |
| Inativo 30d | Lembrete "sentimos sua falta" | ⚠️ Via Campanhas |
| Upgrade Tier | Notificação de benefícios | ❌ Não automático |
| Novo cliente | Welcome message | ❌ Manual |

> **⚠️ ESTADO ATUAL**: As automações de CRM não estão implementadas automaticamente. O módulo de Campanhas permite criar ações manuais para clientes inativos.

#### Mapeamento Técnico - CRM

```
BACKEND                                 FRONTEND
───────────────────────────────────────────────────────────────
controllers/crm.controller.js           pages/admin/clientes.js
├── getDashboard()
├── listCustomers()                     components/CustomerDetailsModal.js
├── getCustomer()
├── getCashbackHistory()
├── addCashback()
├── getInactiveCustomers()
├── getNearUpgrade()
└── adjustTier()

services/crm.service.js
├── getCustomerStats()
├── listCustomers()
├── getDashboardStats()
├── addManualCashback()
├── getInactiveCustomers()
└── getCustomersNearTierUpgrade()

controllers/campaign.controller.js      pages/admin/campanhas.js
├── create(), list(), execute()
├── simulate(), pause()                 stores/campaignStore.js
└── createQuickReactivation()

models/User.js (métricas CRM)
├── totalOrders, totalSpent
├── lastVisit, lastOrderDate
└── loyaltyTier, cashbackBalance

models/Campaign.js
models/CashbackHistory.js

routes/crm.js (8 endpoints)
routes/campaign.routes.js (12 endpoints)
```

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

|| Ação | Cashback |
||------|----------|
|| Compra | % do valor baseado no tier |
|| Cadastro | R$ 10,00 bônus |
|| Aniversário | Baseado no tier |
|| Indicação | R$ 15,00 (quem indica) |
|| Avaliação | R$ 2,00 |

> **Estado atual:** no código hoje, **apenas o acúmulo sobre compras está automatizado** (ganho % do valor do pedido entregue/pago).  
> Bônus de cadastro/aniversário/indicação/avaliação podem ser lançados manualmente via CRM/Admin; automações específicas ainda não foram implementadas.

#### Tiers (baseados em Total Gasto)

| Tier | Requisito (gasto total) | Cashback | Benefícios |
|------|-------------------------|----------|------------|
| Bronze | R$ 0 - R$ 999 | 2% | Cashback padrão |
| Silver | R$ 1.000 - R$ 4.999 | 5% | +Prioridade em reservas, +R$ 50 no aniversário |
| Gold | R$ 5.000 - R$ 9.999 | 8% | +Mesa reservada, +R$ 100 no aniversário, +1 drink cortesia/mês |
| Platinum | R$ 10.000+ | 10% | +Mesa VIP, +R$ 200 no aniversário, +2 drinks cortesia/mês, +Eventos exclusivos |

**Progressão Automática**: O tier é calculado automaticamente baseado no totalSpent (total gasto histórico). Quando o cliente atinge o threshold de um novo tier, é promovido automaticamente.

#### Uso do Cashback (estado atual)

- O cliente **acumula** cashback automaticamente em cada pedido entregue e pago, de acordo com seu tier (2%–10%).
- O saldo acumulado fica registrado em `cashback_saldo`/`cashbackBalance` e em `CashbackHistory`, sendo usado em telas de CRM/Admin e no módulo de Cashback do app.
- O uso de cashback como desconto direto no checkout **ainda não está implementado**; quando for ativado, seguirá a regra planejada de usar no máximo cerca de **50% do valor do pedido** em cashback.

#### Validade e Expiração

- Um job diário expira saldos de cashback que ficaram **90 dias** sem novas transações de ganho (`earned`) ou bônus (`bonus`).
- A expiração gera uma transação `expired` em `CashbackHistory` e zera o saldo do usuário.

---

#### 🔥 CASHBACK INSTAGRAM (NOVO!)

**Conceito:**
Clientes que concordarem em postar uma foto do pedido no Instagram marcando **@flamelounge_** ganham **5% de cashback extra** naquele pedido.

**Regras do Programa:**
- Máximo de **5% de cashback** via Instagram (não 10%)
- Limite de **1 postagem por dia** por cliente
- O cliente deve concordar com os termos no checkout
- Atendente deve verificar a postagem na entrega do pedido
- O cashback só é creditado após confirmação do atendente

**Fluxo Completo:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CASHBACK INSTAGRAM FLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CHECKOUT (Cliente):                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 🔥 Ganhe 5% de cashback extra!                                │  │
│  │                                                                │  │
│  │ Ao receber seu pedido, poste uma foto no Instagram            │  │
│  │ e marque @flamelounge_ para ganhar 5% de cashback.            │  │
│  │                                                                │  │
│  │ Termos:                                                        │  │
│  │ • A postagem deve ser feita em até 1 hora após a entrega      │  │
│  │ • Marque @flamelounge_ na foto ou stories                     │  │
│  │ • Mostrar o pedido de forma clara                             │  │
│  │ • O atendente verificará sua postagem na entrega              │  │
│  │ • Limite de 1 postagem por dia                                │  │
│  │                                                                │  │
│  │ Seu @Instagram: [@_______________]                            │  │
│  │                                                                │  │
│  │ [✓] Aceito participar do programa Instagram Cashback          │  │
│  │                                                                │  │
│  │ Você poderá ganhar: R$ X,XX de cashback extra                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                       │                                             │
│                       ▼                                             │
│  PEDIDO CRIADO com:                                                │
│  ├── instagramPromoOptIn: true                                     │
│  ├── instagramHandle: "@usuario"                                   │
│  └── instagramCashbackPending: true                                │
│                       │                                             │
│                       ▼                                             │
│  ENTREGA (Atendente):                                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Pedido #0127 │ Mesa 07                                        │  │
│  │                                                                │  │
│  │ 🔔 CLIENTE PARTICIPA DO INSTAGRAM CASHBACK                    │  │
│  │                                                                │  │
│  │ Instagram: @usuario_cliente                                    │  │
│  │                                                                │  │
│  │ Instrução: Peça para o cliente mostrar a postagem             │  │
│  │ no Instagram com a marcação @flamelounge_                     │  │
│  │                                                                │  │
│  │ [ ] Cliente postou e marcou corretamente                      │  │
│  │                                                                │  │
│  │ [Confirmar Postagem] [Cliente não postou]                     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                       │                                             │
│           ┌───────────┴───────────┐                                │
│           │                       │                                │
│           ▼                       ▼                                │
│     Confirmou                Não postou                            │
│           │                       │                                │
│           ▼                       ▼                                │
│  ┌─────────────────┐    ┌─────────────────┐                       │
│  │ Credita 5%      │    │ Sem cashback    │                       │
│  │ cashback extra  │    │ Instagram       │                       │
│  │                 │    │                 │                       │
│  │ Notifica cliente│    │ Pedido normal   │                       │
│  └─────────────────┘    └─────────────────┘                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Campos no Order:**
```javascript
{
  // ... outros campos
  instagramPromoOptIn: Boolean,      // Cliente aceitou participar
  instagramHandle: String,           // @ do Instagram
  instagramCashbackPending: Boolean, // Aguardando verificação
  instagramCashbackConfirmed: Boolean, // Atendente confirmou
  instagramCashbackAmount: Decimal   // Valor do cashback Instagram
}
```

**Campos no User:**
```javascript
{
  // ... outros campos
  instagramPromoOptIn: Boolean,      // Preferência geral do usuário
  instagramHandle: String,           // @ salvo do usuário
  lastInstagramPostDate: Date        // Última postagem (para limite diário)
}
```

**Endpoints:**
```
POST /api/orders/:id/instagram-confirm  → Atendente confirma postagem
POST /api/orders/:id/instagram-reject   → Cliente não postou
```

**Notificação ao Cliente:**
Quando o cashback Instagram é creditado:
```
🎉 Você ganhou R$ X,XX de cashback pela sua postagem no Instagram!
Obrigado por compartilhar a experiência FLAME! 🔥
```

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

#### Mapeamento Técnico - Cashback

```
BACKEND                                 FRONTEND
───────────────────────────────────────────────────────────────
models/User.js                          pages/cashback.js
├── cashbackBalance (DECIMAL)
├── loyaltyTier (ENUM)                  stores/cashbackStore.js
├── totalSpent (DECIMAL)                ├── fetchBalance()
├── addCashback(amount, orderId)        ├── fetchHistory()
├── useCashback(maxAmount) ❌           └── applyCashback() ❌
├── calculateTier()
├── updateTier()                        components/CashbackDisplay.js
└── getTierBenefits()

models/CashbackHistory.js
├── userId, orderId
├── amount, type (earned/redeemed/expired/bonus)
├── balanceBefore, balanceAfter
└── expiresAt

Trigger automático:
Order.afterUpdate hook → quando status='delivered'
├── Calcula % baseado no tier
├── Chama user.addCashback()
└── Cria registro em CashbackHistory

⚠️ NÃO IMPLEMENTADO:
├── Uso de cashback no checkout
├── Bônus de cadastro (R$10)
├── Bônus de aniversário
├── Bônus de indicação (R$15)
└── Bônus de avaliação (R$2)
```

---

### 2.6 MÓDULO NARGUILÉ

> **IMPORTANTE**: O narguilé é controlado pelo **ATENDENTE**, não pelo Bar.
> O atendente é quem: acende, troca carvão, controla sessão na mesa, interage com cliente.

> **⚠️ DIVERGÊNCIA ATUAL**: No código atual, o narguilé está em `/staff/bar`. Precisa ser migrado para `/atendente`.

#### Modelo de Operação

```
Cliente solicita narguilé (via app ou presencial)
    ↓
Escolhe sabor (lista de disponíveis)
    ↓
ATENDENTE prepara e acende
    ↓
Entrega na mesa → Timer inicia
    ↓
A cada 15min: Troca de carvão pelo ATENDENTE
    ↓
Cliente solicita encerrar OU tempo máximo
    ↓
ATENDENTE finaliza sessão
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

#### Interface (ATENDENTE)

> **Localização**: `/atendente` (aba "Narguilé")
> **NÃO está mais em**: `/staff/bar`

- Lista de narguilés ativos
- Timer por mesa (countdown visual)
- Alerta troca de carvão
- Botão "Trocar Carvão" (registra)
- Botão "Pausar" / "Retomar"
- Botão "Finalizar"
- Histórico do dia

#### Mapeamento Técnico - Narguilé

```
BACKEND                                 FRONTEND
───────────────────────────────────────────────────────────────
controllers/hookahController.js         pages/staff/bar.js ⚠️
├── getFlavors()                        (deveria ser /atendente)
├── createSession()
├── getActiveSessions()                 stores/hookahStore.js
├── registerCoalChange()                ├── fetchFlavors()
├── pauseSession()                      ├── fetchSessions()
├── resumeSession()                     ├── startSession()
├── endSession()                        ├── registerCoalChange()
├── getHistory()                        ├── pauseSession()
└── getRevenueReport()                  ├── endSession()
                                        └── sessionTimers
services/hookahService.js
├── createSession()                     components/HookahFlavorCard.js
├── getActiveSessions()                 components/HookahSessionCard.js
├── registerCoalChange()
├── pauseSession()
├── resumeSession()
├── endSession()
└── getRevenueReport()

models/HookahSession.js
├── mesaId, flavorId, quantity
├── startedAt, endedAt, pausedAt
├── status (active/paused/ended)
├── duration, scheduledEndTime
├── coalChanges (JSON array)
├── totalPausedTime, price
└── métodos: getElapsedTime(), getRemainingTime(), isOvertime()

models/HookahFlavor.js
├── name, description, category
├── price, inStock, popularity, rating
└── métodos: getPriceForDuration(), incrementPopularity()

routes/hookah.js (12 endpoints)

Socket.IO Events:
├── hookah:session_started
├── hookah:coal_change_alert
├── hookah:coal_changed
├── hookah:paused, hookah:resumed
├── hookah:ended
└── hookah:overtime_warning
```

---

### 2.7 MÓDULO RESERVAS

#### Funcionalidades

|| Feature | Descrição |
||---------|-----------|
|| Calendário | Visualizar disponibilidade |
|| Solicitar | Cliente pede reserva pelo app (requer login + perfil completo) |
|| Confirmar | Staff/Admin aprova ou rejeita pelo painel de reservas (/admin/reservas) |
|| Lembrete | Lembrete automático ~2h antes da reserva (WhatsApp para o cliente, se configurado) |
|| Notificação Loja | WhatsApp automático para FLAME com detalhes de cada nova reserva/cancelamento |
|| No-show | Marcar não compareceu (automático após tolerância) |
|| Walk-in | Registrar chegada sem reserva prévia (via painel Staff/Admin) |

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

- Reservas não podem ser criadas para datas/horários no passado.
- Lembrete: enviado automaticamente ~2 horas antes da reserva (WhatsApp para o cliente, quando habilitado).
- Tolerância de chegada: 15 minutos.
- Após 15min sem chegada marcada: reserva automaticamente marcada como `no_show`.
- Hoje o no-show apenas atualiza o status; qualquer penalização em cashback/CRM deve ser tratada via regras de fidelidade.

> **⚠️ ESTADO ATUAL**: O método `markNoShows()` existe mas o job automático não está agendado.

#### Mapeamento Técnico - Reservas

```
BACKEND                                 FRONTEND
───────────────────────────────────────────────────────────────
controllers/reservationController.js    pages/reservas.js (cliente)
├── createReservation()                 pages/admin/reservas.js (admin)
├── getReservation()
├── getMyReservations()                 stores/reservationStore.js
├── getAllReservations()                ├── fetchAvailableSlots()
├── updateReservation()                 ├── createReservation()
├── confirmReservation()                ├── fetchMyReservations()
├── cancelReservation()                 ├── cancelReservation()
├── getAvailableSlots()                 └── confirmReservation() (admin)
├── markArrived()
├── sendReminder()                      components/ReservationForm.js
└── getReservationStats()               components/ReservationCalendar.js
                                        components/ReservationTimeSlots.js
services/reservationService.js
├── createReservation()
├── confirmReservation()
├── cancelReservation()
├── getAvailableSlots()
├── sendReminder()
├── markNoShows() ⚠️ job não agendado
└── getReservationStats()

services/whatsapp.service.js
├── notifyNewReservation()
├── notifyCancellation()
└── sendReminder()

models/Reservation.js
├── confirmationCode (UNIQUE)
├── guestName, guestEmail, guestPhone
├── reservationDate, partySize
├── status (pending/confirmed/cancelled/completed/no_show)
├── tableId, userId
├── confirmedAt, arrivedAt, cancelledAt
└── métodos: confirm(), cancel(), markArrived(), markNoShow()

routes/reservations.js (12 endpoints)
```

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
| Fidelidade | Regras de cashback, tiers, bônus |
| Narguilé | Preços, sabores |
| Notificações | Templates, automações |
| Integrações | Stripe, Twilio, etc |

#### Gestão de Produtos (Sprint 30)

| Feature | Descrição | Status |
|---------|-----------|--------|
| Upload de Imagens | Upload local via multer (JPEG, PNG, GIF, WebP - max 5MB) | ✅ |
| Preview de Imagem | Visualização antes de salvar no modal de produto | ✅ |
| URL Alternativa | Opção de colar URL externa em vez de upload | ✅ |
| Cards de Estatísticas | Total, ativos, inativos, estoque alto/baixo/zerado | ✅ |
| Filtro por Status | Todos, apenas ativos, apenas inativos | ✅ |
| Filtro por Estoque | Todos, em estoque, baixo, zerado, sem controle | ✅ |
| Filtros Ativos | Resumo visual com opção "Limpar todos" | ✅ |

**Endpoints de Upload:**
- `POST /api/upload/product/:productId` - Upload para produto específico
- `POST /api/upload/image` - Upload genérico
- `DELETE /api/upload/image/:filename` - Deletar imagem

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

| Serviço | Propósito | Status | Componentes |
|---------|-----------|--------|-------------|
| Stripe | Pagamentos | ✅ Configurado | `payment.service.js`, `payment.controller.js` |
| Twilio | SMS | ✅ Ativo | `sms.service.js` |
| Google OAuth 2.0 | Autenticação Social | ⚠️ 90% | `google.service.js` - **Falta credenciais** |
| Socket.IO | Real-time | ✅ Implementado | `socket.service.js`, `socket.js` |
| Push Notifications | Alertas PWA | ⚠️ Parcial | `push.service.js` - **Precisa ativar** |
| WhatsApp (via Twilio) | Notificações de reservas | ✅ Implementado | `whatsapp.service.js` |

#### Serviços Backend Completos

```
services/
├── sms.service.js          # Twilio SMS (9 métodos)
├── push.service.js         # Web Push VAPID (13 métodos)
├── payment.service.js      # Stripe (11 métodos)
├── socket.service.js       # Socket.IO real-time
├── google.service.js       # Google OAuth validation
├── whatsapp.service.js     # WhatsApp via Twilio (3 métodos)
├── crm.service.js          # CRM e métricas (8 métodos)
├── campaign.service.js     # Campanhas marketing (12 métodos)
├── cashier.service.js      # Gestão de caixa (9 métodos)
├── hookahService.js        # Sessões narguilé (13 métodos)
├── inventoryService.js     # Controle estoque (8 métodos)
├── reservationService.js   # Reservas (13 métodos)
├── report.service.js       # Relatórios (5 métodos)
└── orderStatus.service.js  # Máquina de estados ⚠️ incompleto
```

---

## 5. ROADMAP DE IMPLEMENTAÇÃO

### Fases Concluídas ✅

| Fase | Descrição | Status |
|------|-----------|--------|
| Fase 1 | Core (Design System, QR Code, Balcão) | ✅ 100% |
| Fase 2 | Estoque (CRUD, Movimentações, Alertas) | ✅ 90% (falta ficha técnica) |
| Fase 3 | Staff (Roles, Telas, Real-time) | ✅ 95% |
| Fase 4 | Narguilé & Reservas | ✅ 100% |
| Fase 5 | CRM & Fidelidade | ⚠️ 80% (falta uso cashback) |
| Fase 6 | Financeiro (Caixa, DRE, Relatórios) | ✅ 90% |

### Próximas Sprints

**Sprint 23 - CORREÇÃO DE FLUXOS (Prioridade P0)**
- [ ] Criar `orderStatus.service.js` com máquina de estados
- [ ] Validar transições de status por role
- [ ] Migrar Narguilé de `/staff/bar` para `/atendente`
- [ ] Notificar atendente em novos pedidos

**Sprint 24 - CASHBACK COMPLETO**
- [ ] Implementar uso de cashback no checkout
- [ ] Adicionar bônus de cadastro (R$10)
- [ ] Automatizar bônus de aniversário

**Sprint 25 - GOOGLE OAUTH**
- [ ] Configurar projeto no Google Cloud Console
- [ ] Adicionar credenciais no Railway/Vercel
- [ ] Testar fluxo completo

**Sprint 26 - PUSH NOTIFICATIONS**
- [ ] Validar service worker em produção
- [ ] Ativar envio de push em eventos de pedido
- [ ] Testar em dispositivos móveis

---

## 6. DIVERGÊNCIAS CONHECIDAS

| # | Problema | PRD | Sistema | Prioridade |
|---|----------|-----|---------|------------|
| 1 | Fluxo de Pedidos | Transições controladas | Qualquer um muda | P0 |
| 2 | Narguilé | Atendente controla | Bar controla | P0 |
| 3 | Uso de Cashback | 50% do pedido | Não implementado | P0 |
| 4 | Google OAuth | Implementado | Falta credenciais | P1 |
| 5 | Push Notifications | Ativo | Service existe, não ativo | P1 |
| 6 | Bônus automáticos | Cadastro, aniversário | Manual | P2 |
| 7 | No-show automático | Job agendado | Método existe, sem job | P2 |
| 8 | Ficha Técnica | Insumos por produto | Não implementado | P2 |

---

## 7. MÉTRICAS DE SUCESSO

| Indicador | Meta |
|-----------|------|
| Adoção digital | 80% pedidos via app |
| Tempo médio pedido | < 2 minutos |
| Erro de estoque | < 5% |
| NPS staff | > 70 |
| Clientes com cashback | > 60% |

---

## 8. MAPEAMENTO COMPLETO DE PÁGINAS

### Frontend - 48 Páginas

```
pages/
├── Públicas (12)
│   ├── index.js              # Homepage
│   ├── login.js              # Login
│   ├── register.js           # Cadastro
│   ├── cardapio.js           # Cardápio digital
│   ├── historia.js           # Nossa história
│   ├── conceito.js           # Nosso conceito
│   ├── logos.js              # Brand assets
│   ├── 404.js                # Página de erro
│   ├── offline.js            # PWA offline
│   ├── apresentacao.js       # Apresentação
│   ├── roadmap.js            # Roadmap
│   └── termos.js             # Termos de uso
│
├── Cliente Autenticado (6)
│   ├── perfil.js             # Perfil do usuário
│   ├── checkout.js           # Finalizar pedido
│   ├── recuperar-senha.js    # Recuperação de senha
│   ├── complete-profile.js   # Completar cadastro
│   ├── reservas.js           # Reservas
│   └── cashback.js           # Programa de cashback
│
├── Admin (11)
│   ├── admin/index.js        # Dashboard
│   ├── admin/products.js     # Produtos
│   ├── admin/estoque.js      # Estoque
│   ├── admin/orders.js       # Pedidos
│   ├── admin/reports.js      # Relatórios
│   ├── admin/settings.js     # Configurações
│   ├── admin/clientes.js     # CRM
│   ├── admin/reservas.js     # Reservas
│   ├── admin/campanhas.js    # Campanhas
│   ├── admin/logs.js         # Logs
│   └── admin/tables.js       # Mesas
│
├── Staff (5)
│   ├── staff/bar.js          # Bar (inclui narguilé ⚠️)
│   ├── staff/caixa.js        # Caixa
│   ├── staff/relatorios.js   # Relatórios staff
│   ├── staff/login.js        # Login staff
│   └── atendente/index.js    # Atendente
│
├── Operacional (2)
│   ├── cozinha/index.js      # Cozinha
│   └── pedidos.js            # Lista pedidos
│
└── Dinâmicas (12)
    ├── pedido/[id].js        # Detalhes do pedido
    ├── avaliacao/[id].js     # Avaliar pedido
    ├── qr/[mesaId].js        # QR Code mesa
    └── ... outras
```

### Backend - 15 Models

```
models/
├── User.js                   # Usuários (35+ campos)
├── Order.js                  # Pedidos (30+ campos)
├── OrderItem.js              # Itens do pedido
├── Product.js                # Produtos (30+ campos)
├── Table.js                  # Mesas
├── Reservation.js            # Reservas (20+ campos)
├── HookahSession.js          # Sessões narguilé
├── HookahFlavor.js           # Sabores narguilé
├── Cashier.js                # Caixa
├── CashierMovement.js        # Movimentos do caixa
├── CashbackHistory.js        # Histórico cashback
├── PointsHistory.js          # Histórico pontos (legado)
├── InventoryMovement.js      # Movimentos estoque
├── Campaign.js               # Campanhas marketing
└── PushSubscription.js       # Notificações push
```

---

---

## 9. AUDITORIA COMPLETA DOS MÓDULOS

Esta seção contém o mapeamento técnico detalhado de cada módulo, identificando problemas críticos, divergências e o que precisa ser implementado.

### 9.1 MÓDULO DE PEDIDOS (Order)

#### Modelo Order.js - Campos Completos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | ✅ | PK |
| `orderNumber` | STRING | ✅ | Número sequencial único |
| `userId` | UUID | ✅ | FK para User |
| `tableId` | UUID | ❌ | FK para Table (null = balcão) |
| `status` | ENUM | ✅ | pending/confirmed/preparing/ready/on_way/delivered/cancelled |
| `paymentMethod` | ENUM | ❌ | cash/credit/debit/pix |
| `paymentStatus` | ENUM | ✅ | pending/processing/completed/failed/refunded |
| `subtotal` | DECIMAL(10,2) | ✅ | Soma dos itens |
| `serviceFee` | DECIMAL(10,2) | ✅ | Taxa de serviço (10%) |
| `discount` | DECIMAL(10,2) | ✅ | Desconto aplicado |
| `total` | DECIMAL(10,2) | ✅ | Valor final |
| `notes` | TEXT | ❌ | Observações |
| `estimatedTime` | INTEGER | ❌ | Tempo estimado (min) |
| `rating` | INTEGER | ❌ | Avaliação 1-5 |
| `ratingComment` | TEXT | ❌ | Comentário da avaliação |
| `stripePaymentIntentId` | STRING | ❌ | ID do Stripe |
| `confirmedAt` | DATE | ❌ | Quando foi confirmado |
| `preparingAt` | DATE | ❌ | Quando começou preparo |
| `readyAt` | DATE | ❌ | Quando ficou pronto |
| `deliveredAt` | DATE | ❌ | Quando foi entregue |
| `cancelledAt` | DATE | ❌ | Quando foi cancelado |
| `cancelReason` | TEXT | ❌ | Motivo do cancelamento |

#### 🔴 PROBLEMAS CRÍTICOS DE SEGURANÇA

1. **Webhook sem autenticação**: `POST /orders/payment/confirm` aceita qualquer request
2. **Sem validação de role**: `getAllOrders()` e `getDashboardMetrics()` não validam role
3. **Transição de status**: Qualquer role pode mudar para qualquer status

#### Status de Pedido - Transições Válidas

```
pending → confirmed (cozinha/admin)
confirmed → preparing (cozinha/admin)
preparing → ready (cozinha/admin)
ready → on_way (atendente/admin) ← BLOQUEADO até ready
on_way → delivered (atendente/admin)
* → cancelled (admin/gerente)
```

#### Mapeamento Backend-Frontend

| Backend | Frontend |
|---------|----------|
| `orderController.js` (13 métodos) | `pages/pedidos.js`, `pages/checkout.js` |
| `orderService.js` | `stores/orderStore.js` |
| `routes/orders.js` (15 endpoints) | `pages/pedido/[id].js` |

---

### 9.2 MÓDULO DE PRODUTOS (Product)

#### Modelo Product.js - Campos Completos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | PK |
| `name` | STRING(100) | Nome do produto |
| `description` | TEXT | Descrição |
| `price` | DECIMAL(10,2) | Preço base |
| `category` | ENUM | food/drink/dessert/hookah/other |
| `subcategory` | STRING | Subcategoria |
| `image` | STRING | URL da imagem |
| `isAvailable` | BOOLEAN | Disponível para venda |
| `isActive` | BOOLEAN | Ativo no cardápio |
| `preparationTime` | INTEGER | Tempo preparo (min) |
| `hasStock` | BOOLEAN | Controla estoque |
| `stock` | INTEGER | Quantidade atual |
| `minStock` | INTEGER | Estoque mínimo (alerta) |
| `dietary` | JSON | Flags: vegetarian, vegan, glutenFree, lactoseFree |
| `allergens` | JSON | Lista de alérgenos |
| `ingredients` | TEXT | Ingredientes (texto) |
| `promotionPrice` | DECIMAL | Preço promocional |
| `promotionStart` | DATE | Início promoção |
| `promotionEnd` | DATE | Fim promoção |
| `sortOrder` | INTEGER | Ordem no cardápio |

#### 🔴 PROBLEMA CRÍTICO DE SEGURANÇA

**Nenhuma validação de role no CRUD de produtos!**

```javascript
// QUALQUER usuário autenticado pode:
POST   /products      → Criar produto
PUT    /products/:id  → Editar produto
DELETE /products/:id  → Deletar produto
```

**Necessário**: Adicionar `requireAdmin` ou `requireRole(['admin', 'gerente'])` nas rotas

#### Funcionalidades Não Implementadas

- ❌ Ficha técnica / receita (insumos por produto)
- ❌ Exibição de alérgenos no frontend
- ❌ Filtros dietéticos no cardápio

---

### 9.3 MÓDULO DE MESAS (Table)

#### Modelo Table.js - Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | PK |
| `number` | INTEGER | Número único (1-999) |
| `name` | STRING(50) | Nome opcional |
| `capacity` | INTEGER | Capacidade (1-20) |
| `location` | ENUM | interno/externo/balcao/vip/reservado |
| `status` | ENUM | available/occupied/reserved/maintenance |
| `isActive` | BOOLEAN | Mesa ativa |
| `qrCode` | STRING | URL do QR Code |
| `lastCleaned` | DATE | Última limpeza |
| `notes` | TEXT | Observações |
| `position` | JSON | {x, y} para mapa |

#### 🔴 PROBLEMA CRÍTICO: QR Code URL Incorreta

```javascript
// ATUAL (ERRADO) em tableController.js:
const qrCodeUrl = `${process.env.FRONTEND_URL}/table/${table.number}`;

// DEVERIA SER:
const qrCodeUrl = `${process.env.FRONTEND_URL}/qr/${table.number}`;
```

**Locais que precisam correção**:
- `tableController.js:17` - getQRCodeURL()
- `tableController.js:190` - createTable()
- `tableController.js:249` - updateTable()
- `tableController.js:538` - generateQRCode()

#### Divergências Status

| Onde | Status Válidos |
|------|---------------|
| Model | available, occupied, reserved, maintenance |
| Controller | available, occupied, reserved, **cleaning**, **unavailable** |
| Frontend | available, occupied, reserved, cleaning, **inactive** |

**Problema**: Controller aceita status que o model não valida!

#### Fluxo QR Code

```
1. Cliente escaneia QR → /qr/{numero}
2. Salva em sessionStorage: 'redlight-qr-mesa' = numero
3. cartStore.setTable(mesaId, parseInt(mesaId))
4. Se logado → /cardapio?mesa=${mesaId}
5. Se não → Tela login/cadastro
```

---

### 9.4 MÓDULO DE RESERVAS (Reservation)

#### Modelo Reservation.js - Campos Completos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | PK |
| `userId` | UUID | FK User (opcional) |
| `confirmationCode` | STRING(12) | Código único |
| `guestName` | STRING(100) | Nome do cliente |
| `guestEmail` | STRING(100) | Email |
| `guestPhone` | STRING(20) | Telefone |
| `reservationDate` | DATE | Data/hora da reserva |
| `partySize` | INTEGER | Número de pessoas (1-50) |
| `status` | ENUM | pending/confirmed/cancelled/no_show/completed |
| `specialRequests` | TEXT | Pedidos especiais |
| `guestNotes` | TEXT | Notas do cliente |
| `tableId` | UUID | Mesa atribuída |
| `confirmedAt` | DATE | Data confirmação |
| `arrivedAt` | DATE | Data chegada |
| `cancelledAt` | DATE | Data cancelamento |
| `cancelReason` | TEXT | Motivo cancelamento |
| `reminderSentAt` | DATE | Data lembrete enviado |

#### 🔴 BUG CRÍTICO NO JOB DE NO-SHOW

**Arquivo**: `/backend/src/jobs/noShow.job.js`

```javascript
// BUG: Usa campo r.time que NÃO EXISTE no modelo!
const reservationDateTime = new Date(`${r.reservationDate}T${r.time}`);
// r.time é undefined → job não funciona!
```

**Impacto**: No-shows automáticos não são marcados

#### Fluxo de Reserva

```
1. Cliente acessa /reservas
2. Seleciona data → calendário
3. Seleciona horário → slots 13h-22h (30min intervalo)
4. Preenche dados → nome, email, telefone, ocasião
5. Submete → POST /api/reservations
6. Backend:
   - Gera confirmationCode
   - Cria registro (status: pending)
   - Envia SMS async
   - Envia WhatsApp para FLAME
   - Notifica admin via Socket.IO
7. Admin confirma → status: confirmed
8. 2h antes → job envia lembrete
9. Cliente chega → markArrived()
10. OU 15min após → markNoShow() ⚠️ job quebrado
```

---

### 9.5 MÓDULO DE NARGUILÉ (Hookah)

#### Modelo HookahSession.js - Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | PK |
| `mesaId` | UUID | FK Table |
| `flavorId` | UUID | FK HookahFlavor |
| `quantity` | INTEGER | Quantidade de narguilés |
| `startedAt` | DATE | Início da sessão |
| `endedAt` | DATE | Fim da sessão |
| `pausedAt` | DATE | Quando pausou |
| `status` | ENUM | active/paused/ended |
| `duration` | INTEGER | Duração em minutos |
| `scheduledEndTime` | DATE | Fim agendado |
| `coalChanges` | JSON | Array de trocas de carvão |
| `totalPausedTime` | INTEGER | Tempo pausado (min) |
| `price` | DECIMAL | Valor da sessão |

#### ✅ CONFIRMADO: Narguilé está em `/atendente`

O narguilé foi **migrado de `/staff/bar` para `/atendente`** na Sprint 23.

**Localização atual**: `pages/atendente/index.js`

#### ⚠️ PROBLEMA: Falta Socket Listeners no Frontend

O frontend do atendente **não escuta** eventos Socket.IO do narguilé:

```javascript
// Eventos que existem no backend mas NÃO são escutados no frontend:
- hookah:session_started
- hookah:coal_changed
- hookah:coal_change_alert
- hookah:overtime_warning
- hookah:session_ended
```

**Impacto**: Não há sincronização em tempo real das sessões

---

### 9.6 MÓDULO DE ESTOQUE (Inventory)

#### Campos de Estoque no Product.js

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `hasStock` | BOOLEAN | Controla estoque |
| `stock` | INTEGER | Quantidade atual |
| `minStock` | INTEGER | Estoque mínimo (default: 5) |

#### Modelo InventoryMovement.js

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | PK |
| `productId` | UUID | FK Product |
| `orderId` | UUID | FK Order (opcional) |
| `type` | ENUM | entrada/saida/ajuste/devolucao |
| `quantity` | INTEGER | Quantidade |
| `reason` | TEXT | Motivo |
| `previousStock` | INTEGER | Estoque antes |
| `newStock` | INTEGER | Estoque depois |
| `notes` | TEXT | Observações |
| `userId` | UUID | Quem fez |

#### Fluxo de Baixa Automática

```
1. Pedido criado (pending)
2. Para cada item:
   a. Valida: product.hasStock && stock >= quantity
   b. Product.decrement('stock', { by: quantity })
   c. InventoryService.recordMovement(type='saida', reason='venda')
3. Se pedido cancelado:
   a. Product.increment('stock', { by: quantity })
   b. InventoryService.recordMovement(type='devolucao')
```

#### ❌ FICHA TÉCNICA NÃO IMPLEMENTADA

**Estado atual**: Baixa é feita diretamente no produto, não em insumos

```javascript
// O que existe:
Venda de "Caipirinha" → decrementa stock de "Caipirinha"

// O que deveria existir:
Venda de "Caipirinha" → decrementa:
  - Limão (1 unidade)
  - Cachaça (50ml)
  - Açúcar (1 colher)
```

**Impacto**: Impossível saber qual insumo específico está faltando

---

### 9.7 MÓDULO DE CAIXA (Cashier)

#### Modelo Cashier.js - Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | PK |
| `operatorId` | UUID | FK User (quem abriu) |
| `operatorName` | STRING | Nome desnormalizado |
| `openedAt` | DATE | Data/hora abertura |
| `closedAt` | DATE | Data/hora fechamento |
| `status` | ENUM | open/closed |
| `openingAmount` | DECIMAL | Valor inicial |
| `closingAmount` | DECIMAL | Valor contado |
| `totalSales` | DECIMAL | Total vendas dinheiro |
| `totalDeposits` | DECIMAL | Total suprimentos |
| `totalWithdrawals` | DECIMAL | Total sangrias |
| `notes` | TEXT | Observações |
| `closedBy` | UUID | FK User (quem fechou) |

#### Modelo CashierMovement.js - Tipos

| Tipo | Descrição |
|------|-----------|
| `sale` | Venda em dinheiro |
| `deposit` | Suprimento (entrada) |
| `withdrawal` | Sangria (saída) |
| `opening` | Abertura do caixa |
| `closing` | Fechamento do caixa |

#### ⚠️ INTEGRAÇÃO COM PEDIDOS NÃO IMPLEMENTADA

**Problema**: Quando um pedido é pago em dinheiro, **NÃO é registrado automaticamente no caixa**

```javascript
// O método existe:
cashierService.registerSale(cashierId, orderId, orderNumber, amount, userId, userName)

// Mas orderController.js NÃO chama esse método!
```

**Impacto**: Caixa fica desincronizado com vendas

#### Cálculo de Fechamento

```
Esperado = Abertura + Vendas + Suprimentos - Sangrias
Diferença = Contado - Esperado
Resultado = "Sobra" (positivo) ou "Falta" (negativo)
```

---

### 9.8 MÓDULO CRM/CAMPANHAS

#### Campos CRM no User.js

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `totalOrders` | INTEGER | Total de pedidos |
| `totalSpent` | DECIMAL | Total gasto R$ |
| `lastVisit` | DATE | Última visita |
| `lastOrderDate` | DATE | Último pedido |
| `loyaltyTier` | ENUM | bronze/silver/gold/platinum |
| `cashbackBalance` | DECIMAL | Saldo cashback |

#### Modelo Campaign.js

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | PK |
| `name` | STRING | Nome da campanha |
| `description` | TEXT | Descrição |
| `type` | ENUM | reactivation/promotion/loyalty/announcement |
| `status` | ENUM | draft/active/paused/completed |
| `targetType` | ENUM | all/inactive/tier/custom |
| `targetFilters` | JSON | Filtros de segmentação |
| `content` | JSON | {subject, body, sms} |
| `channels` | JSON | ['email', 'sms'] |
| `scheduledAt` | DATE | Agendamento |
| `sentAt` | DATE | Data de envio |
| `stats` | JSON | {totalTargets, sent, opened, clicked, converted} |

#### Funcionalidades CRM Implementadas

✅ Segmentação por tier, gasto, pedidos
✅ Clientes inativos (30/60/90/180 dias)
✅ Próximos de upgrade de tier
✅ Dashboard com KPIs
✅ Histórico de cashback

#### ❌ Automações NÃO Implementadas

- Boas-vindas automáticas
- Campanhas de inatividade automáticas
- Notificação de upgrade de tier
- Campanha de aniversário
- Agendamento de campanhas (campo existe mas não é usado)
- Tracking de campanhas (opened, clicked nunca são atualizados)

---

### 9.9 INTEGRAÇÕES EXTERNAS

#### Socket.IO - Eventos Principais

**Pedidos:**
- `order_created`, `order_status_updated`, `order_ready_alert`
- `order_picked_up`, `order_delivered`, `order_cancelled`

**Narguilé:**
- `hookah:session_started`, `hookah:coal_changed`, `hookah:coal_change_alert`
- `hookah:paused`, `hookah:resumed`, `hookah:overtime_warning`

**Reservas:**
- `reservation:new`, `reservation:confirmed`, `reservation:cancelled`
- `reservation:arrived`, `reservation:reminder_sent`

#### Stripe - Status

| Item | Status |
|------|--------|
| Pagamento com cartão | ✅ Implementado |
| Pagamento PIX | ✅ Implementado |
| Webhooks | ⚠️ Incompleto (TODO no código) |
| Modo | **TESTE** (sk_test_*) |

#### 🔴 PROBLEMAS CRÍTICOS DE SEGURANÇA

1. **Google OAuth**: Credenciais expostas em `.env` no repositório
2. **WhatsApp**: Número pessoal hardcoded (+5521995354010)
3. **Push VAPID**: Chaves padrão hardcoded no código
4. **Stripe**: Modo teste em produção

#### Variáveis de Ambiente Críticas

```env
# EXPOSTAS OU NÃO CONFIGURADAS:
GOOGLE_CLIENT_ID=611018665878-...  # EXPOSTO
GOOGLE_CLIENT_SECRET=GOCSPX-...    # EXPOSTO
FLAME_WHATSAPP_NUMBER=+5521995354010  # NÚMERO PESSOAL
VAPID_PUBLIC_KEY=BLN9wBx...  # DEFAULT HARDCODED
VAPID_PRIVATE_KEY=nJqz_CE...  # DEFAULT HARDCODED
STRIPE_SECRET_KEY=sk_test_...  # MODO TESTE
```

---

## 10. AÇÕES PRIORITÁRIAS

### 🔴 CRÍTICO (Segurança e Funcionamento)

1. **Remover .env do repositório** e revogar credenciais Google
2. **Corrigir URL do QR Code** em 4 locais do tableController
3. **Adicionar validação de role** no productController
4. **Adicionar autenticação** no webhook de pagamento
5. **Corrigir job de no-show** (campo `r.time` não existe)
6. **Remover número pessoal** do whatsapp.service.js
7. **Gerar VAPID keys únicas** (não usar default)

### 🟠 ALTO (Funcionalidade Quebrada)

8. **Implementar uso de cashback** no checkout
9. **Integrar caixa com pedidos** em dinheiro
10. **Adicionar socket listeners** no frontend do narguilé
11. **Padronizar status de mesas** entre model/controller/frontend
12. **Completar webhook Stripe** (atualizar status do pedido)

### 🟡 MÉDIO (Melhorias)

13. Implementar ficha técnica (receita com insumos)
14. Implementar automações de CRM
15. Adicionar Push Notifications no service worker
16. Implementar tracking de campanhas

---

*FLAME PRD v3.3.0 - Atualizado em 07/12/2024*
*Documento sincronizado com auditoria completa de todos os módulos*
