/**
 * Script para popular o banco de dados com dados iniciais
 * Execute: node src/scripts/seed.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  sequelize,
  User,
  Product,
  Table,
  HookahFlavor
} = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed do banco de dados...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Conexão com banco estabelecida\n');

    // 1. Criar todos os usuários FLAME
    console.log('📌 Criando usuários FLAME...');

    const usersData = [
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

    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const [user, userCreated] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: {
          nome: userData.nome,
          email: userData.email,
          celular: userData.celular,
          cpf: userData.cpf,
          password: hashedPassword,
          role: userData.role,
          isActive: true,
          emailVerified: true,
          phoneVerified: true,
          totalOrders: 0,
          totalSpent: 0,
          cashbackBalance: userData.role === 'cliente' ? 50 : 0,
          loyaltyTier: userData.role === 'cliente' ? 'bronze' : null
        }
      });
      console.log(userCreated ? `  ✅ ${userData.role.toUpperCase()} criado` : `  ℹ️ ${userData.role.toUpperCase()} já existe`);
    }

    // 2. Criar mesas
    console.log('\n📌 Criando mesas...');
    const mesas = [];
    for (let i = 1; i <= 15; i++) {
      const [mesa, mesaCreated] = await Table.findOrCreate({
        where: { number: i },
        defaults: {
          number: i,
          qrCode: `MESA${i.toString().padStart(2, '0')}`,
          capacity: i <= 5 ? 4 : i <= 10 ? 6 : 8,
          status: 'available',
          isActive: true,
          location: i <= 5 ? 'interno' : i <= 10 ? 'externo' : 'vip'
        }
      });
      mesas.push(mesa);
      if (mesaCreated) console.log(`  ✅ Mesa ${i} criada`);
    }
    console.log(`  ℹ️ Total: ${mesas.length} mesas`);

    // 3. Criar produtos
    console.log('\n📌 Criando produtos...');
    const produtos = [
      // Entradas
      { name: 'Batata Frita', category: 'entradas', price: 28.90, description: 'Porção de batatas fritas crocantes', stockQuantity: 50 },
      { name: 'Isca de Frango', category: 'entradas', price: 35.90, description: 'Iscas de frango empanadas', stockQuantity: 40 },
      { name: 'Polenta Frita', category: 'entradas', price: 25.90, description: 'Polenta cremosa frita', stockQuantity: 30 },
      { name: 'Mix de Petiscos', category: 'entradas', price: 65.90, description: 'Porção sortida de petiscos', stockQuantity: 25 },

      // Pratos
      { name: 'Picanha na Chapa', category: 'pratos', price: 89.90, description: 'Picanha grelhada com arroz, farofa e vinagrete', stockQuantity: 30 },
      { name: 'Filé com Fritas', category: 'pratos', price: 69.90, description: 'Filé mignon grelhado com batatas fritas', stockQuantity: 25 },
      { name: 'Frango Grelhado', category: 'pratos', price: 49.90, description: 'Peito de frango com legumes', stockQuantity: 35 },
      { name: 'Salmão', category: 'pratos', price: 79.90, description: 'Salmão grelhado com molho de alcaparras', stockQuantity: 20 },

      // Bebidas
      { name: 'Caipirinha', category: 'bebidas', price: 22.90, description: 'Caipirinha clássica de limão', stockQuantity: 100 },
      { name: 'Cerveja Heineken', category: 'bebidas', price: 14.90, description: 'Long neck 330ml', stockQuantity: 200 },
      { name: 'Cerveja Brahma', category: 'bebidas', price: 9.90, description: 'Long neck 330ml', stockQuantity: 200 },
      { name: 'Whisky Red Label', category: 'bebidas', price: 25.90, description: 'Dose 50ml', stockQuantity: 50 },
      { name: 'Água Mineral', category: 'bebidas', price: 5.90, description: '500ml com ou sem gás', stockQuantity: 150 },
      { name: 'Refrigerante', category: 'bebidas', price: 7.90, description: 'Coca-Cola, Guaraná ou Sprite', stockQuantity: 100 },
      { name: 'Suco Natural', category: 'bebidas', price: 12.90, description: 'Laranja, Maracujá ou Abacaxi', stockQuantity: 80 },

      // Sobremesas
      { name: 'Petit Gateau', category: 'sobremesas', price: 32.90, description: 'Bolo de chocolate com sorvete', stockQuantity: 20 },
      { name: 'Pudim', category: 'sobremesas', price: 18.90, description: 'Pudim de leite condensado', stockQuantity: 25 },
      { name: 'Sorvete', category: 'sobremesas', price: 15.90, description: '2 bolas de sorvete artesanal', stockQuantity: 40 }
    ];

    for (const prodData of produtos) {
      const [prod, prodCreated] = await Product.findOrCreate({
        where: { name: prodData.name },
        defaults: {
          ...prodData,
          isActive: true,
          position: produtos.indexOf(prodData) + 1
        }
      });
      if (prodCreated) console.log(`  ✅ ${prodData.name}`);
    }
    console.log(`  ℹ️ Total: ${produtos.length} produtos`);

    // 4. Criar sabores de narguilé
    console.log('\n📌 Criando sabores de narguilé...');
    const sabores = [
      // Frutados
      { name: 'Menta Gelada', category: 'menta', price: 45.00, description: 'Sabor refrescante de menta', inStock: true, popularity: 95 },
      { name: 'Morango', category: 'frutado', price: 45.00, description: 'Morango doce e frutado', inStock: true, popularity: 90 },
      { name: 'Uva', category: 'frutado', price: 45.00, description: 'Uva suculenta', inStock: true, popularity: 85 },
      { name: 'Maçã Verde', category: 'frutado', price: 45.00, description: 'Maçã verde refrescante', inStock: true, popularity: 80 },
      { name: 'Manga', category: 'frutado', price: 45.00, description: 'Manga tropical', inStock: true, popularity: 75 },
      { name: 'Melancia', category: 'frutado', price: 45.00, description: 'Melancia doce', inStock: true, popularity: 88 },
      { name: 'Pêssego', category: 'frutado', price: 45.00, description: 'Pêssego suave', inStock: true, popularity: 70 },

      // Especiais
      { name: 'Love 66', category: 'especial', price: 55.00, description: 'Blend tropical exclusivo', inStock: true, popularity: 98 },
      { name: 'Blue Mix', category: 'especial', price: 55.00, description: 'Mix de frutas vermelhas', inStock: true, popularity: 92 },
      { name: 'Fresh Lemon', category: 'especial', price: 50.00, description: 'Limão com menta', inStock: true, popularity: 87 },

      // Premium
      { name: 'Double Apple', category: 'premium', price: 60.00, description: 'Duas maçãs árabes', inStock: true, popularity: 96 },
      { name: 'Grape Mint', category: 'premium', price: 60.00, description: 'Uva com toque de menta', inStock: true, popularity: 89 }
    ];

    for (const saborData of sabores) {
      const [sabor, saborCreated] = await HookahFlavor.findOrCreate({
        where: { name: saborData.name },
        defaults: saborData
      });
      if (saborCreated) console.log(`  ✅ ${saborData.name}`);
    }
    console.log(`  ℹ️ Total: ${sabores.length} sabores`);

    console.log('\n✨ ========================================');
    console.log('✅ SEED COMPLETO!');
    console.log('========================================');
    console.log('\n📋 CREDENCIAIS FLAME:');
    console.log('┌────────────┬─────────────────────────────────┬──────────────┐');
    console.log('│ ROLE       │ EMAIL                           │ SENHA        │');
    console.log('├────────────┼─────────────────────────────────┼──────────────┤');
    console.log('│ admin      │ admin@flamelounge.com.br        │ admin123     │');
    console.log('│ gerente    │ gerente@flamelounge.com.br      │ gerente123   │');
    console.log('│ cozinha    │ cozinha@flamelounge.com.br      │ cozinha123   │');
    console.log('│ bar        │ bar@flamelounge.com.br          │ bar123       │');
    console.log('│ atendente  │ atendente@flamelounge.com.br    │ atendente123 │');
    console.log('│ caixa      │ caixa@flamelounge.com.br        │ caixa123     │');
    console.log('│ cliente    │ cliente@flamelounge.com.br      │ cliente123   │');
    console.log('└────────────┴─────────────────────────────────┴──────────────┘');
    console.log('\n📊 Resumo:');
    console.log(`   - 7 usuários FLAME`);
    console.log(`   - ${mesas.length} mesas`);
    console.log(`   - ${produtos.length} produtos`);
    console.log(`   - ${sabores.length} sabores de narguilé`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro no seed:', error);
    process.exit(1);
  }
};

seedDatabase();
