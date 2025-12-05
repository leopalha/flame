import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Download, Copy, Check, Flame } from 'lucide-react';
import FlameLogo from '../components/Logo';

export default function Logos() {
  const [copiedId, setCopiedId] = useState(null);

  // Cores do Design System FLAME
  const colors = {
    magenta: '#FF006E',
    purple: '#B266FF',
    cyan: '#00D4FF',
    white: '#FFFFFF',
    black: '#000000',
    neutral900: '#0A0A0A',
    neutral800: '#171717'
  };

  const logos = [
    // ============ LOGO PRINCIPAL COM IMAGEM ============
    {
      id: 'flame-logo-principal',
      name: 'FLAME - Logo Principal',
      description: 'Logo com icone da chama + tipografia branca - fundo escuro',
      category: 'principal',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div style={{ transform: `scale(${scale})` }}>
          <FlameLogo size={72} />
        </div>
      )
    },
    {
      id: 'flame-logo-gradiente',
      name: 'FLAME - Logo Gradiente',
      description: 'Logo com icone + tipografia gradiente magenta-cyan',
      category: 'principal',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div className="flex items-center gap-4" style={{ transform: `scale(${scale})` }}>
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={72}
            height={72}
            className="object-contain"
          />
          <div className="relative" style={{ width: 220, height: 60 }}>
            <div
              className="absolute inset-0 bg-gradient-to-r from-magenta-500 via-purple-500 to-cyan-400"
              style={{
                WebkitMaskImage: 'url(/tipografia-logo.png)',
                maskImage: 'url(/tipografia-logo.png)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center'
              }}
            />
          </div>
        </div>
      )
    },
    {
      id: 'flame-logo-compacto',
      name: 'FLAME - Logo Compacto',
      description: 'Versao compacta para header e espacos menores',
      category: 'principal',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div className="flex items-center gap-2" style={{ transform: `scale(${scale})` }}>
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={44}
            height={44}
            className="object-contain"
          />
          <div className="relative" style={{ width: 130, height: 36 }}>
            <div
              className="absolute inset-0 bg-white"
              style={{
                WebkitMaskImage: 'url(/tipografia-logo.png)',
                maskImage: 'url(/tipografia-logo.png)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center'
              }}
            />
          </div>
        </div>
      )
    },
    {
      id: 'flame-logo-vertical',
      name: 'FLAME - Logo Vertical',
      description: 'Logo vertical com chama em cima e tipografia embaixo',
      category: 'principal',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div style={{ transform: `scale(${scale})` }}>
          <Image
            src="/logo-vertical.png"
            alt="FLAME Vertical"
            width={200}
            height={260}
            className="object-contain"
          />
        </div>
      )
    },

    // ============ ICONE DA CHAMA ISOLADO ============
    {
      id: 'flame-icone-transparente',
      name: 'FLAME - Icone Transparente',
      description: 'Apenas a chama gradiente, fundo transparente',
      category: 'icone',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div style={{ transform: `scale(${scale})` }}>
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
      )
    },
    {
      id: 'flame-icone-grande',
      name: 'FLAME - Icone Grande',
      description: 'Chama em tamanho maior para destaque',
      category: 'icone',
      bgColor: 'bg-gradient-to-br from-neutral-900 to-neutral-800',
      render: (scale = 1) => (
        <div style={{ transform: `scale(${scale})` }}>
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={180}
            height={180}
            className="object-contain drop-shadow-2xl"
          />
        </div>
      )
    },

    // ============ TIPOGRAFIA FLAME ============
    {
      id: 'flame-tipo-completo',
      name: 'FLAME - Tipografia Completa',
      description: 'FLAME + LOUNGE BAR - tipografia oficial',
      category: 'tipografia',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div className="relative" style={{ width: 280 * scale, height: 76 * scale }}>
          <div
            className="absolute inset-0 bg-white"
            style={{
              WebkitMaskImage: 'url(/tipografia-logo.png)',
              maskImage: 'url(/tipografia-logo.png)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center'
            }}
          />
        </div>
      )
    },
    {
      id: 'flame-tipo-branco',
      name: 'FLAME - Tipografia Branca',
      description: 'Tipografia oficial em branco',
      category: 'tipografia',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div className="relative" style={{ width: 280 * scale, height: 76 * scale }}>
          <div
            className="absolute inset-0 bg-white"
            style={{
              WebkitMaskImage: 'url(/tipografia-logo.png)',
              maskImage: 'url(/tipografia-logo.png)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center'
            }}
          />
        </div>
      )
    },
    {
      id: 'flame-tipo-gradiente',
      name: 'FLAME - Tipografia Gradiente',
      description: 'Tipografia oficial com gradiente magenta-purple-cyan',
      category: 'tipografia',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div className="relative" style={{ width: 280 * scale, height: 76 * scale }}>
          <div
            className="absolute inset-0 bg-gradient-to-r from-magenta-500 via-purple-500 to-cyan-400"
            style={{
              WebkitMaskImage: 'url(/tipografia-logo.png)',
              maskImage: 'url(/tipografia-logo.png)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center'
            }}
          />
        </div>
      )
    },
    {
      id: 'flame-tipo-magenta',
      name: 'FLAME - Tipografia Magenta',
      description: 'Tipografia oficial em magenta solido',
      category: 'tipografia',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div className="relative" style={{ width: 280 * scale, height: 76 * scale }}>
          <div
            className="absolute inset-0 bg-magenta-500"
            style={{
              WebkitMaskImage: 'url(/tipografia-logo.png)',
              maskImage: 'url(/tipografia-logo.png)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center'
            }}
          />
        </div>
      )
    },
    {
      id: 'flame-tipo-cyan',
      name: 'FLAME - Tipografia Cyan',
      description: 'Tipografia oficial em cyan solido',
      category: 'tipografia',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div className="relative" style={{ width: 280 * scale, height: 76 * scale }}>
          <div
            className="absolute inset-0 bg-cyan-400"
            style={{
              WebkitMaskImage: 'url(/tipografia-logo.png)',
              maskImage: 'url(/tipografia-logo.png)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center'
            }}
          />
        </div>
      )
    },
    {
      id: 'flame-tipo-preto',
      name: 'FLAME - Tipografia Preta',
      description: 'Tipografia oficial em preto para fundos claros',
      category: 'tipografia',
      bgColor: 'bg-white',
      render: (scale = 1) => (
        <div className="relative" style={{ width: 280 * scale, height: 76 * scale }}>
          <div
            className="absolute inset-0 bg-black"
            style={{
              WebkitMaskImage: 'url(/tipografia-logo.png)',
              maskImage: 'url(/tipografia-logo.png)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center'
            }}
          />
        </div>
      )
    },

    // ============ BADGES CIRCULARES ============
    {
      id: 'flame-badge-magenta',
      name: 'Badge Circular Magenta',
      description: 'Badge circular com fundo cinza escuro',
      category: 'badges',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div
          className="flex items-center justify-center rounded-full bg-neutral-800"
          style={{
            width: `${150 * scale}px`,
            height: `${150 * scale}px`,
            boxShadow: '0 0 40px rgba(64, 64, 64, 0.4)'
          }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={80 * scale}
            height={80 * scale}
            className="object-contain"
          />
        </div>
      )
    },
    {
      id: 'flame-badge-cyan',
      name: 'Badge Circular Cyan',
      description: 'Badge circular com fundo cinza claro',
      category: 'badges',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div
          className="flex items-center justify-center rounded-full bg-neutral-600"
          style={{
            width: `${150 * scale}px`,
            height: `${150 * scale}px`,
            boxShadow: '0 0 40px rgba(115, 115, 115, 0.4)'
          }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={80 * scale}
            height={80 * scale}
            className="object-contain"
          />
        </div>
      )
    },
    {
      id: 'flame-badge-gradiente',
      name: 'Badge Circular Gradiente',
      description: 'Badge circular com fundo vinho',
      category: 'badges',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: `${150 * scale}px`,
            height: `${150 * scale}px`,
            backgroundColor: '#8B1538',
            boxShadow: '0 0 40px rgba(139, 21, 56, 0.4)'
          }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={80 * scale}
            height={80 * scale}
            className="object-contain"
          />
        </div>
      )
    },
    {
      id: 'flame-badge-preto-magenta',
      name: 'Badge Fogo Preto - Fundo Magenta',
      description: 'Fogo preto em fundo magenta',
      category: 'badges',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div
          className="flex items-center justify-center rounded-full bg-gradient-to-br from-magenta-500 to-magenta-600"
          style={{
            width: `${150 * scale}px`,
            height: `${150 * scale}px`,
            boxShadow: '0 0 40px rgba(255, 0, 110, 0.4)'
          }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={80 * scale}
            height={80 * scale}
            className="object-contain brightness-0"
          />
        </div>
      )
    },
    {
      id: 'flame-badge-preto-cyan',
      name: 'Badge Fogo Preto - Fundo Cyan',
      description: 'Fogo preto em fundo cyan',
      category: 'badges',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div
          className="flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500"
          style={{
            width: `${150 * scale}px`,
            height: `${150 * scale}px`,
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.4)'
          }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={80 * scale}
            height={80 * scale}
            className="object-contain brightness-0"
          />
        </div>
      )
    },
    {
      id: 'flame-badge-preto-gradiente',
      name: 'Badge Fogo Preto - Fundo Gradiente',
      description: 'Fogo preto em fundo gradiente magenta-cyan',
      category: 'badges',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div
          className="flex items-center justify-center rounded-full bg-gradient-to-br from-magenta-500 via-purple-500 to-cyan-500"
          style={{
            width: `${150 * scale}px`,
            height: `${150 * scale}px`,
            boxShadow: '0 0 40px rgba(178, 102, 255, 0.4)'
          }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={80 * scale}
            height={80 * scale}
            className="object-contain brightness-0"
          />
        </div>
      )
    },
    {
      id: 'flame-badge-branco-magenta',
      name: 'Badge Fogo Branco - Fundo Magenta',
      description: 'Fogo branco em fundo magenta',
      category: 'badges',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div
          className="flex items-center justify-center rounded-full bg-gradient-to-br from-magenta-500 to-magenta-600"
          style={{
            width: `${150 * scale}px`,
            height: `${150 * scale}px`,
            boxShadow: '0 0 40px rgba(255, 0, 110, 0.4)'
          }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={80 * scale}
            height={80 * scale}
            className="object-contain brightness-[10]"
          />
        </div>
      )
    },
    {
      id: 'flame-badge-branco-cyan',
      name: 'Badge Fogo Branco - Fundo Cyan',
      description: 'Fogo branco em fundo cyan',
      category: 'badges',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div
          className="flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500"
          style={{
            width: `${150 * scale}px`,
            height: `${150 * scale}px`,
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.4)'
          }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={80 * scale}
            height={80 * scale}
            className="object-contain brightness-[10]"
          />
        </div>
      )
    },
    {
      id: 'flame-badge-branco-gradiente',
      name: 'Badge Fogo Branco - Fundo Gradiente',
      description: 'Fogo branco em fundo gradiente magenta-cyan',
      category: 'badges',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div
          className="flex items-center justify-center rounded-full bg-gradient-to-br from-magenta-500 via-purple-500 to-cyan-500"
          style={{
            width: `${150 * scale}px`,
            height: `${150 * scale}px`,
            boxShadow: '0 0 40px rgba(178, 102, 255, 0.4)'
          }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={80 * scale}
            height={80 * scale}
            className="object-contain brightness-[10]"
          />
        </div>
      )
    },
    {
      id: 'flame-badge-preto',
      name: 'Badge Circular Preto',
      description: 'Badge circular com fundo preto e borda magenta',
      category: 'badges',
      bgColor: 'bg-neutral-800',
      render: (scale = 1) => (
        <div
          className="flex items-center justify-center rounded-full bg-black border-4 border-magenta-500"
          style={{
            width: `${150 * scale}px`,
            height: `${150 * scale}px`,
            boxShadow: '0 0 30px rgba(255, 0, 110, 0.3)'
          }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={80 * scale}
            height={80 * scale}
            className="object-contain"
          />
        </div>
      )
    },

    // ============ VERSOES COMPLETAS EM CAIXA ============
    {
      id: 'flame-box-horizontal',
      name: 'Box Horizontal Escuro',
      description: 'Logo completo em caixa horizontal para aplicacoes',
      category: 'boxes',
      bgColor: 'bg-neutral-800',
      render: (scale = 1) => (
        <div
          className="flex items-center gap-3 bg-neutral-900 px-8 py-4 rounded-xl border border-neutral-700"
          style={{ transform: `scale(${scale})` }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={48}
            height={48}
            className="object-contain"
          />
          <div className="relative" style={{ width: 146, height: 40 }}>
            <div
              className="absolute inset-0 bg-white"
              style={{
                WebkitMaskImage: 'url(/tipografia-logo.png)',
                maskImage: 'url(/tipografia-logo.png)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center'
              }}
            />
          </div>
        </div>
      )
    },
    {
      id: 'flame-box-gradiente',
      name: 'Box Horizontal Gradiente',
      description: 'Logo em caixa com borda gradiente',
      category: 'boxes',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div
          className="flex items-center gap-3 bg-neutral-900 px-8 py-4 rounded-xl border-2 border-transparent"
          style={{
            transform: `scale(${scale})`,
            background: 'linear-gradient(#0a0a0a, #0a0a0a) padding-box, linear-gradient(135deg, #FF006E, #B266FF, #00D4FF) border-box'
          }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={48}
            height={48}
            className="object-contain"
          />
          <div className="relative" style={{ width: 146, height: 40 }}>
            <div
              className="absolute inset-0 bg-gradient-to-r from-magenta-500 via-purple-500 to-cyan-400"
              style={{
                WebkitMaskImage: 'url(/tipografia-logo.png)',
                maskImage: 'url(/tipografia-logo.png)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center'
              }}
            />
          </div>
        </div>
      )
    },
    {
      id: 'flame-box-vertical',
      name: 'Box Vertical',
      description: 'Logo em formato vertical empilhado',
      category: 'boxes',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div
          className="flex flex-col items-center gap-3 bg-neutral-900 p-6 rounded-xl border border-neutral-700"
          style={{ transform: `scale(${scale})` }}
        >
          <Image
            src="/logo-flame.png"
            alt="FLAME"
            width={64}
            height={64}
            className="object-contain"
          />
          <div className="relative" style={{ width: 122, height: 33 }}>
            <div
              className="absolute inset-0 bg-white"
              style={{
                WebkitMaskImage: 'url(/tipografia-logo.png)',
                maskImage: 'url(/tipografia-logo.png)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center'
              }}
            />
          </div>
        </div>
      )
    },

    // ============ TAGLINE ============
    {
      id: 'flame-tagline',
      name: 'Logo com Tagline',
      description: 'Logo completo com "Lounge Bar + Gastronomia + Narguile"',
      category: 'tagline',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div className="flex flex-col items-center gap-2" style={{ transform: `scale(${scale})` }}>
          <div className="flex items-center gap-3">
            <Image
              src="/logo-flame.png"
              alt="FLAME"
              width={56}
              height={56}
              className="object-contain"
            />
            <div className="relative" style={{ width: 170, height: 46 }}>
              <div
                className="absolute inset-0 bg-white"
                style={{
                  WebkitMaskImage: 'url(/tipografia-logo.png)',
                  maskImage: 'url(/tipografia-logo.png)',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center'
                }}
              />
            </div>
          </div>
          <span className="text-magenta-400 text-sm tracking-widest font-medium">
            LOUNGE BAR + GASTRONOMIA + NARGUILE
          </span>
        </div>
      )
    },
    {
      id: 'flame-tagline-sinta',
      name: 'Logo com "Sinta o Calor"',
      description: 'Logo com slogan principal',
      category: 'tagline',
      bgColor: 'bg-neutral-900',
      render: (scale = 1) => (
        <div className="flex flex-col items-center gap-2" style={{ transform: `scale(${scale})` }}>
          <div className="flex items-center gap-3">
            <Image
              src="/logo-flame.png"
              alt="FLAME"
              width={56}
              height={56}
              className="object-contain"
            />
            <div className="relative" style={{ width: 170, height: 46 }}>
              <div
                className="absolute inset-0 bg-gradient-to-r from-magenta-500 via-purple-500 to-cyan-400"
                style={{
                  WebkitMaskImage: 'url(/tipografia-logo.png)',
                  maskImage: 'url(/tipografia-logo.png)',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center'
                }}
              />
            </div>
          </div>
          <span className="text-cyan-400 text-lg tracking-widest font-semibold italic">
            Sinta o Calor
          </span>
        </div>
      )
    }
  ];

  const categories = [
    { id: 'principal', name: 'Logo Principal', description: 'Versoes principais do logo FLAME' },
    { id: 'icone', name: 'Icone da Chama', description: 'Apenas o icone para uso isolado' },
    { id: 'tipografia', name: 'Tipografia', description: 'Texto FLAME em diferentes estilos' },
    { id: 'badges', name: 'Badges', description: 'Versoes circulares para avatares e icones' },
    { id: 'boxes', name: 'Caixas', description: 'Logo em containers prontos para uso' },
    { id: 'tagline', name: 'Com Tagline', description: 'Logo com slogans e descricoes' }
  ];

  const handleCopy = (id) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <Head>
        <title>Logos | FLAME - Identidade Visual</title>
        <meta name="description" content="Galeria de logos e variacoes da identidade visual do FLAME Lounge Bar. Tipografia Microgramma EF Bold Extended e Besides, cores magenta e cyan." />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black py-24">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              {/* Logo Principal com tipografia branca */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <FlameLogo size={100} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-magenta-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Identidade Visual
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Diferentes variacoes do logo FLAME para diversos usos e aplicacoes.
                <br />
                <span className="text-magenta-400">Tipografia: Microgramma EF + Besides</span> | <span className="text-cyan-400">Cores: Magenta + Cyan</span>
              </p>
            </motion.div>

            {/* Design System Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16 p-8 bg-neutral-900/50 rounded-2xl border border-neutral-800"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Design System FLAME</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-magenta-400 font-semibold mb-3">Cores Principais</h4>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-lg bg-magenta-500 shadow-lg shadow-magenta-500/30"></div>
                      <span className="text-xs text-gray-400 mt-2">Magenta</span>
                      <span className="text-xs text-gray-500">#FF006E</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-lg bg-purple-500 shadow-lg shadow-purple-500/30"></div>
                      <span className="text-xs text-gray-400 mt-2">Purple</span>
                      <span className="text-xs text-gray-500">#B266FF</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-lg bg-cyan-400 shadow-lg shadow-cyan-400/30"></div>
                      <span className="text-xs text-gray-400 mt-2">Cyan</span>
                      <span className="text-xs text-gray-500">#00D4FF</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-semibold mb-3">Tipografia</h4>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-white text-2xl" style={{ fontFamily: "'Microgramma EF Bold Extended', sans-serif" }}>Microgramma EF</span>
                      <span className="text-gray-500 text-sm">Logo FLAME</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-white text-lg" style={{ fontFamily: "'Besides', sans-serif" }}>Besides</span>
                      <span className="text-gray-500 text-sm">Subtitulo</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-white text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>Montserrat</span>
                      <span className="text-gray-500 text-sm">Headings / Body</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-purple-400 font-semibold mb-3">Gradiente Principal</h4>
                  <div className="h-12 rounded-lg bg-gradient-to-r from-magenta-500 via-purple-500 to-cyan-500 shadow-lg"></div>
                  <p className="text-xs text-gray-500 mt-2">from-magenta-500 via-purple-500 to-cyan-500</p>
                </div>
              </div>
            </motion.div>

            {/* Logo Categories */}
            {categories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-16"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">{category.name}</h2>
                  <p className="text-gray-400">{category.description}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {logos
                    .filter(logo => logo.category === category.id)
                    .map((logo, index) => (
                      <motion.div
                        key={logo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-magenta-500/20 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-sm rounded-2xl border border-neutral-800 group-hover:border-magenta-500/40 transition-all overflow-hidden">
                          {/* Logo Display */}
                          <div className={`${logo.bgColor} p-8 flex items-center justify-center min-h-[200px]`}>
                            {logo.render(1)}
                          </div>

                          {/* Info */}
                          <div className="p-6 border-t border-neutral-800">
                            <h3 className="text-white font-bold text-lg mb-2">{logo.name}</h3>
                            <p className="text-gray-400 text-sm mb-4">{logo.description}</p>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCopy(logo.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-magenta-500 border border-neutral-700 hover:border-magenta-500 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all"
                              >
                                {copiedId === logo.id ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    Copiado!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    Copiar ID
                                  </>
                                )}
                              </button>

                              <button
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-magenta-500 via-purple-500 to-cyan-500 hover:opacity-90 rounded-lg text-sm font-medium text-white transition-all shadow-lg shadow-magenta-500/30"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            ))}

            {/* Proporcoes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-20 p-8 bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 rounded-2xl border border-neutral-800"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Proporcoes e Espacamento</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-magenta-400 font-semibold mb-4">Relacao Icone : Texto</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-neutral-900 rounded-lg">
                      <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center">
                        <Flame className="w-10 h-10 text-magenta-400" />
                      </div>
                      <div>
                        <span className="text-white text-2xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>FLAME</span>
                        <p className="text-xs text-gray-500 mt-1">Icone 40px : Texto 28px (ratio 1.4:1)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-neutral-900 rounded-lg">
                      <div className="w-20 h-20 bg-neutral-800 rounded-lg flex items-center justify-center">
                        <Flame className="w-12 h-12 text-magenta-400" />
                      </div>
                      <div>
                        <span className="text-white text-3xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>FLAME</span>
                        <p className="text-xs text-gray-500 mt-1">Icone 60px : Texto 48px (ratio 1.25:1)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-cyan-400 font-semibold mb-4">Espacamento (Gap)</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-900 rounded-lg">
                      <p className="text-white mb-2">Header/Compacto: <span className="text-magenta-400">gap-2</span> (8px)</p>
                      <p className="text-white mb-2">Padrao: <span className="text-magenta-400">gap-3</span> (12px)</p>
                      <p className="text-white mb-2">Grande/Hero: <span className="text-magenta-400">gap-4</span> (16px)</p>
                    </div>
                    <div className="p-4 bg-neutral-900 rounded-lg">
                      <p className="text-gray-400 text-sm">
                        Letter-spacing do texto: <span className="text-cyan-400">0.1em - 0.15em</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8 p-8 bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 rounded-2xl border border-neutral-800"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Diretrizes de Uso</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-cyan-400 font-semibold mb-4">Permitido</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      Usar os logos em materiais promocionais do FLAME
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      Redimensionar mantendo a proporcao original
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      Usar sobre fundos escuros (preto, cinza escuro)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      Aplicar o gradiente em textos e elementos
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-magenta-400 font-semibold mb-4">Não Permitido</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-magenta-400 mt-1">✕</span>
                      Alterar as cores ou proporções do logo
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-magenta-400 mt-1">✕</span>
                      Adicionar efeitos, sombras ou distorções
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-magenta-400 mt-1">✕</span>
                      Usar o logo em contextos que prejudiquem a marca
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-magenta-400 mt-1">✕</span>
                      Trocar a tipografia Microgramma/Besides por outra fonte
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
}
