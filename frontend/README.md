# 🍻 FLAME - Frontend PWA

**Progressive Web App para FLAME Bar & Lounge**

Uma aplicação moderna para bar e lounge em Botafogo/RJ, oferecendo experiência digital completa para clientes e administradores.

## 📱 Funcionalidades

### Para Clientes
- **Cardápio Digital**: Navegação intuitiva por categorias
- **Carrinho de Compras**: Sistema completo de pedidos
- **Autenticação**: Login via SMS ou email/senha
- **Offline-First**: Funciona mesmo sem internet
- **PWA**: Instalável como app nativo
- **Push Notifications**: Atualizações sobre pedidos

### Para Administradores
- **Dashboard Completo**: Métricas em tempo real
- **Gestão de Pedidos**: Controle total dos status
- **Catálogo de Produtos**: CRUD completo
- **Controle de Mesas**: Status visual e QR codes
- **Relatórios Avançados**: Analytics com exportação

## 🚀 Tecnologias

### Core
- **Next.js 14**: Framework React full-stack
- **React 18**: Biblioteca principal
- **TypeScript**: Tipagem estática
- **TailwindCSS**: Framework CSS utilitário

### PWA & Performance
- **next-pwa**: Service Worker automático
- **Framer Motion**: Animações suaves
- **Sharp**: Otimização de imagens

### Estado e Dados
- **Zustand**: Gerenciamento de estado global
- **React Query**: Cache e sincronização de dados
- **Axios**: Cliente HTTP
- **Socket.io**: Comunicação em tempo real

### UI/UX
- **Heroicons**: Ícones
- **React Hot Toast**: Notificações
- **React Hook Form**: Formulários
- **React Input Mask**: Máscaras de input

### Integração
- **Stripe**: Pagamentos
- **Twilio**: SMS/WhatsApp
- **Push Notifications**: Web Push API

## 📦 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.js       # Layout principal
│   ├── Header.js       # Cabeçalho
│   ├── Footer.js       # Rodapé
│   ├── ProductCard.js  # Card de produto
│   ├── PWAInstallBanner.js    # Banner instalação PWA
│   └── PWANotifications.js    # Notificações PWA
├── pages/              # Páginas da aplicação
│   ├── index.js        # Página inicial
│   ├── cardapio.js     # Cardápio digital
│   ├── carrinho.js     # Carrinho de compras
│   ├── login.js        # Autenticação
│   ├── register.js     # Cadastro
│   ├── offline.js      # Página offline
│   └── admin/          # Painel administrativo
│       ├── index.js    # Dashboard
│       ├── orders.js   # Gestão de pedidos
│       ├── products.js # Gestão de produtos
│       ├── tables.js   # Gestão de mesas
│       └── reports.js  # Relatórios
├── stores/             # Stores Zustand
│   ├── authStore.js    # Autenticação
│   ├── cartStore.js    # Carrinho
│   └── productStore.js # Produtos
├── hooks/              # Hooks personalizados
│   ├── index.js        # Exports centralizados
│   ├── usePWA.js       # Hook PWA
│   └── ...             # Outros hooks
├── services/           # Serviços
│   └── api.js          # Cliente API
├── utils/              # Utilitários
│   └── format.js       # Formatação
└── styles/             # Estilos globais
```

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js ≥ 18.0.0
- npm ≥ 8.0.0

### Instalação
```bash
# Clone o repositório
git clone [repo-url]
cd red-light/frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas configurações
```

### Desenvolvimento
```bash
# Servidor de desenvolvimento
npm run dev

# Acesse: http://localhost:3000
```

### Produção
```bash
# Build para produção
npm run build

# Servidor de produção
npm start
```

### Scripts Adicionais
```bash
# Análise do bundle
npm run analyze

# Lint do código
npm run lint

# Exportação estática
npm run export
```

## 🌐 PWA (Progressive Web App)

### Recursos PWA Implementados
- **Service Worker**: Cache inteligente e offline-first
- **Web App Manifest**: Instalação nativa
- **Push Notifications**: Notificações em tempo real
- **Background Sync**: Sincronização offline
- **Add to Home Screen**: Prompt de instalação
- **Offline Fallback**: Página offline personalizada

### Cache Strategy
- **Static Assets**: Cache-First (longa duração)
- **API Data**: Network-First com fallback
- **Pages**: Stale-While-Revalidate
- **Images**: Lazy loading com cache

## 📊 Performance

### Otimizações Implementadas
- **Code Splitting**: Carregamento sob demanda
- **Image Optimization**: Next.js Image + Sharp
- **Tree Shaking**: Eliminação de código não usado
- **Compression**: Gzip/Brotli automático
- **Preloading**: Recursos críticos
- **Lazy Loading**: Componentes e imagens

### Métricas Alvo
- **FCP**: < 1.5s (First Contentful Paint)
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

## 🔐 Segurança

### Medidas Implementadas
- **CSP Headers**: Content Security Policy
- **XSS Protection**: Cross-site scripting
- **CSRF Protection**: Cross-site request forgery
- **Input Validation**: Sanitização de dados
- **Authentication**: JWT + Refresh tokens
- **HTTPS Only**: Redirecionamento automático

## 🎨 Design System

### Paleta de Cores
- **Primary**: Red #dc2626 (Red-600)
- **Background**: Black #000000
- **Surface**: Gray #111827 (Gray-900)
- **Text**: White #ffffff
- **Accent**: Red variants

### Tipografia
- **Primary**: System fonts (optimized)
- **Headings**: Font weight 700-900
- **Body**: Font weight 400-500

### Componentes
- **Consistent spacing**: 4px grid system
- **Rounded corners**: 8px/12px/16px
- **Shadows**: Depth layers
- **Animations**: Smooth transitions

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (xl/2xl)

### Adaptive Design
- **Mobile-first**: Design responsivo
- **Touch-friendly**: Elementos tocáveis
- **Performance**: Otimizado para mobile
- **Accessibility**: WCAG 2.1 AA

## 🧪 Testes

### Estratégia de Testes
- **Unit Tests**: Jest + Testing Library
- **Integration Tests**: Cypress
- **E2E Tests**: Playwright
- **Performance**: Lighthouse CI
- **Accessibility**: axe-core

## 📈 Analytics

### Métricas Implementadas
- **Core Web Vitals**: Performance automática
- **User Interactions**: Cliques e navegação
- **PWA Install**: Taxa de instalação
- **Conversion**: Funil de pedidos
- **Error Tracking**: Sentry integration

## 🚀 Deploy

### Ambientes
- **Development**: Vercel preview
- **Staging**: Pre-production tests
- **Production**: CDN + Edge functions

### CI/CD Pipeline
- **GitHub Actions**: Build e deploy automático
- **Quality Gates**: Tests + lint + security
- **Performance Budget**: Lighthouse checks
- **Rollback**: Deploy seguro com rollback

## 📞 Suporte

### Contato
- **Email**: suporte@FLAME.com.br
- **WhatsApp**: +55 21 99999-9999
- **Site**: https://FLAME.com.br

### Documentação
- **API Docs**: /docs/api
- **Components**: Storybook
- **Changelog**: CHANGELOG.md

## 📄 Licença

Este projeto é propriedade do FLAME Bar & Lounge.
Todos os direitos reservados © 2024.

---

**Desenvolvido com ❤️ para revolucionar a experiência de bar digital**
