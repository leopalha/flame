/**
 * Script para migrar TODOS os 134 produtos do mockData.js para o banco PostgreSQL
 * Execução: node scripts/migrate-all-products.js
 */

const axios = require('axios');
const path = require('path');

// Importar mockData.js do frontend
const mockDataPath = path.join(__dirname, '../../frontend/src/data/mockData.js');
console.log(`📂 Importando produtos de: ${mockDataPath}\n`);

// Função para extrair produtos do arquivo mockData.js
function loadMockProducts() {
  try {
    // Ler o arquivo mockData.js como módulo ES6
    const fs = require('fs');
    const fileContent = fs.readFileSync(mockDataPath, 'utf8');

    // Extrair apenas o array mockProducts usando regex
    const match = fileContent.match(/export const mockProducts = (\[[\s\S]*?\]);/);
    if (!match) {
      throw new Error('Não foi possível encontrar mockProducts no arquivo');
    }

    // Usar eval para converter o array JS em objeto (CUIDADO: só usar com código confiável!)
    const mockProductsStr = match[1];
    const mockProducts = eval(mockProductsStr);

    console.log(`✅ ${mockProducts.length} produtos carregados do mockData.js\n`);
    return mockProducts;
  } catch (error) {
    console.error('❌ Erro ao carregar mockData.js:', error.message);
    process.exit(1);
  }
}

// URL da API
const API_URL = process.env.API_URL || 'https://backend-production-28c3.up.railway.app';
const SEED_KEY = 'FLAME2024SEED';

// Mapeamento de categorias mock → banco
const categoryMap = {
  'Drinks Clássicos': 'bebidas_alcoolicas',
  'Signature Drinks': 'drinks_autorais',
  'Drinks Tropicais': 'bebidas_alcoolicas',
  'Coquetéis Zero': 'bebidas_nao_alcoolicas',
  'Petiscos': 'petiscos',
  'Pratos Principais': 'pratos_principais',
  'Sobremesas': 'sobremesas',
  'Bebidas sem Álcool': 'bebidas_nao_alcoolicas',
  'Cervejas': 'bebidas_alcoolicas',
  'Vinhos': 'bebidas_alcoolicas',
  'Destilados': 'bebidas_alcoolicas',
  'Narguilés': 'narguiles',
  'Combos': 'combos',
  'Porções': 'petiscos'
};

async function migrateProducts() {
  console.log('🌱 Iniciando migração de produtos para o banco de dados...\n');
  console.log(`🎯 API: ${API_URL}\n`);

  // Carregar produtos do mockData.js
  const mockProducts = loadMockProducts();

  // Converter mockProducts para formato do banco
  const productsToSeed = mockProducts.map((mockProduct, i) => ({
    name: mockProduct.nome,
    description: mockProduct.descricao || '',
    price: parseFloat(mockProduct.preco),
    category: categoryMap[mockProduct.categoria] || 'bebidas_alcoolicas',
    subcategory: mockProduct.categoria,
    image: mockProduct.imagem || null,
    ingredients: mockProduct.ingredientes || '',
    tags: Array.isArray(mockProduct.tags) ? mockProduct.tags : [],
    allergens: mockProduct.alergenos ? (Array.isArray(mockProduct.alergenos) ? mockProduct.alergenos : [mockProduct.alergenos]) : [],
    dietary: mockProduct.dietetico ? (Array.isArray(mockProduct.dietetico) ? mockProduct.dietetico : [mockProduct.dietetico]) : [],
    preparationTime: mockProduct.tempoPreparo || 15,
    calories: mockProduct.calorias || null,
    isActive: mockProduct.disponivel !== false,
    isFeatured: mockProduct.destaque || false,
    hasStock: mockProduct.estoque !== undefined,
    stock: mockProduct.estoque || 50,
    minStock: 5,
    position: i + 1,
    isSignature: mockProduct.assinatura || mockProduct.destaque || false,
    alcoholicContent: mockProduct.teorAlcoolico || null,
    volume: mockProduct.volume || null,
    spiceLevel: mockProduct.nivelPicancia || null
  }));

  console.log(`📦 Enviando ${productsToSeed.length} produtos em bulk...\n`);

  try {
    const response = await axios.post(
      `${API_URL}/api/seed-products-bulk`,
      {
        products: productsToSeed,
        secretKey: SEED_KEY
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-seed-key': SEED_KEY
        }
      }
    );

    if (response.data.success) {
      const { created, existing, errors, total } = response.data.data;

      console.log(`\n${'='.repeat(50)}`);
      console.log(`📊 RESULTADO DA MIGRAÇÃO:`);
      console.log(`${'='.repeat(50)}`);
      console.log(`   ✅ Criados: ${created}`);
      console.log(`   ⏭️  Já existiam: ${existing}`);
      console.log(`   ❌ Erros: ${errors}`);
      console.log(`   📦 Total processado: ${total}`);
      console.log(`${'='.repeat(50)}\n`);
    }
  } catch (error) {
    console.error('\n❌ Erro ao migrar produtos:', error.response?.data?.message || error.message);
    process.exit(1);
  }
}

// Executar
migrateProducts().catch(error => {
  console.error('\n❌ Erro fatal:', error.message);
  process.exit(1);
});
