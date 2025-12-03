# 🚀 Guia de Deploy EXXQUEMA

## ✅ Preparação Concluída!

Seu projeto está pronto para deploy. Siga os passos abaixo:

---

## 📦 Opção 1: Deploy na VERCEL (Recomendado - GRATUITO)

### Passo 1: Criar conta na Vercel
1. Acesse: https://vercel.com/signup
2. Crie conta com GitHub, GitLab ou email
3. É **100% gratuito** para projetos pessoais

### Passo 2: Fazer Deploy
Você tem **3 opções**:

#### **Opção A: Deploy via GitHub (Mais Fácil)**
1. Crie uma conta no GitHub: https://github.com/signup
2. Crie um novo repositório vazio
3. No terminal, execute:
   ```bash
   cd D:\exxquema
   git remote add origin https://github.com/SEU_USUARIO/exxquema.git
   git push -u origin main
   ```
4. Na Vercel:
   - Clique em "Add New Project"
   - Conecte com GitHub
   - Selecione o repositório "exxquema"
   - Root Directory: `frontend`
   - Clique "Deploy"

#### **Opção B: Deploy via Vercel CLI**
1. Instale a CLI da Vercel:
   ```bash
   npm install -g vercel
   ```
2. Faça login:
   ```bash
   vercel login
   ```
3. Deploy:
   ```bash
   cd D:\exxquema\frontend
   vercel --prod
   ```

#### **Opção C: Deploy Manual (Upload ZIP)**
1. Na Vercel, clique em "Add New Project"
2. Escolha "Import Third-Party Git Repository"
3. Faça upload da pasta `frontend` como ZIP
4. Configure Root Directory: `.` (ponto)
5. Clique "Deploy"

### Passo 3: Configurar Variáveis de Ambiente
Na Vercel, vá em:
1. **Settings** → **Environment Variables**
2. Adicione:
   ```
   NEXT_PUBLIC_API_URL = http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL = http://localhost:5000
   ```
   ⚠️ **Nota**: O backend ainda estará rodando local. Para produção completa, você precisará fazer deploy do backend também.

### ✅ Resultado
Após o deploy, você receberá um link como:
```
https://exxquema.vercel.app
```

**Compartilhe este link com seus investidores!** 🎉

---

## 📦 Opção 2: Deploy na NETLIFY (Alternativa GRATUITA)

### Passo 1: Criar conta
1. Acesse: https://netlify.com/signup
2. Crie conta (gratuito)

### Passo 2: Deploy
1. Arraste a pasta `frontend` para o Netlify Drop
2. Ou conecte com GitHub (mesmo processo da Vercel)

### Configurações:
- **Build command**: `npm run build`
- **Publish directory**: `.next`

---

## 🖥️ Opção 3: Usar Ngrok para Testar Local (Temporário)

Se você quiser mostrar **agora mesmo** sem fazer deploy:

### Passo 1: Instalar Ngrok
1. Baixe: https://ngrok.com/download
2. Descompacte e execute

### Passo 2: Criar túnel
```bash
ngrok http 3000
```

### Resultado
Você receberá um link público temporário:
```
https://abc123.ngrok.io → http://localhost:3000
```

⚠️ **Atenção**:
- Link expira quando você fechar o ngrok
- Grátis tem limitações
- Apenas para demonstrações rápidas

---

## 🔥 Minha Recomendação

**Para seus investidores, use a VERCEL:**

1. ✅ Gratuito permanente
2. ✅ Link profissional (exxquema.vercel.app)
3. ✅ Deploy automático a cada atualização
4. ✅ HTTPS incluído
5. ✅ CDN global (site rápido no mundo todo)
6. ✅ Pode adicionar domínio customizado depois (exxquema.com.br)

---

## 📊 Status Atual do Projeto

### ✅ Funcional:
- Interface completa (home, cardápio, programação, checkout)
- Sistema de pedidos
- Painéis de cozinha e atendente
- Real-time com Socket.IO
- PWA (instalável como app)
- Carrinho de compras
- Sistema de autenticação

### ⚠️ Backend Local:
- O backend está configurado para `localhost:5000`
- Quando os investidores acessarem, verão erro de conexão nas APIs
- Solução: Mock data está configurado como fallback

### 🔄 Para Deploy Completo (Backend):

**Opção A: Railway (Recomendado - Grátis)**
1. Acesse: https://railway.app
2. Conecte com GitHub
3. Deploy da pasta `backend`
4. Copie a URL gerada
5. Atualize as variáveis de ambiente na Vercel

**Opção B: Render (Grátis)**
1. Acesse: https://render.com
2. Deploy do backend
3. Configure variáveis de ambiente

---

## 🎯 Plano de Ação Imediato

### Para demonstração AGORA:
```bash
# Terminal 1: Já está rodando
cd D:\exxquema\frontend
npm run dev

# Terminal 2: Ngrok
ngrok http 3000
```
**→ Envie o link do ngrok para investidores**

### Para deployment profissional (30 minutos):
1. Criar conta GitHub
2. Fazer push do código
3. Conectar Vercel com GitHub
4. Deploy automático
**→ Link permanente para investidores**

---

## 📞 Links Úteis

- **Vercel**: https://vercel.com
- **Netlify**: https://netlify.com
- **Ngrok**: https://ngrok.com
- **Railway** (backend): https://railway.app
- **Render** (backend): https://render.com

---

## 🎉 Próximos Passos

Após deploy do frontend:

1. ☐ Deploy do backend (Railway/Render)
2. ☐ Conectar banco de dados PostgreSQL
3. ☐ Configurar domínio customizado
4. ☐ SSL/HTTPS (automático na Vercel)
5. ☐ Configurar emails (SendGrid)
6. ☐ Configurar pagamentos (Stripe)

---

**Seu projeto está PRONTO para impressionar investidores! 🚀**
