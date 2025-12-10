const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Abrir banco de dados
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
    process.exit(1);
  }
  console.log('✅ Conectado ao banco de dados SQLite');
});

// Criar usuário admin
async function createAdmin() {
  const adminData = {
    id: uuidv4(),
    nome: 'Admin FLAME',
    cpf: '000.000.000-00',
    email: 'admin@flame.bar',
    celular: '(21) 99999-9999',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
    isActive: 1,
    emailVerified: 1,
    phoneVerified: 1,
    totalOrders: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Deletar admin existente se houver
  db.run('DELETE FROM users WHERE email = ?', ['admin@flame.bar'], (err) => {
    if (err) console.log('Nenhum admin anterior para deletar');

    // Inserir novo admin
    const sql = `INSERT INTO users (id, nome, cpf, email, celular, password, role, isActive, emailVerified, phoneVerified, totalOrders, totalSpent, createdAt, updatedAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [
      adminData.id,
      adminData.nome,
      adminData.cpf,
      adminData.email,
      adminData.celular,
      adminData.password,
      adminData.role,
      adminData.isActive,
      adminData.emailVerified,
      adminData.phoneVerified,
      adminData.totalOrders,
      adminData.totalSpent,
      adminData.createdAt,
      adminData.updatedAt
    ], function(err) {
      if (err) {
        console.error('❌ Erro ao criar admin:', err.message);
        db.close();
        process.exit(1);
      }

      console.log('✅ Usuário admin criado com sucesso!');
      console.log('');
      console.log('📧 Email: admin@flame.bar');
      console.log('🔑 Senha: admin123');
      console.log('');

      db.close((err) => {
        if (err) console.error(err.message);
        console.log('✅ Conexão com banco fechada');
        process.exit(0);
      });
    });
  });
}

createAdmin();
