import React from 'react';

/**
 * ErrorBoundary - Captura erros de runtime em componentes filhos
 * Evita que um erro em um componente quebre toda a aplicacao
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para mostrar a UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    this.setState({ errorInfo });

    // Em producao, tentar auto-recovery
    if (typeof window !== 'undefined') {
      try {
        const errorCount = parseInt(sessionStorage.getItem('errorCount') || '0');
        sessionStorage.setItem('errorCount', String(errorCount + 1));

        // Se for o primeiro erro, tentar limpar cache automaticamente
        if (errorCount === 0) {
          console.log('Primeiro erro detectado, tentando auto-recovery...');
          this.handleAutoRecovery();
        }
      } catch (e) {
        // Ignorar erros de sessionStorage
      }
    }
  }

  handleAutoRecovery = async () => {
    if (typeof window === 'undefined') return;

    try {
      // Limpa caches do Service Worker
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Aguarda um pouco e recarrega
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (e) {
      console.error('Auto-recovery failed:', e);
    }
  }

  handleReload = () => {
    // Limpa o sessionStorage de erro e recarrega
    try {
      sessionStorage.removeItem('errorCount');
      this.setState({ hasError: false, error: null, errorInfo: null });
    } catch (e) {
      // Ignorar
    }
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleClearAndReload = async () => {
    if (typeof window === 'undefined') return;

    try {
      // Limpa caches do Service Worker
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      // Limpa localStorage e sessionStorage
      try {
        sessionStorage.clear();
        localStorage.clear();
      } catch (storageError) {
        console.warn('Could not clear storage:', storageError);
      }

      // Reset state e recarrega
      this.setState({ hasError: false, error: null, errorInfo: null });
      window.location.href = '/';
    } catch (e) {
      console.error('Error clearing cache:', e);
      window.location.reload();
    }
  };

  handleGoHome = () => {
    if (typeof window === 'undefined') return;
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback quando ocorre erro - estilo FLAME
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center border border-gray-800">
            {/* Logo FLAME */}
            <div className="mb-6">
              <svg
                viewBox="0 0 100 100"
                className="w-20 h-20 mx-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="flameGradient" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="50%" stopColor="#B266FF" />
                    <stop offset="100%" stopColor="#FF006E" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 10 C30 30 20 50 30 70 C35 80 45 85 50 90 C55 85 65 80 70 70 C80 50 70 30 50 10 Z M50 30 C40 45 35 55 42 68 C45 72 48 75 50 78 C52 75 55 72 58 68 C65 55 60 45 50 30 Z"
                  fill="url(#flameGradient)"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Ops! Algo deu errado
            </h1>
            <p className="text-gray-400 mb-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Ocorreu um erro inesperado. Por favor, tente recarregar a pagina.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 text-white font-semibold rounded-xl transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #FF006E 0%, #00D4FF 100%)',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                Recarregar Pagina
              </button>

              <button
                onClick={this.handleClearAndReload}
                className="w-full py-3 px-4 text-white font-semibold rounded-xl transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #B266FF 0%, #00D4FF 100%)',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                Limpar Cache e Recarregar
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl transition-colors active:scale-95"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Voltar ao Inicio
              </button>
            </div>

            {/* Mostrar erro para debug - temporariamente em producao tambem */}
            {this.state.error && (
              <div className="mt-6 p-4 bg-red-900/30 rounded-lg text-left">
                <p className="text-red-400 text-xs font-mono break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <p className="text-red-300 text-xs mt-2 font-mono break-all opacity-70">
                    {this.state.errorInfo.componentStack?.split('\n').slice(0, 3).join('\n')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
