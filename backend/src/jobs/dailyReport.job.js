/**
 * Daily Report Job - FLAME Lounge Bar
 * Gera relatório diário e envia para administradores
 */

const { Order, Reservation, User, Product } = require('../models');
const pushService = require('../services/push.service');
const { Op } = require('sequelize');

/**
 * Gera relatório do dia anterior e envia para admins
 * Executa diariamente às 06h
 */
async function generateDailyReport() {
  const startTime = Date.now();
  console.log(`[DAILY-REPORT] Iniciando geração - ${new Date().toISOString()}`);

  try {
    // Calcular período (ontem)
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    // Métricas de pedidos
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [yesterday, endOfYesterday]
        }
      }
    });

    const completedOrders = orders.filter(o => o.status === 'delivered');
    const cancelledOrders = orders.filter(o => o.status === 'cancelled');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0);
    const averageTicket = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    // Métricas de reservas
    const reservations = await Reservation.findAll({
      where: {
        date: yesterday.toISOString().split('T')[0]
      }
    });

    const confirmedReservations = reservations.filter(r => r.status === 'completed' || r.status === 'confirmed');
    const noShowReservations = reservations.filter(r => r.status === 'no_show');

    // Métricas de clientes
    const newCustomers = await User.count({
      where: {
        role: 'cliente',
        createdAt: {
          [Op.between]: [yesterday, endOfYesterday]
        }
      }
    });

    // Produtos mais vendidos (simplificado)
    const topProducts = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [yesterday, endOfYesterday]
        },
        status: 'delivered'
      },
      include: ['items'],
      limit: 10
    });

    // Montar relatório
    const report = {
      date: yesterday.toISOString().split('T')[0],
      orders: {
        total: orders.length,
        completed: completedOrders.length,
        cancelled: cancelledOrders.length,
        completionRate: orders.length > 0 ? ((completedOrders.length / orders.length) * 100).toFixed(1) : 0
      },
      revenue: {
        total: totalRevenue.toFixed(2),
        averageTicket: averageTicket.toFixed(2)
      },
      reservations: {
        total: reservations.length,
        confirmed: confirmedReservations.length,
        noShow: noShowReservations.length,
        noShowRate: reservations.length > 0 ? ((noShowReservations.length / reservations.length) * 100).toFixed(1) : 0
      },
      customers: {
        new: newCustomers
      }
    };

    console.log('[DAILY-REPORT] Relatório gerado:', JSON.stringify(report, null, 2));

    // Enviar push para admins
    const reportSummary = `
📊 Resumo de ${report.date}:
💰 Receita: R$ ${report.revenue.total}
🛒 Pedidos: ${report.orders.completed}/${report.orders.total}
📅 Reservas: ${report.reservations.confirmed} confirmadas
👤 Novos clientes: ${report.customers.new}
    `.trim();

    try {
      await pushService.sendToRole('admin', {
        title: '📊 Relatório Diário - FLAME',
        body: reportSummary,
        icon: '/icons/icon-192x192.png',
        tag: 'daily-report',
        data: {
          type: 'daily_report',
          report,
          url: '/staff/relatorios'
        }
      });

      console.log('[DAILY-REPORT] Push enviado para admins');
    } catch (pushError) {
      console.error('[DAILY-REPORT] Erro ao enviar push:', pushError.message);
    }

    const duration = Date.now() - startTime;
    console.log(`[DAILY-REPORT] Concluído em ${duration}ms`);

    return {
      success: true,
      report,
      duration
    };
  } catch (error) {
    console.error('[DAILY-REPORT] Erro no job:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  name: 'dailyReport',
  schedule: '0 6 * * *', // Diariamente às 06h
  handler: generateDailyReport
};
