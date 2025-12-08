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

// Migration endpoint to extend celular column from 15 to 20 characters
router.post('/celular-length', async (req, res) => {
  try {
    // Check current length
    const [results] = await sequelize.query(`
      SELECT column_name, character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'celular';
    `);

    if (results.length > 0 && results[0].character_maximum_length >= 20) {
      return res.status(200).json({
        success: true,
        message: 'Migração já aplicada - celular já tem 20+ caracteres',
        alreadyMigrated: true
      });
    }

    // Run migration
    await sequelize.query(`
      ALTER TABLE "users"
      ALTER COLUMN "celular" TYPE VARCHAR(20);
    `);

    res.status(200).json({
      success: true,
      message: 'Migração aplicada com sucesso - celular agora tem 20 caracteres',
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

// Update test user email endpoint
router.post('/update-test-user', async (req, res) => {
  try {
    const { celular, newEmail, newNome } = req.body;
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({
        success: false,
        message: 'Chave de migração inválida'
      });
    }

    if (!celular || !newEmail) {
      return res.status(400).json({
        success: false,
        message: 'celular e newEmail são obrigatórios'
      });
    }

    // Update user directly via SQL
    const [results, metadata] = await sequelize.query(`
      UPDATE "users"
      SET "email" = :newEmail, "nome" = COALESCE(:newNome, "nome")
      WHERE "celular" = :celular
      RETURNING id, nome, email, celular;
    `, {
      replacements: { celular, newEmail, newNome: newNome || null }
    });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado com este celular'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: results[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário',
      error: error.message
    });
  }
});

// Migration endpoint to convert phone numbers to international format
router.post('/phone-format', async (req, res) => {
  try {
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({
        success: false,
        message: 'Chave de migração inválida'
      });
    }

    // First get all users with old format
    const [usersToUpdate] = await sequelize.query(`
      SELECT id, celular FROM "users" WHERE "celular" LIKE '(%';
    `);

    if (usersToUpdate.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Nenhum número para converter',
        count: 0
      });
    }

    // Update each user directly with raw SQL (bypass Sequelize validations)
    const results = [];
    for (const user of usersToUpdate) {
      // Extract only numbers from the phone
      const numbersOnly = user.celular.replace(/\D/g, '');
      const newCelular = '+55' + numbersOnly;

      // Use raw query without any Sequelize involvement
      await sequelize.query(
        `UPDATE "users" SET "celular" = $1 WHERE "id" = $2`,
        {
          bind: [newCelular, user.id],
          type: sequelize.QueryTypes.RAW
        }
      );

      results.push({
        id: user.id,
        oldCelular: user.celular,
        newCelular
      });
    }

    res.status(200).json({
      success: true,
      message: 'Números convertidos para formato internacional',
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Erro na migração de formato:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao migrar formato de telefone',
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

// List users with old phone format
router.get('/phone-format/list', async (req, res) => {
  try {
    const [users] = await sequelize.query(`
      SELECT id, nome, email, celular FROM "users"
      WHERE "celular" LIKE '(%' OR "celular" NOT LIKE '+%';
    `);

    res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar usuários',
      error: error.message
    });
  }
});

// Direct SQL migration - update specific user phone
router.post('/phone-format/update-single', async (req, res) => {
  try {
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;
    const { userId, newCelular } = req.body;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({
        success: false,
        message: 'Chave de migração inválida'
      });
    }

    if (!userId || !newCelular) {
      return res.status(400).json({
        success: false,
        message: 'userId e newCelular são obrigatórios'
      });
    }

    // Use raw SQL with transaction
    const transaction = await sequelize.transaction();
    try {
      await sequelize.query(
        `UPDATE "users" SET "celular" = '${newCelular}' WHERE "id" = '${userId}'`,
        { transaction, type: sequelize.QueryTypes.UPDATE }
      );

      await transaction.commit();

      // Verify
      const [updated] = await sequelize.query(
        `SELECT id, nome, email, celular FROM "users" WHERE "id" = '${userId}'`
      );

      res.status(200).json({
        success: true,
        message: 'Celular atualizado com sucesso',
        user: updated[0]
      });
    } catch (txError) {
      await transaction.rollback();
      throw txError;
    }
  } catch (error) {
    console.error('Erro ao atualizar celular:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar celular',
      error: error.message,
      stack: error.stack
    });
  }
});

