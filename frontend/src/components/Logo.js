/**
 * FLAME - Logo Component
 *
 * Usa a imagem do logo (chama gradiente) + tipografia oficial como mascara
 *
 * Versoes:
 * - default: Logo imagem + tipografia branca (para header/footer)
 * - gradient: Logo imagem + tipografia gradiente (para hero)
 * - compact: Versao menor para header
 * - badge: Apenas o icone da chama
 * - supreme: Apenas icone grande (para login/register)
 */

import Image from 'next/image';

const FlameLogo = ({
  size = 40,
  compact = false,
  badge = false,
  gradient = false,
  supreme = false,
  showText = true,
  className = ''
}) => {
  // Use unoptimized para evitar problemas de otimização em desenvolvimento
  const isDev = process.env.NODE_ENV === 'development';

  // Calcula proporcoes baseadas no size
  const iconSize = size;
  const textWidth = size * 3.05; // Proporcao da tipografia
  const textHeight = size * 0.83;

  // Versao Supreme - Apenas icone grande (para login/register)
  if (supreme) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Image
          src="/logo-flame.png"
          alt="FLAME"
          width={size}
          height={size}
          className="object-contain"
          priority
          unoptimized={isDev}
        />
      </div>
    );
  }

  // Versao Badge - Apenas a imagem da chama
  if (badge) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Image
          src="/logo-flame.png"
          alt="FLAME"
          width={size}
          height={size}
          className="object-contain"
          priority
          unoptimized={isDev}
        />
      </div>
    );
  }

  // Versao compacta para header
  if (compact) {
    const compactTextWidth = size * 2.95;
    const compactTextHeight = size * 0.82;

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Image
          src="/logo-flame.png"
          alt="FLAME"
          width={iconSize}
          height={iconSize}
          className="object-contain"
          priority
          unoptimized={isDev}
        />
        {showText && (
          <div className="relative" style={{ width: compactTextWidth, height: compactTextHeight }}>
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
        )}
      </div>
    );
  }

  // Versao com texto gradiente (para hero)
  if (gradient) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Image
          src="/logo-flame.png"
          alt="FLAME"
          width={iconSize}
          height={iconSize}
          className="object-contain"
          priority
          unoptimized={isDev}
        />
        {showText && (
          <div className="relative" style={{ width: textWidth, height: textHeight }}>
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))',
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
        )}
      </div>
    );
  }

  // Versao padrao - Logo + tipografia branca
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo-flame.png"
        alt="FLAME"
        width={iconSize}
        height={iconSize}
        className="object-contain"
        priority
        unoptimized={isDev}
      />
      {showText && (
        <div className="relative" style={{ width: textWidth, height: textHeight }}>
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
      )}
    </div>
  );
};

export default FlameLogo;
