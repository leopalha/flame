import React from 'react';

/**
 * ErrorBoundary - Captura erros de runtime em componentes filhos
 * Evita que um erro em um componente quebre toda a aplicação
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

    // Em produção, pode enviar para um serviço de monitoramento
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Tentar limpar cache se o erro persistir
      try {
        const errorCount = parseInt(sessionStorage.getItem('errorCount') || '0');
        if (errorCount < 2) {
          sessionStorage.setItem('errorCount', String(errorCount + 1));
        }
      } catch (e) {
        // Ignorar erros de sessionStorage
      }
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
              <img
                src="/logo-flame.png"
                alt="FLAME"
                className="w-24 h-24 mx-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Ops! Algo deu errado
            </h1>
            <p className="text-gray-400 mb-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Ocorreu um erro inesperado. Por favor, tente recarregar a página.
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
                Recarregar Página
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
                Voltar ao Início
              </button>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="mt-6 p-4 bg-red-900/30 rounded-lg text-left">
                <p className="text-red-400 text-sm font-mono break-all">
                  {this.state.error.toString()}
                </p>
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
