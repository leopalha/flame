import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

/**
 * GoogleLoginButton Component
 *
 * Renderiza o botão de login do Google usando Google Identity Services
 * Utiliza a biblioteca oficial do Google para garantir segurança e consistência
 *
 * @param {Object} props
 * @param {string} props.text - Texto do botão ('signin_with' ou 'signup_with')
 * @param {string} props.size - Tamanho do botão ('large', 'medium', 'small')
 * @param {string} props.theme - Tema do botão ('outline', 'filled_blue', 'filled_black')
 * @param {string} props.shape - Formato do botão ('rectangular', 'pill', 'circle', 'square')
 * @param {Function} props.onSuccess - Callback adicional quando login for bem-sucedido
 */
export default function GoogleLoginButton({
  text = 'signin_with',
  size = 'large',
  theme = 'outline',
  shape = 'rectangular',
  onSuccess
}) {
  const buttonRef = useRef(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const googleLogin = useAuthStore((state) => state.googleLogin);

  // Verificar se o SDK do Google está carregado
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Se já está carregado
    if (window.google?.accounts?.id) {
      setSdkLoaded(true);
      return;
    }

    // Polling para verificar quando o SDK carregar
    const checkGoogleSDK = setInterval(() => {
      if (window.google?.accounts?.id) {
        setSdkLoaded(true);
        clearInterval(checkGoogleSDK);
      }
    }, 100);

    // Timeout após 5 segundos
    const timeout = setTimeout(() => {
      clearInterval(checkGoogleSDK);
      if (!window.google?.accounts?.id) {
        console.warn('⚠️ Google SDK não carregou após 5 segundos');
      }
    }, 5000);

    return () => {
      clearInterval(checkGoogleSDK);
      clearTimeout(timeout);
    };
  }, []);

  // Renderizar botão quando SDK estiver disponível
  useEffect(() => {
    if (!sdkLoaded || !buttonRef.current) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error('❌ NEXT_PUBLIC_GOOGLE_CLIENT_ID não está configurado no .env');
      return;
    }

    // Callback chamado quando o usuário faz login com sucesso
    const handleCredentialResponse = async (response) => {
      try {
        console.log('🔐 Google Login: Credencial recebida');

        // Enviar credential para o backend via authStore
        await googleLogin(response.credential);

        // Callback adicional
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('❌ Erro no Google Login:', error);
        toast.error(error.message || 'Erro ao fazer login com Google');
      }
    };

    // Inicializar o Google Identity Services
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Limpar o container antes de renderizar
    buttonRef.current.innerHTML = '';

    // Renderizar o botão
    window.google.accounts.id.renderButton(
      buttonRef.current,
      {
        type: 'standard',
        theme: theme,
        size: size,
        text: text,
        shape: shape,
        logo_alignment: 'left',
        width: 280
      }
    );
  }, [sdkLoaded, googleLogin, onSuccess, text, size, theme, shape]);

  return (
    <div
      ref={buttonRef}
      className="w-full flex justify-center"
      style={{ minHeight: '44px' }}
    />
  );
}
