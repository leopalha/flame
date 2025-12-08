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

    console.log('🔍 [GoogleLoginButton] Checking for Google SDK...');

    // Se já está carregado
    if (window.google?.accounts?.id) {
      console.log('✅ [GoogleLoginButton] Google SDK already loaded');
      setSdkLoaded(true);
      return;
    }

    // Polling para verificar quando o SDK carregar
    let pollAttempts = 0;
    const checkGoogleSDK = setInterval(() => {
      pollAttempts++;
      if (window.google?.accounts?.id) {
        console.log(`✅ [GoogleLoginButton] Google SDK loaded after ${pollAttempts} attempts`);
        setSdkLoaded(true);
        clearInterval(checkGoogleSDK);
      }
    }, 100);

    // Timeout após 10 segundos (aumentado de 5s)
    const timeout = setTimeout(() => {
      clearInterval(checkGoogleSDK);
      if (!window.google?.accounts?.id) {
        console.error('❌ [GoogleLoginButton] Google SDK não carregou após 10 segundos');
        console.error('❌ [GoogleLoginButton] Verifique se o script está sendo carregado em _app.js');
        console.error('❌ [GoogleLoginButton] URL: https://accounts.google.com/gsi/client');
      }
    }, 10000);

    return () => {
      clearInterval(checkGoogleSDK);
      clearTimeout(timeout);
    };
  }, []);

  // Renderizar botão quando SDK estiver disponível
  useEffect(() => {
    if (!sdkLoaded || !buttonRef.current) {
      if (!sdkLoaded) {
        console.log('⏳ [GoogleLoginButton] Waiting for SDK to load...');
      }
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error('❌ [GoogleLoginButton] NEXT_PUBLIC_GOOGLE_CLIENT_ID não está configurado');
      console.error('❌ [GoogleLoginButton] Valor atual:', clientId);
      console.error('❌ [GoogleLoginButton] Configure a variável de ambiente no Vercel');
      return;
    }

    console.log('✅ [GoogleLoginButton] Client ID found, rendering button...');

    // Callback chamado quando o usuário faz login com sucesso
    const handleCredentialResponse = async (response) => {
      try {
        console.log('🔐 [GoogleLoginButton] Credencial recebida do Google');

        // Enviar credential para o backend via authStore
        await googleLogin(response.credential);

        console.log('✅ [GoogleLoginButton] Login com Google bem-sucedido');

        // Callback adicional
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('❌ [GoogleLoginButton] Erro no Google Login:', error);
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

    console.log('✅ [GoogleLoginButton] Button rendered successfully');
  }, [sdkLoaded, googleLogin, onSuccess, text, size, theme, shape]);

  return (
    <div className="w-full">
      <div
        ref={buttonRef}
        className="w-full flex justify-center"
        style={{ minHeight: '44px' }}
      />
      {!sdkLoaded && (
        <div className="text-center text-sm text-neutral-400 py-2">
          Carregando Google Login...
        </div>
      )}
    </div>
  );
}
