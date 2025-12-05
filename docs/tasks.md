# FLAME - TASKS & SPRINT PLANNING

## LEGENDA DE STATUS

- [ ] Nao iniciado
- [~] Em andamento
- [x] Concluido
- [!] Bloqueado
- [-] Pausado

---

## SPRINT 20 - GOOGLE OAUTH IMPLEMENTATION (05/12/2024)

**Objetivo:** Implementar autenticação com Google OAuth 2.0 para cadastro e login

**Prioridade:** P0 (Alta) - Feature de acessibilidade crítica
**Estimativa:** 2-3 dias
**Responsável:** Claude + Leo
**Doc Referência:** [GOOGLE_OAUTH_IMPLEMENTATION_PLAN.md](GOOGLE_OAUTH_IMPLEMENTATION_PLAN.md)

---

### FASE 1: PREPARAÇÃO E CONFIGURAÇÃO

**[ ] 1.1 Criar Projeto no Google Cloud Console**
- [ ] Acessar https://console.cloud.google.com/
- [ ] Criar novo projeto "FLAME Lounge" ou usar existente
- [ ] Ativar "Google+ API"
- [ ] Ir em "Credentials" > "Create Credentials"
- [ ] Configurar OAuth 2.0 Client ID:
  - Application Type: Web Application
  - Name: FLAME OAuth Client
  - Authorized JavaScript origins:
    - `http://localhost:3000` (dev)
    - `https://flame-lounge.vercel.app` (prod)
  - Authorized redirect URIs:
    - `http://localhost:3000` (dev)
    - `https://flame-lounge.vercel.app` (prod)
- [ ] Copiar Client ID
- [ ] Copiar Client Secret

**Dependências:** Nenhuma
**Bloqueadores:** Acesso ao Google Cloud Console
**Tempo Estimado:** 30min

---

### FASE 2: BACKEND - MODELO E SERVIÇOS

**[ ] 2.1 Instalar Dependências**
```bash
cd backend
npm install google-auth-library
```
**Arquivo:** `backend/package.json`
**Tempo Estimado:** 5min

**[ ] 2.2 Adicionar Campos ao Modelo User**
- [ ] Abrir `backend/src/models/User.js`
- [ ] Adicionar campos:
  ```javascript
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: 'ID único do Google OAuth'
  },
  googleProfilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL da foto de perfil do Google'
  },
  authProvider: {
    type: DataTypes.TEXT,
    defaultValue: 'local',
    allowNull: false,
    validate: {
      isIn: [['local', 'google']]
    },
    comment: 'Provedor de autenticação utilizado'
  }
  ```
- [ ] Atualizar método `hasCompleteProfile()`:
  ```javascript
  hasCompleteProfile() {
    if (this.authProvider === 'google') {
      return !!(this.nome && this.email && this.googleId);
    }
    return !!(this.nome && this.email && this.profileComplete);
  }
  ```

**Arquivo:** `backend/src/models/User.js`
**Linhas:** ~220-240
**Tempo Estimado:** 15min

**[ ] 2.3 Criar Google Service**
- [ ] Criar arquivo `backend/src/services/google.service.js`
- [ ] Implementar classe GoogleService:
  ```javascript
  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  class GoogleService {
    async verifyToken(token) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        return {
          sub: payload.sub,
          email: payload.email,
          email_verified: payload.email_verified,
          name: payload.name,
          picture: payload.picture,
          given_name: payload.given_name,
          family_name: payload.family_name
        };
      } catch (error) {
        throw new Error('Token do Google inválido');
      }
    }
  }

  module.exports = new GoogleService();
  ```

**Arquivo:** `backend/src/services/google.service.js` (NOVO)
**Tempo Estimado:** 10min

**Dependências:** 2.1 instalação concluída
**Bloqueadores:** Nenhum

---

### FASE 3: BACKEND - CONTROLLER E ROTAS

