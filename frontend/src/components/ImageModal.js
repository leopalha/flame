import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setImageLoaded(false);
      setImageError(false);

      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);

      return () => {
        window.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  // Nao abrir modal se nao tiver imagem valida
  if (!isOpen || !imageSrc) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 999999,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      {/* Botao Fechar */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(255, 0, 110, 0.8)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000000,
          transition: 'all 0.2s',
          backdropFilter: 'blur(4px)'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 0, 110, 1)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 0, 110, 0.8)'}
      >
        <X size={24} />
      </button>

      {/* Loading Spinner */}
      {!imageLoaded && !imageError && (
        <div style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(255, 0, 110, 0.3)',
              borderTop: '4px solid #FF006E',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }' }} />
        </div>
      )}

      {/* Erro ao carregar */}
      {imageError && (
        <div style={{
          color: 'white',
          textAlign: 'center',
          padding: '20px'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>Nao foi possivel carregar a imagem</p>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #FF006E, #00D4FF)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Fechar
          </button>
        </div>
      )}

      {/* Imagem Maximizada */}
      <img
        src={imageSrc}
        alt={imageAlt || 'Imagem ampliada'}
        onClick={(e) => e.stopPropagation()}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        style={{
          maxWidth: '95vw',
          maxHeight: '95vh',
          objectFit: 'contain',
          borderRadius: '8px',
          cursor: 'default',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          display: imageError ? 'none' : 'block'
        }}
      />
    </div>
  );
}
