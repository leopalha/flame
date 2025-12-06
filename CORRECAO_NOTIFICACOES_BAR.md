# 🔧 CORREÇÃO: Pedidos não chegando no Bar/Cozinha

**Data**: 06/12/2025
**Commit**: `c202d12` - fix: incluir Product nos itens do pedido para corrigir notificações de bar/cozinha

---

## 🐛 PROBLEMA IDENTIFICADO

**Sintoma**: Pedidos sendo criados com sucesso, mas NÃO chegando para bar/cozinha/atendente

**Causa Raiz**: O orderController estava buscando os itens do pedido SEM incluir o Product relacionado. Quando o socketService tentava categorizar os itens para enviar para bar/cozinha, não encontrava a categoria do produto.

---

## 🔍 DIAGNÓSTICO

### Fluxo Problemático:

1. Cliente faz pedido → ✅ Pedido criado no banco
2. orderController busca pedido completo:
   ```javascript
   const completeOrder = await Order.findByPk(order.id, {
     include: [
       {
         model: OrderItem,
         as: 'items'  // ❌ SEM incluir Product!
       }
     ]
   });
   ```

3. orderController chama notificação:
   ```javascript
   socketService.notifyNewOrder(completeOrder);
   ```

4. socketService tenta categorizar itens:
   ```javascript
   const category = item.productCategory?.toLowerCase() || '';
   // ❌ item.productCategory é undefined porque Product não foi incluído!
   ```

5. Como `category === ''`, todos os itens iam para `foodItems` (cozinha)
6. Mas mesmo assim não funcionava porque o socketService não conseguia enviar

---

## ✅ SOLUÇÃO APLICADA

### Arquivo 1: `backend/src/controllers/orderController.js`

**Linha 122-132** - Adicionar include do Product:

```javascript
const completeOrder = await Order.findByPk(order.id, {
  include: [
    {
      model: OrderItem,
      as: 'items',
      include: [{  // ✅ NOVO: Incluir Product
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'category', 'price']
      }]
    },
    // ... outros includes
  ]
});
```

### Arquivo 2: `backend/src/services/socket.service.js`

**Linha 193-195** - Buscar categoria do product nested:

```javascript
orderData.items.forEach(item => {
  // ✅ ATUALIZADO: Buscar de item.product.category
  const category = (item.product?.category || item.productCategory || '').toLowerCase();

  if (category.includes('bebida') || category.includes('drink')) {
    drinkItems.push(item);  // → VAI PARA BAR
  } else if (category.includes('nargui') || category.includes('hookah')) {
    hookahItems.push(item);  // → VAI PARA BAR
  } else {
    foodItems.push(item);  // → VAI PARA COZINHA
  }
});
```

---

## 📊 RESULTADO ESPERADO

Após o deploy:

### Pedido de BEBIDA (Caipirinha):
- ✅ Categoria: `bebidas_alcoolicas`
- ✅ Roteamento: `bar` room
- ✅ Notificação: Bar recebe evento `new_order`
- ✅ Atendente recebe: `new_order_notification`

### Pedido de COMIDA (Hambúrguer):
- ✅ Categoria: `pratos_principais`
- ✅ Roteamento: `kitchen` room
- ✅ Notificação: Cozinha recebe evento `new_order`
- ✅ Atendente recebe: `new_order_notification`

### Pedido MISTO (Bebida + Comida):
- ✅ Bebida → BAR
- ✅ Comida → COZINHA
- ✅ Atendente recebe AMBOS

---

## 🧪 PRÓXIMO TESTE

Leonardo, após o deploy concluir (aguarde ~2 minutos), faça novamente:

1. **Limpar pedidos anteriores** (opcional, mas recomendado)
2. **Login como Bar** em uma aba
3. **Login como Leonardo** em outra aba
4. **Fazer pedido de Caipirinha Clássica**
5. **Verificar se aparece NO BAR IMEDIATAMENTE**

Se funcionou, você verá:
- 🔔 Notificação sonora (se Push Notification estiver ativo)
- 📱 Pedido aparecendo na lista do bar
- ⏱️ Sem delay (< 1 segundo)

---

## 📝 DEBUG LOGS

Os console.logs de debug ainda estão ativos:

```
🔔 [NOTIFICAÇÃO] Enviando notificações para pedido #XXXX
📡 [WEBSOCKET] Notificando sobre pedido #XXXX...
✅ [WEBSOCKET] Notificação enviada com sucesso!
```

Esses logs aparecerão nos logs do Railway quando você fizer um pedido.

---

## ⚠️ SE AINDA NÃO FUNCIONAR

Se após essa correção ainda não funcionar, pode ser:

1. **WebSocket não conectado no frontend do bar**
   - Verificar console do navegador (F12)
   - Procurar por erros de Socket.IO

2. **Bar não está na room 'bar'**
   - Verificar no backend se usuário bar tem role='bar' ou 'barman'

3. **Frontend não está escutando o evento correto**
   - Evento esperado: `new_order`
   - Verificar código do frontend

---

**Status**: ⏳ AGUARDANDO DEPLOY + TESTE MANUAL
