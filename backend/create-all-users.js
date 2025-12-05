/**
 * Script para criar todos os usuários de teste do sistema FLAME
 * Execute: node create-all-users.js
 */

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Gerar UUID v4
function generateUUID() {
  return crypto.randomUUID();
}

const users = [
  {
    nome: 'Administrador FLAME',
    email: 'admin@flamelounge.com.br',
    celular: '11999990001',
    cpf: '00000000001',
    password: 'admin123',
    role: 'admin'
  },
  {
    nome: 'Gerente FLAME',
    email: 'gerente@flamelounge.com.br',
    celular: '11999990002',
    cpf: '00000000002',
    password: 'gerente123',
    role: 'gerente'
  },
  {
    nome: 'Cozinheiro FLAME',
    email: 'cozinha@flamelounge.com.br',
    celular: '11999990003',
    cpf: '00000000003',
    password: 'cozinha123',
    role: 'cozinha'
  },
  {
    nome: 'Barman FLAME',
    email: 'bar@flamelounge.com.br',
    celular: '11999990004',
    cpf: '00000000004',
    password: 'bar123',
    role: 'bar'
  },
  {
    nome: 'Atendente FLAME',
    email: 'atendente@flamelounge.com.br',
    celular: '11999990005',
    cpf: '00000000005',
    password: 'atendente123',
    role: 'atendente'
  },
  {
    nome: 'Caixa FLAME',
    email: 'caixa@flamelounge.com.br',
    celular: '11999990006',
    cpf: '00000000006',
    password: 'caixa123',
    role: 'caixa'
  },
  {
    nome: 'Cliente Teste',
    email: 'cliente@flamelounge.com.br',
    celular: '11999990007',
    cpf: '00000000007',
    password: 'cliente123',
    role: 'cliente'
  }
];

async function createUsers() {
  console.log('\n🔥 FLAME - Criando usuários de teste...\n');

  // Primeiro, deletar todos os usuários @flamelounge.com.br
  await new Promise((resolve) => {
    db.run("DELETE FROM users WHERE email LIKE '%@flamelounge.com.br'", (err) => {
      if (err) console.log('  ⚠️ Erro ao limpar usuários antigos:', err.message);
      else console.log('  🧹 Usuários antigos removidos\n');
      resolve();
    });
  });

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const uuid = generateUUID();

    // Criar usuário com UUID
    const sql = `INSERT INTO users (
      id, nome, cpf, email, celular, password, role,
      isActive, emailVerified, phoneVerified,
      totalOrders, totalSpent, cashbackBalance, loyaltyTier,
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;

    await new Promise((resolve) => {
      db.run(sql, [
        uuid,
        user.nome,
        user.cpf,
        user.email,
        user.celular,
        hashedPassword,
        user.role,
        1, // isActive
        1, // emailVerified
        1, // phoneVerified
        0, // totalOrders
        0, // totalSpent
        user.role === 'cliente' ? 50 : 0, // cashbackBalance
        user.role === 'cliente' ? 'bronze' : null // loyaltyTier
      ], function(err) {
        if (err) {
          console.log(`  ❌ Erro ao criar ${user.role}: ${err.message}`);
        } else {
          console.log(`  ✅ ${user.role.toUpperCase()} criado (ID: ${uuid.substring(0, 8)}...)`);
        }
        resolve();
      });
    });
  }

  console.log('\n========================================');
  console.log('✅ TODOS OS USUÁRIOS CRIADOS!');
  console.log('========================================\n');
  console.log('📋 CREDENCIAIS DE ACESSO:\n');
  console.log('┌────────────┬─────────────────────────────────┬──────────────┬─────────────────────────┐');
  console.log('│ ROLE       │ EMAIL                           │ SENHA        │ PAINEL                  │');
  console.log('├────────────┼─────────────────────────────────┼──────────────┼─────────────────────────┤');
  console.log('│ admin      │ admin@flamelounge.com.br        │ admin123     │ /admin                  │');
  console.log('│ gerente    │ gerente@flamelounge.com.br      │ gerente123   │ /admin (limitado)       │');
  console.log('│ cozinha    │ cozinha@flamelounge.com.br      │ cozinha123   │ /cozinha                │');
  console.log('│ bar        │ bar@flamelounge.com.br          │ bar123       │ /staff/bar              │');
  console.log('│ atendente  │ atendente@flamelounge.com.br    │ atendente123 │ /atendente              │');
  console.log('│ caixa      │ caixa@flamelounge.com.br        │ caixa123     │ /staff/caixa            │');
  console.log('│ cliente    │ cliente@flamelounge.com.br      │ cliente123   │ / (home)                │');
  console.log('└────────────┴─────────────────────────────────┴──────────────┴─────────────────────────┘');
  console.log('\n🔗 URLs de login:');
  console.log('   Staff: /staff/login');
  console.log('   Cliente: /login');
  console.log('========================================\n');

  db.close();
  process.exit(0);
}

createUsers().catch(err => {
  console.error('Erro:', err);
  db.close();
  process.exit(1);
});
