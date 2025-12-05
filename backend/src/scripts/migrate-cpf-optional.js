/**
 * Migration Script: Make CPF column optional
 *
 * This script updates the Users table to make the CPF column nullable.
 * Run this on production: node src/scripts/migrate-cpf-optional.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');

async function migrateCPF() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conectado!');

    console.log('🔄 Alterando coluna CPF para permitir valores NULL...');

    // Para PostgreSQL
    if (sequelize.getDialect() === 'postgres') {
      await sequelize.query(`
        ALTER TABLE "Users"
        ALTER COLUMN "cpf" DROP NOT NULL;
      `);
      console.log('✅ Coluna CPF atualizada com sucesso (PostgreSQL)!');
    }
    // Para SQLite
    else if (sequelize.getDialect() === 'sqlite') {
      console.log('⚠️  SQLite não suporta ALTER COLUMN diretamente.');
      console.log('   Recriando tabela com Sequelize.sync({ alter: true })...');

      const { User } = require('../models');
      await User.sync({ alter: true });

      console.log('✅ Tabela Users atualizada com sucesso (SQLite)!');
    }

    console.log('🎉 Migração concluída!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
}

// Executar migração
migrateCPF();
