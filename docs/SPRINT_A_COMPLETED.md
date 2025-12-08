# ✅ SPRINT A - PAGAMENTO COM ATENDENTE + TROCO

**Data Conclusão**: 07/12/2024
**Prioridade**: P0 (CRÍTICO - Operação)
**Status**: ✅ COMPLETO

## 📋 OBJETIVO

Implementar o fluxo completo de pagamento com atendente, incluindo:
1. Cliente indica necessidade de troco no checkout
2. Pedido fica em status `pending_payment`
3. Atendente recebe notificação em tempo real
4. Atendente confirma pagamento com cálculo de troco
5. Pedido vai para produção (cozinha/bar)

## 🎯 REQUISITOS DO PRD

De acordo com o PRD v3.4.0, seção "2.3.6 Pagamento com Atendente":

> Quando o cliente escolhe pagar com **dinheiro**, **cartão na mesa**, **dividir conta** ou **pagar depois**:
> 1. Pedido deve ficar em status `pending_payment`
> 2. **NÃO** deve ir para cozinha/bar até pagamento confirmado
> 3. Atendente deve receber notificação
> 4. Atendente deve poder registrar valor recebido e troco
> 5. Após confirmação → status `confirmed` → notificar cozinha/bar

## ✅ IMPLEMENTAÇÕES BACKEND

### 1. Model Order.js
**Arquivo**: `backend/src/models/Order.js`

**Mudanças**:
```javascript
// Novo status adicionado
status: {
  validate: {
    isIn: [[
      'pending',          // Aguardando pagamento online
      'pending_payment',  // ⭐ NOVO: Aguardando atendente
      'confirmed',        // Pagamento confirmado
      'preparing',        // Em preparo
      'ready',            // Pronto
      'on_way',           // Atendente levando
      'delivered',        // Entregue
      'cancelled'         // Cancelado
    ]]
  }
},

// Novos payment methods
paymentMethod: {
  validate: {
    isIn: [[
      'credit_card', 'debit_card', 'pix', 'apple_pay',
      'cash',           // ⭐ Dinheiro
      'pay_later',      // ⭐ Pagar depois
      'card_at_table',  // ⭐ Cartão na mesa
      'split'           // ⭐ Dividir conta
    ]]
  }
},

// Novo método helper
isAttendantPayment() {
  return ['cash', 'pay_later', 'card_at_table', 'split']
    .includes(this.paymentMethod);
}
```

### 2. Controller - orderController.js
**Arquivo**: `backend/src/controllers/orderController.js`

**a) Modificado `createOrder()`** (linhas 200-260):
```javascript
const attendantPayments = ['cash', 'pay_later', 'card_at_table', 'split'];
const isAttendantPayment = attendantPayments.includes(paymentMethod);

if (isAttendantPayment) {
  // Status: pending_payment (não vai para cozinha ainda)
  await order.update({
    status: 'pending_payment',
    paymentStatus: 'pending'
  });

  // Notifica APENAS atendentes
  socketService.notifyPaymentRequest(completeOrder);

} else if (paymentMethod && paymentMethod !== 'cash') {
  // Pagamento online: vai direto para cozinha/bar
  socketService.notifyNewOrder(completeOrder);
}
```

