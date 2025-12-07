import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Eye, EyeOff, ArrowLeft, Check, Calendar, CreditCard, FileText } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useForm } from '../hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import FlameLogo from '../components/Logo';
import PhoneInput, { validatePhoneNumber } from '../components/PhoneInput';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { toast } from 'react-hot-toast';
import { isBrazilian } from '../data/countries';
import {
  validateCPF,
  formatCPF,
  cleanCPF,
  validateBirthDate,
  validatePhone,
  validateForeignId,
  toE164Format
} from '../utils/validation';

export default function Register() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCodeStep, setIsCodeStep] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  // Campos controlados separadamente
  const [celular, setCelular] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [celularError, setCelularError] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [foreignId, setForeignId] = useState('');
  const [foreignIdError, setForeignIdError] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthDateError, setBirthDateError] = useState('');

  // Detectar se é brasileiro pelo país selecionado
  const isBrazilianUser = isBrazilian(countryCode);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  // Registration form (campos básicos)
  const registerForm = useForm(
    {
      nome: '',
      email: '',
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

  // Validar celular
  const validateCelular = () => {
    if (!countryCode) {
      setCelularError('Selecione o país');
      return false;
    }
    if (!celular) {
      setCelularError('Celular é obrigatório');
      return false;
    }

    const validation = validatePhone(celular, countryCode);
    if (!validation.valid) {
      setCelularError(validation.error);
      return false;
    }

    setCelularError('');
    return true;
  };

  // Validar CPF (apenas para brasileiros)
  const validateCPFField = () => {
    if (!isBrazilianUser) return true;

    if (!cpf) {
      setCpfError('CPF é obrigatório para brasileiros');
      return false;
    }

    if (!validateCPF(cpf)) {
      setCpfError('CPF inválido');
      return false;
    }

    setCpfError('');
    return true;
  };

  // Validar documento estrangeiro
  const validateForeignIdField = () => {
    if (isBrazilianUser) return true;

    if (!countryCode) return true; // Ainda não selecionou país

    const validation = validateForeignId(foreignId);
    if (!validation.valid) {
      setForeignIdError(validation.error);
      return false;
    }

    setForeignIdError('');
    return true;
  };

  // Validar data de nascimento
  const validateBirthDateField = () => {
    const validation = validateBirthDate(birthDate);
    if (!validation.valid) {
      setBirthDateError(validation.error);
      return false;
    }

    setBirthDateError('');
    return true;
  };

  const handleRegister = async (values) => {
    // Validar todos os campos
    const celularValid = validateCelular();
    const cpfValid = validateCPFField();
    const foreignIdValid = validateForeignIdField();
    const birthDateValid = validateBirthDateField();

    if (!celularValid || !cpfValid || !foreignIdValid || !birthDateValid) {
      return;
    }

    const userData = {
      nome: values.nome.trim(),
      email: values.email.trim().toLowerCase(),
      celular: toE164Format(celular, countryCode),
      countryCode: countryCode,
      password: values.password,
      birthDate: birthDate,
      ...(isBrazilianUser
        ? { cpf: formatCPF(cpf) }
        : { foreignId: foreignId.trim() }
      ),
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

  const handleCelularChange = (value, selectedCountryCode) => {
    setCelular(value);
    if (selectedCountryCode) {
      setCountryCode(selectedCountryCode);
    }
    if (celularError) {
      setCelularError('');
    }
  };

  const handleCountryChange = (newCountryCode) => {
    setCountryCode(newCountryCode);
    // Limpar campos de documento ao trocar país
    if (isBrazilian(newCountryCode)) {
      setForeignId('');
      setForeignIdError('');
    } else {
      setCpf('');
      setCpfError('');
    }
  };

  const handleCpfChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    if (cpfError) setCpfError('');
  };

  const handleForeignIdChange = (e) => {
    setForeignId(e.target.value.toUpperCase());
    if (foreignIdError) setForeignIdError('');
  };

  const handleBirthDateChange = (e) => {
    setBirthDate(e.target.value);
    if (birthDateError) setBirthDateError('');
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

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[var(--theme-primary)] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[var(--theme-secondary)] rounded-full blur-3xl" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3 text-white hover:text-red-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </Link>

            <div className="mt-6 mb-4">
              <div className="mx-auto mb-6 flex items-center justify-center">
                <FlameLogo size={120} supreme={true} />
              </div>
              <p className="text-gray-400 mt-2 text-lg">Crie sua conta</p>
            </div>
          </div>

          {/* Registration Form */}
          <motion.div
            variants={formVariants}
            className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl"
          >
            {!isCodeStep ? (
              <>
                <form onSubmit={(e) => { e.preventDefault(); registerForm.handleSubmit(handleRegister); }}>
                  {/* Nome */}
                  <div className="mb-4">
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="nome"
                        type="text"
                        value={registerForm.values.nome}
                        onChange={(e) => registerForm.setValue('nome', e.target.value)}
                        onBlur={() => registerForm.setFieldTouched('nome')}
                        placeholder="Seu nome completo"
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                          registerForm.isFieldInvalid('nome')
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-600 focus:ring-0'
                        }`}
                      />
                    </div>
                    {registerForm.isFieldInvalid('nome') && (
                      <p className="mt-2 text-sm text-red-400">{registerForm.errors.nome}</p>
                    )}
                  </div>

                  {/* Email */}
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
                        value={registerForm.values.email}
                        onChange={(e) => registerForm.setValue('email', e.target.value)}
                        onBlur={() => registerForm.setFieldTouched('email')}
                        placeholder="seu@email.com"
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                          registerForm.isFieldInvalid('email')
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-600 focus:ring-0'
                        }`}
                      />
                    </div>
                    {registerForm.isFieldInvalid('email') && (
                      <p className="mt-2 text-sm text-red-400">{registerForm.errors.email}</p>
                    )}
                  </div>

                  {/* Celular com seleção de país */}
                  <div className="mb-4">
                    <PhoneInput
                      value={celular}
                      onChange={handleCelularChange}
                      onCountryChange={handleCountryChange}
                      onBlur={validateCelular}
                      error={celularError}
                      label="Celular"
                    />
                  </div>

                  {/* Data de Nascimento */}
                  <div className="mb-4">
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300 mb-2">
                      Data de Nascimento <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="birthDate"
                        type="date"
                        value={birthDate}
                        onChange={handleBirthDateChange}
                        onBlur={validateBirthDateField}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                          birthDateError
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-600 focus:ring-0'
                        }`}
                      />
                    </div>
                    {birthDateError ? (
                      <p className="mt-2 text-sm text-red-400">{birthDateError}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Entrada permitida apenas para maiores de 18 anos</p>
                    )}
                  </div>

                  {/* CPF ou Documento Estrangeiro */}
                  {countryCode && (
                    <div className="mb-4">
                      {isBrazilianUser ? (
                        // CPF para brasileiros
                        <>
                          <label htmlFor="cpf" className="block text-sm font-medium text-gray-300 mb-2">
                            CPF <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="cpf"
                              type="text"
                              value={cpf}
                              onChange={handleCpfChange}
                              onBlur={validateCPFField}
                              placeholder="000.000.000-00"
                              maxLength={14}
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                                cpfError
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-gray-600 focus:ring-0'
                              }`}
                            />
                          </div>
                          {cpfError && (
                            <p className="mt-2 text-sm text-red-400">{cpfError}</p>
                          )}
                        </>
                      ) : (
                        // Documento para estrangeiros
                        <>
                          <label htmlFor="foreignId" className="block text-sm font-medium text-gray-300 mb-2">
                            Documento de Identidade <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="foreignId"
                              type="text"
                              value={foreignId}
                              onChange={handleForeignIdChange}
                              onBlur={validateForeignIdField}
                              placeholder="Passaporte ou RNE"
                              maxLength={30}
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                                foreignIdError
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-gray-600 focus:ring-0'
                              }`}
                            />
                          </div>
                          {foreignIdError ? (
                            <p className="mt-2 text-sm text-red-400">{foreignIdError}</p>
                          ) : (
                            <p className="mt-1 text-xs text-gray-500">Passaporte, RNE ou documento de identidade do seu país</p>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Senha */}
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
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
                        className={`block w-full pr-10 pl-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                          registerForm.isFieldInvalid('password')
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-600 focus:ring-0'
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
                    {registerForm.isFieldInvalid('password') && (
                      <p className="mt-2 text-sm text-red-400">{registerForm.errors.password}</p>
                    )}
                  </div>

                  {/* Confirmar Senha */}
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
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
                        className={`block w-full pr-10 pl-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                          registerForm.isFieldInvalid('confirmPassword')
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-600 focus:ring-0'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {registerForm.isFieldInvalid('confirmPassword') && (
                      <p className="mt-2 text-sm text-red-400">{registerForm.errors.confirmPassword}</p>
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
                            ? 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] border-[var(--theme-primary)]'
                            : 'border-gray-600 bg-gray-800'
                        }`}>
                          {registerForm.values.acceptTerms && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        Eu concordo com os{' '}
                        <Link href="/termos" className="text-red-400 hover:text-white">
                          Termos de Uso
                        </Link>{' '}
                        e{' '}
                        <Link href="/privacidade" className="text-red-400 hover:text-white">
                          Política de Privacidade
                        </Link>
                      </div>
                    </label>
                    {registerForm.isFieldInvalid('acceptTerms') && (
                      <p className="mt-2 text-sm text-red-400">{registerForm.errors.acceptTerms}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] hover:opacity-90 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {isLoading ? <LoadingSpinner size="small" color="white" /> : 'Criar Conta'}
                  </button>
                </form>

                {/* Divider */}
                <div className="mt-8 mb-8 flex items-center">
                  <div className="flex-1 border-t border-gray-700"></div>
                  <span className="px-4 text-gray-500 text-sm">ou</span>
                  <div className="flex-1 border-t border-gray-700"></div>
                </div>

                {/* Google Login Button */}
                <div className="mb-8">
                  <GoogleLoginButton
                    text="signup_with"
                    size="large"
                    theme="outline"
                    onSuccess={() => {
                      router.replace('/');
                    }}
                  />
                </div>

                <div className="mt-8 text-center">
                  <Link href="/login" className="text-red-400 hover:text-white font-medium">
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
                  <p className="text-gray-400 mb-2">
                    Para finalizar seu cadastro, digite o código de 6 dígitos enviado para
                  </p>
                  <p className="text-white font-medium">{registeredUser?.celular || ''}</p>
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
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-600 focus:ring-0'
                      }`}
                    />
                    {codeForm.isFieldInvalid('codigo') && (
                      <p className="mt-2 text-sm text-red-400 text-center">{codeForm.errors.codigo}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] hover:opacity-90 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isLoading ? <LoadingSpinner size="small" color="white" /> : 'Finalizar Cadastro'}
                    </button>

                    <button
                      type="button"
                      onClick={goBackToRegister}
                      className="w-full bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-lg transition-colors"
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
            <p>FLAME Lounge Bar - Botafogo, RJ</p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
