# 🚀 Deploy na Vercel - Passo a Passo (@leopalha)

## ✅ STATUS ATUAL
- ✅ Git inicializado e commit feito
- ✅ Conta GitHub conectada (@leopalha)
- ✅ Projeto pronto para deploy

---

## 📋 PASSO 1: Criar Repositório no GitHub

### 1.1 Acesse:
https://github.com/new

### 1.2 Preencha:
- **Repository name:** `exxquema`
- **Description:** "Plataforma PWA para Exxquema - Pub & Lounge Bar"
- **Visibility:** ✅ Public (ou Private se preferir)
- ⚠️ **NÃO marque** "Initialize this repository with README"
- ⚠️ **NÃO adicione** .gitignore ou license

### 1.3 Clique em:
**"Create repository"**

---

## 📋 PASSO 2: Fazer Push do Código

### 2.1 Copie e execute estes comandos NO TERMINAL:

```bash
cd D:\exxquema

git remote add origin https://github.com/leopalha/exxquema.git

git branch -M main

git push -u origin main
```

### 2.2 Se pedir autenticação:
- **Username:** leopalha
- **Password:** Use um Personal Access Token (não a senha)
  - Crie em: https://github.com/settings/tokens/new
  - Marque: `repo` (Full control of private repositories)
  - Copie o token gerado

### ✅ Após executar, você verá:
```
Enumerating objects: 297, done.
Writing objects: 100% (297/297), done.
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 📋 PASSO 3: Deploy na Vercel

### 3.1 Acesse a Vercel:
https://vercel.com/new

### 3.2 Na tela "Import Git Repository":
- Procure por: `leopalha/exxquema`
- Clique em **"Import"**

### 3.3 Configurações do Projeto:

#### Framework Preset:
- ✅ **Next.js** (detectado automaticamente)

#### Root Directory:
- ⚠️ **IMPORTANTE**: Clique em "Edit"
- Digite: `frontend`
- Confirme

#### Build Settings:
- **Build Command:** `npm run build` (deixe padrão)
- **Output Directory:** `.next` (deixe padrão)
- **Install Command:** `npm install` (deixe padrão)

#### Environment Variables:
Clique em "Add" e adicione:

1. **Name:** `NEXT_PUBLIC_API_URL`
   **Value:** `http://localhost:5000`

2. **Name:** `NEXT_PUBLIC_SOCKET_URL`
   **Value:** `http://localhost:5000`

### 3.4 Clique em:
**"Deploy"**

### ✅ Aguarde 2-3 minutos
A Vercel vai:
- ✅ Instalar dependências
- ✅ Buildar o projeto
- ✅ Fazer deploy

---

## 📋 PASSO 4: Configurar Domínio

### 4.1 Após deploy bem-sucedido:
Você verá: **"Your project has been successfully deployed!"**

### 4.2 Clique em:
**"Go to Dashboard"** → **"Settings"** → **"Domains"**

### 4.3 Adicionar domínio customizado:
- Digite: `exxquema`
- Clique "Add"
- Seu site ficará em: **https://exxquema.vercel.app**

---

## 🎉 PRONTO! SEU LINK PERMANENTE:

### https://exxquema.vercel.app

**Compartilhe com seus investidores!** 🚀

---

## 📱 VANTAGENS DO DEPLOY NA VERCEL

✅ **Link permanente** - Nunca expira
✅ **HTTPS automático** - Seguro por padrão
✅ **CDN global** - Rápido no mundo todo
✅ **Deploy automático** - A cada push no GitHub
✅ **Preview deploys** - Cada branch tem seu próprio link
✅ **Analytics incluído** - Veja quantas visitas teve
✅ **Domínio próprio** - Pode adicionar exxquema.com.br depois

---

## 🔄 ATUALIZAÇÕES FUTURAS

Quando você modificar o código:

```bash
cd D:\exxquema
git add .
git commit -m "Descrição da mudança"
git push
```

**A Vercel fará deploy automático!** ✅

---

## 🐛 TROUBLESHOOTING

### Erro: "authentication failed"
**Solução:**
1. Crie um Personal Access Token: https://github.com/settings/tokens/new
2. Marque `repo`
3. Use o token como senha

### Erro: "remote already exists"
**Solução:**
```bash
git remote remove origin
git remote add origin https://github.com/leopalha/exxquema.git
```

### Deploy falhou na Vercel
**Solução:**
- Verifique se Root Directory está como `frontend`
- Confira os logs de erro na Vercel
- Entre no canal #help da Vercel: https://vercel.com/help

---

## 📊 PRÓXIMOS PASSOS (OPCIONAL)

### 1. Deploy do Backend
Para funcionalidades completas (pedidos reais, banco de dados):
- Use Railway: https://railway.app
- Deploy da pasta `backend`
- Atualize as Environment Variables na Vercel

### 2. Domínio Personalizado
- Compre: exxquema.com.br
- Configure DNS no Registro.br
- Adicione na Vercel: Settings → Domains

### 3. Analytics
- Vercel Analytics (incluso grátis)
- Google Analytics (adicione tracking ID)

---

## ✅ CHECKLIST ANTES DE COMPARTILHAR

- [ ] Repositório criado no GitHub
- [ ] Código enviado (git push)
- [ ] Deploy realizado na Vercel
- [ ] Link funcionando: https://exxquema.vercel.app
- [ ] Testado no navegador
- [ ] Testado no celular
- [ ] Navegação ok
- [ ] Cardápio carregando

---

## 📧 MENSAGEM PARA INVESTIDORES

**Assunto:** Plataforma EXXQUEMA - Versão Online

Prezado(a),

A plataforma EXXQUEMA está no ar! 🚀

🔗 **Acesse:** https://exxquema.vercel.app

**Funcionalidades:**
- ✅ Cardápio digital completo
- ✅ Sistema de pedidos
- ✅ Programação de eventos
- ✅ Painéis administrativos
- ✅ PWA (instalável como app)

**Credenciais de teste:**
- Email: admin@exxquema.com
- Senha: admin123

Aguardo seu feedback!

Atenciosamente,
[Seu nome]

---

**Qualquer dúvida, estou à disposição!** 💪
