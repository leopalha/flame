/**
 * FLAME - Logo Component
 *
 * Usa a imagem do logo (chama gradiente) + texto "FLAME"
 *
 * Proporcoes padrao: icone + texto 10% maior (ratio 1:1.1)
 *
 * Versoes:
 * - default: Logo imagem + texto branco (para header/footer)
 * - gradient: Logo imagem + texto gradiente (para hero)
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
        />
      </div>
    );
  }

  // Versao compacta para header (texto 10% maior que icone)
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Image
          src="/logo-flame.png"
          alt="FLAME"
          width={size}
          height={size}
          className="object-contain"
          priority
        />
        {showText && (
          <span
            className="text-white font-bold tracking-wider"
            style={{
              fontFamily: "var(--font-bebas), 'Bebas Neue', 'Oswald', sans-serif",
              fontSize: `${size * 1.1}px`,
              letterSpacing: '0.06em',
              lineHeight: '1'
            }}
          >
            FLAME
          </span>
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
          width={size}
          height={size}
          className="object-contain"
          priority
        />
        {showText && (
          <span
            className="font-bold tracking-wider bg-gradient-to-r from-magenta-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            style={{
              fontFamily: "var(--font-bebas), 'Bebas Neue', 'Oswald', sans-serif",
              fontSize: `${size * 1.1}px`,
              letterSpacing: '0.06em',
              lineHeight: '1'
            }}
          >
            FLAME
          </span>
        )}
      </div>
    );
  }

  // Versao padrao - Logo + texto branco (texto 10% maior que icone)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo-flame.png"
        alt="FLAME"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
      {showText && (
        <span
          className="text-white font-bold tracking-wider"
          style={{
            fontFamily: "var(--font-bebas), 'Bebas Neue', 'Oswald', sans-serif",
            fontSize: `${size * 1.1}px`,
            letterSpacing: '0.06em',
            lineHeight: '1'
          }}
        >
          FLAME
        </span>
      )}
    </div>
  );
};

export default FlameLogo;
