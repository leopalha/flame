import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function LimparServiceWorker() {
  const router = useRouter();
  const [status, setStatus] = useState('Iniciando limpeza...');
  const [steps, setSteps] = useState([]);

  const addStep = (step) => {
    setSteps(prev => [...prev, step]);
  };

  useEffect(() => {
    const clearEverything = async () => {
      try {
        addStep('✅ Iniciando processo de limpeza');

        // 1. Desregistrar todos os service workers
        if ('serviceWorker' in navigator) {
          setStatus('Desregistrando Service Workers...');
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            if (registrations.length === 0) {
              addStep('ℹ️  Nenhum Service Worker encontrado');
            }
            for (const registration of registrations) {
              const success = await registration.unregister();
              if (success) {
                addStep(`✅ Service Worker desregistrado: ${registration.scope}`);
              } else {
                addStep(`⚠️  Falha ao desregistrar: ${registration.scope}`);
              }
            }
          } catch (e) {
            addStep(`⚠️  Erro ao desregistrar SW: ${e.message}`);
          }
        } else {
          addStep('ℹ️  Service Worker não suportado neste navegador');
        }

        // 2. Limpar todos os caches
        if ('caches' in window) {
          setStatus('Limpando caches...');
          try {
            const cacheNames = await caches.keys();
            if (cacheNames.length === 0) {
              addStep('ℹ️  Nenhum cache encontrado');
            }
            for (const cacheName of cacheNames) {
              const success = await caches.delete(cacheName);
              if (success) {
                addStep(`✅ Cache removido: ${cacheName}`);
              } else {
                addStep(`⚠️  Falha ao remover cache: ${cacheName}`);
              }
            }
          } catch (e) {
            addStep(`⚠️  Erro ao limpar caches: ${e.message}`);
          }
        } else {
          addStep('ℹ️  Cache API não suportada neste navegador');
        }

        // 3. Limpar localStorage
        setStatus('Limpando localStorage...');
        try {
          const localStorageKeys = Object.keys(localStorage);
          localStorage.clear();
          addStep(`✅ localStorage limpo (${localStorageKeys.length} itens)`);
        } catch (e) {
          addStep(`⚠️  Erro ao limpar localStorage: ${e.message}`);
        }

        // 4. Limpar sessionStorage
        setStatus('Limpando sessionStorage...');
        try {
          sessionStorage.clear();
          addStep('✅ sessionStorage limpo');
        } catch (e) {
          addStep(`⚠️  Erro ao limpar sessionStorage: ${e.message}`);
        }

        // 5. Limpar IndexedDB
        if ('indexedDB' in window) {
          setStatus('Limpando IndexedDB...');
          try {
            if (indexedDB.databases) {
              const databases = await indexedDB.databases();
              if (databases.length === 0) {
                addStep('ℹ️  Nenhum IndexedDB encontrado');
              }
              for (const db of databases) {
                indexedDB.deleteDatabase(db.name);
                addStep(`✅ IndexedDB removido: ${db.name}`);
              }
            } else {
              addStep('ℹ️  indexedDB.databases() não disponível');
            }
          } catch (e) {
            addStep(`⚠️  Erro ao limpar IndexedDB: ${e.message}`);
          }
        } else {
          addStep('ℹ️  IndexedDB não suportado neste navegador');
        }

        addStep('');
        addStep('🎉 LIMPEZA CONCLUÍDA!');
        addStep('');
        addStep('⏳ Redirecionando em 3 segundos...');
        setStatus('Limpeza concluída! Redirecionando...');

        // Aguardar 3 segundos e fazer hard reload
        setTimeout(() => {
          // Hard reload - força download de novos arquivos
          window.location.href = '/?_=' + Date.now();
        }, 3000);

      } catch (error) {
        console.error('Erro ao limpar:', error);
        setStatus('❌ Erro ao limpar: ' + error.message);
        addStep('❌ Erro: ' + error.message);
        addStep('');
        addStep('Você pode tentar recarregar a página manualmente com Ctrl+Shift+R');
      }
    };

    clearEverything();
  }, []);

  return (
    <>
      <Head>
        <title>Limpando Cache | FLAME</title>
      </Head>

      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FF006E]/20 mb-4">
                <svg
                  className="w-10 h-10 text-[#FF006E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">Limpeza de Cache</h1>
              <p className="text-gray-400">
                Removendo dados antigos e atualizando o aplicativo
              </p>
            </div>

            {/* Status atual */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF006E]"></div>
                <span className="text-lg">{status}</span>
              </div>
            </div>

            {/* Lista de steps */}
            <div className="bg-black rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
              {steps.map((step, index) => (
                <div key={index} className="mb-1 text-green-400">
                  {step}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>Aguarde enquanto limpamos os dados antigos...</p>
              <p className="mt-2">Você será redirecionado automaticamente.</p>
            </div>

            {/* Botão manual caso algo dê errado */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Ir para Home Agora
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-[#FF006E] hover:bg-[#FF006E]/80 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Recarregar Página
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
