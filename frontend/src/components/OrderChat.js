/**
 * Sprint 56: Componente de Chat Staff-Cliente
 * Chat em tempo real via Socket.IO para comunicacao sobre pedidos
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, User, Users } from 'lucide-react';
import api from '../services/api';
import socketService from '../services/socket';
import { useAuthStore } from '../stores/authStore';

export default function OrderChat({ orderId, orderNumber, isOpen, onClose, isStaff = false }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Funcao para obter token do localStorage (Zustand persisted)
  const getAuthToken = useCallback(() => {
    try {
      const stored = localStorage.getItem('flame-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed?.state?.token || null;
      }
    } catch (e) {
      console.error('Erro ao ler token:', e);
    }
    return null;
  }, []);

  // Scroll para ultima mensagem
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Carregar mensagens do pedido
  const loadMessages = useCallback(async () => {
    const token = getAuthToken();
    if (!orderId || !token) return;

    setLoading(true);
    try {
      const response = await api.get(`/chat/${orderId}`);
      if (response.data.success) {
        setMessages(response.data.data.messages || []);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId, getAuthToken]);

  // Conectar ao socket e configurar listeners
  useEffect(() => {
    const token = getAuthToken();
    if (!isOpen || !orderId || !token) return;

    // Conectar socket se nao estiver conectado
    if (!socketService.isConnected) {
      socketService.connect(token);
    }

    // Entrar na sala do chat
    socketService.joinChatRoom(orderId);

    // Listener para novas mensagens
    const handleNewMessage = (data) => {
      if (data.orderId === orderId) {
        setMessages(prev => [...prev, data]);
        if (data.senderId !== user?.id) {
          if (isMinimized) {
            setUnreadCount(prev => prev + 1);
          }
          // Marcar como lida se chat estiver aberto
          socketService.markChatAsRead(orderId, [data.id]);
        }
        scrollToBottom();
      }
    };

    // Listener para indicador de digitacao
    const handleTyping = (data) => {
      if (data.orderId === orderId && data.userId !== user?.id) {
        setIsTyping(data.isTyping);
        setTypingUser(data.userName);
      }
    };

    // Listener para mensagens lidas
    const handleRead = (data) => {
      if (data.orderId === orderId) {
        setMessages(prev => prev.map(msg => ({
          ...msg,
          isRead: data.messageIds.includes(msg.id) ? true : msg.isRead
        })));
      }
    };

    socketService.onChatMessage(handleNewMessage);
    socketService.onChatTyping(handleTyping);
    socketService.onChatRead(handleRead);

    // Carregar mensagens existentes
    loadMessages();

    // Cleanup
    return () => {
      socketService.leaveChatRoom(orderId);
      socketService.offChatMessage(handleNewMessage);
      socketService.offChatTyping(handleTyping);
      socketService.offChatRead(handleRead);
    };
  }, [isOpen, orderId, getAuthToken, user?.id, isMinimized, loadMessages, scrollToBottom]);

  // Scroll ao receber novas mensagens
  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom();
    }
  }, [messages, isMinimized, scrollToBottom]);

  // Enviar mensagem
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      socketService.sendChatMessage(orderId, newMessage.trim());
      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  // Emitir indicador de digitacao
  const handleTypingStart = useCallback(() => {
    socketService.emitTyping(orderId, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.emitTyping(orderId, false);
    }, 2000);
  }, [orderId]);

  // Formatar data/hora
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed ${isStaff ? 'bottom-4 right-4' : 'bottom-20 right-4'} z-50
        ${isMinimized ? 'w-72' : 'w-80 sm:w-96'}
        bg-gray-900 border border-orange-500/30 rounded-xl shadow-2xl overflow-hidden
        transition-all duration-300`}
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-white" />
          <div>
            <span className="text-white font-medium text-sm">
              Chat - Pedido #{orderNumber || (typeof orderId === 'string' ? orderId.slice(0, 8) : orderId)}
            </span>
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Body - colapsavel */}
      {!isMinimized && (
        <>
          {/* Area de mensagens */}
          <div className="h-72 overflow-y-auto p-3 space-y-3 bg-gray-800/50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">Nenhuma mensagem ainda</p>
                <p className="text-xs">Envie uma mensagem para iniciar</p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => {
                  const isOwnMessage = msg.senderId === user?.id;
                  const isSystem = msg.messageType === 'system' || msg.senderType === 'sistema';

                  if (isSystem) {
                    return (
                      <div key={msg.id || index} className="text-center">
                        <span className="text-xs text-gray-500 bg-gray-700/50 px-3 py-1 rounded-full">
                          {msg.content}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl px-3 py-2 ${
                          isOwnMessage
                            ? 'bg-orange-600 text-white rounded-br-sm'
                            : 'bg-gray-700 text-gray-100 rounded-bl-sm'
                        }`}
                      >
                        {/* Nome do remetente (apenas para mensagens de outros) */}
                        {!isOwnMessage && (
                          <div className="flex items-center gap-1 mb-1">
                            {msg.senderType === 'staff' ? (
                              <Users className="w-3 h-3 text-orange-400" />
                            ) : (
                              <User className="w-3 h-3 text-gray-400" />
                            )}
                            <span className="text-xs font-medium text-orange-400">
                              {msg.senderName || (msg.senderType === 'staff' ? 'Atendente' : 'Cliente')}
                            </span>
                          </div>
                        )}

                        <p className="text-sm break-words">{msg.content}</p>

                        <div className={`flex items-center gap-1 mt-1 ${
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className="text-xs opacity-70">
                            {formatTime(msg.createdAt)}
                          </span>
                          {isOwnMessage && msg.isRead && (
                            <span className="text-xs text-blue-300">Visto</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Indicador de digitacao */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span>{typingUser || 'Alguem'} esta digitando...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input de mensagem */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700 bg-gray-800">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTypingStart();
                }}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

// Componente de botao flutuante para abrir o chat
export function ChatButton({ orderId, orderNumber, unreadCount = 0, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-medium">Chat</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
