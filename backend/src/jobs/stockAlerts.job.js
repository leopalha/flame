/**
 * Stock Alerts Job - FLAME Lounge Bar
 * Verifica estoque baixo a cada hora e envia alertas
 */

const { Product, sequelize } = require('../models');
const pushService = require('../services/push.service');
const { Op } = require('sequelize');

/**
 * Verifica produtos com estoque baixo e envia alertas
 * Executa a cada 1 hora
 */
async function checkStockAlerts() {
  const startTime = Date.now();
  console.log(`[STOCK-ALERTS] Iniciando verificação de estoque - ${new Date().toISOString()}`);

  try {
    // Buscar produtos com estoque abaixo do mínimo
    const lowStockProducts = await Product.findAll({
      where: {
        isActive: true,
        stock: {
          [Op.lte]: sequelize.col('stockMinimum')
        }
      },
      order: [['stock', 'ASC']]
    });

    // Buscar produtos com estoque zerado
    const outOfStockProducts = await Product.findAll({
      where: {
        isActive: true,
        stock: 0
      }
    });

    const criticalCount = outOfStockProducts.length;
    const warningCount = lowStockProducts.length - criticalCount;

    console.log(`[STOCK-ALERTS] Encontrados: ${criticalCount} críticos, ${warningCount} avisos`);

    // Enviar push para admin/manager se houver itens críticos
    if (criticalCount > 0) {
      const productNames = outOfStockProducts
        .slice(0, 3)
        .map(p => p.name)
        .join(', ');

      const message = criticalCount > 3
        ? `${productNames} e mais ${criticalCount - 3} produtos estão sem estoque!`
        : `${productNames} ${criticalCount === 1 ? 'está' : 'estão'} sem estoque!`;

      try {
        await pushService.sendToRole('admin', {
          title: '⚠️ Alerta de Estoque Crítico',
          body: message,
          icon: '/icons/icon-192x192.png',
          tag: 'stock-critical',
          data: {
            type: 'stock_alert',
            severity: 'critical',
            count: criticalCount,
            url: '/admin/estoque'
          }
        });

        await pushService.sendToRole('manager', {
          title: '⚠️ Alerta de Estoque Crítico',
          body: message,
          icon: '/icons/icon-192x192.png',
          tag: 'stock-critical',
          data: {
            type: 'stock_alert',
            severity: 'critical',
            count: criticalCount,
            url: '/admin/estoque'
          }
        });

        console.log(`[STOCK-ALERTS] Push de alerta crítico enviado`);
      } catch (pushError) {
        console.error('[STOCK-ALERTS] Erro ao enviar push:', pushError.message);
      }
    }

    // Log de produtos com aviso (estoque baixo mas não zerado)
    if (warningCount > 0) {
      const warningProducts = lowStockProducts.filter(p => p.stock > 0);
      console.log(`[STOCK-ALERTS] Produtos com estoque baixo:`);
      warningProducts.forEach(p => {
        console.log(`  - ${p.name}: ${p.stock}/${p.stockMinimum}`);
      });
    }

    const duration = Date.now() - startTime;
    console.log(`[STOCK-ALERTS] Verificação concluída em ${duration}ms`);

    return {
      success: true,
      criticalCount,
      warningCount,
      duration
    };
  } catch (error) {
    console.error('[STOCK-ALERTS] Erro na verificação:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  name: 'stockAlerts',
  schedule: '0 * * * *', // A cada hora
  handler: checkStockAlerts
};