// Delete user by ID (for cleaning duplicates)
router.delete('/phone-format/delete-user/:userId', async (req, res) => {
  try {
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;
    const { userId } = req.params;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({ success: false, message: 'Chave inválida' });
    }

    // Get user info first
    const [user] = await sequelize.query(
      `SELECT id, nome, email, celular FROM "users" WHERE "id" = $1`,
      { bind: [userId] }
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Delete user
    await sequelize.query(
      `DELETE FROM "users" WHERE "id" = $1`,
      { bind: [userId], type: sequelize.QueryTypes.DELETE }
    );

    res.status(200).json({
      success: true,
      message: 'Usuário deletado com sucesso',
      deletedUser: user[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check for duplicate phone numbers
router.get('/phone-format/check-duplicate/:celular', async (req, res) => {
  try {
    const celular = decodeURIComponent(req.params.celular);
    const [users] = await sequelize.query(
      `SELECT id, nome, email, celular FROM "users" WHERE "celular" = $1`,
      { bind: [celular] }
    );

    res.status(200).json({
      success: true,
      exists: users.length > 0,
      user: users[0] || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Debug: Update single user with detailed error
router.post('/phone-format/debug-update', async (req, res) => {
  try {
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;
    const { userId, newCelular } = req.body;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({ success: false, message: 'Chave inválida' });
    }

    // Check if new number already exists
    const [existing] = await sequelize.query(
      `SELECT id, nome, celular FROM "users" WHERE "celular" = $1 AND "id" != $2`,
      { bind: [newCelular, userId] }
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Número já existe',
        conflictingUser: existing[0]
      });
    }

    // Try direct SQL update
    const result = await sequelize.query(
      `UPDATE "users" SET "celular" = $1, "updatedAt" = NOW() WHERE "id" = $2`,
      { bind: [newCelular, userId], type: sequelize.QueryTypes.UPDATE }
    );

    // Get updated user
    const [updated] = await sequelize.query(
      `SELECT id, nome, celular FROM "users" WHERE "id" = $1`,
      { bind: [userId] }
    );

    res.status(200).json({
      success: true,
      result,
      user: updated[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      name: error.name,
      original: error.original ? error.original.message : null,
      stack: error.stack
    });
  }
});

// Migration using pg client directly (bypassing Sequelize completely)
router.post('/phone-format/direct', async (req, res) => {
  try {
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({
        success: false,
        message: 'Chave de migração inválida'
      });
    }

    // Get database connection pool directly
    const pool = sequelize.connectionManager.pool;

    // Get users with old format
    const [usersToUpdate] = await sequelize.query(`
      SELECT id, celular FROM "users" WHERE "celular" LIKE '(%';
    `);

    if (usersToUpdate.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Nenhum número para converter',
        count: 0
      });
    }

    const results = [];
    const errors = [];

    for (const user of usersToUpdate) {
      try {
        // Extract only numbers from the phone
        const numbersOnly = user.celular.replace(/\D/g, '');
        const newCelular = '+55' + numbersOnly;

        // Execute raw SQL directly
        await sequelize.query(
          `UPDATE "users" SET "celular" = $1 WHERE "id" = $2::uuid`,
          {
            bind: [newCelular, user.id],
            type: sequelize.QueryTypes.UPDATE,
            raw: true
          }
        );

        results.push({
          id: user.id,
          oldCelular: user.celular,
          newCelular,
          success: true
        });
      } catch (userError) {
        errors.push({
          id: user.id,
          oldCelular: user.celular,
          error: userError.message
        });
      }
    }

    res.status(200).json({
      success: errors.length === 0,
      message: `${results.length} números convertidos, ${errors.length} erros`,
      results,
      errors
    });
  } catch (error) {
    console.error('Erro na migração direta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao migrar formato de telefone',
      error: error.message,
      stack: error.stack
    });
  }
});

// Create admin user Leonardo directly via SQL
router.post('/create-admin-user', async (req, res) => {
  try {
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({
        success: false,
        message: 'Chave de migração inválida'
      });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Leo@2024', 12);

    // Check if user exists
    const [existing] = await sequelize.query(
      `SELECT id FROM "users" WHERE LOWER(email) = LOWER('leonardo.palha@gmail.com')`
    );

    if (existing.length > 0) {
      // Update existing user
      await sequelize.query(
        `UPDATE "users" SET
          "password" = $1,
          "role" = 'admin',
          "isActive" = true,
          "phoneVerified" = true,
          "celular" = '+5521995354010',
          "updatedAt" = NOW()
        WHERE LOWER(email) = LOWER('leonardo.palha@gmail.com')`,
        { bind: [hashedPassword] }
      );

      return res.status(200).json({
        success: true,
        message: 'Usuário admin atualizado com sucesso',
        action: 'updated'
      });
    }

    // Create new user
    const { v4: uuidv4 } = require('uuid');
    const userId = uuidv4();

    await sequelize.query(
      `INSERT INTO "users" (id, nome, email, celular, password, role, "isActive", "phoneVerified", "createdAt", "updatedAt")
       VALUES ($1, 'Leonardo Palha', 'leonardo.palha@gmail.com', '+5521995354010', $2, 'admin', true, true, NOW(), NOW())`,
      { bind: [userId, hashedPassword] }
    );

    res.status(201).json({
      success: true,
      message: 'Usuário admin criado com sucesso',
      action: 'created',
      userId
    });
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add birthday fields to users table (Sprint 25 - Bônus Automáticos)
router.post('/add-birthday-fields', async (req, res) => {
  try {
    const columnsToAdd = [
      { name: 'birthDate', type: 'DATE', default: null },
      { name: 'lastBirthdayBonusYear', type: 'INTEGER', default: null }
    ];

    const results = [];

    for (const col of columnsToAdd) {
      // Check if column exists
      const [existing] = await sequelize.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = '${col.name}';
      `);

      if (existing.length > 0) {
        results.push({ column: col.name, status: 'already_exists' });
        continue;
      }

      // Add column
      await sequelize.query(`
        ALTER TABLE "users"
        ADD COLUMN "${col.name}" ${col.type};
      `);

      results.push({ column: col.name, status: 'added' });
    }

    res.status(200).json({
      success: true,
      message: 'Colunas de aniversário verificadas/adicionadas',
      results
    });
  } catch (error) {
    console.error('Erro na migração birthday fields:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message
    });
  }
});

// Add Google OAuth columns to users table
router.post('/add-google-oauth-columns', async (req, res) => {
  try {
    const columnsToAdd = [
      { name: 'googleId', type: 'VARCHAR(255)', default: null },
      { name: 'googleProfilePicture', type: 'VARCHAR(500)', default: null },
      { name: 'authProvider', type: 'VARCHAR(20)', default: "'local'" }
    ];

    const results = [];

    for (const col of columnsToAdd) {
      // Check if column exists
      const [existing] = await sequelize.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = '${col.name}';
      `);

      if (existing.length > 0) {
        results.push({ column: col.name, status: 'already_exists' });
        continue;
      }

      // Add column
      const defaultClause = col.default ? `DEFAULT ${col.default}` : '';
      await sequelize.query(`
        ALTER TABLE "users"
        ADD COLUMN "${col.name}" ${col.type} ${defaultClause};
      `);

      results.push({ column: col.name, status: 'added' });
    }

    res.status(200).json({
      success: true,
      message: 'Colunas Google OAuth verificadas/adicionadas',
      results
    });
  } catch (error) {
    console.error('Erro na migração Google OAuth:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message
    });
  }
});

// Add profileComplete column to users table
router.post('/add-profile-complete', async (req, res) => {
  try {
    // Check if column exists
    const [results] = await sequelize.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'profileComplete';
    `);

    if (results.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Coluna profileComplete já existe',
        alreadyMigrated: true
      });
    }

    // Add column
    await sequelize.query(`
      ALTER TABLE "users"
      ADD COLUMN "profileComplete" BOOLEAN DEFAULT false NOT NULL;
    `);

    // Set existing users with email as profileComplete = true
    await sequelize.query(`
      UPDATE "users" SET "profileComplete" = true WHERE "email" IS NOT NULL AND "nome" IS NOT NULL;
    `);

    res.status(200).json({
      success: true,
      message: 'Coluna profileComplete adicionada com sucesso',
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

// Check user status by email
router.get('/user-status/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const [users] = await sequelize.query(
      `SELECT id, nome, email, celular, role, "phoneVerified", "isActive",
       CASE WHEN password IS NOT NULL THEN true ELSE false END as "hasPassword"
       FROM "users" WHERE LOWER(email) = LOWER($1)`,
      { bind: [email] }
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
        email
      });
    }

    res.status(200).json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update user role
router.post('/update-role', async (req, res) => {
  try {
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;
    const { email, newRole } = req.body;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({ success: false, message: 'Chave inválida' });
    }

    if (!email || !newRole) {
      return res.status(400).json({ success: false, message: 'email e newRole são obrigatórios' });
    }

    const validRoles = ['cliente', 'atendente', 'cozinha', 'bar', 'caixa', 'gerente', 'admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ success: false, message: 'Role inválida' });
    }

    const [results] = await sequelize.query(
      `UPDATE "users" SET "role" = $1, "updatedAt" = NOW() WHERE LOWER(email) = LOWER($2) RETURNING id, nome, email, role`,
      { bind: [newRole, email] }
    );

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    res.status(200).json({
      success: true,
      message: 'Role atualizada com sucesso',
      user: results[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset user password
router.post('/reset-user-password', async (req, res) => {
  try {
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;
    const { email, newPassword } = req.body;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({
        success: false,
        message: 'Chave de migração inválida'
      });
    }

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'email e newPassword são obrigatórios'
      });
    }

    // Hash the password using bcrypt
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password directly
    const [results, metadata] = await sequelize.query(
      `UPDATE "users" SET "password" = $1, "updatedAt" = NOW() WHERE LOWER(email) = LOWER($2) RETURNING id, nome, email`,
      { bind: [hashedPassword, email] }
    );

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Senha atualizada com sucesso',
      user: results[0]
    });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check Google OAuth configuration status
router.get('/google-oauth-status', async (req, res) => {
  try {
    const googleService = require('../services/google.service');

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const isConfigured = googleService.isConfigured();

    // Check users with Google auth
    const [googleUsers] = await sequelize.query(`
      SELECT COUNT(*) as count FROM "users" WHERE "googleId" IS NOT NULL;
    `);

    res.status(200).json({
      success: true,
      googleOAuth: {
        isConfigured,
        clientIdSet: !!clientId,
        clientIdPrefix: clientId ? clientId.substring(0, 20) + '...' : null,
        clientIdLength: clientId ? clientId.length : 0,
      },
      database: {
        usersWithGoogleAuth: parseInt(googleUsers[0].count)
      }
    });
  } catch (error) {
    console.error('Erro ao verificar Google OAuth:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add order timeline fields (confirmedAt, pickedUpAt, cancelledAt, cancelledBy)
router.post('/add-order-timeline-fields', async (req, res) => {
  try {
    const columnsToAdd = [
      { name: 'confirmedAt', type: 'TIMESTAMPTZ', default: null },
      { name: 'pickedUpAt', type: 'TIMESTAMPTZ', default: null },
      { name: 'cancelledAt', type: 'TIMESTAMPTZ', default: null },
      { name: 'cancelledBy', type: 'UUID', default: null, references: 'users(id)' }
    ];

    const results = [];

    for (const col of columnsToAdd) {
      // Check if column exists
      const [existing] = await sequelize.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = '${col.name}';
      `);

      if (existing.length > 0) {
        results.push({ column: col.name, status: 'already_exists' });
        continue;
      }

      // Add column
      let query = `ALTER TABLE "orders" ADD COLUMN "${col.name}" ${col.type}`;
      if (col.default !== null) {
        query += ` DEFAULT ${col.default}`;
      }
      query += ';';

      await sequelize.query(query);
      results.push({ column: col.name, status: 'added' });
    }

    res.status(200).json({
      success: true,
      message: 'Colunas de timeline de pedidos verificadas/adicionadas',
      results
    });
  } catch (error) {
    console.error('Erro na migração order timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message
    });
  }
});


// Add Instagram Cashback table (Sprint 44)
router.post('/add-instagram-cashback-table', async (req, res) => {
  try {
    // Check if table exists
    const [tables] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'instagram_cashbacks';
    `);

    if (tables.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Tabela instagram_cashbacks já existe',
        alreadyMigrated: true
      });
    }

    // Create table
    await sequelize.query(`
      CREATE TABLE "instagram_cashbacks" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL REFERENCES "users"("id"),
        "orderId" UUID NOT NULL UNIQUE REFERENCES "orders"("id"),
        "instagramPostUrl" VARCHAR(500) NOT NULL,
        "cashbackAmount" DECIMAL(10, 2) NOT NULL,
        "status" VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "approvedBy" UUID REFERENCES "users"("id"),
        "approvedAt" TIMESTAMPTZ,
        "rejectedBy" UUID REFERENCES "users"("id"),
        "rejectedAt" TIMESTAMPTZ,
        "rejectionReason" VARCHAR(500),
        "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX "idx_instagram_cashbacks_userId" ON "instagram_cashbacks"("userId");
      CREATE INDEX "idx_instagram_cashbacks_status" ON "instagram_cashbacks"("status");
    `);

    res.status(200).json({
      success: true,
      message: 'Tabela instagram_cashbacks criada com sucesso',
      migrated: true
    });
  } catch (error) {
    console.error('Erro na migração instagram_cashbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar tabela',
      error: error.message
    });
  }
});

// Add user identity fields (Sprint 41 - Cadastro Internacional)
router.post('/add-user-identity-fields', async (req, res) => {
  try {
    const columnsToAdd = [
      { name: 'countryCode', type: 'VARCHAR(2)', comment: 'Código ISO 3166-1 alpha-2 do país' },
      { name: 'foreignId', type: 'VARCHAR(30)', comment: 'Documento de identidade para estrangeiros' }
    ];

    const results = [];

    for (const col of columnsToAdd) {
      const [existing] = await sequelize.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = '${col.name}';
      `);

      if (existing.length > 0) {
        results.push({ column: col.name, status: 'already_exists' });
        continue;
      }

      await sequelize.query(`
        ALTER TABLE "users" ADD COLUMN "${col.name}" ${col.type};
      `);

      results.push({ column: col.name, status: 'added' });
    }

    // Set countryCode = 'BR' for existing users with celular starting with +55
    const [updated] = await sequelize.query(`
      UPDATE "users" SET "countryCode" = 'BR'
      WHERE "countryCode" IS NULL AND "celular" LIKE '+55%'
      RETURNING id;
    `);

    res.status(200).json({
      success: true,
      message: 'Colunas de identidade internacional verificadas/adicionadas',
      results,
      braziliansMarked: updated.length
    });
  } catch (error) {
    console.error('Erro na migração user identity fields:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message
    });
  }
});

