/**
 * Sprint 58: Servico centralizado de sons
 * Evita duplicacao de sons e garante consistencia
 */

class SoundService {
  constructor() {
    this.audioContext = null;
    this.lastPlayedTime = {};
    this.debounceMs = 500; // Evitar tocar mesmo som em menos de 500ms
  }

  getAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Verificar se pode tocar (debounce)
  canPlay(soundName) {
    const now = Date.now();
    const lastPlayed = this.lastPlayedTime[soundName] || 0;

    if (now - lastPlayed < this.debounceMs) {
      console.log(`🔇 Som "${soundName}" bloqueado (debounce)`);
      return false;
    }

    this.lastPlayedTime[soundName] = now;
    return true;
  }

  // Tocar um beep simples
  playBeep(frequency = 600, duration = 300, volume = 0.3) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Erro ao reproduzir som:', error);
    }
  }

  // ========================================
  // SONS PADRONIZADOS POR ACAO
  // ========================================

  // Novo pedido chegou (para staff)
  playNewOrder() {
    if (!this.canPlay('newOrder')) return;

    console.log('🔔 Som: Novo pedido');
    this.playBeep(600, 100, 0.3);
    setTimeout(() => this.playBeep(800, 100, 0.3), 130);
    setTimeout(() => this.playBeep(600, 150, 0.3), 260);
  }

  // Acao de sucesso (botao clicado, status atualizado)
  playSuccess() {
    if (!this.canPlay('success')) return;

    console.log('🔔 Som: Sucesso');
    this.playBeep(400, 150, 0.3);
    setTimeout(() => this.playBeep(600, 150, 0.3), 180);
    setTimeout(() => this.playBeep(800, 150, 0.3), 360);
  }

  // Alerta de atraso ou urgencia
  playUrgent() {
    if (!this.canPlay('urgent')) return;

    console.log('🔔 Som: Urgente');
    this.playBeep(900, 150, 0.4);
    setTimeout(() => this.playBeep(900, 150, 0.4), 200);
    setTimeout(() => this.playBeep(900, 200, 0.4), 400);
  }

  // Alerta generico (notificacao)
  playAlert() {
    if (!this.canPlay('alert')) return;

    console.log('🔔 Som: Alerta');
    this.playBeep(800, 200, 0.35);
    setTimeout(() => this.playBeep(800, 200, 0.35), 250);
  }

  // Erro
  playError() {
    if (!this.canPlay('error')) return;

    console.log('🔔 Som: Erro');
    this.playBeep(800, 200, 0.35);
    setTimeout(() => this.playBeep(600, 200, 0.35), 250);
  }

  // Pedido pronto (para cliente)
  playOrderReady() {
    if (!this.canPlay('orderReady')) return;

    console.log('🔔 Som: Pedido pronto');
    this.playBeep(523, 150, 0.35); // C5
    setTimeout(() => this.playBeep(659, 150, 0.35), 180); // E5
    setTimeout(() => this.playBeep(784, 200, 0.35), 360); // G5
  }

  // Status mudou (para staff ao clicar botao)
  playStatusChange() {
    if (!this.canPlay('statusChange')) return;

    console.log('🔔 Som: Status alterado');
    this.playBeep(500, 100, 0.25);
    setTimeout(() => this.playBeep(700, 150, 0.3), 120);
  }

  // Notificacao de chat
  playChat() {
    if (!this.canPlay('chat')) return;

    console.log('🔔 Som: Chat');
    this.playBeep(880, 100, 0.2);
    setTimeout(() => this.playBeep(1100, 100, 0.2), 130);
  }

  // Troca de carvao narguilé
  playCoalChange() {
    if (!this.canPlay('coalChange')) return;

    console.log('🔔 Som: Troca de carvao');
    this.playBeep(600, 200, 0.3);
    setTimeout(() => this.playBeep(600, 200, 0.3), 300);
  }

  // Notificação genérica (para garçom chamado, etc)
  playNotification() {
    if (!this.canPlay('notification')) return;

    console.log('🔔 Som: Notificacao');
    this.playBeep(700, 150, 0.35);
    setTimeout(() => this.playBeep(900, 150, 0.35), 200);
    setTimeout(() => this.playBeep(700, 200, 0.35), 400);
  }

  // Pagamento pendente (para atendente) - som mais forte e perceptível
  playPaymentRequest() {
    if (!this.canPlay('paymentRequest')) return;

    console.log('🔔 Som: Pagamento pendente');
    // Sequência mais longa e perceptível - tipo alarme
    this.playBeep(880, 150, 0.5);
    setTimeout(() => this.playBeep(660, 150, 0.5), 200);
    setTimeout(() => this.playBeep(880, 150, 0.5), 400);
    setTimeout(() => this.playBeep(660, 150, 0.5), 600);
    setTimeout(() => this.playBeep(880, 200, 0.5), 800);
  }
}

// Singleton
const soundService = new SoundService();

export default soundService;
