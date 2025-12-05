import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, CheckCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import FlameLogo from '../components/Logo';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export default function RecuperarSenha() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: email, 2: código, 3: nova senha
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneHint, setPhoneHint] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Solicitar código via email
  const handleRequestCode = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Digite um email válido');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });

      if (response.data.success) {
        setPhoneHint(response.data.data?.hint || '');
        toast.success('Código enviado! Verifique seu SMS.');
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao enviar código');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verificar código
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      toast.error('Digite o código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-reset-code', { email, code });

      if (response.data.success) {
        setResetToken(response.data.data.resetToken);
        toast.success('Código verificado!');
        setStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Código inválido');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Redefinir senha
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        resetToken,
        newPassword
      });

      if (response.data.success) {
        // Salvar token e redirecionar
        localStorage.setItem('token', response.data.data.token);
        toast.success('Senha redefinida com sucesso!');
        router.push('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao redefinir senha');
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar código
  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.success) {
        toast.success('Novo código enviado!');
      }
    } catch (error) {
      toast.error('Erro ao reenviar código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Recuperar Senha | FLAME</title>
        <meta name="description" content="Recupere sua senha no FLAME" />
      </Head>

      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <FlameLogo size="lg" />
            </Link>
          </div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
          >
            {/* Voltar */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao login
            </Link>

            <h1 className="text-2xl font-bold text-white mb-2">
              {step === 1 && 'Recuperar Senha'}
              {step === 2 && 'Verificar Código'}
              {step === 3 && 'Nova Senha'}
            </h1>

            <p className="text-gray-400 mb-6">
              {step === 1 && 'Digite seu email para receber o código de recuperação via SMS.'}
              {step === 2 && `Digite o código de 6 dígitos enviado para ${phoneHint || 'seu celular'}.`}
              {step === 3 && 'Digite sua nova senha.'}
            </p>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      step >= s
                        ? 'text-white'
                        : 'bg-gray-800 text-gray-500'
                    }`}
                    style={step >= s ? { background: 'var(--theme-primary)' } : {}}
                  >
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 sm:w-24 h-1 mx-2 ${
                        step > s ? '' : 'bg-gray-800'
                      }`}
                      style={step > s ? { background: 'var(--theme-primary)' } : {}}
                    />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Email */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleRequestCode}
                >
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{ background: 'var(--theme-primary)' }}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Enviar Código'}
                  </button>
                </motion.form>
              )}

              {/* Step 2: Código */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyCode}
                >
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Código de Verificação
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-12 pr-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      O código expira em 15 minutos
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
                    className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50 mb-4"
                    style={{ background: 'var(--theme-primary)' }}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Verificar Código'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="w-full text-gray-400 hover:text-white py-2 transition-colors"
                  >
                    Reenviar código
                  </button>
                </motion.form>
              )}

              {/* Step 3: Nova Senha */}
              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleResetPassword}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Digite novamente"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">As senhas não coincidem</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || newPassword.length < 6 || newPassword !== confirmPassword}
                    className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{ background: 'var(--theme-primary)' }}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Redefinir Senha'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Lembrou a senha?{' '}
            <Link href="/login" className="hover:underline" style={{ color: 'var(--theme-primary)' }}>
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
