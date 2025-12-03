# 🎨 FLAME - DESIGN SYSTEM

## VISÃO GERAL

Sistema de design para a plataforma FLAME, baseado no logo com gradiente magenta → ciano sobre fundo preto.

---

## 1. CORES

### 1.1 Paleta Primária (Gradiente do Logo)

```javascript
// tailwind.config.js
colors: {
  flame: {
    magenta:    '#FF006E',  // Topo do gradiente
    pink:       '#FF4D94',  // Transição 1
    purple:     '#B266FF',  // Centro
    cyan:       '#00D4FF',  // Transição 2
    blue:       '#0099FF',  // Base do gradiente
  }
}
```

### 1.2 Escala de Magenta

```javascript
magenta: {
  50:  '#FFF0F6',
  100: '#FFE0ED',
  200: '#FFC2DB',
  300: '#FF8FBF',
  400: '#FF4D94',
  500: '#FF006E',  // PRINCIPAL
  600: '#DB005E',
  700: '#B8004E',
  800: '#94003F',
  900: '#700030',
  950: '#4D0021',
}
```

### 1.3 Escala de Cyan

```javascript
cyan: {
  50:  '#ECFEFF',
  100: '#CFFAFE',
  200: '#A5F3FC',
  300: '#67E8F9',
  400: '#22D3EE',
  500: '#00D4FF',  // PRINCIPAL
  600: '#0099FF',
  700: '#0284C7',
  800: '#0369A1',
  900: '#075985',
  950: '#0C4A6E',
}
```

### 1.4 Neutros (Dark Theme)

```javascript
neutral: {
  0:   '#000000',  // Background principal
  50:  '#0A0A0A',  // Surface
  100: '#141414',  // Cards
  200: '#1A1A1A',  // Hover
  300: '#262626',  // Borders
  400: '#404040',  // Disabled
  500: '#666666',  // Muted text
  600: '#808080',
  700: '#A1A1A1',  // Secondary text
  800: '#C4C4C4',
  900: '#E5E5E5',
  950: '#F5F5F5',
  1000: '#FFFFFF', // Primary text
}
```

### 1.5 Cores Semânticas

```javascript
semantic: {
  success: {
    light: '#34D399',
    DEFAULT: '#10B981',
    dark: '#059669',
  },
  warning: {
    light: '#FBBF24',
    DEFAULT: '#F59E0B',
    dark: '#D97706',
  },
  error: {
    light: '#F87171',
    DEFAULT: '#EF4444',
    dark: '#DC2626',
  },
  info: {
    light: '#60A5FA',
    DEFAULT: '#3B82F6',
    dark: '#2563EB',
  }
}
```

### 1.6 Gradientes

```css
/* Gradiente Principal (Logo) */
.gradient-flame {
  background: linear-gradient(180deg, #FF006E 0%, #B266FF 50%, #00D4FF 100%);
}

/* Gradiente Horizontal */
.gradient-flame-horizontal {
  background: linear-gradient(90deg, #FF006E 0%, #B266FF 50%, #00D4FF 100%);
}

/* Gradiente para Texto */
.text-gradient-flame {
  background: linear-gradient(180deg, #FF006E 0%, #00D4FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Gradiente Botão Hover */
.gradient-flame-hover {
  background: linear-gradient(180deg, #FF4D94 0%, #C77DFF 50%, #22D3EE 100%);
}

/* Gradiente Sutil (Backgrounds) */
.gradient-flame-subtle {
  background: linear-gradient(180deg, rgba(255,0,110,0.1) 0%, rgba(0,212,255,0.1) 100%);
}
```

---

## 2. TIPOGRAFIA

### 2.1 Fontes

```javascript
// fonts.js
import { Bebas_Neue, Inter, Montserrat } from 'next/font/google'

export const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})
```

### 2.2 Configuração Tailwind

```javascript
fontFamily: {
  display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
  heading: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
  body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
}
```

### 2.3 Escala Tipográfica

| Token | Tamanho | Line Height | Uso |
|-------|---------|-------------|-----|
| `text-xs` | 12px | 16px | Labels, captions |
| `text-sm` | 14px | 20px | Texto auxiliar |
| `text-base` | 16px | 24px | Corpo principal |
| `text-lg` | 18px | 28px | Corpo destacado |
| `text-xl` | 20px | 28px | Subtítulos |
| `text-2xl` | 24px | 32px | Títulos de seção |
| `text-3xl` | 30px | 36px | Títulos de página |
| `text-4xl` | 36px | 40px | Hero mobile |
| `text-5xl` | 48px | 48px | Hero desktop |
| `text-6xl` | 60px | 60px | Display |

### 2.4 Pesos

```javascript
fontWeight: {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}
```

---

## 3. ESPAÇAMENTO

### 3.1 Escala Base (4px)

```javascript
spacing: {
  px: '1px',
  0: '0',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
}
```

### 3.2 Tokens Semânticos

