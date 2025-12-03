/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ============================================
        // FLAME Brand Colors - Gradiente Magenta -> Cyan
        // ============================================
        flame: {
          magenta: '#FF006E',   // Topo do gradiente (rosa/magenta vibrante)
          pink: '#FF4D94',      // Transicao 1
          purple: '#B266FF',    // Centro (roxo)
          cyan: '#00D4FF',      // Transicao 2 (ciano/azul eletrico)
          blue: '#0099FF',      // Base do gradiente
        },

        // Escala de Magenta
        magenta: {
          50: '#FFF0F6',
          100: '#FFE0ED',
          200: '#FFC2DB',
          300: '#FF8FBF',
          400: '#FF4D94',
          500: '#FF006E',       // PRINCIPAL
          600: '#DB005E',
          700: '#B8004E',
          800: '#94003F',
          900: '#700030',
          950: '#4D0021',
        },

        // Escala de Cyan
        cyan: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#00D4FF',       // PRINCIPAL
          600: '#0099FF',
          700: '#0284C7',
          800: '#0369A1',
          900: '#075985',
          950: '#0C4A6E',
        },

        // Neutros (Dark Theme - padrao Tailwind: numeros baixos = claro, altos = escuro)
        // Para dark theme, usamos o inverso nos componentes
        neutral: {
          50: '#FAFAFA',        // Mais claro
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',       // Meio
          600: '#525252',
          700: '#404040',       // Borders
          800: '#262626',       // Cards/Surface
          900: '#171717',       // Background secundario
          950: '#0A0A0A',       // Background principal
        },

        // Cores Semanticas
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#10B981',       // DEFAULT
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',       // DEFAULT
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',       // DEFAULT
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',       // DEFAULT
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
      },

      fontFamily: {
        display: ['var(--font-bebas)', 'Bebas Neue', 'Impact', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'Montserrat', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }]
      },

      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },

      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        'full': '9999px',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-soft': 'bounceSoft 1s ease-in-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'flame': 'flame 4s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        bounceSoft: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 110, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        flame: {
          '0%, 100%': { filter: 'hue-rotate(0deg)' },
          '50%': { filter: 'hue-rotate(30deg)' }
        },
      },

      backgroundImage: {
        // Gradientes FLAME
        'gradient-flame': 'linear-gradient(180deg, #FF006E 0%, #B266FF 50%, #00D4FF 100%)',
        'gradient-flame-horizontal': 'linear-gradient(90deg, #FF006E 0%, #B266FF 50%, #00D4FF 100%)',
        'gradient-flame-diagonal': 'linear-gradient(135deg, #FF006E 0%, #B266FF 50%, #00D4FF 100%)',
        'gradient-flame-subtle': 'linear-gradient(180deg, rgba(255,0,110,0.1) 0%, rgba(0,212,255,0.1) 100%)',
        'gradient-flame-hover': 'linear-gradient(180deg, #FF4D94 0%, #C77DFF 50%, #22D3EE 100%)',

        // Outros gradientes
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dark-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #141414 100%)',
        'glass-effect': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
      },

      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },

      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1600px'
      },

      aspectRatio: {
        'product': '4/3',
        'hero': '16/9'
      },

      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      },

      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      },

      transitionDuration: {
        'fast': '150ms',
        'DEFAULT': '300ms',
        'slow': '500ms',
      },

      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },

      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',

        // Glows da marca FLAME
        'glow-magenta': '0 0 20px rgba(255, 0, 110, 0.4)',
        'glow-magenta-strong': '0 0 40px rgba(255, 0, 110, 0.6)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.4)',
        'glow-cyan-strong': '0 0 40px rgba(0, 212, 255, 0.6)',
        'glow-purple': '0 0 30px rgba(178, 102, 255, 0.4)',
        'glow-flame': '0 0 30px rgba(255, 0, 110, 0.3), 0 0 60px rgba(0, 212, 255, 0.2)',

        // Cards
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 0, 110, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    }),
    require('@tailwindcss/aspect-ratio'),
    // Custom plugin for FLAME specific utilities
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0,0,0,0.10)'
        },
        '.text-shadow-md': {
          textShadow: '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)'
        },
        '.text-shadow-lg': {
          textShadow: '0 15px 30px rgba(0,0,0,0.11), 0 5px 15px rgba(0,0,0,0.08)'
        },
        '.glass-morphism': {
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.flame-glow': {
          boxShadow: '0 0 30px rgba(255, 0, 110, 0.3), 0 0 60px rgba(0, 212, 255, 0.2)',
        },
        '.text-gradient-flame': {
          background: 'linear-gradient(180deg, #FF006E 0%, #00D4FF 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.safe-area-inset-top': {
          paddingTop: 'env(safe-area-inset-top)'
        },
        '.safe-area-inset-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)'
        }
      }

      const newComponents = {
        '.btn': {
          padding: theme('spacing.3') + ' ' + theme('spacing.6'),
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.semibold'),
          textAlign: 'center',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.2'),
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed'
          }
        },
        '.btn-primary': {
          background: 'linear-gradient(180deg, #FF006E 0%, #B266FF 50%, #00D4FF 100%)',
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            transform: 'translateY(-2px)',
            boxShadow: '0 0 30px rgba(255, 0, 110, 0.4)',
          },
          '&:active': {
            transform: 'translateY(0)'
          }
        },
        '.btn-secondary': {
          backgroundColor: 'transparent',
          color: '#FF006E',
          border: '2px solid #FF006E',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(255, 0, 110, 0.1)',
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)',
          }
        },
        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: 'rgba(255, 255, 255, 0.8)',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
          }
        },
        '.card': {
          backgroundColor: theme('colors.neutral.950'),
          borderRadius: theme('borderRadius.xl'),
          border: '1px solid ' + theme('colors.neutral.800'),
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(255, 0, 110, 0.3)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 0, 110, 0.1)',
          }
        },
        '.card-gradient': {
          background: 'linear-gradient(180deg, #171717 0%, #0A0A0A 100%)',
          borderRadius: theme('borderRadius.xl'),
          border: '1px solid ' + theme('colors.neutral.800'),
        },
        '.input': {
          width: '100%',
          backgroundColor: theme('colors.neutral.900'),
          border: '1px solid ' + theme('colors.neutral.800'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.3') + ' ' + theme('spacing.4'),
          color: theme('colors.white'),
          fontSize: theme('fontSize.base[0]'),
          transition: 'all 0.3s ease',
          '&::placeholder': {
            color: theme('colors.neutral.500'),
          },
          '&:focus': {
            outline: 'none',
            borderColor: '#FF006E',
            boxShadow: '0 0 0 3px rgba(255, 0, 110, 0.2)',
          }
        }
      }

      addUtilities(newUtilities)
      addComponents(newComponents)
    }
  ]
}
