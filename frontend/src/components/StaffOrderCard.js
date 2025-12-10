import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Users, MapPin, FileText, Zap, MessageCircle, Instagram, CheckCircle, XCircle, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import CountdownTimer from './CountdownTimer';
import useThemeStore from '../stores/themeStore';
import useStaffStore from '../stores/staffStore';
import OrderChat from './OrderChat';
import soundService from '../services/soundService';
import { api } from '../services/api';

const StaffOrderCard = ({ order, onStatusUpdate, onTimerAlert, userRole = 'staff' }) => {
  const { getPalette } = useThemeStore();
  const { updateOrderStatus } = useStaffStore();
  const [expanded, setExpanded] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showChat, setShowChat] = useState(false); // Sprint 56: Chat
  const [showInstagramValidation, setShowInstagramValidation] = useState(false); // Sprint 59: Instagram Cashback
  const [validatingInstagram, setValidatingInstagram] = useState(false);
  const palette = getPalette();

  // Obter cor baseada no status
  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9500', // Laranja
      confirmed: '#3b82f6', // Azul
      preparing: '#f59e0b', // Âmbar
      ready: '#10b981', // Verde
      on_way: '#8b5cf6', // Roxo
      delivered: '#6b7280', // Cinza
      cancelled: '#ef4444' // Vermelho
    };
    return colors[status] || palette?.primary || '#FF006E';
  };

  // Obter label do status
  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Pronto',
      on_way: 'Em Entrega',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  // Configuração de botões por role
  const getRoleActionConfig = () => {
    const status = order.status;

    // Bar e Cozinha: podem Preparar (pending→preparing) e marcar Pronto (preparing→ready)
    if (userRole === 'bar' || userRole === 'cozinha') {
      if (status === 'pending' || status === 'confirmed') {
        return { nextStatus: 'preparing', label: 'Preparar', enabled: true, color: '#f59e0b' };
      }
      if (status === 'preparing') {
        return { nextStatus: 'ready', label: 'Pronto', enabled: true, color: '#10b981' };
      }
      return { enabled: false };
    }

    // Atendente: botão bloqueado até estar pronto, depois Retirar e Entregar
    if (userRole === 'atendente') {
      if (status === 'pending' || status === 'confirmed' || status === 'preparing') {
        return { enabled: false, label: 'Aguardando preparo...', color: '#6b7280' };
      }
      if (status === 'ready') {
        return { nextStatus: 'on_way', label: 'Retirar', enabled: true, color: '#3b82f6' };
      }
      if (status === 'on_way') {
        return { nextStatus: 'delivered', label: 'Entregar', enabled: true, color: '#10b981' };
      }
      return { enabled: false };
    }

    // Admin/Gerente: podem fazer todas as transições
    if (userRole === 'admin' || userRole === 'gerente') {
      const statusFlow = {
        pending: { nextStatus: 'preparing', label: 'Preparar' },
        confirmed: { nextStatus: 'preparing', label: 'Preparar' },
        preparing: { nextStatus: 'ready', label: 'Pronto' },
        ready: { nextStatus: 'on_way', label: 'Retirar' },
        on_way: { nextStatus: 'delivered', label: 'Entregar' }
      };
      const config = statusFlow[status];
      if (config) {
        return { ...config, enabled: true, color: getStatusColor(config.nextStatus) };
      }
      return { enabled: false };
    }

    // Default: fluxo completo
    const defaultFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'on_way',
      on_way: 'delivered'
    };
    const nextStatus = defaultFlow[status];
    if (nextStatus) {
      return { nextStatus, label: getStatusLabel(nextStatus), enabled: true, color: getStatusColor(nextStatus) };
    }
    return { enabled: false };
  };

  // Sprint 59: Validar Instagram Cashback
  const handleValidateInstagram = async (validated) => {
    setValidatingInstagram(true);
    try {
      const response = await api.patch(`/orders/${order.id}/instagram-cashback`, {
        validated,
        validatedBy: 'staff'
      });

      if (response.data.success) {
        // Som de conclusão ao entregar
        soundService.playDeliveryComplete();
        if (validated) {
          toast.success('Instagram validado! Cliente receberá 5% de cashback extra.');
        } else {
          toast('Instagram não validado. Pedido será entregue sem cashback extra.', { icon: '⚠️' });
        }
        setShowInstagramValidation(false);
        // Continuar com a entrega
        await updateOrderStatus(order.id, 'delivered');
      } else {
        toast.error(response.data.message || 'Erro ao validar Instagram');
      }
    } catch (error) {
      console.error('Erro ao validar Instagram:', error);
      toast.error('Erro ao validar Instagram: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setValidatingInstagram(false);
    }
  };

  // Passar para próximo status
  const handleNextStatus = async () => {
    const config = getRoleActionConfig();
    console.log('🔄 handleNextStatus chamado:', { orderId: order.id, config, userRole });

    if (!config.enabled || !config.nextStatus) {
      console.log('❌ Ação não permitida:', { enabled: config.enabled, nextStatus: config.nextStatus });
      return;
    }

    // Sprint 59: Se próximo status é 'delivered' e pedido tem Instagram cashback pendente
    if (config.nextStatus === 'delivered' && order.wantsInstagramCashback && order.instagramCashbackStatus === 'pending_validation') {
      setShowInstagramValidation(true);
      return;
    }

    setUpdatingStatus(true);
    try {
      // Sprint 58: Som ao clicar no botão de ação
      // Se for entrega, usar som de conclusão; caso contrário, som normal
      if (config.nextStatus === 'delivered') {
        soundService.playDeliveryComplete();
      } else {
        soundService.playStatusChange();
      }

      console.log('📡 Chamando updateOrderStatus:', order.id, config.nextStatus);
      const result = await updateOrderStatus(order.id, config.nextStatus);
      console.log('✅ Status atualizado com sucesso:', result);
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusColor = getStatusColor(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg"
      style={{ borderColor: statusColor }}
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        style={{ backgroundColor: `${statusColor}15` }}
      >
        <div className="flex items-start justify-between mb-3">
          {/* Número do Pedido */}
          <div>
            <div className="text-xs font-semibold uppercase text-gray-500">Pedido #</div>
            <div className="text-2xl font-bold text-white">{order.orderNumber}</div>
          </div>

          {/* Status Badge */}
          <motion.div
            className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: statusColor }}
          >
            {getStatusLabel(order.status)}
          </motion.div>

          {/* Ícone Expandir */}
          <button className="text-gray-400 hover:text-white transition-colors">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Timer se em preparo */}
        {(order.status === 'preparing' || order.status === 'pending' || order.status === 'confirmed') && (
          <div className="mb-3">
            <CountdownTimer
              orderId={order.id}
              startedAt={order.startedAt || order.createdAt}
              thresholdMinutes={15}
              onThresholdReached={onTimerAlert}
            />
          </div>
        )}

        {/* Informações Rápidas */}
        <div className="flex items-center gap-4 text-sm text-gray-300">
          {order.table && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: palette?.secondary || '#00D4FF' }} />
              <span>Mesa {order.table.number}</span>
            </div>
          )}
          {order.customer && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: palette?.secondary || '#00D4FF' }} />
              <span>{order.customer.nome}</span>
            </div>
          )}
          {order.items && (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: palette?.secondary || '#00D4FF' }} />
              <span>{order.items.length} itens</span>
            </div>
          )}
        </div>

        {/* Sprint 59: Badge Instagram Cashback */}
        {order.wantsInstagramCashback && (
          <div className="mt-2 flex items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
              order.instagramCashbackStatus === 'validated'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : order.instagramCashbackStatus === 'rejected'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
            }`}>
              <Instagram className="w-3 h-3" />
              <span>
                {order.instagramCashbackStatus === 'validated'
                  ? 'Instagram Validado (+5%)'
                  : order.instagramCashbackStatus === 'rejected'
                  ? 'Instagram Recusado'
                  : 'Instagram Pendente'}
              </span>
            </div>
          </div>
        )}

        {/* Sprint 57: Botão de Ação Principal - sempre visível no header */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (() => {
          const config = getRoleActionConfig();
          if (!config.enabled) return null;
          return (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Evita expandir o card ao clicar no botão
                handleNextStatus();
              }}
              disabled={updatingStatus}
              className="mt-3 w-full py-3 px-4 rounded-lg font-semibold text-white transition-all disabled:opacity-50 hover:scale-[1.02] cursor-pointer"
              style={{ backgroundColor: config.color || statusColor }}
            >
              {updatingStatus ? 'Atualizando...' : config.label}
            </button>
          );
        })()}
      </div>

      {/* Conteúdo Expandido */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-700 p-4 space-y-4"
        >
          {/* Itens do Pedido */}
          {order.items && order.items.length > 0 && (
            <div>
              <h4 className="font-semibold text-white mb-2">Itens</h4>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start p-2 bg-black/30 rounded">
                    <div>
                      <p className="text-sm font-medium text-white">{item.productName}</p>
                      <p className="text-xs text-gray-400">{item.productCategory}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-300">x{item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notas */}
          {order.notes && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" style={{ color: palette?.primary || '#FF006E' }} />
                <h4 className="font-semibold text-white">Observações</h4>
              </div>
              <p className="text-sm text-gray-300 italic">{order.notes}</p>
            </div>
          )}

          {/* Total */}
          <div className="pt-2 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total</span>
              <span className="text-lg font-bold" style={{ color: palette?.primary || '#FF006E' }}>
                R$ {parseFloat(order.total).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botão de Chat - Sprint 56 */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowChat(true)}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors"
              title="Chat com cliente"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">Chat</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Sprint 56: Componente de Chat */}
      {showChat && (
        <OrderChat
          orderId={order.id}
          orderNumber={order.orderNumber}
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          isStaff={true}
        />
      )}

      {/* Sprint 59: Modal de Validação Instagram */}
      {showInstagramValidation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowInstagramValidation(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-pink-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Validar Instagram</h3>
                <p className="text-sm text-gray-400">Pedido #{order.orderNumber}</p>
              </div>
            </div>

            <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-pink-200 mb-3">
                Este cliente optou por participar do <strong>Cashback Instagram</strong>.
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <Camera className="w-4 h-4 text-pink-400 mt-0.5" />
                  <span>Verifique se o cliente postou uma foto do pedido</span>
                </div>
                <div className="flex items-start gap-2">
                  <Instagram className="w-4 h-4 text-pink-400 mt-0.5" />
                  <span>A postagem deve marcar <strong>@flamelounge_</strong></span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleValidateInstagram(false)}
                disabled={validatingInstagram}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                <XCircle className="w-5 h-5" />
                {validatingInstagram ? 'Aguarde...' : 'Não Validar'}
              </button>
              <button
                onClick={() => handleValidateInstagram(true)}
                disabled={validatingInstagram}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                {validatingInstagram ? 'Validando...' : 'Validar'}
              </button>
            </div>

            <button
              onClick={() => setShowInstagramValidation(false)}
              className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StaffOrderCard;
