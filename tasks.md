# FLAME - Tasks e Planejamento

## Sprint 62 - Sistema de Delivery e Melhorias

### Status Atual

#### Concluido nesta sessao:
- [x] Fix notificacoes sobrepondo header na pagina inicial
- [x] OrderTracker mostra status "entregue" com verde e solicita avaliacao
- [x] Botao Reservas no admin agora vai para /admin/reservas (correto)
- [x] Sistema de chat - tabela Message agora sincroniza corretamente
- [x] Narguilé - status preparing/ready implementados com botoes no atendente

#### Pendente:
- [ ] Admin Socket.IO real-time sync
- [ ] Admin receita/vendas nao calculando corretamente
- [ ] Admin produtos - criar/listar/editar nao funciona
- [ ] Sistema de Delivery completo

---

## PLANEJAMENTO: Sistema de Delivery

### Contexto
O usuario deseja implementar delivery mas preferiu usar iFood como parceiro em vez de desenvolver sistema proprio com endereco/motoboy.

### Opcoes Analisadas:

#### Opcao 1: Integracao com iFood (RECOMENDADA)
**Pros:**
- Nao precisa de motoboy proprio
- iFood gerencia toda logistica
- Maior alcance de clientes
- Sistema ja pronto

**Contras:**
- Taxa do iFood (12-27%)
- Dependencia de terceiros
- Menos controle sobre experiencia

**Implementacao:**
1. Cadastrar restaurante no iFood Parceiros
2. Usar API do iFood para:
   - Receber pedidos
   - Sincronizar cardapio
   - Atualizar status
3. No FLAME, quando cliente selecionar "Delivery":
   - Mostrar mensagem: "Delivery via iFood"
   - Redirecionar para app/site do iFood
   - OU abrir iFood com deep link para o restaurante

**API iFood:** https://developer.ifood.com.br/
- Requer cadastro como parceiro
- Acesso via OAuth 2.0
- Endpoints para: menu, orders, merchant

#### Opcao 2: Sistema Proprio (NAO RECOMENDADA POR HORA)
Requer muito desenvolvimento:
- Cadastro de endereco no perfil
- Validacao de area de entrega
- Calculo de taxa de entrega
- Gestao de motoboys
- Rastreamento em tempo real
- Pagamento online

### Decisao: Usar iFood como Parceiro

### Proximos Passos para iFood:
1. **Cadastrar no iFood Parceiros** (manual, fora do sistema)
2. **Obter credenciais da API** (client_id, client_secret)
3. **Implementar no FLAME:**
   - Botao "Pedir via Delivery" no cardapio
   - Deep link para iFood: `ifood://restaurant/SLUG_DO_RESTAURANTE`
   - Ou URL web: `https://www.ifood.com.br/delivery/CIDADE/RESTAURANTE/ID`

4. **Webhook para receber pedidos do iFood** (opcional futuro)
   - Integrar pedidos do iFood no painel admin
   - Unificar dashboard

### Implementacao Minima (Sem API):
```javascript
// No checkout, se tipo for delivery:
const handleDelivery = () => {
  // URL do restaurante no iFood
  const ifoodUrl = 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/flame-lounge-bar-botafogo/ID_RESTAURANTE';

  // Tentar abrir app, senao abre web
  window.location.href = ifoodUrl;
};
```

---

## Outras Melhorias Pendentes

### Admin Real-time (Socket.IO)
O admin ja tem polling de 30s implementado. Para Socket.IO real-time:
1. Conectar socket na pagina admin
2. Escutar eventos: new_order, order_status, payment_confirmed
3. Atualizar stats em tempo real

### Admin Produtos
Verificar:
1. Se API POST /products esta funcionando
2. Se token esta sendo enviado corretamente
3. Se validacao no frontend esta bloqueando

### Receita/Vendas
Verificar:
1. Calculo de receita no backend
2. Se CashierMovement esta sendo criado corretamente
3. Se query de totalizacao esta correta

---

## User Flow - Delivery (com iFood)

```
Cliente abre cardapio
    |
    v
Seleciona itens
    |
    v
Vai para checkout
    |
    v
Seleciona tipo: [Mesa] [Retirada] [Delivery]
    |
    v (se Delivery)
Mostra modal: "Delivery disponivel via iFood"
    |
    v
Botao: "Pedir pelo iFood" -> Redireciona para iFood
```

---

## Decisoes Tecnicas

### Por que iFood e nao sistema proprio:
1. **Tempo**: Desenvolver delivery proprio levaria semanas
2. **Custo**: Motoboys, seguro, gestao
3. **Escala**: iFood ja tem infraestrutura
4. **Foco**: FLAME pode focar no core business (bar/lounge)

### Integracao Futura (se necessario):
- Webhook para receber pedidos iFood no admin
- Sincronizar cardapio FLAME <-> iFood
- Unificar relatorios

---

*Atualizado em: 09/12/2024*
