import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Phone } from 'lucide-react';

// Lista de países com códigos telefônicos e formatos
const countries = [
  { code: 'BR', name: 'Brasil', dial: '+55', flag: '🇧🇷', format: '(##) #####-####', placeholder: '(21) 99999-9999' },
  { code: 'US', name: 'Estados Unidos', dial: '+1', flag: '🇺🇸', format: '(###) ###-####', placeholder: '(555) 123-4567' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹', format: '### ### ###', placeholder: '912 345 678' },
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷', format: '## ####-####', placeholder: '11 1234-5678' },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱', format: '# #### ####', placeholder: '9 1234 5678' },
  { code: 'CO', name: 'Colômbia', dial: '+57', flag: '🇨🇴', format: '### ### ####', placeholder: '312 345 6789' },
  { code: 'MX', name: 'México', dial: '+52', flag: '🇲🇽', format: '## #### ####', placeholder: '55 1234 5678' },
  { code: 'PE', name: 'Peru', dial: '+51', flag: '🇵🇪', format: '### ### ###', placeholder: '912 345 678' },
  { code: 'UY', name: 'Uruguai', dial: '+598', flag: '🇺🇾', format: '## ### ###', placeholder: '99 123 456' },
  { code: 'PY', name: 'Paraguai', dial: '+595', flag: '🇵🇾', format: '### ### ###', placeholder: '981 123 456' },
  { code: 'ES', name: 'Espanha', dial: '+34', flag: '🇪🇸', format: '### ### ###', placeholder: '612 345 678' },
  { code: 'FR', name: 'França', dial: '+33', flag: '🇫🇷', format: '# ## ## ## ##', placeholder: '6 12 34 56 78' },
  { code: 'DE', name: 'Alemanha', dial: '+49', flag: '🇩🇪', format: '### #######', placeholder: '151 1234567' },
  { code: 'IT', name: 'Itália', dial: '+39', flag: '🇮🇹', format: '### ### ####', placeholder: '312 345 6789' },
  { code: 'GB', name: 'Reino Unido', dial: '+44', flag: '🇬🇧', format: '#### ######', placeholder: '7911 123456' },
  { code: 'CA', name: 'Canadá', dial: '+1', flag: '🇨🇦', format: '(###) ###-####', placeholder: '(416) 123-4567' },
  { code: 'AU', name: 'Austrália', dial: '+61', flag: '🇦🇺', format: '### ### ###', placeholder: '412 345 678' },
  { code: 'JP', name: 'Japão', dial: '+81', flag: '🇯🇵', format: '##-####-####', placeholder: '90-1234-5678' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳', format: '### #### ####', placeholder: '131 1234 5678' },
  { code: 'IN', name: 'Índia', dial: '+91', flag: '🇮🇳', format: '##### #####', placeholder: '98765 43210' },
  { code: 'ZA', name: 'África do Sul', dial: '+27', flag: '🇿🇦', format: '## ### ####', placeholder: '71 234 5678' },
  { code: 'AE', name: 'Emirados Árabes', dial: '+971', flag: '🇦🇪', format: '## ### ####', placeholder: '50 123 4567' },
  { code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱', format: '##-###-####', placeholder: '50-123-4567' },
  { code: 'KR', name: 'Coreia do Sul', dial: '+82', flag: '🇰🇷', format: '##-####-####', placeholder: '10-1234-5678' },
  { code: 'RU', name: 'Rússia', dial: '+7', flag: '🇷🇺', format: '### ###-##-##', placeholder: '912 345-67-89' },
  { code: 'NL', name: 'Holanda', dial: '+31', flag: '🇳🇱', format: '# ########', placeholder: '6 12345678' },
  { code: 'BE', name: 'Bélgica', dial: '+32', flag: '🇧🇪', format: '### ## ## ##', placeholder: '470 12 34 56' },
  { code: 'CH', name: 'Suíça', dial: '+41', flag: '🇨🇭', format: '## ### ## ##', placeholder: '78 123 45 67' },
  { code: 'AT', name: 'Áustria', dial: '+43', flag: '🇦🇹', format: '### #######', placeholder: '664 1234567' },
  { code: 'SE', name: 'Suécia', dial: '+46', flag: '🇸🇪', format: '##-### ## ##', placeholder: '70-123 45 67' },
  { code: 'NO', name: 'Noruega', dial: '+47', flag: '🇳🇴', format: '### ## ###', placeholder: '412 34 567' },
  { code: 'DK', name: 'Dinamarca', dial: '+45', flag: '🇩🇰', format: '## ## ## ##', placeholder: '20 12 34 56' },
  { code: 'FI', name: 'Finlândia', dial: '+358', flag: '🇫🇮', format: '## ### ####', placeholder: '40 123 4567' },
  { code: 'PL', name: 'Polônia', dial: '+48', flag: '🇵🇱', format: '### ### ###', placeholder: '512 345 678' },
  { code: 'CZ', name: 'República Tcheca', dial: '+420', flag: '🇨🇿', format: '### ### ###', placeholder: '601 123 456' },
  { code: 'GR', name: 'Grécia', dial: '+30', flag: '🇬🇷', format: '### ### ####', placeholder: '691 234 5678' },
  { code: 'TR', name: 'Turquia', dial: '+90', flag: '🇹🇷', format: '### ### ## ##', placeholder: '532 123 45 67' },
  { code: 'EG', name: 'Egito', dial: '+20', flag: '🇪🇬', format: '### ### ####', placeholder: '100 123 4567' },
  { code: 'NG', name: 'Nigéria', dial: '+234', flag: '🇳🇬', format: '### ### ####', placeholder: '802 123 4567' },
  { code: 'KE', name: 'Quênia', dial: '+254', flag: '🇰🇪', format: '### ######', placeholder: '712 345678' },
  { code: 'TH', name: 'Tailândia', dial: '+66', flag: '🇹🇭', format: '## ### ####', placeholder: '81 234 5678' },
  { code: 'VN', name: 'Vietnã', dial: '+84', flag: '🇻🇳', format: '## ### ## ##', placeholder: '91 234 56 78' },
  { code: 'PH', name: 'Filipinas', dial: '+63', flag: '🇵🇭', format: '### ### ####', placeholder: '917 123 4567' },
  { code: 'MY', name: 'Malásia', dial: '+60', flag: '🇲🇾', format: '##-### ####', placeholder: '12-345 6789' },
  { code: 'SG', name: 'Singapura', dial: '+65', flag: '🇸🇬', format: '#### ####', placeholder: '8123 4567' },
  { code: 'ID', name: 'Indonésia', dial: '+62', flag: '🇮🇩', format: '### ### ####', placeholder: '812 345 6789' },
  { code: 'NZ', name: 'Nova Zelândia', dial: '+64', flag: '🇳🇿', format: '## ### ####', placeholder: '21 123 4567' },
  { code: 'IE', name: 'Irlanda', dial: '+353', flag: '🇮🇪', format: '## ### ####', placeholder: '85 123 4567' },
  { code: 'HU', name: 'Hungria', dial: '+36', flag: '🇭🇺', format: '## ### ####', placeholder: '20 123 4567' },
  { code: 'RO', name: 'Romênia', dial: '+40', flag: '🇷🇴', format: '### ### ###', placeholder: '721 234 567' },
  { code: 'UA', name: 'Ucrânia', dial: '+380', flag: '🇺🇦', format: '## ### ####', placeholder: '50 123 4567' },
  // Adicionar mais conforme necessário
];

// Formatar número de telefone baseado no formato do país
const formatPhoneNumber = (value, format) => {
  if (!value) return '';

  // Remover tudo que não é número
  const numbers = value.replace(/\D/g, '');

  let formatted = '';
  let numberIndex = 0;

  for (let i = 0; i < format.length && numberIndex < numbers.length; i++) {
    if (format[i] === '#') {
      formatted += numbers[numberIndex];
      numberIndex++;
    } else {
      formatted += format[i];
      // Se o próximo caractere do formato não é #, pular para o próximo número
      if (format[i + 1] !== '#' && numberIndex < numbers.length) {
        continue;
      }
    }
  }

  return formatted;
};

// Obter apenas números do telefone
const getPhoneNumbers = (value) => {
  return value.replace(/\D/g, '');
};

export default function PhoneInput({
  value,
  onChange,
  onBlur,
  error,
  label = 'Número do Celular',
  disabled = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Brasil por padrão
  const [phoneNumber, setPhoneNumber] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Inicializar com valor existente
  useEffect(() => {
    if (value) {
      // Tentar detectar o país pelo código
      const matchingCountry = countries.find(c => value.startsWith(c.dial));
      if (matchingCountry) {
        setSelectedCountry(matchingCountry);
        const numberPart = value.slice(matchingCountry.dial.length);
        setPhoneNumber(formatPhoneNumber(numberPart, matchingCountry.format));
      } else {
        // Se não encontrar, assumir que é o número sem código
        setPhoneNumber(formatPhoneNumber(value, selectedCountry.format));
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

  // Filtrar países pela busca
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase()) ||
    country.dial.includes(search) ||
    country.code.toLowerCase().includes(search.toLowerCase())
  );

  // Quando muda o país
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearch('');

    // Reformatar o número para o novo país
    const numbers = getPhoneNumbers(phoneNumber);
    const newFormatted = formatPhoneNumber(numbers, country.format);
    setPhoneNumber(newFormatted);

    // Notificar mudança
    if (onChange) {
      const fullNumber = country.dial + getPhoneNumbers(newFormatted);
      onChange(fullNumber);
    }

    // Focar no input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Quando digita o número
  const handlePhoneChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input, selectedCountry.format);
    setPhoneNumber(formatted);

    if (onChange) {
      const fullNumber = selectedCountry.dial + getPhoneNumbers(formatted);
      onChange(fullNumber);
    }
  };

  // Calcular maxLength baseado no formato
  const maxLength = selectedCountry.format.length;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          {label}
        </label>
      )}

      <div className={`flex border rounded-lg bg-neutral-800 overflow-hidden transition-colors ${
        error ? 'border-magenta-500' : 'border-neutral-600 focus-within:border-magenta-500 focus-within:ring-2 focus-within:ring-magenta-500'
      }`}>
        {/* Seletor de País */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-3 bg-neutral-700 hover:bg-neutral-600 transition-colors border-r border-neutral-600 min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xl">{selectedCountry.flag}</span>
            <span className="text-white text-sm font-medium">{selectedCountry.dial}</span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown de Países */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-72 max-h-80 bg-neutral-800 border border-neutral-600 rounded-lg shadow-xl z-50 overflow-hidden">
              {/* Campo de Busca */}
              <div className="p-2 border-b border-neutral-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar país ou código..."
                    className="w-full pl-9 pr-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white text-sm placeholder-neutral-400 focus:outline-none focus:border-magenta-500"
                    autoFocus
                  />
                </div>
              </div>

              {/* Lista de Países */}
              <div className="max-h-60 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-700 transition-colors text-left ${
                        selectedCountry.code === country.code ? 'bg-neutral-700' : ''
                      }`}
                    >
                      <span className="text-xl">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{country.name}</p>
                        <p className="text-neutral-400 text-xs">{country.dial}</p>
                      </div>
                      {selectedCountry.code === country.code && (
                        <div className="w-2 h-2 rounded-full bg-magenta-500" />
                      )}
                    </button>
                  ))
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
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            ref={inputRef}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onBlur={onBlur}
            placeholder={selectedCountry.placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className="w-full pl-10 pr-3 py-3 bg-transparent text-white placeholder-neutral-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <p className="mt-2 text-sm text-magenta-400">{error}</p>
      )}

      {/* Dica do formato */}
      <p className="mt-1 text-xs text-neutral-500">
        Formato: {selectedCountry.dial} {selectedCountry.placeholder}
      </p>
    </div>
  );
}

// Exportar função utilitária para validação
export const validatePhoneNumber = (fullNumber) => {
  if (!fullNumber) return false;

  // Encontrar o país pelo código
  const country = countries.find(c => fullNumber.startsWith(c.dial));
  if (!country) return false;

  // Obter apenas os números após o código do país
  const numberPart = fullNumber.slice(country.dial.length).replace(/\D/g, '');

  // Contar quantos # tem no formato (quantidade de dígitos esperados)
  const expectedDigits = (country.format.match(/#/g) || []).length;

  return numberPart.length === expectedDigits;
};

// Exportar lista de países
export { countries };
