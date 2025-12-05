const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('\n🔍 Verificando estrutura da tabela users...\n');

db.all("PRAGMA table_info(users)", (err, columns) => {
  if (err) {
    console.error('Erro:', err);
    return;
  }

  console.log('📋 Colunas da tabela users:');
  columns.forEach(col => {
    console.log(`   - ${col.name} (${col.type})`);
  });

  console.log('\n👥 Usuários existentes:');
  db.all("SELECT id, nome, email, celular, role, isActive, password FROM users", (err, users) => {
    if (err) {
      console.error('Erro:', err);
      db.close();
      return;
    }

    users.forEach(u => {
      console.log(`   ID: ${u.id} | ${u.role} | ${u.email} | Active: ${u.isActive} | HasPassword: ${u.password ? 'Yes' : 'No'}`);
    });

    console.log(`\n   Total: ${users.length} usuários\n`);
    db.close();
  });
});
