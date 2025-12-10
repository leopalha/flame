/**
 * Script para criar produtos de Narguilé
 * Categoria: hookah
 */

require('dotenv').config();
const { Product, sequelize } = require('../src/models');

const hookahProducts = [
  {
    name: 'Narguilé Premium FLAME',
    description: 'Narguilé premium com carvão de coco e essências importadas. Inclui 2 trocas de carvão.',
    price: '80.00',
    category: 'hookah',
    subcategory: 'Premium',
    image: '/images/cardapio/narguile-premium.png',
    preparationTime: 15,
    isActive: true,
    hasStock: true,
    stock: 10,
    minStock: 2,
    position: 1,
    isSignature: true,
    tags: ['premium', 'importado', 'carvão de coco']
  },
  {
    name: 'Narguilé Gold FLAME',
    description: 'Narguilé tradicional com essências premium e carvão de alta qualidade. Inclui 1 troca de carvão.',
    price: '60.00',
    category: 'hookah',
    subcategory: 'Gold',
    image: '/images/cardapio/narguile-gold.png',
    preparationTime: 15,
    isActive: true,
    hasStock: true,
    stock: 15,
    minStock: 3,
    position: 2,
    isSignature: false,
    tags: ['tradicional', 'essências premium']
  },
  {
    name: 'Narguilé Standard',
    description: 'Narguilé clássico com essências nacionais de qualidade.',
    price: '45.00',
    category: 'hookah',
    subcategory: 'Standard',
    image: '/images/cardapio/narguile-standard.png',
    preparationTime: 10,
    isActive: true,
    hasStock: true,
    stock: 20,
    minStock: 5,
    position: 3,
    isSignature: false,
    tags: ['clássico', 'econômico']
  }
];

async function seedHookahProducts() {
  try {
    console.log('🔥 Criando produtos de Narguilé...\n');

    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados\n');

    let created = 0;
    let skipped = 0;

    for (const productData of hookahProducts) {
      // Verificar se já existe
      const existing = await Product.findOne({
        where: { name: productData.name }
      });

      if (existing) {
        console.log(`⏭️  "${productData.name}" já existe - pulando`);
        skipped++;
        continue;
      }

      // Criar produto
      const product = await Product.create(productData);
      console.log(`✅ Criado: ${product.name} - R$ ${product.price}`);
      created++;
    }

    console.log(`\n\n🎉 Processo concluído!`);
    console.log(`   Criados: ${created}`);
    console.log(`   Já existiam: ${skipped}`);
    console.log(`   Total: ${hookahProducts.length}`);

  } catch (error) {
    console.error('❌ Erro ao criar produtos:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n👋 Conexão fechada');
  }
}

// Executar
if (require.main === module) {
  seedHookahProducts()
    .then(() => {
      console.log('\n✅ Script finalizado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script finalizado com erro:', error);
      process.exit(1);
    });
}

module.exports = seedHookahProducts;
