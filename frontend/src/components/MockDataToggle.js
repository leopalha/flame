import { useState, useEffect } from 'react';
import { Database, Globe } from 'lucide-react';
import { safeLocalStorage } from '../utils/storage';

const MockDataToggle = () => {
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const stored = safeLocalStorage.getItem('useMockData') === 'true';
    setUseMockData(stored);
  }, []);

  const toggleMockData = () => {
    const newValue = !useMockData;
    setUseMockData(newValue);
    safeLocalStorage.setItem('useMockData', newValue.toString());

    // Força reload da página para aplicar a mudança
    window.location.reload();
  };

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleMockData}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
          useMockData
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
        title={useMockData ? 'Usando dados mockados - Clique para usar API' : 'Usando API real - Clique para usar dados mockados'}
      >
        {useMockData ? (
          <>
            <Database className="w-4 h-4" />
            Mock Data
          </>
        ) : (
          <>
            <Globe className="w-4 h-4" />
            API Real
          </>
        )}
      </button>
      
      {/* Tooltip informativo */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {useMockData 
            ? 'Dados mockados ativos - produtos visíveis no cardápio'
            : 'API real ativa - pode não ter produtos cadastrados'
          }
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default MockDataToggle;