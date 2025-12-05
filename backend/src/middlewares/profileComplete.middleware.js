const { User } = require('../models');

/**
 * Middleware para verificar se o usuário tem perfil completo
 * Bloqueia acesso a funcionalidades que requerem perfil completo (pedidos, reservas, etc)
 */
const requireCompleteProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se o perfil está completo
    if (!user.profileComplete) {
      console.log('🚫 PROFILE INCOMPLETE:', {
        userId: user.id,
        celular: user.celular,
        profileComplete: user.profileComplete,
        hasEmail: !!user.email,
        hasNome: !!user.nome
      });

      return res.status(403).json({
        success: false,
        message: 'Complete seu perfil para acessar esta funcionalidade',
        requiresProfileCompletion: true,
        redirectTo: '/complete-profile'
      });
    }

    // Perfil completo, pode prosseguir
    next();
  } catch (error) {
    console.error('❌ REQUIRE COMPLETE PROFILE: Erro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar perfil'
    });
  }
};

/**
 * Middleware opcional - apenas adiciona flag profileComplete no req.user
 * Não bloqueia acesso, apenas informa status
 */
const checkProfileComplete = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        req.user.profileComplete = user.profileComplete;
        req.user.hasCompleteProfile = user.hasCompleteProfile();
      }
    }

    next();
  } catch (error) {
    console.error('❌ CHECK PROFILE COMPLETE: Erro:', error);
    next(); // Não bloqueia em caso de erro
  }
};

module.exports = {
  requireCompleteProfile,
  checkProfileComplete
};