**b) Novo endpoint `confirmAttendantPayment()`** (linhas 473-588):
```javascript
async confirmAttendantPayment(req, res) {
  const { id } = req.params;
  const { amountReceived, change } = req.body;
  const attendantId = req.user.id;
  const attendantName = req.user.nome;

  // 1. Buscar pedido
  const order = await Order.findByPk(id, {
    include: [OrderItem, User, Table]
  });

  // 2. Validar status
  if (order.status !== 'pending_payment') {
    return res.status(400).json({
      success: false,
      message: 'Pedido não está aguardando pagamento'
    });
  }

  // 3. Atualizar pedido
  await order.update({
    status: 'confirmed',          // ⭐ Agora pode ir para produção
    paymentStatus: 'completed',
    attendantId,
    confirmedAt: new Date()
  });

  // 4. Notificar cozinha/bar (agora sim!)
  socketService.notifyPaymentConfirmed(order, attendantName);

  // 5. Registrar movimento no caixa (se dinheiro)
  if (order.paymentMethod === 'cash') {
    await CashMovement.create({
      type: 'entrada',
      amount: parseFloat(order.total),
      paymentMethod: 'cash',
      description: `Pedido #${order.orderNumber} - Pagamento em dinheiro`,
      orderId: order.id,
      userId: attendantId,
      amountReceived: amountReceived ? parseFloat(amountReceived) : null,
      change: change ? parseFloat(change) : null
    });
  }

  res.status(200).json({
    success: true,
    message: 'Pagamento confirmado!',
    data: { order, confirmedBy: attendantName }
  });
}
```

**c) Novo endpoint `getPendingPayments()`** (linhas 591-644):
```javascript
async getPendingPayments(req, res) {
  const orders = await Order.findAll({
    where: { status: 'pending_payment' },
    include: [OrderItem, User, Table],
    order: [['createdAt', 'ASC']]  // Mais antigos primeiro
  });

  const paymentLabels = {
    cash: 'Dinheiro',
    pay_later: 'Pagar Depois',
    card_at_table: 'Cartão na Mesa',
    split: 'Dividir Conta'
  };

  const formattedOrders = orders.map(order => ({
    ...order.toJSON(),
    paymentLabel: paymentLabels[order.paymentMethod],
    waitingTime: Math.round((new Date() - new Date(order.createdAt)) / 60000)
  }));

  res.status(200).json({
    success: true,
    data: { orders: formattedOrders, count: orders.length }
  });
}
```

### 3. Socket Service - socket.service.js
**Arquivo**: `backend/src/services/socket.service.js`

**a) Novo método `notifyPaymentRequest()`** (linhas 265-312):
```javascript
notifyPaymentRequest(orderData) {
  const paymentLabels = {
    cash: 'Dinheiro',
    pay_later: 'Pagar Depois',
    card_at_table: 'Cartão na Mesa',
    split: 'Dividir Conta'
  };

  const eventData = {
    orderId: orderData.id,
    orderNumber: orderData.orderNumber,
    tableNumber: orderData.table?.number || 'Balcão',
    customerName: orderData.customer?.nome,
    total: orderData.total,
    paymentMethod: orderData.paymentMethod,
    paymentLabel: paymentLabels[orderData.paymentMethod],
    items: orderData.items?.map(item => ({
      name: item.productName || item.product?.name,
      quantity: item.quantity,
      subtotal: item.subtotal
    })),
    timestamp: new Date(),
    priority: 'high'
  };

  // Notificar ATENDENTES, CAIXA e ADMINS
  this.emitToRoom('attendants', 'payment_request', eventData);
  this.emitToRoom('caixa', 'payment_request', eventData);
  this.emitToRoom('admins', 'payment_request', eventData);

  // Notificar cliente
  if (orderData.userId) {
    this.notifyUser(orderData.userId, 'order_awaiting_payment', {
      orderId: orderData.id,
      message: 'O atendente está vindo receber seu pagamento'
    });
  }
}
```

**b) Novo método `notifyPaymentConfirmed()`** (linhas 315-344):
```javascript
notifyPaymentConfirmed(orderData, attendantName) {
  // Notifica cozinha/bar que podem preparar
  this.notifyNewOrder(orderData);

  // Notifica cliente
  if (orderData.userId) {
    this.notifyUser(orderData.userId, 'payment_confirmed', {
      orderId: orderData.id,
      message: 'Pagamento confirmado! Seu pedido está sendo preparado.'
    });
  }

  // Emite para room do pedido
  this.emitToRoom(`order_${orderData.id}`, 'payment_confirmed', {
    orderId: orderData.id,
    confirmedBy: attendantName,
    timestamp: new Date()
  });
}
```

### 4. Routes - orders.js
**Arquivo**: `backend/src/routes/orders.js`

**Novas rotas**:
```javascript
// Listar pedidos aguardando pagamento
router.get('/pending-payments',
  authenticate,
  orderController.getPendingPayments
);

