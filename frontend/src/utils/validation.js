/**
 * Utilitários de validação para o sistema FLAME
 * CPF, Data de nascimento, Telefone internacional
 */

import { countries, getCountryByCode, isBrazilian } from '../data/countries';

// ============= VALIDAÇÃO DE CPF =============

/**
 * Valida CPF brasileiro
 * @param {string} cpf - CPF com ou sem formatação
 * @returns {boolean}
 */
export const validateCPF = (cpf) => {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');

  // Deve ter 11 dígitos
  if (cleaned.length !== 11) return false;

  // Rejeita CPFs com todos dígitos iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;

  return true;
};

/**
 * Formata CPF para exibição
 * @param {string} cpf - CPF sem formatação
 * @returns {string} CPF formatado (XXX.XXX.XXX-XX)
 */
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
};

/**
 * Remove formatação do CPF
 * @param {string} cpf - CPF formatado
 * @returns {string} CPF sem formatação
 */
export const cleanCPF = (cpf) => {
  return cpf ? cpf.replace(/\D/g, '') : '';
};

// ============= VALIDAÇÃO DE DATA DE NASCIMENTO =============

/**
 * Calcula idade a partir da data de nascimento
 * @param {Date|string} birthDate - Data de nascimento
 * @returns {number} Idade em anos
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return 0;

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Verifica se a pessoa tem idade mínima
 * @param {Date|string} birthDate - Data de nascimento
 * @param {number} minAge - Idade mínima (padrão: 18)
 * @returns {boolean}
 */
export const isMinimumAge = (birthDate, minAge = 18) => {
  return calculateAge(birthDate) >= minAge;
};

/**
 * Valida se a data de nascimento é válida
 * @param {Date|string} birthDate - Data de nascimento
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateBirthDate = (birthDate) => {
  if (!birthDate) {
    return { valid: false, error: 'Data de nascimento é obrigatória' };
  }

  const birth = new Date(birthDate);
  const today = new Date();

  // Verifica se é uma data válida
  if (isNaN(birth.getTime())) {
    return { valid: false, error: 'Data de nascimento inválida' };
  }

  // Não pode ser no futuro
  if (birth > today) {
    return { valid: false, error: 'Data de nascimento não pode ser no futuro' };
  }

  // Idade máxima razoável (120 anos)
  const age = calculateAge(birthDate);
  if (age > 120) {
    return { valid: false, error: 'Data de nascimento inválida' };
  }

  // Mínimo 18 anos
  if (age < 18) {
    return { valid: false, error: 'Você deve ter pelo menos 18 anos' };
  }

  return { valid: true };
};

/**
 * Formata data de nascimento para exibição
 * @param {Date|string} date - Data
 * @returns {string} Data formatada (DD/MM/AAAA)
 */
export const formatBirthDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Converte data do formato DD/MM/AAAA para AAAA-MM-DD
 * @param {string} date - Data no formato DD/MM/AAAA
 * @returns {string} Data no formato AAAA-MM-DD
 */
