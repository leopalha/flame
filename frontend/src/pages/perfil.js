import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Lock,
  Bell,
  Save,
  Edit2,
  X,
  Check,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Perfil() {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile, changePassword, logout, deleteAccount } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: ''
  });

  // Password data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login para acessar seu perfil');
      router.push('/login?returnTo=/perfil');
      return;
    }

    if (user) {
      setProfileData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        cpf: user.cpf || ''
      });
    }
  }, [isAuthenticated, user, router]);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    // Validações básicas
    if (!profileData.nome || profileData.nome.trim().length < 2) {
      toast.error('Nome deve ter pelo menos 2 caracteres');
      return;
    }

    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      toast.error('E-mail inválido');
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateProfile(profileData);

      if (result.success) {
        setIsEditing(false);
        toast.success('Perfil atualizado com sucesso!');
      } else {
        toast.error(result.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Validations
    if (!passwordData.currentPassword) {
      toast.error('Digite sua senha atual');
      return;
    }

    if (!passwordData.newPassword) {
      toast.error('Digite a nova senha');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsSaving(true);

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);

      if (result.success) {
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Senha alterada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotification = (key) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Preferências atualizadas!');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAccount(deletePassword);
      if (result.success) {
        router.push('/');
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeletePassword('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to original user data
    if (user) {
      setProfileData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        cpf: user.cpf || ''
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Meu Perfil | FLAME</title>
        <meta name="description" content="Gerencie suas informações pessoais" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Meu Perfil</h1>
              <p className="text-neutral-400">
                Gerencie suas informações pessoais e preferências
              </p>
            </div>

            {/* Profile Info */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                  Informações Pessoais
                </h2>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))'
                    }}
                    className="flex items-center gap-2 hover:opacity-90 text-white px-4 py-2 rounded-lg transition-opacity text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      style={{
                        background: isSaving ? '#525252' : 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))'
                      }}
                      className="flex items-center gap-2 hover:opacity-90 disabled:opacity-60 text-white px-4 py-2 rounded-lg transition-opacity text-sm font-medium"
                    >
                      {isSaving ? (
                        <LoadingSpinner size="small" color="white" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Salvar
                    </button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Nome Completo</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.nome}
                      onChange={(e) => handleProfileChange('nome', e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2"
                      style={{
                        focusRingColor: 'var(--theme-primary)',
                        borderColor: 'var(--theme-primary)'
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-white font-medium">
                      <User className="w-4 h-4 text-neutral-500" />
                      {profileData.nome || '-'}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">E-mail</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--theme-primary)'
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Mail className="w-4 h-4 text-neutral-500" />
                      {profileData.email || '-'}
                    </div>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Telefone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.telefone}
                      onChange={(e) => handleProfileChange('telefone', e.target.value)}
                      placeholder="(21) 99999-9999"
                      className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--theme-primary)'
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Phone className="w-4 h-4 text-neutral-500" />
                      {profileData.telefone || '-'}
                    </div>
                  )}
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">CPF</label>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <CreditCard className="w-4 h-4 text-neutral-500" />
                    {profileData.cpf || '-'}
                  </div>
                  {isEditing && (
                    <p className="text-xs text-neutral-500 mt-1">CPF não pode ser alterado</p>
                  )}
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                  Segurança
                </h2>

                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    style={{
                      color: 'var(--theme-primary)'
                    }}
                    className="hover:opacity-70 text-sm font-medium transition-opacity"
                  >
                    Alterar Senha
                  </button>
                )}
              </div>

              {isChangingPassword ? (
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Senha Atual</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 pr-12"
                        style={{
                          borderColor: 'var(--theme-primary)'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 pr-12"
                        style={{
                          borderColor: 'var(--theme-primary)'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Mínimo 6 caracteres</p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Confirmar Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 pr-12"
                        style={{
                          borderColor: 'var(--theme-primary)'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={isSaving}
                      style={{
                        background: isSaving ? '#525252' : 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))'
                      }}
                      className="flex-1 hover:opacity-90 disabled:opacity-60 text-white px-4 py-2 rounded-lg transition-opacity text-sm font-medium"
                    >
                      {isSaving ? 'Alterando...' : 'Alterar Senha'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-400 text-sm">
                  Sua senha está protegida. Clique em "Alterar Senha" para modificá-la.
                </p>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                Notificações
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                  <div>
                    <p className="text-white font-medium">Atualizações de Pedidos</p>
                    <p className="text-neutral-400 text-sm">Receba notificações sobre o status dos seus pedidos</p>
                  </div>
                  <button
                    onClick={() => handleToggleNotification('orderUpdates')}
                    style={{
                      backgroundColor: notificationPrefs.orderUpdates ? 'var(--theme-primary)' : 'var(--neutral-700, #374151)'
                    }}
                    className="relative w-12 h-6 rounded-full transition-colors"
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: notificationPrefs.orderUpdates ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                  <div>
                    <p className="text-white font-medium">Promoções e Ofertas</p>
                    <p className="text-neutral-400 text-sm">Fique por dentro de ofertas especiais</p>
                  </div>
                  <button
                    onClick={() => handleToggleNotification('promotions')}
                    style={{
                      backgroundColor: notificationPrefs.promotions ? 'var(--theme-primary)' : 'var(--neutral-700, #374151)'
                    }}
                    className="relative w-12 h-6 rounded-full transition-colors"
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: notificationPrefs.promotions ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-white font-medium">Newsletter</p>
                    <p className="text-neutral-400 text-sm">Receba novidades por email</p>
                  </div>
                  <button
                    onClick={() => handleToggleNotification('newsletter')}
                    style={{
                      backgroundColor: notificationPrefs.newsletter ? 'var(--theme-primary)' : 'var(--neutral-700, #374151)'
                    }}
                    className="relative w-12 h-6 rounded-full transition-colors"
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: notificationPrefs.newsletter ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--theme-primary)' }}>
                <AlertCircle className="w-5 h-5" />
                Zona de Perigo
              </h2>

              <p className="text-neutral-400 text-sm mb-4">
                Ações irreversíveis. Tenha certeza antes de prosseguir.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ color: 'var(--theme-primary)' }}
                  className="flex items-center gap-2 bg-[var(--theme-primary)]/30 hover:bg-[var(--theme-primary)]/50 border border-[var(--theme-primary)] px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir Conta
                </button>
              ) : (
                <div className="bg-[var(--theme-primary)]/20 border border-[var(--theme-primary)] rounded-lg p-4">
                  <p className="font-medium mb-3" style={{ color: 'var(--theme-primary)' }}>Tem certeza que deseja excluir sua conta?</p>
                  <p className="text-neutral-400 text-sm mb-4">
                    Esta ação não pode ser desfeita. Seus dados serão anonimizados permanentemente.
                  </p>

                  {/* Campo de senha para confirmação */}
                  {user?.password && (
                    <div className="mb-4">
                      <label className="block text-sm text-neutral-400 mb-2">
                        Digite sua senha para confirmar:
                      </label>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Sua senha"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-[var(--theme-primary)]"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword('');
                      }}
                      className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      disabled={isDeleting}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="flex-1 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] hover:from-[var(--theme-secondary)] hover:to-[var(--theme-primary)] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {isDeleting ? 'Excluindo...' : 'Sim, Excluir Conta'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
