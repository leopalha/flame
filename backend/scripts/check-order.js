/**
 * Script para verificar se pedido tem Product incluído
 */
const { Order, OrderItem, Product, User, Table } = require('../src/models');

async function checkOrder() {
  try {
    const order = await Order.findOne({
      where: { orderNumber: 'ORD-996660' },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product'
          }]
        },
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'nome']
        }
      ]
    });

    if (!order) {
      console.log('❌ Pedido não encontrado');
      process.exit(1);
    }

    console.log('\n📦 PEDIDO ENCONTRADO:');
    console.log(`   Número: ${order.orderNumber}`);
    console.log(`   Cliente: ${order.customer?.nome}`);
    console.log(`   Total de itens: ${order.items?.length || 0}`);

    console.log('\n📋 ITENS DO PEDIDO:\n');
    order.items?.forEach((item, i) => {
      console.log(`Item ${i + 1}:`);
      console.log(`   - Produto ID: ${item.productId}`);
      console.log(`   - Quantidade: ${item.quantity}`);
      console.log(`   - Tem Product? ${item.product ? 'SIM ✅' : 'NÃO ❌'}`);

      if (item.product) {
        console.log(`   - Nome: ${item.product.name}`);
        console.log(`   - Categoria: ${item.product.category}`);
        console.log(`   - Preço: R$ ${item.product.price}`);
      }
      console.log('');
    });

    // Testar a lógica de categorização
    console.log('\n🔍 TESTE DE CATEGORIZAÇÃO:\n');
    const foodItems = [];
    const drinkItems = [];

    order.items?.forEach(item => {
      const category = (item.product?.category || '').toLowerCase();
      console.log(`   Categoria detectada: "${category}"`);

      if (category.includes('bebida') || category.includes('drink')) {
        drinkItems.push(item);
        console.log(`   → Vai para BAR ✅`);
      } else {
        foodItems.push(item);
        console.log(`   → Vai para COZINHA`);
      }
    });

    console.log(`\n📊 RESULTADO:`);
    console.log(`   Itens para BAR: ${drinkItems.length}`);
    console.log(`   Itens para COZINHA: ${foodItems.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkOrder();
