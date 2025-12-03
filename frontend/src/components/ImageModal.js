import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

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

  if (!isOpen) return null;

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

      {/* Imagem Maximizada */}
      <img
        src={imageSrc}
        alt={imageAlt || 'Imagem ampliada'}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '95vw',
          maxHeight: '95vh',
          objectFit: 'contain',
          borderRadius: '8px',
          cursor: 'default'
        }}
      />
    </div>
  );
}