export const parseBirthDateInput = (date) => {
  if (!date) return '';
  const parts = date.split('/');
  if (parts.length !== 3) return date;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

// ============= VALIDAÇÃO DE TELEFONE INTERNACIONAL =============

/**
 * Valida número de telefone para um país específico
 * @param {string} phone - Número de telefone (apenas dígitos)
 * @param {string} countryCode - Código ISO do país
 * @returns {{ valid: boolean, error?: string }}
 */
export const validatePhone = (phone, countryCode) => {
  if (!phone) {
    return { valid: false, error: 'Número de celular é obrigatório' };
  }

  const country = getCountryByCode(countryCode);
  if (!country) {
    return { valid: false, error: 'País inválido' };
  }

  const digits = phone.replace(/\D/g, '');

  // Verifica quantidade de dígitos
  if (digits.length < country.digits.min) {
    return { valid: false, error: `Número deve ter pelo menos ${country.digits.min} dígitos` };
  }

  if (digits.length > country.digits.max) {
    return { valid: false, error: `Número deve ter no máximo ${country.digits.max} dígitos` };
  }

  // Verifica prefixo de celular (se aplicável)
  if (country.mobileStart && country.mobileStart.length > 0) {
    const startsWithValidPrefix = country.mobileStart.some(prefix =>
      digits.startsWith(prefix)
    );

    if (!startsWithValidPrefix) {
      return {
        valid: false,
        error: `Número de celular deve começar com ${country.mobileStart.join(' ou ')}`
      };
    }
  }

  return { valid: true };
};

/**
 * Converte telefone para formato E.164
 * @param {string} phone - Número de telefone
 * @param {string} countryCode - Código ISO do país
 * @returns {string|null} Número no formato E.164 ou null se inválido
 */
export const toE164Format = (phone, countryCode) => {
  const country = getCountryByCode(countryCode);
  if (!country || !phone) return null;

  const digits = phone.replace(/\D/g, '');
  return `${country.dial}${digits}`;
};

/**
 * Extrai país e número de um telefone E.164
 * @param {string} e164Phone - Número no formato E.164 (+55...)
 * @returns {{ countryCode: string, phone: string } | null}
 */
export const parseE164 = (e164Phone) => {
  if (!e164Phone || !e164Phone.startsWith('+')) return null;

  // Ordena países por tamanho do código de discagem (maior primeiro)
  // para evitar match errado (ex: +1 vs +1876)
  const sortedCountries = [...countries].sort((a, b) =>
    b.dial.length - a.dial.length
  );

  for (const country of sortedCountries) {
    if (e164Phone.startsWith(country.dial)) {
      return {
        countryCode: country.code,
        phone: e164Phone.slice(country.dial.length)
      };
    }
  }

  return null;
};

// ============= VALIDAÇÃO DE DOCUMENTO DE IDENTIDADE =============

/**
 * Valida documento de identidade estrangeiro
 * Regras básicas: não vazio, comprimento mínimo
 * @param {string} foreignId - Número do documento
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateForeignId = (foreignId) => {
  if (!foreignId) {
    return { valid: false, error: 'Número do documento é obrigatório' };
  }

  const cleaned = foreignId.trim();

  if (cleaned.length < 5) {
    return { valid: false, error: 'Número do documento muito curto' };
  }

  if (cleaned.length > 30) {
    return { valid: false, error: 'Número do documento muito longo' };
  }

  // Aceita letras, números, hífens e pontos
  if (!/^[a-zA-Z0-9.\-]+$/.test(cleaned)) {
    return { valid: false, error: 'Documento contém caracteres inválidos' };
  }

  return { valid: true };
};

// ============= VALIDAÇÃO COMPLETA DE CADASTRO =============

/**
 * Valida todos os dados de cadastro
 * @param {Object} data - Dados do formulário
 * @returns {{ valid: boolean, errors: Object }}
 */
export const validateRegistration = (data) => {
  const errors = {};

  // Nome
  if (!data.nome || data.nome.trim().length < 2) {
    errors.nome = 'Nome deve ter pelo menos 2 caracteres';
  }

  // Email
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email inválido';
  }

  // Telefone
  const phoneValidation = validatePhone(data.phone, data.countryCode);
  if (!phoneValidation.valid) {
    errors.phone = phoneValidation.error;
  }

  // Data de nascimento
  const birthValidation = validateBirthDate(data.birthDate);
  if (!birthValidation.valid) {
    errors.birthDate = birthValidation.error;
  }

  // CPF (apenas para brasileiros)
  if (isBrazilian(data.countryCode)) {
    if (!data.cpf) {
      errors.cpf = 'CPF é obrigatório para brasileiros';
    } else if (!validateCPF(data.cpf)) {
      errors.cpf = 'CPF inválido';
    }
  } else {
    // Documento estrangeiro
    const foreignIdValidation = validateForeignId(data.foreignId);
    if (!foreignIdValidation.valid) {
      errors.foreignId = foreignIdValidation.error;
    }
  }

  // Senha
  if (!data.password || data.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres';
  }

  // Confirmação de senha
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Senhas não conferem';
  }

  // Termos
  if (!data.acceptTerms) {
    errors.acceptTerms = 'Você deve aceitar os termos de uso';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateCPF,
  formatCPF,
  cleanCPF,
  calculateAge,
  isMinimumAge,
  validateBirthDate,
  formatBirthDate,
  parseBirthDateInput,
  validatePhone,
  toE164Format,
  parseE164,
  validateForeignId,
  validateRegistration
};