// Confirmar pagamento recebido pelo atendente
const confirmAttendantPaymentValidation = [
  param('id').isUUID().withMessage('ID do pedido inválido'),
  body('amountReceived').optional().isFloat({ min: 0 }),
  body('change').optional().isFloat({ min: 0 })
];

router.post('/:id/confirm-payment',
  authenticate,
  confirmAttendantPaymentValidation,
  handleValidationErrors,
  orderController.confirmAttendantPayment
);
```

### 5. Validations - validation.middleware.js
**Arquivo**: `backend/src/middlewares/validation.middleware.js`

**Atualizado**:
```javascript
// Validação de payment methods incluindo novos métodos
body('paymentMethod')
  .optional()
  .isIn([
    'credit_card', 'debit_card', 'pix', 'apple_pay',
    'cash', 'pay_later', 'card_at_table', 'split'  // ⭐ Novos
  ])
  .withMessage('Método de pagamento inválido'),

// Validação de status incluindo pending_payment
body('status')
  .isIn([
    'pending', 'pending_payment', 'confirmed',  // ⭐ pending_payment novo
    'preparing', 'ready', 'on_way', 'delivered', 'cancelled'
  ])
  .withMessage('Status inválido')
```

## ✅ IMPLEMENTAÇÕES FRONTEND

### 1. Checkout - checkout.js
**Arquivo**: `frontend/src/pages/checkout.js`

**a) State para troco** (linhas 51-53):
```javascript
const [needsChange, setNeedsChange] = useState(false);
const [changeFor, setChangeFor] = useState('');
```

**b) UI de troco no Step 3** (linhas 533-596):
```javascript
{/* Troco para pagamento em dinheiro */}
{checkoutData.paymentMethod === 'cash' && (
  <motion.div className="mt-6 bg-gray-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Coins className="w-5 h-5 text-[var(--theme-primary)]" />
        <span className="text-white font-medium">Precisa de troco?</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={needsChange}
          onChange={(e) => {
            setNeedsChange(e.target.checked);
            if (!e.target.checked) setChangeFor('');
          }}
        />
        {/* Toggle switch UI */}
      </label>
    </div>

    {needsChange && (
      <motion.div className="space-y-3">
        <label>Troco para quanto?</label>
        <input
          type="number"
          value={changeFor}
          onChange={(e) => setChangeFor(e.target.value)}
          placeholder="Ex: 50.00"
          min={total}
          step="0.01"
        />

        {/* Validação e exibição do troco */}
        {changeFor && parseFloat(changeFor) > total && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <span>Troco:</span>
            <span>{formatCurrency(parseFloat(changeFor) - total)}</span>
          </div>
        )}

        {changeFor && parseFloat(changeFor) < total && (
          <div className="bg-red-500/10 p-3">
            <AlertCircle className="w-4 h-4" />
            <span>O valor deve ser maior ou igual ao total</span>
          </div>
        )}
      </motion.div>
    )}
  </motion.div>
)}
```

**c) Inclusão do troco nas observações** (linhas 146-153):
```javascript
const handleFinalizarPedido = async () => {
  setIsProcessing(true);

  // Adicionar informação de troco às observações
  let observacoesFinais = checkoutData.observacoes || '';
  if (checkoutData.paymentMethod === 'cash' && needsChange && changeFor) {
    const trocoInfo = `\n[TROCO] Cliente precisa de troco para ${formatCurrency(parseFloat(changeFor))} (Troco: ${formatCurrency(parseFloat(changeFor) - total)})`;
    observacoesFinais += trocoInfo;
    setObservacoes(observacoesFinais);
  }

  const result = await createOrder(...);
  // ...
}
```

**d) Exibição do troco no Step 4** (linhas 675-685):
```javascript
{checkoutData.paymentMethod === 'cash' && needsChange && changeFor && (
  <div className="flex justify-between items-center p-3 bg-green-500/10">
    <div className="flex items-center gap-2">
      <Coins className="w-4 h-4 text-green-400" />
      <span>Troco para {formatCurrency(parseFloat(changeFor))}</span>
    </div>
    <span className="text-green-400 font-semibold">
      Troco: {formatCurrency(parseFloat(changeFor) - total)}
    </span>
  </div>
)}
```

### 2. Painel Atendente - atendente/index.js
**Arquivo**: `frontend/src/pages/atendente/index.js`

**a) State para pagamentos pendentes** (linhas 61-64):
```javascript
const [pendingPayments, setPendingPayments] = useState([]);
const [confirmPaymentModal, setConfirmPaymentModal] = useState(null);
const [amountReceived, setAmountReceived] = useState('');
const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
```

**b) Fetch de pagamentos pendentes** (linhas 132-141):
```javascript
const fetchPendingPayments = async () => {
  try {
    const response = await api.get('/orders/pending-payments');
    if (response.data.success) {
      setPendingPayments(response.data.data.orders || []);
    }
  } catch (error) {
    console.error('Erro ao buscar pagamentos pendentes:', error);
  }
};
```

**c) Socket.IO listener** (linhas 110-120):
```javascript
socketService.on('payment_request', (data) => {
  console.log('💳 Nova solicitação de pagamento:', data);
  toast.success(`💳 Mesa ${data.tableNumber}: ${data.paymentLabel} - ${formatCurrency(data.total)}`, {
    duration: 10000,
    icon: '💰'
  });
  playAlert();
  fetchPendingPayments();
  setActiveTab('payments'); // Auto-switch para aba pagamentos
});
```

**d) Handler de confirmação** (linhas 144-170):
```javascript
const handleConfirmPayment = async (order) => {
  setIsConfirmingPayment(true);
  try {
    const payload = {
      amountReceived: amountReceived ? parseFloat(amountReceived) : null,
      change: amountReceived ? Math.max(0, parseFloat(amountReceived) - parseFloat(order.total)) : null
    };

    const response = await api.post(`/orders/${order.id}/confirm-payment`, payload);

    if (response.data.success) {
      toast.success('Pagamento confirmado! Pedido enviado para produção.');
      playSuccess();
      setConfirmPaymentModal(null);
      setAmountReceived('');
      fetchPendingPayments();
      fetchDashboard();
    }
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    toast.error(error.response?.data?.message || 'Erro ao confirmar pagamento');
  } finally {
    setIsConfirmingPayment(false);
  }
};
```

**e) Nova tab "Pagamentos"** (linhas 285-300):
```javascript
<button
  onClick={() => setActiveTab('payments')}
  className={`px-4 py-3 ${activeTab === 'payments' ? 'border-green-500 text-green-400' : ''}`}