**[ ] 3.1 Adicionar Método googleAuth no AuthController**
- [ ] Abrir `backend/src/controllers/authController.js`
- [ ] Adicionar método após `completeProfile`:
  ```javascript
  async googleAuth(req, res) {
    try {
      const { credential } = req.body;
      console.log('🔐 GOOGLE AUTH:', { credentialLength: credential.length });

      // 1. Validar token com Google
      const googleUser = await googleService.verifyToken(credential);
      const { sub: googleId, email, name, picture } = googleUser;

      console.log('✅ GOOGLE USER:', { googleId, email, name });

      // 2. Buscar usuário por googleId OU email
      let user = await User.findOne({
        where: {
          [Op.or]: [{ googleId }, { email }]
        }
      });

      let isNewUser = false;

      // 3. SE NÃO EXISTIR: Criar novo
      if (!user) {
        console.log('📝 Criando novo usuário via Google');
        user = await User.create({
          googleId,
          email,
          nome: name,
          googleProfilePicture: picture,
          authProvider: 'google',
          profileComplete: true,
          phoneVerified: false,
          emailVerified: true,
          role: 'cliente'
        });
        isNewUser = true;
      }
      // 4. SE EXISTIR MAS SEM GOOGLE_ID: Vincular conta
      else if (!user.googleId) {
        console.log('🔗 Vinculando conta Google a usuário existente');
        await user.update({
          googleId,
          googleProfilePicture: picture,
          authProvider: 'google'
        });
      }

      // 5. Gerar JWT
      const token = generateToken(user.id);

      // 6. Atualizar último login
      await user.update({ lastLogin: new Date() });

      console.log('✅ GOOGLE AUTH SUCCESS:', { userId: user.id, isNewUser });

      // 7. Retornar
      res.status(200).json({
        success: true,
        message: isNewUser ? 'Cadastro realizado com sucesso!' : 'Login realizado com sucesso',
        data: {
          user: user.toJSON(),
          token,
          isNewUser,
          needsPhone: !user.celular
        }
      });
    } catch (error) {
      console.error('❌ GOOGLE AUTH ERROR:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao autenticar com Google',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  ```
- [ ] Adicionar import do googleService no topo:
  ```javascript
  const googleService = require('../services/google.service');
  ```

**Arquivo:** `backend/src/controllers/authController.js`
**Linha:** Após método `completeProfile` (~920)
**Tempo Estimado:** 20min

**[ ] 3.2 Adicionar Rota POST /auth/google**
- [ ] Abrir `backend/src/routes/auth.js`
- [ ] Adicionar rota após `/complete-profile`:
  ```javascript
  /**
   * @route   POST /api/auth/google
   * @desc    Autenticar/Cadastrar com Google OAuth 2.0
   * @access  Public
   * @body    { credential: string (JWT) }
   */
  router.post('/google', authController.googleAuth);
  ```

**Arquivo:** `backend/src/routes/auth.js`
**Linha:** Após rota `/complete-profile` (~91)
**Tempo Estimado:** 5min

**Dependências:** 2.3, 3.1 concluídos
**Bloqueadores:** Nenhum

---

### FASE 4: FRONTEND - GOOGLE SDK E COMPONENTE

**[ ] 4.1 Carregar Google Identity Services no _app.js**
- [ ] Abrir `frontend/src/pages/_app.js`
- [ ] Adicionar Script tag antes do Component:
  ```javascript
  import Script from 'next/script';

  // ...no return
  <>
    {/* Google Identity Services */}
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="beforeInteractive"
    />

    <Component {...pageProps} />
  </>
  ```

**Arquivo:** `frontend/src/pages/_app.js`
**Tempo Estimado:** 5min

