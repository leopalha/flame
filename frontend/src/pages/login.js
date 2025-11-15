import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useForm } from '../hooks';
import { formatPhone } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';
import ExxquemaLogo from '../components/Logo';
import { toast } from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const { loginWithPassword, loginWithSMS, isAuthenticated, isLoading } = useAuthStore();
  const { setTable } = useCartStore();
  const [loginMethod, setLoginMethod] = useState('sms'); // 'sms' or 'password'
  const [showPassword, setShowPassword] = useState(false);
  const [isCodeStep, setIsCodeStep] = useState(false);
  const [sentTo, setSentTo] = useState('');

  // Helper function to set table from session/query
  const setTableFromSession = () => {
    // Check query string first
    const mesaFromQuery = router.query.mesa;
    if (mesaFromQuery) {
      setTable(mesaFromQuery, parseInt(mesaFromQuery));
      return;
    }

    // Check sessionStorage for QR code scanned table
    const mesaFromSession = sessionStorage.getItem('redlight-qr-mesa');
    if (mesaFromSession) {
      setTable(mesaFromSession, parseInt(mesaFromSession));
      sessionStorage.removeItem('redlight-qr-mesa'); // Clean up
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setTableFromSession(); // Set table before redirecting
      const returnTo = router.query.returnTo || '/';
      router.replace(returnTo);
    }
  }, [isAuthenticated, router]);

  // Form for password login
  const passwordForm = useForm(
    { email: '', password: '' },
    {
      email: {
        required: 'Email é obrigatório',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'Email inválido',
      },
      password: {
        required: 'Senha é obrigatória',
        minLength: 6,
      },
    }
  );

  // Form for SMS login
  const smsForm = useForm(
    { celular: '' },
    {
      celular: {
        required: 'Celular é obrigatório',
        pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
        patternMessage: 'Formato: (11) 99999-9999',
      },
    }
  );

  // Form for SMS verification
  const codeForm = useForm(
    { codigo: '' },
    {
      codigo: {
        required: 'Código é obrigatório',
        pattern: /^\d{6}$/,
        patternMessage: 'Código deve ter 6 dígitos',
      },
    }
  );

  const handlePasswordLogin = async (values) => {
    const result = await loginWithPassword(values.email, values.password);

    if (result.success) {
      setTableFromSession(); // Set table before redirecting
      const returnTo = router.query.returnTo || '/';
      router.replace(returnTo);
    }
  };

  const handleSMSLogin = async (values) => {
    const cleanPhone = values.celular.replace(/\D/g, '');
    const result = await loginWithSMS(cleanPhone);
    
    if (result.success) {
      setIsCodeStep(true);
      setSentTo(values.celular);
    }
  };

  const handleCodeVerification = async (values) => {
    const cleanPhone = sentTo.replace(/\D/g, '');
    const { verifySMSLogin } = useAuthStore.getState();

    const result = await verifySMSLogin(cleanPhone, values.codigo);

    if (result.success) {
      setTableFromSession(); // Set table before redirecting
      const returnTo = router.query.returnTo || '/';
      router.replace(returnTo);
    }
  };

  const handleCelularChange = (value) => {
    const formatted = formatPhone(value);
    smsForm.setValue('celular', formatted);
  };

  const goBackToMethod = () => {
    setIsCodeStep(false);
    codeForm.reset();
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: 0.1 }
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Redirecionando..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Login | Exxquema</title>
        <meta name="description" content="Faça login na sua conta do Exxquema" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-950 via-black to-gray-900 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-3xl" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3 text-white hover:text-orange-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </Link>
            
            <div className="mt-6 mb-4">
              <div className="flex justify-center mb-6">
                <ExxquemaLogo supreme size={80} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
              <p className="text-gray-400">Entre na sua conta para continuar</p>
            </div>
          </div>

          {/* Login Form */}
          <motion.div
            variants={formVariants}
            className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-2xl"
          >
            {!isCodeStep ? (
              <>
                {/* Method Toggle */}
                <div className="flex bg-gray-800 rounded-lg p-1 mb-8">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('sms')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-colors ${
                      loginMethod === 'sms'
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    SMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-colors ${
                      loginMethod === 'password'
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                </div>

                {/* SMS Login Form */}
                {loginMethod === 'sms' && (
                  <form onSubmit={(e) => { e.preventDefault(); if (!isLoading) handleSMSLogin(smsForm.values); }}>
                    <div className="mb-6">
                      <label htmlFor="celular" className="block text-sm font-medium text-gray-300 mb-2">
                        Número do Celular
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="celular"
                          type="tel"
                          value={smsForm.values.celular}
                          onChange={(e) => handleCelularChange(e.target.value)}
                          onBlur={() => smsForm.setFieldTouched('celular')}
                          placeholder="(11) 99999-9999"
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                            smsForm.isFieldInvalid('celular')
                              ? 'border-orange-500 focus:ring-orange-500'
                              : 'border-gray-600 focus:ring-orange-500 focus:border-orange-500'
                          }`}
                          maxLength={15}
                        />
                      </div>
                      {smsForm.isFieldInvalid('celular') && (
                        <p className="mt-2 text-sm text-orange-400">{smsForm.errors.celular}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isLoading ? <LoadingSpinner size="small" color="white" /> : 'Enviar Código'}
                    </button>
                  </form>
                )}

                {/* Password Login Form */}
                {loginMethod === 'password' && (
                  <form onSubmit={(e) => { e.preventDefault(); if (!isLoading) handlePasswordLogin(passwordForm.values); }}>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={passwordForm.values.email}
                          onChange={(e) => passwordForm.setValue('email', e.target.value)}
                          onBlur={() => passwordForm.setFieldTouched('email')}
                          placeholder="seu@email.com"
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                            passwordForm.isFieldInvalid('email')
                              ? 'border-orange-500 focus:ring-orange-500'
                              : 'border-gray-600 focus:ring-orange-500 focus:border-orange-500'
                          }`}
                        />
                      </div>
                      {passwordForm.isFieldInvalid('email') && (
                        <p className="mt-2 text-sm text-orange-400">{passwordForm.errors.email}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                        Senha
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.values.password}
                          onChange={(e) => passwordForm.setValue('password', e.target.value)}
                          onBlur={() => passwordForm.setFieldTouched('password')}
                          placeholder="Sua senha"
                          className={`block w-full pr-10 pl-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                            passwordForm.isFieldInvalid('password')
                              ? 'border-orange-500 focus:ring-orange-500'
                              : 'border-gray-600 focus:ring-orange-500 focus:border-orange-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {passwordForm.isFieldInvalid('password') && (
                        <p className="mt-2 text-sm text-orange-400">{passwordForm.errors.password}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isLoading ? <LoadingSpinner size="small" color="white" /> : 'Entrar'}
                    </button>
                  </form>
                )}

                {/* Links */}
                <div className="mt-8 text-center space-y-4">
                  <Link href="/register" className="text-orange-400 hover:text-orange-300 font-medium">
                    Não tem uma conta? Cadastre-se
                  </Link>
                  
                  {loginMethod === 'password' && (
                    <div>
                      <Link href="/forgot-password" className="text-gray-400 hover:text-white text-sm">
                        Esqueceu a senha?
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* SMS Code Verification */
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Código Enviado!</h2>
                  <p className="text-gray-400">
                    Digite o código de 6 dígitos enviado para
                  </p>
                  <p className="text-white font-medium">{sentTo}</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); codeForm.handleSubmit(handleCodeVerification); }}>
                  <div className="mb-6">
                    <label htmlFor="codigo" className="block text-sm font-medium text-gray-300 mb-2">
                      Código de Verificação
                    </label>
                    <input
                      id="codigo"
                      type="text"
                      value={codeForm.values.codigo}
                      onChange={(e) => codeForm.setValue('codigo', e.target.value.replace(/\D/g, ''))}
                      onBlur={() => codeForm.setFieldTouched('codigo')}
                      placeholder="000000"
                      maxLength={6}
                      className={`block w-full px-3 py-3 border rounded-lg bg-gray-800 text-white text-center text-2xl font-mono tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        codeForm.isFieldInvalid('codigo')
                          ? 'border-orange-500 focus:ring-orange-500'
                          : 'border-gray-600 focus:ring-orange-500 focus:border-orange-500'
                      }`}
                    />
                    {codeForm.isFieldInvalid('codigo') && (
                      <p className="mt-2 text-sm text-orange-400 text-center">{codeForm.errors.codigo}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isLoading ? <LoadingSpinner size="small" color="white" /> : 'Verificar Código'}
                    </button>

                    <button
                      type="button"
                      onClick={goBackToMethod}
                      className="w-full bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      Voltar
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      const cleanPhone = sentTo.replace(/\D/g, '');
                      const { loginWithSMS } = useAuthStore.getState();
                      loginWithSMS(cleanPhone);
                    }}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-white text-sm disabled:opacity-50"
                  >
                    Não recebeu o código? Reenviar
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>© 2024 Exxquema. Todos os direitos reservados.</p>
          </div>
        </motion.div>
      </div>
    </>
  );
}