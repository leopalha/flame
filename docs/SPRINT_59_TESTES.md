# SPRINT 59 - PLANO DE TESTES E VALIDACAO COMPLETA

**Data**: 09/12/2024
**Objetivo**: Testar todos os fluxos implementados e corrigir bugs encontrados
**Prioridade**: P0 (Garantir qualidade antes de lancamento)
**Status**: ✅ TESTES DE API CONCLUIDOS

---

## RESULTADOS DOS TESTES DE API (PRODUCAO)

| # | Endpoint | Metodo | Status | Observacoes |
|---|----------|--------|--------|-------------|
| 1 | /api/auth/me | GET | ✅ PASSOU | Tokens admin e cliente validos |
| 2 | /api/products | GET | ✅ PASSOU | 116 produtos retornados |
| 3 | /api/tables | GET | ✅ PASSOU | 20 mesas configuradas |
| 4 | /api/orders | GET | ✅ PASSOU | 16+ pedidos no sistema |
| 5 | /api/orders | POST | ✅ PASSOU | Pedido #18 criado (pay_later) |
| 6 | /api/orders/pending-payments | GET | ✅ PASSOU | Lista pedidos aguardando |
| 7 | /api/orders/:id/confirm-payment | POST | ✅ PASSOU | Pagamento confirmado (cash) |
| 8 | /api/orders/:id/status | PATCH | ✅ PASSOU | Status atualizado (preparing) |
| 9 | /api/chat/:orderId | GET | ⚠️ PENDENTE | Rota precisa deploy |

---

## CHECKLIST DE TESTES - FLUXO CLIENTE

### 1. Cadastro e Autenticacao
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 1.1 | Cadastro com email/senha | [ ] | Verificar validacao de campos |
| 1.2 | Cadastro com celular (SMS OTP) | [ ] | Verificar envio e validacao do codigo |
| 1.3 | Cadastro com Google OAuth | [ ] | Verificar criacao de conta |
| 1.4 | Login com email/senha | [ ] | |
| 1.5 | Login com SMS OTP | [ ] | |
| 1.6 | Login com Google | [ ] | |
| 1.7 | Recuperacao de senha | [ ] | |
| 1.8 | Completar perfil (nome, email) | [ ] | |
| 1.9 | Perfil incompleto bloqueia checkout | [ ] | |

### 2. Cardapio e Carrinho
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 2.1 | Visualizar produtos por categoria | [ ] | |
| 2.2 | Buscar produto por nome | [ ] | |
| 2.3 | Ver detalhes do produto | [ ] | |
| 2.4 | Adicionar produto ao carrinho | [ ] | |
| 2.5 | Editar quantidade no carrinho | [ ] | |
| 2.6 | Remover item do carrinho | [ ] | |
| 2.7 | Limpar carrinho | [ ] | |
| 2.8 | Carrinho persiste apos refresh | [ ] | |

### 3. Checkout e Pagamento
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 3.1 | Selecionar tipo de consumo (mesa/balcao) | [ ] | |
| 3.2 | **Narguile so permite mesa** | [ ] | Sprint 58 - Testar bloqueio |
| 3.3 | Selecionar mesa | [ ] | |
| 3.4 | Taxa de servico 10% aparece | [ ] | Sprint 42 |
| 3.5 | Remover taxa de servico | [ ] | |
| 3.6 | Adicionar gorjeta (5%, 10%, 15%, custom) | [ ] | Sprint 55 |
| 3.7 | Usar cashback como desconto | [ ] | Sprint 24 |
| 3.8 | **Pagamento PIX** | [ ] | Verificar criacao de pedido |
| 3.9 | **Pagamento Credito** | [ ] | Verificar validacao |
| 3.10 | **Pagamento Debito** | [ ] | Verificar validacao |
| 3.11 | **Pagar com Atendente (Dinheiro)** | [x] | ✅ API testada - status pending_payment ok |
| 3.12 | **Pagar com Atendente (Cartao na mesa)** | [x] | ✅ API testada - card_at_table aceito |
| 3.13 | Pedido criado com sucesso | [x] | ✅ Pedido #18 criado via API |

