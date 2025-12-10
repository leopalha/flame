import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { LogIn, User, Lock, ChefHat, Wine, Users } from 'lucide-react';

export default function StaffLogin() {
  const router = useRouter();
  const { loginWithPassword, isAuthenticated, user } = useAuthStore();
  const { getPalette } = useThemeStore();

  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // Redirect based on role after login
  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRoutes = {
        admin: '/admin',
        gerente: '/admin',
        cozinha: '/cozinha',
        bar: '/staff/bar',
        atendente: '/atendente',
        caixa: '/staff/caixa',
        cliente: '/'
      };

      const redirectUrl = roleRoutes[user.role] || '/';
      router.push(redirectUrl);
    }
  }, [isAuthenticated, user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use authStore login method
      const result = await loginWithPassword(credentials.email, credentials.password);

      if (result.success && result.data?.user) {
        // Redirect based on role
        const roleRoutes = {
          admin: '/admin',
          gerente: '/admin',
          cozinha: '/cozinha',
          bar: '/staff/bar',
          atendente: '/atendente',
          caixa: '/staff/caixa',
          cliente: '/'
        };

        const redirectUrl = roleRoutes[result.data.user.role] || '/';
        router.push(redirectUrl);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      const errorMsg = error.response?.data?.error || 'Erro ao fazer login';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const palette = getPalette();

  return (
    <>
      <Head>
        <title>Login Staff | FLAME</title>
        <meta name="description" content="Login para equipe FLAME" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5" style={{ background: palette?.primary || '#FF006E', filter: 'blur(80px)' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: palette?.secondary || '#00D4FF', filter: 'blur(80px)' }}></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo Section */}
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: `${palette?.primary || '#FF006E'}20`, borderColor: palette?.primary || '#FF006E', borderWidth: '2px' }}
            >
              <LogIn className="w-8 h-8" style={{ color: palette?.primary || '#FF006E' }} />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">FLAME Staff</h1>
            <p className="text-gray-400">Login para equipe de operação</p>
          </div>

          {/* Login Form Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 mb-6"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Email ou Usuário
                  </div>
                </label>
                <input
                  type="text"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF006E] transition-colors"
                  disabled={loading}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Senha
                  </div>
                </label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF006E] transition-colors"
                  disabled={loading}
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2"
                style={{
                  background: loading ? (palette?.secondary || '#00D4FF') : (palette?.primary || '#FF006E'),
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Role Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/30 border border-gray-700 rounded-xl p-4"
          >
            <p className="text-xs text-gray-400 mb-3 font-semibold">Papéis disponíveis:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <ChefHat className="w-4 h-4 text-orange-400" />
                <span>Cozinha → /cozinha</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Wine className="w-4 h-4 text-purple-400" />
                <span>Bar → /staff/bar</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Atendente → /atendente</span>
              </div>
            </div>
          </motion.div>

          {/* Back to Main Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Login de cliente?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-[#FF006E] hover:text-[#ff3388] font-semibold transition-colors"
              >
                Clique aqui
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