**[ ] 4.2 Criar Componente GoogleLoginButton**
- [ ] Criar arquivo `frontend/src/components/GoogleLoginButton.js`
- [ ] Implementar componente:
  ```javascript
  import { useEffect, useRef } from 'react';
  import { useAuthStore } from '../stores/authStore';

  export default function GoogleLoginButton({ text = 'continue_with' }) {
    const { googleLogin } = useAuthStore();
    const buttonRef = useRef(null);

    useEffect(() => {
      if (typeof window === 'undefined' || !window.google) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          theme: 'filled_black',
          size: 'large',
          text: text,
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 320
        }
      );
    }, []);

    const handleCredentialResponse = async (response) => {
      console.log('📱 Google Credential recebido');
      await googleLogin(response.credential);
    };

    return (
      <div className="flex justify-center">
        <div ref={buttonRef} />
      </div>
    );
  }
  ```

**Arquivo:** `frontend/src/components/GoogleLoginButton.js` (NOVO)
**Tempo Estimado:** 10min

**Dependências:** 4.1 concluído
**Bloqueadores:** Nenhum

---

### FASE 5: FRONTEND - AUTHSTORE E INTEGRAÇÃO

**[ ] 5.1 Adicionar googleLogin() no authStore**
- [ ] Abrir `frontend/src/stores/authStore.js`
- [ ] Adicionar método após `completeProfile()`:
  ```javascript
  googleLogin: async (credential) => {
    set({ isLoading: true });
    try {
      console.log('🔐 GOOGLE LOGIN:', { credentialLength: credential.length });

      const response = await api.post('/auth/google', { credential });

      console.log('✅ GOOGLE LOGIN RESPONSE:', response.data);

      if (response.data.success) {
        const { user, token, isNewUser, needsPhone } = response.data.data;

        // Salvar no estado
        set({
          user,
          token,
          isAuthenticated: true
        });

        // Configurar token na API
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Mensagem de sucesso
        if (isNewUser) {
          toast.success('Bem-vindo ao FLAME! 🔥');

          if (needsPhone) {
            toast('Adicione seu celular para receber atualizações por SMS', {
              icon: '📱',
              duration: 5000
            });
          }
        } else {
          toast.success('Login realizado com sucesso!');
        }

        return { success: true, user, isNewUser };
      } else {
        toast.error(response.data.message || 'Erro no login com Google');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('❌ GOOGLE LOGIN ERROR:', error.response?.data);
      const message = error.response?.data?.message || 'Erro ao fazer login com Google';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      set({ isLoading: false });
    }
  }
  ```

**Arquivo:** `frontend/src/stores/authStore.js`
**Linha:** Após método `completeProfile` (~692)
**Tempo Estimado:** 15min

**[ ] 5.2 Adicionar GoogleLoginButton na página login**
- [ ] Abrir `frontend/src/pages/login.js`
- [ ] Import GoogleLoginButton:
  ```javascript
  import GoogleLoginButton from '../components/GoogleLoginButton';
  ```
- [ ] Adicionar botão antes do formulário de login:
  ```jsx
  <div className="mb-6">
    <GoogleLoginButton text="signin_with" />

    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-purple-300/30"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-slate-950 text-purple-300">ou</span>
      </div>
    </div>
  </div>
  ```

**Arquivo:** `frontend/src/pages/login.js`
**Tempo Estimado:** 10min

**[ ] 5.3 Adicionar GoogleLoginButton na página register**
- [ ] Abrir `frontend/src/pages/register.js`
- [ ] Import GoogleLoginButton:
  ```javascript
  import GoogleLoginButton from '../components/GoogleLoginButton';
  ```
- [ ] Adicionar botão antes do formulário:
  ```jsx
  <div className="mb-6">
    <GoogleLoginButton text="signup_with" />

    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-purple-300/30"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-slate-950 text-purple-300">ou</span>
      </div>
    </div>
  </div>
  ```

**Arquivo:** `frontend/src/pages/register.js`
**Tempo Estimado:** 10min

**Dependências:** 4.2, 5.1 concluídos
**Bloqueadores:** Nenhum

---

### FASE 6: VARIÁVEIS DE AMBIENTE

