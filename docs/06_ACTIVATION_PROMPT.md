# 🔥 FLAME - ACTIVATION PROMPT

## IDENTIDADE DO AGENTE

Você é o agente de desenvolvimento do **FLAME**, uma plataforma digital completa para um Lounge Bar, Gastronomia e Narguilé/Tabacaria localizado na Rua Arnaldo Quintela 19, Botafogo, Rio de Janeiro.

---

## CONTEXTO DO PROJETO

### Informações da Marca
- **Nome:** FLAME
- **Tagline:** "Prepare-se, vai esquentar"
- **Instagram:** @flamelounge_
- **WhatsApp:** +55 21 99554-6492
- **Endereço:** Rua Arnaldo Quintela, 19 - Botafogo, RJ

### Identidade Visual
- **Paleta Principal:** Gradiente magenta (#FF006E) → ciano (#00D4FF)
- **Background:** Preto (#000000)
- **Tema:** Dark mode only
- **Logo:** Chama com gradiente vertical (magenta no topo, ciano na base)

### Stack Tecnológica
- **Frontend:** Next.js 14 + React 18 + Tailwind CSS + Zustand
- **Backend:** Node.js + Express + Sequelize + PostgreSQL
- **Real-time:** Socket.IO
- **Pagamentos:** Stripe
- **SMS:** Twilio
- **PWA:** next-pwa

---

## ARQUITETURA DO SISTEMA

### Módulos Principais

1. **CLIENTE (App Público)**
   - Cadastro/Login via SMS
   - Cardápio digital
   - Pedido via QR Code (mesa auto-detectada)
   - Pedido para balcão
   - Reserva de mesa
   - Narguilé (escolha de sabor, timer)
   - Programa de pontos
   - Tracking em tempo real

2. **STAFF (Funcionários)**
   - Cozinha: fila de produção
   - Bar: drinks + narguilé
   - Atendente: entregas
   - Caixa: PDV

3. **ESTOQUE**
   - Insumos com ficha técnica
   - Entrada/saída automática
   - Alertas de mínimo
   - Custo médio

4. **CRM**
   - Histórico do cliente
   - Segmentação
   - Automações

5. **FIDELIDADE**
   - Pontos por compra
   - Tiers (Bronze, Silver, Gold, Platinum)
   - Resgate de recompensas

6. **FINANCEIRO**
   - Caixa (abertura/fechamento)
   - DRE simplificado
   - Relatórios

---

## FLUXOS PRINCIPAIS

### Pedido na Mesa (via QR)
```
QR Code → Mesa detectada → Login/Cadastro → Cardápio → Carrinho → Checkout → Pagamento → Tracking
```

### Pedido no Balcão
```
Acesso direto → Login → Cardápio → Carrinho → Marca "Balcão" → Pagamento → Push quando pronto
```

### Narguilé
```
Cardápio → Seleciona sabor → Adiciona ao pedido → Staff inicia timer → Troca carvão automática → Cliente encerra → Valor calculado
```

### Reserva
```
Menu Reservas → Calendário → Seleciona data/hora → Num. pessoas → Solicita → Staff confirma → Lembrete 2h antes
```

---

## REGRAS DE NEGÓCIO

### Pontos
- R$1 gasto = 1 ponto
- Cadastro = 50 pontos bônus
- Aniversário = 100 pontos
- Expiram em 12 meses

### Tiers
- Bronze: 1x multiplicador
- Silver (500pts): 1.2x
- Gold (2000pts): 1.5x
- Platinum (5000pts): 2x

### Narguilé
- R$60/hora (clássico)
- R$75/hora (premium)
- R$80/hora (signature)
- Mínimo 30min
- Troca carvão a cada 15min

### Reservas
- Antecedência: 2h - 30 dias
- Tolerância: 15min
- No-show: -50 pontos

---

## CONVENÇÕES DE CÓDIGO

### Nomenclatura
- Componentes: PascalCase (`ProductCard.js`)
- Funções: camelCase (`getOrderById`)
- Constantes: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- CSS Classes: kebab-case (`btn-primary`)

### Commits
```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração
style: formatação
docs: documentação
chore: manutenção
```

### Estrutura de Componentes
```jsx
// 1. Imports
// 2. Types/Interfaces
// 3. Component
// 4. Styles (se inline)
// 5. Export
```

---

## CORES (Tokens)

```javascript
// Primárias
flame.magenta: '#FF006E'
flame.cyan: '#00D4FF'
flame.purple: '#B266FF'

// Backgrounds
neutral.0: '#000000'
neutral.50: '#0A0A0A'
neutral.100: '#141414'

// Texto
text.primary: '#FFFFFF'
text.secondary: '#A1A1A1'

// Semânticas
success: '#10B981'
warning: '#F59E0B'
error: '#EF4444'
```

---

## ARQUIVOS IMPORTANTES

```
/docs/
├── 01_CONCEITO_FLAME.md      # Identidade da marca
├── 02_DESIGN_SYSTEM.md       # Tokens, componentes
├── 03_PRD.md                 # Requisitos do produto
├── 04_USER_FLOWS.md          # Fluxos detalhados
├── 05_TECHNICAL_ARCHITECTURE.md  # Arquitetura técnica

/frontend/
├── tailwind.config.js        # Design tokens
├── src/components/Logo.js    # Logo principal
├── src/styles/globals.css    # Variáveis CSS

/backend/
├── src/models/               # Modelos de dados
├── src/routes/               # API endpoints
├── src/socket/               # Eventos real-time
```

---

## DIRETRIZES

### Ao Desenvolver

1. **Sempre usar o Design System** - Nunca hardcode cores ou espaçamentos
2. **Mobile-first** - Começar pelo mobile, expandir para desktop
3. **Real-time primeiro** - Sempre pensar em Socket.IO para atualizações
4. **Estoque integrado** - Toda venda deve baixar estoque automaticamente
5. **Pontos sempre** - Toda compra gera pontos

### Ao Criar Componentes

1. Seguir padrão de cores do FLAME (gradiente magenta→ciano)
2. Usar `rounded-lg` ou `rounded-xl` para bordas
3. Animações com Framer Motion
4. Estados de loading/erro/empty
5. Responsivo (sm, md, lg breakpoints)

### Ao Criar APIs

1. Autenticação JWT obrigatória (exceto públicas)
2. Validação com Zod
3. Rate limiting em endpoints sensíveis
4. Logs estruturados
5. Tratamento de erros padronizado

---

## PRIORIDADE DE DESENVOLVIMENTO

```
Fase 1: Core Visual (Semanas 1-2)
├── Atualizar Design System
├── Refatorar componentes
├── Fluxo QR Code + Balcão

Fase 2: Estoque (Semanas 3-4)
├── Modelos de dados
├── CRUD insumos
├── Integração vendas

Fase 3: Staff (Semanas 5-6)
├── Sistema de roles
├── Painéis por função
├── Real-time aprimorado

Fase 4: Narguilé + Reservas (Semanas 7-8)
├── Módulo completo narguilé
├── Sistema de reservas
├── Calendário

Fase 5: CRM + Fidelidade (Semanas 9-10)
├── CRM
├── Pontos
├── Recompensas

Fase 6: Financeiro (Semanas 11-12)
├── Caixa
├── DRE
├── Relatórios
```

---

## COMANDOS ÚTEIS

```bash
# Frontend
cd frontend
npm run dev         # Desenvolvimento
npm run build       # Build produção

# Backend
cd backend
npm run dev         # Desenvolvimento
npm run migrate     # Rodar migrações
npm run seed        # Popular banco

# Git
git checkout -b feature/nome
git add .
git commit -m "feat: descrição"
git push origin feature/nome
```

---

## LEMBRETES

- ⚠️ Projeto anterior se chamava "Exxquema" - renomear todas as referências
- ⚠️ Cores antigas eram laranja (#FF6B35) - trocar para gradiente magenta/ciano
- ⚠️ Conceito antigo era "esquema" - novo é "calor/chama"
- ✅ Backend funcional existe - aproveitar estrutura
- ✅ PWA já configurado - manter
- ✅ Socket.IO implementado - expandir

---

*FLAME - O point quente de Botafogo* 🔥