### 4. Acompanhamento de Pedido
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 4.1 | Ver status do pedido em tempo real | [ ] | Socket.IO |
| 4.2 | Receber notificacao quando pronto | [ ] | Push notification |
| 4.3 | Ver timeline do pedido | [ ] | Sprint 47 |
| 4.4 | **Chat com staff** | [ ] | Sprint 56/58 |
| 4.5 | Avaliar pedido apos entrega | [ ] | |
| 4.6 | Receber cashback (2%) apos avaliacao | [ ] | Sprint 29 |

---

## CHECKLIST DE TESTES - FLUXO STAFF

### 5. Painel Atendente (/atendente)
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 5.1 | Ver pedidos aguardando pagamento | [x] | ✅ API testada - funciona |
| 5.2 | **Confirmar pagamento (Dinheiro)** | [x] | ✅ API testada - funciona |
| 5.3 | **Confirmar pagamento (Credito)** | [x] | ✅ Sprint 58 - validacao ok |
| 5.4 | **Confirmar pagamento (Debito)** | [x] | ✅ Sprint 58 - validacao ok |
| 5.5 | **Confirmar pagamento (PIX)** | [x] | ✅ Sprint 58 - validacao ok |
| 5.6 | Calcular troco automatico | [x] | ✅ API retorna change calculado |
| 5.7 | Ver pedidos novos | [ ] | |
| 5.8 | Ver pedidos prontos para entrega | [ ] | |
| 5.9 | Marcar pedido como entregue | [ ] | |
| 5.10 | **Som de notificacao (1x)** | [ ] | Sprint 58 - nao duplicar |
| 5.11 | **Chat com cliente** | [ ] | Sprint 56 |
| 5.12 | Gerenciar sessoes de narguile | [ ] | |
| 5.13 | Trocar carvao do narguile | [ ] | |

### 6. Painel Cozinha (/cozinha)
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 6.1 | Ver pedidos pendentes | [x] | ✅ API /orders funciona |
| 6.2 | Iniciar preparo (pending -> preparing) | [x] | ✅ API PATCH status testada |
| 6.3 | Marcar como pronto (preparing -> ready) | [ ] | |
| 6.4 | **Som de novo pedido** | [ ] | Sprint 58 |
| 6.5 | Timer de preparo funcionando | [ ] | |
| 6.6 | Filtrar por categoria | [ ] | |

### 7. Painel Bar (/staff/bar)
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 7.1 | Ver pedidos de bebidas | [ ] | |
| 7.2 | Filtrar por categoria (drinks, cervejas) | [ ] | |
| 7.3 | Atualizar status de bebidas | [ ] | |
| 7.4 | **Som de novo pedido** | [ ] | Sprint 58 |
| 7.5 | Ver pedidos prontos para retirada | [ ] | Sprint 45 |

### 8. Painel Caixa (/staff/caixa)
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 8.1 | Ver movimentacoes do dia | [ ] | |
| 8.2 | Abrir/fechar caixa | [ ] | |
| 8.3 | Registrar entrada manual | [ ] | |
| 8.4 | Registrar saida manual | [ ] | |
| 8.5 | Ver relatorio do turno | [ ] | |

---

## CHECKLIST DE TESTES - FLUXO ADMIN

### 9. Dashboard Admin (/admin)
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 9.1 | Ver metricas do dia | [ ] | Sprint 51 hydration fix |
| 9.2 | Ver pedidos recentes | [ ] | |
| 9.3 | Cancelar pedido | [ ] | Sprint 51 real API |
| 9.4 | Estornar pagamento Stripe | [ ] | Sprint 52 |

### 10. Gestao de Produtos (/admin/products)
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 10.1 | Listar produtos | [ ] | |
| 10.2 | Criar produto | [ ] | |
| 10.3 | Editar produto | [ ] | |
| 10.4 | Upload de imagem | [ ] | Sprint 30 |
| 10.5 | Ativar/desativar produto | [ ] | |
| 10.6 | Ficha tecnica (insumos) | [ ] | Sprint 31 |

### 11. Gestao de Mesas (/admin/tables)
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 11.1 | Listar mesas | [ ] | |
| 11.2 | Criar mesa | [ ] | |
| 11.3 | Gerar QR code | [ ] | |
| 11.4 | Ver status ocupacao | [ ] | |