**[ ] 6.1 Configurar Backend (.env)**
- [ ] Abrir `backend/.env` (ou criar)
- [ ] Adicionar variáveis:
  ```bash
  # Google OAuth Configuration
  GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=your-google-client-secret
  ```
- [ ] Substituir valores pelas credenciais da Fase 1

**Arquivo:** `backend/.env`
**Tempo Estimado:** 2min

**[ ] 6.2 Configurar Frontend (.env.production)**
- [ ] Abrir `frontend/.env.production`
- [ ] Adicionar variável:
  ```bash
  # Google OAuth
  NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
  ```
- [ ] Substituir valor pelo Client ID da Fase 1

**Arquivo:** `frontend/.env.production`
**Tempo Estimado:** 2min

**[ ] 6.3 Configurar Frontend (.env.local) para Dev**
- [ ] Copiar `.env.production` para `.env.local`
- [ ] Manter mesmas variáveis

**Arquivo:** `frontend/.env.local`
**Tempo Estimado:** 1min

**[ ] 6.4 Atualizar Backend .env.example**
- [ ] Abrir `backend/.env.example`
- [ ] Adicionar seção Google OAuth após Twilio:
  ```bash
  # ============================================
  # Google OAuth Configuration
  # ============================================
  # Get credentials at: https://console.cloud.google.com/
  GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=your-google-client-secret
  ```

**Arquivo:** `backend/.env.example`
**Tempo Estimado:** 2min

**Dependências:** Fase 1 concluída
**Bloqueadores:** Credenciais do Google

---

### FASE 7: DEPLOY E CONFIGURAÇÃO

**[ ] 7.1 Atualizar Variáveis no Railway**
- [ ] Acessar Railway dashboard
- [ ] Ir em Variables do service backend
- [ ] Adicionar:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
- [ ] Salvar e aguardar redeploy

**Plataforma:** Railway
**Tempo Estimado:** 5min

**[ ] 7.2 Atualizar Variáveis no Vercel**
- [ ] Acessar Vercel dashboard
- [ ] Ir em Environment Variables do projeto flame
- [ ] Adicionar:
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (Production + Preview)
- [ ] Salvar

**Plataforma:** Vercel
**Tempo Estimado:** 5min

**[ ] 7.3 Deploy Backend**
```bash
cd backend
railway up
```

**Tempo Estimado:** 3min

**[ ] 7.4 Deploy Frontend**
```bash
cd frontend
npx vercel --prod
```

**Tempo Estimado:** 3min

**Dependências:** Todas as fases anteriores
**Bloqueadores:** Credenciais configuradas

---

### FASE 8: TESTES E VALIDAÇÃO

**[ ] 8.1 Teste: Novo Usuário via Google**
- [ ] Acessar `/login` em produção
- [ ] Clicar "Entrar com Google"
- [ ] Escolher conta Google (nova, sem cadastro prévio)
- [ ] Verificar:
  - ✅ Usuário criado automaticamente
  - ✅ `profileComplete = true`
  - ✅ Redireciona para `/cardapio`
  - ✅ Pode fazer pedido imediatamente
  - ✅ Toast: "Bem-vindo ao FLAME! 🔥"
  - ✅ Toast secundário: "Adicione celular..."

**Cenário:** Primeiro acesso
**Tempo Estimado:** 5min

**[ ] 8.2 Teste: Login Google com Conta Existente**
- [ ] Fazer logout
- [ ] Fazer login Google com mesma conta do teste anterior
- [ ] Verificar:
  - ✅ Login bem-sucedido
  - ✅ Mesmo usuário retornado (não cria duplicado)
  - ✅ Toast: "Login realizado com sucesso"
  - ✅ Mantém dados anteriores

**Cenário:** Segundo acesso
**Tempo Estimado:** 3min

