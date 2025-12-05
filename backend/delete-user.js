const { sequelize } = require('./src/models');
const User = require('./src/models/User');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco');

    // Buscar por email OU celular
    const users = await User.findAll({
      where: {
        email: 'leonardo.palha@gmail.com'
      }
    });

    console.log(`📋 Encontrados ${users.length} usuário(s)`);

    for (const user of users) {
      console.log('Usuário:', {
        id: user.id,
        nome: user.nome,
        email: user.email,
        celular: user.celular,
        verificado: user.verificado,
        role: user.role
      });

      await user.destroy();
      console.log('🗑️ Usuário deletado!');
    }

    if (users.length === 0) {
      console.log('⚠️ Nenhum usuário encontrado com esse email');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
})();
