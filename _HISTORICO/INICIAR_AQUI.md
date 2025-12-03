# 🚀 EXXQUEMA - INICIAR SISTEMA

## ✅ ESTÁ TUDO PRONTO E FUNCIONANDO!

### 🎯 INICIAR O SISTEMA (3 PASSOS)

#### 1. Abrir Terminal
```bash
cd "D:\EXXQUEMA\red-light\frontend"
```

#### 2. Iniciar Servidor
```bash
npm run dev
```

#### 3. Acessar no Navegador
```
http://localhost:3001
```

---

## 🔐 CREDENCIAIS DE TESTE

### Admin
```
Email: admin@exxquema.com.br
Senha: 123456
```

### Cliente
```
Email: cliente@test.com
Senha: 123456
```

---

## 📍 PÁGINAS PRINCIPAIS

### Para Clientes
- **Home**: http://localhost:3001
- **Cardápio**: http://localhost:3001/cardapio (20 produtos!)
- **Login**: http://localhost:3001/login
- **Carrinho**: http://localhost:3001/carrinho

### Para Admin
- **Dashboard**: http://localhost:3001/admin
- **Pedidos**: http://localhost:3001/admin/orders
- **Produtos**: http://localhost:3001/admin/products
- **Mesas**: http://localhost:3001/admin/tables
- **Relatórios**: http://localhost:3001/admin/reports

---

## ✨ FUNCIONALIDADES DISPONÍVEIS

### ✅ Cardápio (FUNCIONANDO!)
- 20 produtos com imagens
- 8 categorias
- Busca por nome
- Filtros avançados
- Ordenação múltipla
- Paginação

### ✅ Login (FUNCIONANDO!)
- Autenticação com dados mockados
- Proteção de rotas
- Redirecionamento automático

### ✅ Admin Panel (FUNCIONANDO!)
- Dashboard com métricas
- Gestão de pedidos
- Gestão de produtos
- Gestão de mesas

### ✅ PWA (CONFIGURADO!)
- Service Worker
- Instalável como app
- Funciona offline (parcial)

---

## 🎨 DESIGN COMPLETO

### ✅ O que está implementado:
- ✅ **CSS Global** com Tailwind
- ✅ **Variáveis CSS** customizadas
- ✅ **Cores**: Vermelho #dc2626, Preto, Cinza
- ✅ **Tipografia**: System fonts otimizadas
- ✅ **Animações**: FadeIn, SlideIn, Pulse
- ✅ **Scrollbar customizada**
- ✅ **Loading states** com skeleton
- ✅ **Glass effect** backdrop blur
- ✅ **Cards** com hover effects
- ✅ **Botões** com transições
- ✅ **Forms** estilizados
- ✅ **Responsivo** mobile-first
- ✅ **Dark theme** completo

---

## 🔧 TOGGLE MOCK DATA

### Botão Flutuante (canto inferior direito)
- **Azul (Database)**: Usando dados mockados ✅
- **Verde (Globe)**: Usando API real

### Por padrão: MOCK DATA ATIVO
Você verá os 20 produtos funcionando sem precisar de backend!

---

## 🗂️ ESTRUTURA DE DADOS

### Produtos Mockados (20 itens)
```
├── Drinks Clássicos (4)
├── Drinks Especiais (2)
├── Petiscos (3)
├── Pratos Principais (2)
├── Sobremesas (2)
├── Bebidas sem Álcool (2)
├── Vinhos (2)
└── Cervejas Artesanais (3)
```

### Usuários de Teste
- 1 Admin
- 2 Clientes

### Mesas
- 8 mesas com QR codes

---

## 🎉 TESTE TUDO AGORA!

### Fluxo Completo de Teste:

1. **Acesse Home**
   - `http://localhost:3001`
   - Veja landing page

2. **Veja Cardápio**
   - Clique em "Ver Cardápio"
   - Veja 20 produtos
   - Teste busca e filtros

3. **Faça Login**
   - Clique em "Login"
   - Use: `admin@exxquema.com.br` / `123456`
   - Será redirecionado para admin

4. **Admin Dashboard**
   - Veja métricas mockadas
   - Navegue entre páginas

5. **Adicione ao Carrinho**
   - Volte ao cardápio
   - Adicione produtos
   - Veja carrinho funcionando

---

## 🐛 TROUBLESHOOTING

### Porta em uso?
```bash
# Sistema usa porta 3001 automaticamente
# Se precisar mudar porta 3000:
npx kill-port 3000
npm run dev
```

### Imagens não carregam?
```
Isso é normal! As imagens do Unsplash podem dar 404
O sistema funciona perfeitamente mesmo assim
```

### Dados não aparecem?
```bash
# Verifique se mock está ativo:
# Olhe o botão no canto inferior direito
# Deve estar AZUL (Mock Data)
```

### Cache antigo?
```bash
# Limpe cache:
Remove-Item -Recurse -Force .next
npm run dev
```

---

## 📚 DOCUMENTAÇÃO

### Arquivos Importantes:
- `SETUP_COMPLETO.md` - Guia detalhado completo
- `MOCK_DATA_README.md` - Sistema de dados mockados
- `README.md` - Documentação geral do projeto

---

## ✅ CHECKLIST IMPLEMENTADO

- ✅ Sistema rodando na porta 3001
- ✅ 20 produtos no cardápio
- ✅ Autenticação funcionando
- ✅ Design completo com Tailwind
- ✅ CSS global configurado
- ✅ PWA configurado
- ✅ Admin panel completo
- ✅ Carrinho de compras
- ✅ Toggle mock/API
- ✅ Documentação completa

---

## 🚀 PRONTO PARA USAR!

**Abra o terminal, rode `npm run dev` e divirta-se! 🍻**

Qualquer dúvida, consulte a documentação completa em:
- `D:\EXXQUEMA\red-light\SETUP_COMPLETO.md`