// Add referral fields to users table (Sprint 29 - Bônus de Indicação)
router.post('/add-referral-fields', async (req, res) => {
  try {
    const columnsToAdd = [
      { name: 'referralCode', type: 'VARCHAR(10)', unique: true },
      { name: 'referredBy', type: 'UUID' },
      { name: 'referralBonusGiven', type: 'BOOLEAN DEFAULT false' },
      { name: 'totalReferrals', type: 'INTEGER DEFAULT 0' }
    ];

    const results = [];

    for (const col of columnsToAdd) {
      const [existing] = await sequelize.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = '${col.name}';
      `);

      if (existing.length > 0) {
        results.push({ column: col.name, status: 'already_exists' });
        continue;
      }

      let query = `ALTER TABLE "users" ADD COLUMN "${col.name}" ${col.type}`;
      if (col.unique) query += ' UNIQUE';
      query += ';';

      await sequelize.query(query);
      results.push({ column: col.name, status: 'added' });
    }

    // Generate referral codes for existing users
    const [usersWithoutCode] = await sequelize.query(`
      SELECT id FROM "users" WHERE "referralCode" IS NULL;
    `);

    let codesGenerated = 0;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (const user of usersWithoutCode) {
      let code = 'FLAME';
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      await sequelize.query(`UPDATE "users" SET "referralCode" = '${code}' WHERE id = '${user.id}';`);
      codesGenerated++;
    }

    res.status(200).json({
      success: true,
      message: 'Colunas de indicação verificadas/adicionadas',
      results,
      referralCodesGenerated: codesGenerated
    });
  } catch (error) {
    console.error('Erro na migração referral fields:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message
    });
  }
});

// Sprint 51: Migração para adicionar campos de timeline nos pedidos
router.post('/add-order-timeline-fields', async (req, res) => {
  try {
    const results = [];

    // Lista de campos de timeline a adicionar
    const timelineColumns = [
      { name: 'confirmedAt', type: 'TIMESTAMP WITH TIME ZONE' },
      { name: 'startedAt', type: 'TIMESTAMP WITH TIME ZONE' },
      { name: 'finishedAt', type: 'TIMESTAMP WITH TIME ZONE' },
      { name: 'pickedUpAt', type: 'TIMESTAMP WITH TIME ZONE' },
      { name: 'deliveredAt', type: 'TIMESTAMP WITH TIME ZONE' },
      { name: 'cancelledAt', type: 'TIMESTAMP WITH TIME ZONE' },
      { name: 'preparationTime', type: 'INTEGER' },
      { name: 'attendantId', type: 'UUID' },
      { name: 'kitchenUserId', type: 'UUID' },
      { name: 'cancelledBy', type: 'UUID' }
    ];

    for (const col of timelineColumns) {
      // Verificar se coluna já existe
      const [existing] = await sequelize.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = '${col.name}';
      `);

      if (existing.length > 0) {
        results.push({ column: col.name, status: 'already_exists' });
      } else {
        // Adicionar coluna
        await sequelize.query(`
          ALTER TABLE "orders"
          ADD COLUMN "${col.name}" ${col.type};
        `);
        results.push({ column: col.name, status: 'added' });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Campos de timeline de pedidos verificados/adicionados',
      results
    });
  } catch (error) {
    console.error('Erro na migração order timeline fields:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message
    });
  }
});

