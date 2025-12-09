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
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            addStep(`✅ Service Worker desregistrado: ${registration.scope}`);
          }
        }

        // 2. Limpar todos os caches
        if ('caches' in window) {
          setStatus('Limpando caches...');
          const cacheNames = await caches.keys();
          for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
            addStep(`✅ Cache removido: ${cacheName}`);
          }
        }

        // 3. Limpar localStorage
        setStatus('Limpando localStorage...');
        const localStorageKeys = Object.keys(localStorage);
        localStorage.clear();
        addStep(`✅ localStorage limpo (${localStorageKeys.length} itens)`);

        // 4. Limpar sessionStorage
        setStatus('Limpando sessionStorage...');
        sessionStorage.clear();
        addStep('✅ sessionStorage limpo');

        // 5. Limpar IndexedDB
        if ('indexedDB' in window) {
          setStatus('Limpando IndexedDB...');
          const databases = await indexedDB.databases();
          for (const db of databases) {
            indexedDB.deleteDatabase(db.name);
            addStep(`✅ IndexedDB removido: ${db.name}`);
          }
        }

        addStep('');
        addStep('🎉 LIMPEZA CONCLUÍDA COM SUCESSO!');
        setStatus('Limpeza concluída! Redirecionando...');

        // Aguardar 2 segundos e redirecionar para home
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);

      } catch (error) {
        console.error('Erro ao limpar:', error);
        setStatus('❌ Erro ao limpar: ' + error.message);
        addStep('❌ Erro: ' + error.message);
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
          </div>
        </div>
      </div>
    </>
  );
}