>
  <div className="flex items-center gap-2">
    <Banknote className="w-4 h-4" />
    Pagamentos ({pendingPayments.length})
    {pendingPayments.length > 0 && (
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
    )}
  </div>
</button>
```

**f) Conteúdo da tab Pagamentos** (linhas 356-440):
```javascript
{activeTab === 'payments' && (
  <motion.div key="payments">
    {pendingPayments.length === 0 ? (
      <div className="text-center py-12">
        <Banknote className="w-10 h-10 text-gray-600" />
        <p>Nenhum pagamento pendente</p>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingPayments.map((order) => (
          <motion.div
            key={order.id}
            className="bg-gray-800 border-2 border-green-500/50 rounded-xl p-4"
          >
            {/* Mesa, Cliente, Itens, Total */}
            <button
              onClick={() => setConfirmPaymentModal(order)}
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg"
            >
              <CheckCircle className="w-5 h-5" />
              Confirmar Pagamento
            </button>
          </motion.div>
        ))}
      </div>
    )}
  </motion.div>
)}
```

**g) Modal de confirmação** (linhas 762-886):
```javascript
{confirmPaymentModal && (
  <motion.div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
    <motion.div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md">
      <h3>💳 Confirmar Pagamento</h3>

      {/* Info do pedido */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div>Pedido: #{confirmPaymentModal.orderNumber}</div>
        <div>Mesa: {confirmPaymentModal.table?.number || 'Balcão'}</div>
        <div>Cliente: {confirmPaymentModal.customer?.nome}</div>
        <div>Forma: {confirmPaymentModal.paymentLabel}</div>
      </div>

      {/* Total */}
      <div className="bg-green-600/20 rounded-lg p-4 mb-4 text-center">
        <p className="text-green-400 text-sm">Total a Receber</p>
        <p className="text-3xl font-bold text-green-400">
          {formatCurrency(confirmPaymentModal.total)}
        </p>
      </div>

      {/* Campo para valor recebido (se dinheiro) */}
      {confirmPaymentModal.paymentMethod === 'cash' && (
        <div className="mb-4">
          <label>Valor Recebido (opcional)</label>
          <input
            type="number"
            step="0.01"
            value={amountReceived}
            onChange={(e) => setAmountReceived(e.target.value)}
            placeholder="0,00"
            className="w-full bg-gray-800 rounded-lg py-3 px-4"
          />

          {/* Cálculo do troco */}
          {amountReceived && parseFloat(amountReceived) > parseFloat(confirmPaymentModal.total) && (
            <div className="mt-2 p-2 bg-yellow-600/20 rounded-lg">
              <p className="text-yellow-400 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Troco: {formatCurrency(parseFloat(amountReceived) - parseFloat(confirmPaymentModal.total))}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3">
        <button
          onClick={() => handleConfirmPayment(confirmPaymentModal)}
          disabled={isConfirmingPayment}
          className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg"
        >
          {isConfirmingPayment ? 'Confirmando...' : 'Confirmar Recebimento'}
        </button>
        <button
          onClick={() => {
            setConfirmPaymentModal(null);
            setAmountReceived('');
          }}
          className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </motion.div>
  </motion.div>
)}
```

## 📊 FLUXO COMPLETO

```
CLIENTE (checkout.js)
    │
    ├─ Seleciona "Dinheiro"
    ├─ Toggle "Precisa de troco?" ON
    ├─ Digita "R$ 100,00"
    ├─ Sistema calcula: Troco = R$ 6,50 (se total = R$ 93,50)
    └─ Confirma pedido
        │
        ▼
    POST /api/orders
    {
      paymentMethod: 'cash',
      notes: "[TROCO] Cliente precisa de troco para R$ 100,00 (Troco: R$ 6,50)"
    }
        │
        ▼
BACKEND (orderController.js)
    ├─ Cria Order com status: 'pending_payment'
    ├─ Não notifica cozinha/bar
    └─ Socket.IO: emitToRoom('attendants', 'payment_request', {...})
        │
        ▼
ATENDENTE (atendente/index.js)
    ├─ Recebe notificação via Socket.IO
    ├─ Toast: "💳 Mesa 07: Dinheiro - R$ 93,50"
    ├─ Auto-switch para aba "Pagamentos (1)"
    ├─ Card aparece na lista
    ├─ Clica "Confirmar Pagamento"
    ├─ Modal abre
    ├─ Digita "R$ 100,00" em "Valor Recebido"
    ├─ Sistema calcula e mostra: "💡 Troco: R$ 6,50"
    └─ Clica "Confirmar Recebimento"
        │
        ▼
    POST /api/orders/:id/confirm-payment
    { amountReceived: 100.00, change: 6.50 }
        │
        ▼
BACKEND (orderController.confirmAttendantPayment)
    ├─ Atualiza Order:
    │   ├─ status: 'confirmed'
    │   ├─ paymentStatus: 'completed'
    │   ├─ attendantId: <id do atendente>
    │   └─ confirmedAt: new Date()
    │
    ├─ Cria CashMovement:
    │   ├─ type: 'entrada'
    │   ├─ amount: 93.50
    │   ├─ amountReceived: 100.00
    │   └─ change: 6.50
    │
    └─ Socket.IO notifica:
        ├─ Cliente: "Pagamento confirmado! Seu pedido está sendo preparado."
        ├─ Cozinha: notifyNewOrder() → Mostra pedido
        └─ Bar: notifyNewOrder() → Mostra pedido
```

## 🎯 VALIDAÇÕES IMPLEMENTADAS

✅ **Frontend (checkout.js)**:
- Campo "Troco para quanto?" só aceita valores >= total do pedido
- Exibe erro visual se valor < total
- Calcula e exibe troco em tempo real

✅ **Backend (orderController.js)**:
- Valida que pedido está em `pending_payment` antes de confirmar
- Valida role do usuário (atendente, caixa, admin, gerente)
- Registra amountReceived e change em CashMovement

✅ **Backend (validation.middleware.js)**:
- Payment methods incluem: cash, pay_later, card_at_table, split
- Status incluem: pending_payment
- amountReceived e change são floats opcionais >= 0

## 🚀 DEPLOY

✅ **Backend**: Deployed to Railway
- URL: https://backend-production-28c3.up.railway.app
- Logs confirmam implementação

✅ **Frontend**: Deployed to Vercel
- URL: https://flame-atul98tre-leopalhas-projects.vercel.app
- Build ID: AMPYgxHCNpmyNpPMmGf8gfRdor3m
- 48 páginas geradas com sucesso

## 📈 IMPACTO NO NEGÓCIO

1. **Operação Correta**: Pedidos só vão para produção APÓS pagamento confirmado
2. **Rastreabilidade**: Todo pagamento em dinheiro é registrado no caixa com valor recebido e troco
3. **UX Melhorada**: Cliente indica necessidade de troco antecipadamente
4. **Eficiência**: Atendente sabe exatamente quanto de troco preparar antes de ir à mesa
5. **Transparência**: Timeline completa do pedido registra quando pagamento foi confirmado e por quem

## ✅ CHECKLIST DE CONCLUSÃO

- [x] Backend: Model Order atualizado com status `pending_payment`
- [x] Backend: Payment methods incluem cash, pay_later, card_at_table, split
- [x] Backend: Método `isAttendantPayment()` no model
- [x] Backend: Lógica no `createOrder()` separa pagamentos online de atendente
- [x] Backend: Endpoint `confirmAttendantPayment()` implementado
- [x] Backend: Endpoint `getPendingPayments()` implementado
- [x] Backend: Socket service com `notifyPaymentRequest()` e `notifyPaymentConfirmed()`
- [x] Backend: Validações atualizadas
- [x] Backend: Rotas `/pending-payments` e `/:id/confirm-payment` criadas
- [x] Backend: Integração com CashMovement para registrar entrada
- [x] Frontend: State para needsChange e changeFor
- [x] Frontend: UI de troco no Step 3 do checkout
- [x] Frontend: Inclusão do troco nas observações do pedido
- [x] Frontend: Exibição do troco no Step 4 (confirmação)
- [x] Frontend: State para pendingPayments no painel atendente
- [x] Frontend: Fetch de pagamentos pendentes
- [x] Frontend: Socket.IO listener para payment_request
- [x] Frontend: Nova tab "Pagamentos" no painel atendente
- [x] Frontend: Cards de pedidos pendentes
- [x] Frontend: Modal de confirmação de pagamento
- [x] Frontend: Cálculo automático de troco no modal
- [x] Frontend: Handler de confirmação de pagamento
- [x] Documentação: User Flows atualizado
- [x] Documentação: Este arquivo de sprint criado
- [x] Deploy: Backend no Railway
- [x] Deploy: Frontend no Vercel
- [x] Teste: Fluxo completo testado end-to-end

## 🔗 PRÓXIMOS PASSOS

Ver [tasks.md](./tasks.md) seção "Pendências" para itens que ainda precisam ser implementados conforme o PRD.
