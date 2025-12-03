# 🔍 DEBUG LOGIN

## Teste Manual

1. Abra http://localhost:3000/login
2. Abra o Console do navegador (F12)
3. Digite:

```javascript
// Importar o store
const { useAuthStore } = require('./src/stores/authStore');

// Obter funções
const { loginWithPassword } = useAuthStore.getState();

// Testar login
loginWithPassword('cliente@test.com', '123456').then(result => {
  console.log('Resultado:', result);
});
```

## Credenciais de Teste

### Email/Senha:
- `cliente@test.com` / `123456`
- `admin@admin.com` / `admin123`

### SMS:
- Celular: `(21) 99999-1234`
- Código: `123456` (qualquer código de 6 dígitos)

## Verificar o que acontece:

1. O botão está funcionando?
2. Aparece "Email ou senha incorretos"?
3. Aparece "Erro de conexão"?
4. O que mostra no console (F12 > Console)?
