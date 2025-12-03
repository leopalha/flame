# 🟠 Exxquema - Plataforma Digital Completa

> **Uma plataforma web progressiva (PWA) moderna para pub & lounge que revoluciona a experiência do cliente através de pedidos digitais, pagamentos antecipados e acompanhamento em tempo real.**

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [API Documentation](#-api-documentation)
- [PWA Features](#-pwa-features)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **Exxquema** é uma solução completa para modernizar a experiência em pubs e lounges, permitindo que clientes façam pedidos diretamente da mesa através de QR Code, paguem antecipadamente e acompanhem o status em tempo real.

### ✨ Diferencial

- 🚀 **Zero Instalação**: PWA funciona como app nativo
- ⚡ **Real-time**: Status dos pedidos atualizados instantaneamente 
- 💰 **Pagamento Seguro**: Integração completa com Stripe
- 📱 **Mobile-First**: Otimizado para dispositivos móveis
- 🔄 **Offline Support**: Funciona parcialmente sem internet
- 🎨 **Design Moderno**: Interface elegante e intuitiva

---

## 🛠 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Sequelize** - ORM
- **Socket.IO** - Comunicação real-time
- **JWT** - Autenticação
- **Twilio** - SMS
- **Stripe** - Pagamentos
- **SendGrid** - E-mails

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **PWA** - Progressive Web App
- **Framer Motion** - Animações
- **Zustand** - Gerenciamento de estado
- **React Query** - Cache e sincronização

### DevOps & Tools
- **Docker** - Containerização
- **Vercel** - Deploy frontend
- **Railway** - Deploy backend
- **GitHub Actions** - CI/CD
- **ESLint & Prettier** - Qualidade de código

---

## 🚀 Funcionalidades

### 👤 Para Clientes
- ✅ Cadastro simplificado com validação SMS
- ✅ Login por SMS ou e-mail/senha
- ✅ Cardápio digital com busca e filtros
- ✅ Carrinho de compras inteligente
- ✅ Pagamento antecipado (Cartão, PIX, Apple Pay)
- ✅ Acompanhamento de pedido em tempo real
- ✅ Avaliação da experiência (NPS)
- ✅ Histórico de pedidos
- ✅ PWA - instalável como app

### 👨‍🍳 Para Cozinha
- ✅ Fila de produção em tempo real
- ✅ Timer por pedido
- ✅ Alertas de atraso (>20min)
- ✅ Interface otimizada para tablets
- ✅ Notificações sonoras

### 🏃‍♂️ Para Atendentes
- ✅ Dashboard de pedidos ativos
- ✅ Notificações quando pedido fica pronto
- ✅ Controle de entrega
- ✅ Histórico do turno

### 📊 Para Administradores
- ✅ Dashboard com métricas em tempo real
- ✅ Gestão completa do cardápio
- ✅ Relatórios de vendas
- ✅ Controle de usuários
- ✅ Configurações do sistema

---

## 📦 Instalação

### Pré-requisitos

```bash
node >= 18.0.0
npm >= 8.0.0
postgresql >= 13.0
```

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/exxquema.git
cd exxquema
```

### 2. Instalar dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configurar banco de dados

```bash
# Instalar PostgreSQL
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Criar banco de dados
createdb exxquema
```

---

## ⚙️ Configuração

### Backend - Variáveis de ambiente

Crie o arquivo `.env` na pasta `backend`:

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/exxquema
DB_HOST=localhost
DB_PORT=5432
DB_NAME=exxquema
DB_USER=seu_usuario
DB_PASS=sua_senha

# JWT
JWT_SECRET=sua-chave-jwt-super-secreta
JWT_EXPIRE=7d

# Twilio (SMS)
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_PHONE_NUMBER=+5521999999999

# Stripe (Pagamentos)
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta
STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret

# SendGrid (Email)
SENDGRID_API_KEY=SG.sua_api_key
FROM_EMAIL=noreply@exxquema.bar

# Business Rules
MINIMUM_ORDER_VALUE=15.00
SERVICE_FEE_PERCENTAGE=10
MAX_SMS_ATTEMPTS=3
SMS_CODE_EXPIRY_MINUTES=5
```

### Frontend - Variáveis de ambiente

Crie o arquivo `.env.local` na pasta `frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 🎮 Como Usar

### 1. Iniciar o Backend

```bash
cd backend

# Executar migrations
npm run migrate

# Iniciar servidor de desenvolvimento
npm run dev
```

O backend estará disponível em `http://localhost:5000`

### 2. Iniciar o Frontend

```bash
cd frontend

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

### 3. Testar o Sistema

1. **Acesse**: `http://localhost:3000`
2. **QR Code**: Para simular, acesse `http://localhost:3000/qr/1`
3. **Cadastro**: Preencha os dados e valide o SMS
4. **Cardápio**: Navegue e adicione itens ao carrinho
5. **Pagamento**: Use cartão de teste: `4242 4242 4242 4242`
6. **Acompanhar**: Veja o pedido em tempo real

---

## 📚 API Documentation

### Autenticação

#### `POST /api/auth/register`
Cadastrar novo usuário

```json
{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao@email.com",
  "celular": "(21) 98765-4321"
}
```

#### `POST /api/auth/verify-sms`
Verificar código SMS

```json
{
  "celular": "(21) 98765-4321",
  "code": "1234"
}
```

#### `POST /api/auth/login`
Login com email/senha

```json
{
  "email": "joao@email.com",
  "password": "minhasenha"
}
```

### Pedidos

#### `GET /api/products`
Listar produtos do cardápio

**Query params:**
- `category`: Filtrar por categoria
- `search`: Buscar por nome
- `page`: Página (padrão: 1)
- `limit`: Itens por página (padrão: 20)

#### `POST /api/orders`
Criar novo pedido

```json
{
  "tableId": "uuid-da-mesa",
  "items": [
    {
      "productId": "uuid-produto",
      "quantity": 2,
      "notes": "Sem gelo"
    }
  ],
  "paymentMethod": "credit_card"
}
```

### WebSocket Events

O cliente pode escutar os seguintes eventos:

```javascript
// Status do pedido atualizado
socket.on('order_status_updated', (data) => {
  console.log('Pedido:', data.orderId, 'Status:', data.status);
});

// Pedido pronto
socket.on('order_ready', (data) => {
  console.log('Pedido', data.orderId, 'está pronto!');
});
```

---

## 📱 PWA Features

### Service Worker
- Cache inteligente de recursos estáticos
- Funciona offline (cardápio em cache)
- Updates automáticos em background

### Manifest
- Instalável como app nativo
- Ícones adaptativos
- Shortcuts personalizados
- Splash screen customizado

### Características Nativas
- Push notifications
- Add to homescreen
- Fullscreen experience
- Hardware acceleration

### Como Instalar (PWA)

1. **Android Chrome**: Banner automático ou Menu > "Instalar app"
2. **iOS Safari**: Compartilhar > "Adicionar à Tela Início"
3. **Desktop**: Ícone de instalação na barra de endereço

---

## 🚀 Deploy

### Backend (Railway)

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
cd backend
railway up
```

### Frontend (Vercel)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
cd frontend
vercel --prod
```

### Usando Docker

```bash
# Construir imagens
docker-compose build

# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## 🧪 Testes

```bash
# Backend
cd backend
npm test
npm run test:watch

# Frontend  
cd frontend
npm test
npm run test:coverage
```

### Testes E2E

```bash
# Cypress
cd frontend
npm run cypress:open
npm run cypress:run
```

---

## 📊 Métricas e Monitoramento

### Performance
- **Lighthouse Score**: >90
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Time to Interactive**: <3s

### Monitoramento
- **Logs**: Winston + CloudWatch
- **Errors**: Sentry
- **Uptime**: UptimeRobot
- **Analytics**: Google Analytics 4

---

## 🔧 Scripts Úteis

```bash
# Backend
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run start        # Produção
npm run migrate      # Executar migrations
npm run seed         # Popular banco com dados
npm run test         # Executar testes

# Frontend
npm run dev          # Desenvolvimento
npm run build        # Build produção  
npm run start        # Produção
npm run lint         # ESLint
npm run analyze      # Analisar bundle
```

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Add: nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Padrões de Commit

```bash
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
```

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Suporte

- **Email**: suporte@exxquema.bar
- **WhatsApp**: (21) 99999-9999
- **Documentação**: [docs.exxquema.bar](https://docs.exxquema.bar)

---

## 🙏 Agradecimentos

- **Equipe Exxquema** - Conceito e visão do produto
- **Comunidade Open Source** - Bibliotecas incríveis
- **Beta Testers** - Feedback valioso

---

<div align="center">

**Feito com ❤️ pela equipe Exxquema**

[🌟 Dar uma estrela](https://github.com/seu-usuario/exxquema) • [🐛 Reportar bug](https://github.com/seu-usuario/exxquema/issues) • [💡 Sugerir funcionalidade](https://github.com/seu-usuario/exxquema/issues)

</div>