```css
--space-page-x: 16px;      /* Mobile */
--space-page-x-md: 24px;   /* Tablet */
--space-page-x-lg: 32px;   /* Desktop */

--space-section: 48px;     /* Entre seções */
--space-card: 16px;        /* Padding interno de cards */
--space-stack: 8px;        /* Entre elementos empilhados */
--space-inline: 8px;       /* Entre elementos inline */
```

---

## 4. BORDAS E RAIOS

### 4.1 Border Radius

```javascript
borderRadius: {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
}
```

### 4.2 Borders

```javascript
borderWidth: {
  0: '0',
  DEFAULT: '1px',
  2: '2px',
  3: '3px',
  4: '4px',
}

borderColor: {
  DEFAULT: '#262626',
  flame: '#FF006E',
  cyan: '#00D4FF',
}
```

---

## 5. SOMBRAS E EFEITOS

### 5.1 Box Shadows

```javascript
boxShadow: {
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
  'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5)',
  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
  'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
  'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
  
  // Glows da marca
  'glow-magenta': '0 0 20px rgba(255, 0, 110, 0.4)',
  'glow-magenta-strong': '0 0 40px rgba(255, 0, 110, 0.6)',
  'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.4)',
  'glow-cyan-strong': '0 0 40px rgba(0, 212, 255, 0.6)',
  'glow-purple': '0 0 30px rgba(178, 102, 255, 0.4)',
  
  // Cards
  'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
  'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 0, 110, 0.1)',
}
```

### 5.2 Backdrop Blur

```javascript
backdropBlur: {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
}
```

---

## 6. ANIMAÇÕES

### 6.1 Transições

```javascript
transitionDuration: {
  fast: '150ms',
  DEFAULT: '300ms',
  slow: '500ms',
}

transitionTimingFunction: {
  DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}
```

### 6.2 Keyframes

```javascript
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  fadeOut: {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' },
  },
  slideUp: {
    '0%': { transform: 'translateY(10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  slideDown: {
    '0%': { transform: 'translateY(-10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
  glow: {
    '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 110, 0.4)' },
    '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' },
  },
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
  flame: {
    '0%, 100%': { filter: 'hue-rotate(0deg)' },
    '50%': { filter: 'hue-rotate(30deg)' },
  },
}

animation: {
  'fade-in': 'fadeIn 0.3s ease-out',
  'fade-out': 'fadeOut 0.3s ease-out',
  'slide-up': 'slideUp 0.3s ease-out',
  'slide-down': 'slideDown 0.3s ease-out',
  'pulse': 'pulse 2s infinite',
  'glow': 'glow 3s ease-in-out infinite',
  'shimmer': 'shimmer 2s infinite',
  'flame': 'flame 4s ease-in-out infinite',
}
```

---

## 7. COMPONENTES BASE

### 7.1 Botões

```css
/* Primário (Gradiente) */
.btn-primary {
  @apply bg-gradient-to-b from-flame-magenta to-flame-cyan 
         text-white font-semibold px-6 py-3 rounded-lg
         transition-all duration-300
         hover:shadow-glow-magenta hover:scale-[1.02]
         active:scale-[0.98]
         disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Secundário (Outline) */
.btn-secondary {
  @apply border-2 border-flame-magenta text-flame-magenta
         bg-transparent px-6 py-3 rounded-lg font-semibold
         transition-all duration-300
         hover:bg-flame-magenta/10 hover:shadow-glow-magenta;
}

/* Ghost */
.btn-ghost {
  @apply text-white/80 px-4 py-2 rounded-lg
         transition-all duration-300
         hover:bg-white/10 hover:text-white;
}
```

### 7.2 Cards

```css
.card {
  @apply bg-neutral-100 rounded-xl border border-neutral-300
         transition-all duration-300
         hover:border-flame-magenta/30 hover:shadow-card-hover;
}

.card-gradient {
  @apply bg-gradient-to-b from-neutral-100 to-neutral-50
         rounded-xl border border-neutral-300
         transition-all duration-300;
}
```

### 7.3 Inputs

```css
.input {
  @apply w-full bg-neutral-100 border border-neutral-300 
         rounded-lg px-4 py-3 text-white
         placeholder:text-neutral-500
         transition-all duration-300
         focus:outline-none focus:border-flame-magenta 
         focus:ring-2 focus:ring-flame-magenta/20;
}
```

---

## 8. BREAKPOINTS

```javascript
screens: {
  'xs': '375px',   // Mobile pequeno
  'sm': '640px',   // Mobile grande
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop pequeno
  'xl': '1280px',  // Desktop
  '2xl': '1536px', // Desktop grande
}
```

---

## 9. Z-INDEX

```javascript
zIndex: {
  0: '0',
  10: '10',      // Elementos base elevados
  20: '20',      // Dropdowns
  30: '30',      // Sticky headers
  40: '40',      // Overlays
  50: '50',      // Modais
  60: '60',      // Toasts/Notificações
  70: '70',      // Tooltips
  100: '100',    // Máximo (loading screens)
}
```

---

## 10. DARK MODE

O sistema é **dark-first**. O tema claro (se implementado) seria exceção.

```javascript
// tailwind.config.js
darkMode: 'class', // Controlado via classe no <html>
```

---

*FLAME Design System v1.0*
