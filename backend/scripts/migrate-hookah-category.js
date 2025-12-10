/**
 * Script de Migração: Narguilés para categoria "hookah"
 *
 * PROBLEMA: Narguilés estão cadastrados como "bebidas_alcoolicas"
 * SOLUÇÃO: Migrar para categoria "hookah"
 *
 * Este script:
 * 1. Busca todos os produtos que são narguilés (nome contém "nargui" ou "hookah")
 * 2. Altera a categoria para "hookah"
 * 3. Ajusta subcategoria se necessário
 */

require('dotenv').config();
const { Product, sequelize } = require('../src/models');
const { Op } = require('sequelize');

async function migrateHookahProducts() {
  try {
    console.log('🔥 Iniciando migração de narguilés para categoria hookah...\n');

    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados\n');

    // Buscar produtos que são narguilés mas estão em categoria errada
    const hookahs = await Product.findAll({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('name')),
        {
          [Op.like]: '%nargui%'
        }
      )
    });

    console.log(`📦 Encontrados ${hookahs.length} produtos de narguilé\n`);

    if (hookahs.length === 0) {
      console.log('ℹ️  Nenhum narguilé encontrado para migrar');
      return;
    }

    // Migrar cada produto
    let migratedCount = 0;
    for (const hookah of hookahs) {
      console.log(`\n🔄 Processando: ${hookah.name}`);
      console.log(`   Categoria atual: ${hookah.category}`);
      console.log(`   Subcategoria atual: ${hookah.subcategory || 'N/A'}`);

      if (hookah.category === 'hookah') {
        console.log(`   ⏭️  Já está na categoria correta`);
        continue;
      }

      // Atualizar para categoria hookah
      await hookah.update({
        category: 'hookah',
        subcategory: 'Narguilés' // Subcategoria padrão
      });

      console.log(`   ✅ Migrado para: hookah / Narguilés`);
      migratedCount++;
    }

    console.log(`\n\n🎉 Migração concluída!`);
    console.log(`   Total processado: ${hookahs.length}`);
    console.log(`   Migrados: ${migratedCount}`);
    console.log(`   Já corretos: ${hookahs.length - migratedCount}`);

  } catch (error) {
    console.error('❌ Erro na migração:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n👋 Conexão fechada');
  }
}

// Executar migração
if (require.main === module) {
  migrateHookahProducts()
    .then(() => {
      console.log('\n✅ Script finalizado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script finalizado com erro:', error);
      process.exit(1);
    });
}

module.exports = migrateHookahProducts;
