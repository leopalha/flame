import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useForm } from '../hooks';
import { formatPhone } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';
import FlameLogo from '../components/Logo';
import { toast } from 'react-hot-toast';

export default function Register() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCodeStep, setIsCodeStep] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  // Registration form
  const registerForm = useForm(
    {
      nome: '',
      email: '',
      celular: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    {
      nome: {
        required: 'Nome é obrigatório',
        minLength: 2,
      },
      email: {
        required: 'Email é obrigatório',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'Email inválido',
      },
      celular: {
        required: 'Celular é obrigatório',
        pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
        patternMessage: 'Formato: (11) 99999-9999',
      },
      password: {
        required: 'Senha é obrigatória',
        minLength: 6,
      },
      confirmPassword: {
        required: 'Confirmação de senha é obrigatória',
        custom: (value, values) => {
          if (value !== values.password) {
            return 'Senhas não conferem';
          }
          return null;
        },
      },
      acceptTerms: {
        required: 'Você deve aceitar os termos de uso',
        custom: (value) => {
          if (!value) {
            return 'Você deve aceitar os termos de uso';
          }
          return null;
        },
      },
    }
  );

  // SMS verification form
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

  const handleRegister = async (values) => {
    const userData = {
      nome: values.nome.trim(),
      email: values.email.trim().toLowerCase(),
      celular: values.celular.replace(/\D/g, ''),
      password: values.password,
    };

    const result = await register(userData);

    if (result.success) {
      setRegisteredUser(userData);
      setIsCodeStep(true);
    }
  };

  const handleCodeVerification = async (values) => {
    if (!registeredUser) return;

    const { verifySMS } = useAuthStore.getState();
    const result = await verifySMS(registeredUser.celular, values.codigo);

    if (result.success) {
      toast.success('Conta criada com sucesso!');
      router.replace('/');
    }
  };

  const handleCelularChange = (value) => {
    const formatted = formatPhone(value);
    registerForm.setValue('celular', formatted);
  };

  const goBackToRegister = () => {
    setIsCodeStep(false);
    setRegisteredUser(null);
    codeForm.reset();
  };

  const resendCode = async () => {
    if (!registeredUser) return;

    const { resendSMS } = useAuthStore.getState();
    await resendSMS(registeredUser.celular);
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
        <title>Cadastro | FLAME</title>
        <meta name="description" content="Crie sua conta no FLAME Lounge Bar" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-magenta-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3 text-white hover:text-magenta-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </Link>

            <div className="mt-6 mb-4">
              <div className="mx-auto mb-6 flex items-center justify-center">
                <FlameLogo size={120} supreme={true} />
              </div>
              <p className="text-neutral-400 mt-2 text-lg">Crie sua conta</p>
            </div>
          </div>

          {/* Registration Form */}
          <motion.div
            variants={formVariants}
            className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 shadow-2xl"
          >
            {!isCodeStep ? (
              <>
                <form onSubmit={(e) => { e.preventDefault(); registerForm.handleSubmit(handleRegister); }}>
                  {/* Nome */}
                  <div className="mb-4">
                    <label htmlFor="nome" className="block text-sm font-medium text-neutral-300 mb-2">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        id="nome"
                        type="text"
                        value={registerForm.values.nome}
                        onChange={(e) => registerForm.setValue('nome', e.target.value)}
                        onBlur={() => registerForm.setFieldTouched('nome')}
                        placeholder="Seu nome completo"
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                          registerForm.isFieldInvalid('nome')
                            ? 'border-magenta-500 focus:ring-magenta-500'
                            : 'border-neutral-600 focus:ring-magenta-500 focus:border-magenta-500'
                        }`}
                      />
                    </div>
                    {registerForm.isFieldInvalid('nome') && (
                      <p className="mt-2 text-sm text-magenta-400">{registerForm.errors.nome}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={registerForm.values.email}
                        onChange={(e) => registerForm.setValue('email', e.target.value)}
                        onBlur={() => registerForm.setFieldTouched('email')}
                        placeholder="seu@email.com"
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                          registerForm.isFieldInvalid('email')
                            ? 'border-magenta-500 focus:ring-magenta-500'
                            : 'border-neutral-600 focus:ring-magenta-500 focus:border-magenta-500'
                        }`}
                      />
                    </div>
                    {registerForm.isFieldInvalid('email') && (
                      <p className="mt-2 text-sm text-magenta-400">{registerForm.errors.email}</p>
                    )}
                  </div>

                  {/* Celular */}
                  <div className="mb-4">
                    <label htmlFor="celular" className="block text-sm font-medium text-neutral-300 mb-2">
                      Celular
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        id="celular"
                        type="tel"
                        value={registerForm.values.celular}
                        onChange={(e) => handleCelularChange(e.target.value)}
                        onBlur={() => registerForm.setFieldTouched('celular')}
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                          registerForm.isFieldInvalid('celular')
                            ? 'border-magenta-500 focus:ring-magenta-500'
                            : 'border-neutral-600 focus:ring-magenta-500 focus:border-magenta-500'
                        }`}
                      />
                    </div>
                    {registerForm.isFieldInvalid('celular') && (
                      <p className="mt-2 text-sm text-magenta-400">{registerForm.errors.celular}</p>
                    )}
                  </div>

                  {/* Senha */}
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={registerForm.values.password}
                        onChange={(e) => registerForm.setValue('password', e.target.value)}
                        onBlur={() => registerForm.setFieldTouched('password')}
                        placeholder="Mínimo 6 caracteres"
                        className={`block w-full pr-10 pl-3 py-3 border rounded-lg bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                          registerForm.isFieldInvalid('password')
                            ? 'border-magenta-500 focus:ring-magenta-500'
                            : 'border-neutral-600 focus:ring-magenta-500 focus:border-magenta-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {registerForm.isFieldInvalid('password') && (
                      <p className="mt-2 text-sm text-magenta-400">{registerForm.errors.password}</p>
                    )}
                  </div>

                  {/* Confirmar Senha */}
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-2">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={registerForm.values.confirmPassword}
                        onChange={(e) => registerForm.setValue('confirmPassword', e.target.value)}
                        onBlur={() => registerForm.setFieldTouched('confirmPassword')}
                        placeholder="Digite a senha novamente"
                        className={`block w-full pr-10 pl-3 py-3 border rounded-lg bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                          registerForm.isFieldInvalid('confirmPassword')
                            ? 'border-magenta-500 focus:ring-magenta-500'
                            : 'border-neutral-600 focus:ring-magenta-500 focus:border-magenta-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {registerForm.isFieldInvalid('confirmPassword') && (
                      <p className="mt-2 text-sm text-magenta-400">{registerForm.errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Termos */}
                  <div className="mb-6">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={registerForm.values.acceptTerms}
                          onChange={(e) => registerForm.setValue('acceptTerms', e.target.checked)}
                          onBlur={() => registerForm.setFieldTouched('acceptTerms')}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                          registerForm.values.acceptTerms
                            ? 'bg-gradient-to-r from-magenta-500 to-cyan-500 border-magenta-500'
                            : 'border-neutral-600 bg-neutral-800'
                        }`}>
                          {registerForm.values.acceptTerms && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-neutral-400">
                        Eu concordo com os{' '}
                        <Link href="/termos" className="text-magenta-400 hover:text-cyan-400">
                          Termos de Uso
                        </Link>{' '}
                        e{' '}
                        <Link href="/privacidade" className="text-magenta-400 hover:text-cyan-400">
                          Política de Privacidade
                        </Link>
                      </div>
                    </label>
                    {registerForm.isFieldInvalid('acceptTerms') && (
                      <p className="mt-2 text-sm text-magenta-400">{registerForm.errors.acceptTerms}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 disabled:from-neutral-600 disabled:to-neutral-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {isLoading ? <LoadingSpinner size="small" color="white" /> : 'Criar Conta'}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link href="/login" className="text-magenta-400 hover:text-cyan-400 font-medium">
                    Já tem uma conta? Entre aqui
                  </Link>
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
                  <p className="text-neutral-400 mb-2">
                    Para finalizar seu cadastro, digite o código de 6 dígitos enviado para
                  </p>
                  <p className="text-white font-medium">{formatPhone(registeredUser?.celular || '')}</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); codeForm.handleSubmit(handleCodeVerification); }}>
                  <div className="mb-6">
                    <label htmlFor="codigo" className="block text-sm font-medium text-neutral-300 mb-2">
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
                      className={`block w-full px-3 py-3 border rounded-lg bg-neutral-800 text-white text-center text-2xl font-mono tracking-widest placeholder-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                        codeForm.isFieldInvalid('codigo')
                          ? 'border-magenta-500 focus:ring-magenta-500'
                          : 'border-neutral-600 focus:ring-magenta-500 focus:border-magenta-500'
                      }`}
                    />
                    {codeForm.isFieldInvalid('codigo') && (
                      <p className="mt-2 text-sm text-magenta-400 text-center">{codeForm.errors.codigo}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 disabled:from-neutral-600 disabled:to-neutral-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isLoading ? <LoadingSpinner size="small" color="white" /> : 'Finalizar Cadastro'}
                    </button>

                    <button
                      type="button"
                      onClick={goBackToRegister}
                      className="w-full bg-transparent border border-neutral-600 hover:border-neutral-500 text-neutral-300 hover:text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      Voltar
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={resendCode}
                    disabled={isLoading}
                    className="text-neutral-400 hover:text-white text-sm disabled:opacity-50"
                  >
                    Não recebeu o código? Reenviar
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Footer */}
          <div className="mt-8 text-center text-neutral-500 text-sm">
            <p>FLAME Lounge Bar - Botafogo, RJ</p>
          </div>
        </motion.div>
      </div>
    </>
  );
}