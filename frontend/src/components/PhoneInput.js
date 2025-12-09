import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import {
  countries,
  getCountryByCode,
  getCountriesForDropdown,
  formatPhoneDisplay,
  getPhonePlaceholder
} from '../data/countries';

/**
 * PhoneInput - Componente de entrada de telefone internacional
 *
 * Features:
 * - Seletor de país com bandeiras e DDI
 * - Busca de país por nome ou código
 * - Países prioritários no topo (BR, PT, US, etc.)
 * - Formatação automática do número
 * - Validação de quantidade de dígitos
 * - Retorna número completo com DDI
 * - Auto-detecção de nacionalidade pelo país selecionado
 */
export default function PhoneInput({
  value,
  onChange,
  onBlur,
  onCountryChange,
  error,
  label = 'Número do Celular',
  disabled = false,
  className = '',
  initialCountry = 'BR', // Brasil como padrão
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(() => {
    // Inicializar com Brasil por padrão
    return getCountryByCode('BR');
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Inicializar com valor existente ou país inicial
  useEffect(() => {
    if (value) {
      // Tentar detectar o país pelo código de discagem
      // Ordena por tamanho do dial code (maior primeiro) para match correto
      const sortedCountries = [...countries].sort((a, b) =>
        b.dial.length - a.dial.length
      );

      for (const country of sortedCountries) {
        if (value.startsWith(country.dial)) {
          setSelectedCountry(country);
          const numberPart = typeof value === 'string' ? value.slice(country.dial.length) : '';
          setPhoneNumber(numberPart);
          return;
        }
      }
    }

    // Se não tem valor e tem país inicial diferente do default
    if (!value && initialCountry && initialCountry !== 'BR') {
      const country = getCountryByCode(initialCountry);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Obter lista de países para o dropdown
  const dropdownCountries = getCountriesForDropdown();

  // Filtrar países pela busca
  const filteredCountries = dropdownCountries.filter(item => {
    if (item.divider) return true;
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.dial.includes(search) ||
      item.code.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Handler para toggle do dropdown
  const handleToggleDropdown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      console.log('🔍 [PhoneInput] Toggle dropdown clicked, current isOpen:', isOpen);
      setIsOpen(prev => {
        console.log('🔍 [PhoneInput] Setting isOpen to:', !prev);
        return !prev;
      });
    }
  }, [disabled, isOpen]);

  // Quando muda o país
  const handleCountrySelect = useCallback((country) => {
    console.log('🔍 [PhoneInput] Country selected:', country.name);
    setSelectedCountry(country);
    setIsOpen(false);
    setSearch('');

    // Notificar mudança de país
    if (onCountryChange) {
      onCountryChange(country.code);
    }

    // Notificar mudança do número completo
    if (onChange && phoneNumber) {
      const fullNumber = country.dial + phoneNumber.replace(/\D/g, '');
      onChange(fullNumber, country.code);
    }

    // Focar no input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [onChange, onCountryChange, phoneNumber]);

  // Quando digita o número
  const handlePhoneChange = (e) => {
    // Remove tudo que não é dígito
    const digits = e.target.value.replace(/\D/g, '');

    // Limitar ao máximo de dígitos do país
    const maxDigits = selectedCountry?.digits?.max || 15;
    const limited = digits.slice(0, maxDigits);

    setPhoneNumber(limited);

    if (onChange && selectedCountry) {
      const fullNumber = selectedCountry.dial + limited;
      onChange(fullNumber, selectedCountry.code);
    }
  };

  // Handler para tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onBlur) onBlur();
    }
  };

  // Formatar número para exibição
  const displayNumber = selectedCountry
    ? formatPhoneDisplay(phoneNumber, selectedCountry.code)
    : phoneNumber;

  // Placeholder com máscara do país
  const getPlaceholder = () => {
    if (!selectedCountry) return 'Selecione o país';
    return getPhonePlaceholder(selectedCountry.code);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          {label}
        </label>
      )}

      <div className={`flex border rounded-lg bg-neutral-800 transition-colors ${
        error ? 'border-red-500' : 'border-neutral-600 focus-within:border-[var(--theme-primary)] focus-within:ring-2 focus-within:ring-[var(--theme-primary)]/20'
      }`}>
        {/* Seletor de País */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={handleToggleDropdown}
            disabled={disabled}
            className={`flex items-center gap-2 px-3 py-3 bg-neutral-700 hover:bg-neutral-600 transition-colors border-r border-neutral-600 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] ${
              !selectedCountry ? 'text-neutral-400' : ''
            }`}
          >
            {selectedCountry ? (
              <>
                <span className="text-xl">{selectedCountry.flag}</span>
                <span className="text-white text-sm font-medium">{selectedCountry.dial}</span>
              </>
            ) : (
              <span className="text-sm">Selecionar país</span>
            )}
            <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ml-auto ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown de Países */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-80 max-h-80 bg-neutral-800 border border-neutral-600 rounded-lg shadow-xl overflow-hidden" style={{ zIndex: 9999 }}>
              {/* Campo de Busca */}
              <div className="p-2 border-b border-neutral-700 sticky top-0 bg-neutral-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar país ou código..."
                    className="w-full pl-9 pr-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white text-sm placeholder-neutral-400 focus:outline-none focus:border-[var(--theme-primary)]"
                    autoFocus
                  />
                </div>
              </div>

              {/* Lista de Países */}
              <div className="max-h-60 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((item, index) => {
                    // Renderizar divisor
                    if (item.divider) {
                      return (
                        <div key="divider" className="border-t border-neutral-700 my-1">
                          <p className="text-xs text-neutral-500 px-3 py-1">Outros países</p>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleCountrySelect(item)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-700 transition-colors text-left ${
                          selectedCountry?.code === item.code ? 'bg-neutral-700' : ''
                        }`}
                      >
                        <span className="text-xl">{item.flag}</span>
                        <span className="text-white text-sm flex-1 truncate">{item.name}</span>
                        <span className="text-neutral-400 text-sm font-mono">{item.dial}</span>
                        {selectedCountry?.code === item.code && (
                          <div className="w-2 h-2 rounded-full bg-[var(--theme-primary)]" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-4 text-center text-neutral-400 text-sm">
                    Nenhum país encontrado
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input do Número */}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            value={displayNumber}
            onChange={handlePhoneChange}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            disabled={disabled || !selectedCountry}
            className="w-full px-4 py-3 bg-transparent text-white placeholder-neutral-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
          />
        </div>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

// Exportar função utilitária para validação
export const validatePhoneNumber = (fullNumber, countryCode) => {
  if (!fullNumber) return false;

  const country = getCountryByCode(countryCode);
  if (!country) return false;

  // Obter apenas os números após o código do país
  const fullStr = typeof fullNumber === 'string' ? fullNumber : String(fullNumber || '');
  const numberPart = fullStr.startsWith(country.dial)
    ? fullStr.slice(country.dial.length).replace(/\D/g, '')
    : fullStr.replace(/\D/g, '');

  // Verificar quantidade de dígitos
  return numberPart.length >= country.digits.min && numberPart.length <= country.digits.max;
};

// Exportar países
export { countries };