// Migration: Update product images based on available images
router.post('/update-product-images', async (req, res) => {
  try {
    const { productImageMap } = require('../migrations/20251208_add_product_images');

    let updated = 0;
    const results = [];

    for (const [productName, imagePath] of Object.entries(productImageMap)) {
      try {
        // Buscar produto com nome exato
        const [result] = await sequelize.query(
          `UPDATE products SET image = :imagePath WHERE LOWER(name) = LOWER(:productName) AND (image IS NULL OR image = '')`,
          {
            replacements: { imagePath, productName },
            type: sequelize.QueryTypes.UPDATE
          }
        );

        if (result > 0) {
          results.push({ product: productName, image: imagePath, status: 'updated' });
          updated++;
        }
      } catch (error) {
        results.push({ product: productName, status: 'error', error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      message: `${updated} produtos atualizados com imagens`,
      updated,
      results: results.filter(r => r.status === 'updated')
    });
  } catch (error) {
    console.error('Erro na migração de imagens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração de imagens',
      error: error.message
    });
  }
});

// Migration: Update product images with flexible matching
router.post('/update-product-images-flexible', async (req, res) => {
  try {
    // Mapeamento flexível nome do produto -> path da imagem
    const flexibleImageMap = {
      // Shots
      'Tequila Shot Premium': '/images/cardapio/Tequila Shot Premium.png',
      'Jägermeister Shot': '/images/cardapio/Jägermeister Shot.png',
      'Lemon Drop Shot': '/images/cardapio/Lemon Drop.png',
      'B-52': '/images/cardapio/B-52 Flamejado.png',

      // Cervejas
      'IPA FLAME': '/images/cardapio/IPA Exxquema Copo.png',
      'Lager Pilsen Artesanal': '/images/cardapio/Lager Pilsen Copo.png',
      'Witbier Artesanal': '/images/cardapio/Witbier Copo.png',
      'APA Tropical': '/images/cardapio/APA Tropical Copo.png',
      'Porter Imperial': '/images/cardapio/Porter Imperial Taça.png',

      // Vinhos
      'Malbec Argentino Premium': '/images/cardapio/Malbec Taça.png',
      'Prosecco Italiano DOC': '/images/cardapio/Prosecco Taça.png',
      'Rosé Francês Provence': '/images/cardapio/Rosé Provence Taça.png',
      'Cabernet Sauvignon Reserva': '/images/cardapio/Cabernet Sauvignon Reserva.png',
      'Chandon Brut': '/images/cardapio/Chandon Brut Taça.png',

      // Destilados
      "Vodka Absolut 1L": '/images/cardapio/Vodka Absolut 1L.png',
      "Vodka Ciroc 750ml": '/images/cardapio/Vodka Ciroc 750ml.png',
      "Vodka Grey Goose 1L": '/images/cardapio/Grey Goose 750ml.png',
      "Jack Daniel's 1L": "/images/cardapio/Jack Daniel's 1L.png",
      "Johnnie Walker Black Label 1L": '/images/cardapio/Johnnie Walker Black Label 1L.png',
      "Chivas Regal 12 Anos 1L": '/images/cardapio/Chivas Regal.png',
      "Gin Tanqueray 1L": '/images/cardapio/Gin Tanqueray 1L.png',
      "Gin Bombay Sapphire 1L": '/images/cardapio/Bombay Sapphire.png',
      "Gin Hendrick's 750ml": "/images/cardapio/Hendrick's.png",
      "Tequila José Cuervo Gold 750ml": '/images/cardapio/Tequila José Cuervo Gold 750ml.png',
      "Tequila Patrón Silver 750ml": '/images/cardapio/Patrón Silver.png',
      "Rum Bacardi Carta Ouro 1L": '/images/cardapio/Bacardi Ouro.png',

      // Red Bull
      'Red Bull Sugar Free': '/images/cardapio/Red Bull Original.png',

      // Petiscos
      'Nachos FLAME': '/images/cardapio/Nachos Exxquema.png',
      'Coxinha de Catupiry (6uni)': '/images/cardapio/Coxinha de Frango com Catupiry.png',
      'Bolinho de Bacalhau Português': '/images/cardapio/Bolinhos de Bacalhau.png',
      'Tábua de Frios Premium': '/images/cardapio/Tábua de Frios Especiais.png',

      // Pratos
      'FLAME Burger Premium': '/images/cardapio/Exxquema Burger Premium.png',
      'Picanha FLAME': '/images/cardapio/Picanha na Brasa.png',

      // Sobremesas
      'Petit Gateau FLAME': '/images/cardapio/Petit Gateau Exxquema.png',
      'Brownie Premium com Sorvete': '/images/cardapio/Brownie Premium com Sorvete.png',

      // Drinks especiais
      'FLAME Signature': '/images/cardapio/Red Light Signature.png',
      'FLAME Bomb': '/images/cardapio/Red Light Bomb.png',
      'Margarita Clássica': '/images/cardapio/Lemon Drop.png',

      // Não alcoólicos
      'Limonada Suíça Premium': '/images/cardapio/Limonada Suíça Premium.png',
      'Virgin Mojito': '/images/cardapio/Virgin Mojito Drink.png'
    };

    let updated = 0;
    const results = [];

    for (const [productName, imagePath] of Object.entries(flexibleImageMap)) {
      try {
        const [result] = await sequelize.query(
          `UPDATE products SET image = :imagePath WHERE LOWER(name) = LOWER(:productName) AND (image IS NULL OR image = '')`,
          {
            replacements: { imagePath, productName },
            type: sequelize.QueryTypes.UPDATE
          }
        );

        if (result > 0) {
          results.push({ product: productName, image: imagePath, status: 'updated' });
          updated++;
        }
      } catch (error) {
        results.push({ product: productName, status: 'error', error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      message: `${updated} produtos atualizados com imagens (match flexível)`,
      updated,
      results: results.filter(r => r.status === 'updated')
    });
  } catch (error) {
    console.error('Erro na migração de imagens flexível:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração de imagens',
      error: error.message
    });
  }
});

// Migration: Add cashbackUsed and discount columns to orders table
router.post('/add-order-cashback-fields', async (req, res) => {
  try {
    const columns = [
      { name: 'cashbackUsed', type: 'DECIMAL(10,2)', default: '0.00' },
      { name: 'discount', type: 'DECIMAL(10,2)', default: '0.00' }
    ];

    const results = [];

    for (const col of columns) {
      // Check if column exists
      const [existing] = await sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'orders'
        AND column_name = '${col.name}'
      `);

      if (existing.length > 0) {
        results.push({ column: col.name, status: 'already exists' });
      } else {
        await sequelize.query(`
          ALTER TABLE "orders"
          ADD COLUMN "${col.name}" ${col.type} DEFAULT ${col.default}
        `);
        results.push({ column: col.name, status: 'added' });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Campos cashbackUsed e discount verificados/adicionados',
      results
    });
  } catch (error) {
    console.error('Erro na migração order cashback fields:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message
    });
  }
});

module.exports = router;
