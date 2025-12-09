// Currency formatting
export const formatCurrency = (value, currency = 'BRL', locale = 'pt-BR') => {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Number formatting
export const formatNumber = (value, decimals = 0, locale = 'pt-BR') => {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// Phone formatting
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

// CPF formatting
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return cpf;
};

// Date formatting
export const formatDate = (date, format = 'short', locale = 'pt-BR') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return '';

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString(locale);
    case 'long':
      return dateObj.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'time':
      return dateObj.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'datetime':
      return dateObj.toLocaleString(locale);
    case 'relative':
      return formatRelativeTime(dateObj);
    default:
      return dateObj.toLocaleDateString(locale);
  }
};

// Relative time formatting (ex: "há 2 horas")
export const formatRelativeTime = (date, locale = 'pt-BR') => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'agora mesmo';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `há ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `há ${diffInMonths} mês${diffInMonths > 1 ? 'es' : ''}`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `há ${diffInYears} ano${diffInYears > 1 ? 's' : ''}`;
};

// Duration formatting (ex: "2h 30min")
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '0min';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}min`;
  }
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}min`;
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }
  
  return `${value.toFixed(decimals)}%`;
};

// Text truncation
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Capitalize first letter
export const capitalize = (text) => {
  if (!text || typeof text !== 'string') return '';

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Title case
export const titleCase = (text) => {
  if (!text || typeof text !== 'string') return '';

  return text
    .toLowerCase()
    .split(' ')
    .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : '')
    .join(' ');
};

// Slugify text (for URLs)
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9 -]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .trim('-'); // Remove leading/trailing -
};

// Extract initials from name
export const getInitials = (name, maxInitials = 2) => {
  if (!name) return '';
  
  const words = name.trim().split(/\s+/);
  const initials = words
    .slice(0, maxInitials)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
    
  return initials;
};

// Mask input values
export const maskInput = (value, mask) => {
  if (!value || !mask) return value;
  
  const cleanValue = value.replace(/\D/g, '');
  let maskedValue = '';
  let valueIndex = 0;
  
  for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
    if (mask[i] === '#') {
      maskedValue += cleanValue[valueIndex];
      valueIndex++;
    } else {
      maskedValue += mask[i];
    }
  }
  
  return maskedValue;
};

// Common masks
export const masks = {
  phone: '(##) #####-####',
  cpf: '###.###.###-##',
  cnpj: '##.###.###/####-##',
  cep: '#####-###',
  date: '##/##/####',
  time: '##:##',
  card: '#### #### #### ####',
};

// Apply mask to input
export const applyMask = (value, maskType) => {
  const mask = masks[maskType];
  if (!mask) return value;
  
  return maskInput(value, mask);
};

// Remove mask from value
export const removeMask = (value) => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};

// Format order status
export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: 'Pendente',
    pending_payment: 'Aguardando Pagamento',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    ready: 'Pronto',
    on_way: 'A Caminho',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  return statusMap[status] || status;
};

// Get status color
export const getStatusColor = (status) => {
  const colorMap = {
    pending: 'yellow',
    pending_payment: 'yellow',
    confirmed: 'blue',
    preparing: 'orange',
    ready: 'green',
    on_way: 'purple',
    delivered: 'green',
    cancelled: 'red',
  };

  return colorMap[status] || 'gray';
};

// Format payment method
export const formatPaymentMethod = (method) => {
  const methodMap = {
    cash: 'Dinheiro',
    card: 'Cartão',
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
  };
  
  return methodMap[method] || method;
};

// Format table number
export const formatTableNumber = (number) => {
  if (!number) return '';
  return `Mesa ${number}`;
};

// Format rating
export const formatRating = (rating, maxRating = 5) => {
  if (!rating) return 'Sem avaliação';
  
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(maxRating - Math.floor(rating));
  return `${stars} (${rating.toFixed(1)})`;
};

export default {
  formatCurrency,
  formatNumber,
  formatPhone,
  formatCPF,
  formatDate,
  formatRelativeTime,
  formatDuration,
  formatFileSize,
  formatPercentage,
  truncateText,
  capitalize,
  titleCase,
  slugify,
  getInitials,
  maskInput,
  masks,
  applyMask,
  removeMask,
  formatOrderStatus,
  getStatusColor,
  formatPaymentMethod,
  formatTableNumber,
  formatRating,
};