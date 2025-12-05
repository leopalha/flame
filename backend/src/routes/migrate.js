const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

// Migration endpoint (should be protected in production!)
router.post('/cpf-optional', async (req, res) => {
  try {
    // Check if already migrated (lowercase table names in PostgreSQL)
    const [results] = await sequelize.query(`
      SELECT column_name, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'cpf';
    `);

    if (results.length > 0 && results[0].is_nullable === 'YES') {
      return res.status(200).json({
        success: true,
        message: 'Migração já aplicada - CPF já é opcional',
        alreadyMigrated: true
      });
    }

    // Run migration (lowercase table name for PostgreSQL)
    await sequelize.query(`
      ALTER TABLE "users"
      ALTER COLUMN "cpf" DROP NOT NULL;
    `);

    res.status(200).json({
      success: true,
      message: 'Migração aplicada com sucesso - CPF agora é opcional',
      migrated: true
    });
  } catch (error) {
    console.error('Erro na migração:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message
    });
  }
});

// Migration endpoint to extend smsCode column from 4 to 6 characters
router.post('/smscode-length', async (req, res) => {
  try {
    // Check current length
    const [results] = await sequelize.query(`
      SELECT column_name, character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'smsCode';
    `);

    if (results.length > 0 && results[0].character_maximum_length === 6) {
      return res.status(200).json({
        success: true,
        message: 'Migração já aplicada - smsCode já tem 6 caracteres',
        alreadyMigrated: true
      });
    }

    // Run migration
    await sequelize.query(`
      ALTER TABLE "users"
      ALTER COLUMN "smsCode" TYPE VARCHAR(6);
    `);

    res.status(200).json({
      success: true,
      message: 'Migração aplicada com sucesso - smsCode agora tem 6 caracteres',
      migrated: true
    });
  } catch (error) {
    console.error('Erro na migração:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message
    });
  }
});

// Check migration status
router.get('/status', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT column_name, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users'
      AND column_name IN ('cpf', 'email', 'celular', 'password');
    `);

    res.status(200).json({
      success: true,
      columns: results
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar status',
      error: error.message
    });
  }
});

module.exports = router;