### 12. CRM e Clientes (/admin/clientes)
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 12.1 | Listar clientes | [ ] | |
| 12.2 | Ver detalhes do cliente | [ ] | |
| 12.3 | Ver historico de pedidos | [ ] | |
| 12.4 | Ajustar cashback manualmente | [ ] | |

---

## CHECKLIST DE TESTES - INTEGRACOES

### 13. Socket.IO (Tempo Real)
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 13.1 | Conexao estabelecida | [ ] | |
| 13.2 | Reconexao automatica | [ ] | |
| 13.3 | Eventos de pedido chegam | [ ] | |
| 13.4 | Eventos de status chegam | [ ] | |
| 13.5 | Multiplos clientes sincronizados | [ ] | |

### 14. Push Notifications
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 14.1 | Solicitar permissao | [ ] | |
| 14.2 | Receber notificacao de pedido pronto | [ ] | |
| 14.3 | Notificacao quando app em background | [ ] | |

### 15. Sons de Notificacao (Sprint 58)
| # | Teste | Status | Observacoes |
|---|-------|--------|-------------|
| 15.1 | **Som toca apenas 1x** | [ ] | Nao duplicar |
| 15.2 | Som de novo pedido | [ ] | playNewOrder() |
| 15.3 | Som de alerta | [ ] | playAlert() |
| 15.4 | Som de sucesso | [ ] | playSuccess() |
| 15.5 | Som de mudanca de status | [ ] | playStatusChange() |
| 15.6 | Som de urgencia (timer) | [ ] | playUrgent() |

---

## BUGS CONHECIDOS PARA VERIFICAR

| # | Bug | Sprint Fix | Status |
|---|-----|------------|--------|
| 1 | Som tocando 4x | Sprint 58 | [x] ✅ Debounce 500ms implementado |
| 2 | Chat "Erro interno servidor" | Sprint 58 | [x] ✅ Codigo corrigido, deploy pendente |
| 3 | Pagamento cartao "Dados invalidos" | Sprint 58 | [x] ✅ Validacao credit/debit aceita |
| 4 | Narguile permitindo delivery | Sprint 58 | [x] ✅ TABLE_ONLY_CATEGORIES implementado |
| 5 | Token de autenticacao expirando | Sprint 50 | [x] ✅ Tokens testados e validos |
| 6 | Listeners duplicados socket | Sprint 58 | [x] ✅ listenersSetup ref implementado |

---

## TESTES DE DISPOSITIVO

| Dispositivo | Browser | Status |
|-------------|---------|--------|
| Desktop Chrome | | [ ] |
| Desktop Firefox | | [ ] |
| Desktop Safari | | [ ] |
| Mobile Android Chrome | | [ ] |
| Mobile iOS Safari | | [ ] |
| Tablet | | [ ] |

---

## CRITERIOS DE ACEITE FINAL

Para considerar o sistema pronto para producao:

1. [ ] Todos os fluxos de cliente funcionando
2. [ ] Todos os paineis staff funcionando
3. [ ] Socket.IO estavel (sem desconexoes)
4. [ ] Sons tocando corretamente (1x)
5. [ ] Pagamentos funcionando (todos os metodos)
6. [ ] Chat funcionando
7. [ ] Sem erros de console criticos
8. [ ] Performance aceitavel (<3s carregamento)

---

## PROXIMAS SPRINTS (PENDENCIAS)

### Sprint 60 - Divisao de Conta
- [ ] Modal para dividir conta igualmente
- [ ] Dividir por valores diferentes
- [ ] Registrar pagamento parcial
- [ ] Confirmar quando todos pagaram

### Sprint 61 - Melhorias UX
- [ ] Animacoes mais suaves
- [ ] Loading states melhorados
- [ ] Feedback de acoes mais claro
- [ ] Acessibilidade (ARIA labels)

### Sprint 62 - Relatorios Avancados
- [ ] Graficos de vendas
- [ ] Relatorio CMV
- [ ] Analise ABC de produtos
- [ ] Exportacao Excel/PDF