**[ ] 8.3 Teste: Vinculação de Contas (Email Duplicado)**
- [ ] Criar conta tradicional com email X
- [ ] Fazer logout
- [ ] Fazer login Google com mesmo email X
- [ ] Verificar:
  - ✅ Vincula `googleId` ao usuário existente
  - ✅ Não cria usuário duplicado
  - ✅ Mantém dados originais (celular, pedidos, etc)
  - ✅ `authProvider` atualizado para 'google'

**Cenário:** Unificação de contas
**Tempo Estimado:** 5min

**[ ] 8.4 Teste: Fazer Pedido após Login Google**
- [ ] Login com Google
- [ ] Acessar `/cardapio`
- [ ] Adicionar itens ao carrinho
- [ ] Ir para checkout
- [ ] Confirmar pedido
- [ ] Verificar:
  - ✅ Pedido criado com sucesso
  - ✅ Não exige completar perfil
  - ✅ Aparece na fila da cozinha/bar

**Cenário:** Fluxo completo de pedido
**Tempo Estimado:** 5min

**[ ] 8.5 Teste: Adicionar Celular Posteriormente**
- [ ] Login com Google (sem celular)
- [ ] Acessar `/perfil`
- [ ] Adicionar número de celular
- [ ] Verificar SMS de confirmação (futuro)
- [ ] Verificar:
  - ✅ Celular salvo no perfil
  - ✅ `phoneVerified` pode ser atualizado

**Cenário:** Opcional - complementar perfil
**Tempo Estimado:** 3min

**[ ] 8.6 Teste: Console de Erros**
- [ ] Verificar console do navegador (F12)
- [ ] Verificar logs do Railway
- [ ] Confirmar:
  - ✅ Sem erros JavaScript
  - ✅ Sem erros 500 no backend
  - ✅ Logs de debug aparecem corretamente

**Cenário:** Validação técnica
**Tempo Estimado:** 3min

---

## CHECKLIST FINAL

### Backend
- [ ] `google-auth-library` instalado
- [ ] Modelo User com 3 campos novos
- [ ] `google.service.js` criado
- [ ] Método `googleAuth()` no authController
- [ ] Rota `POST /auth/google` criada
- [ ] Variáveis `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` configuradas
- [ ] Deploy no Railway concluído

### Frontend
- [ ] Google SDK carregado no `_app.js`
- [ ] `GoogleLoginButton.js` criado
- [ ] Método `googleLogin()` no authStore
- [ ] Botão Google na página `/login`
- [ ] Botão Google na página `/register`
- [ ] Variável `NEXT_PUBLIC_GOOGLE_CLIENT_ID` configurada
- [ ] Deploy no Vercel concluído

### Testes
- [ ] Novo usuário via Google
- [ ] Login usuário existente
- [ ] Vinculação de contas
- [ ] Fazer pedido após login
- [ ] Adicionar celular posteriormente
- [ ] Sem erros no console

### Documentação
- [x] PRD atualizado (seção 2.1.1)
- [x] USER_FLOWS atualizado (fluxo 1.1.4)
- [x] GOOGLE_OAUTH_IMPLEMENTATION_PLAN.md criado
- [ ] Testar e validar implementação

---

## NOTAS IMPORTANTES

### Segurança
- ✅ Token Google validado no backend (nunca confiar no frontend)
- ✅ JWT gerado após validação bem-sucedida
- ✅ Usuário criado com `profileComplete = true` automaticamente
- ✅ Celular opcional (pode adicionar depois)

### Compatibilidade
- ✅ Sistema de `profileComplete` continua funcionando
- ✅ Usuários Google têm acesso total imediato
- ✅ Usuários phone-only ainda precisam completar perfil
- ✅ Middleware `requireCompleteProfile` compatível

### Próximos Passos (Futuro)
- [ ] Apple Sign In (similar ao Google)
- [ ] Facebook Login
- [ ] Login com WhatsApp
- [ ] Two-Factor Authentication (2FA)

---

**Data Criação:** 05/12/2024
**Última Atualização:** 05/12/2024
**Status Sprint:** [ ] Não Iniciado
