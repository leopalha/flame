import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/stores/authStore';
import Head from 'next/head';

export default function CompleteProfile() {
  const router = useRouter();
  const { user, completeProfile, isAuthenticated, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirecionar se não estiver autenticado
    if (!isLoading && !isAuthenticated) {
      toast.error('Faça login para continuar');
      router.push('/login');
      return;
    }

    // Redirecionar se o perfil já estiver completo
    if (user?.profileComplete) {
      toast.success('Seu perfil já está completo!');
      router.push('/');
      return;
    }

    // Preencher dados existentes
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.nome || '',
        email: user.email || ''
      }));
    }
  }, [user, isAuthenticated, isLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validações
      if (!formData.nome || formData.nome.trim().length < 2) {
        toast.error('Nome deve ter pelo menos 2 caracteres');
        setIsSubmitting(false);
        return;
      }

      if (!formData.email || !formData.email.includes('@')) {
        toast.error('Email inválido');
        setIsSubmitting(false);
        return;
      }

      // Senha opcional
      if (formData.password && formData.password.length < 6) {
        toast.error('Senha deve ter pelo menos 6 caracteres');
        setIsSubmitting(false);
        return;
      }

      console.log('📝 Completando perfil:', {
        nome: formData.nome,
        email: formData.email,
        hasPassword: !!formData.password
      });

      await completeProfile(formData);

      toast.success('Perfil completado com sucesso! Agora você pode fazer pedidos.');

      // Redirecionar para a home após 1 segundo
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Erro ao completar perfil:', error);
      toast.error(error.message || 'Erro ao completar perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Complete seu Cadastro | FLAME Lounge</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Complete seu Cadastro
            </h1>
            <p className="text-purple-200">
              Para fazer pedidos, precisamos de mais algumas informações
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-purple-200 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Seu nome completo"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            {/* Senha (opcional) */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                Senha (opcional)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
              <p className="mt-1 text-xs text-purple-300/70">
                Opcional: Crie uma senha para fazer login sem SMS
              </p>
            </div>

            {/* Informações do usuário atual */}
            {user?.celular && (
              <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-3">
                <p className="text-sm text-purple-200">
                  <span className="font-medium">Celular:</span> {user.celular}
                </p>
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : 'Completar Cadastro'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-purple-300">
              * Campos obrigatórios
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
