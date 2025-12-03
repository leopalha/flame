// FLAME - Typography System
// Tipografia moderna e elegante

import { Bebas_Neue, Inter, Playfair_Display } from '@next/font/google';

// Primária - Títulos e Logo
// Forte, impactante, urbano
export const bebasNeue = Bebas_Neue({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas',
});

// Secundária - Textos e Corpo
// Clean, legível, moderno
export const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Acento - Citações e Storytelling
// Elegância clássica, conexão histórica
export const playfairDisplay = Playfair_Display({
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

// Exportar todas as classes de variáveis juntas
export const fontVariables = `${bebasNeue.variable} ${inter.variable} ${playfairDisplay.variable}`;
