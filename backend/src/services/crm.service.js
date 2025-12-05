const { Op } = require('sequelize');
const User = require('../models/User');
const Order = require('../models/Order');
const CashbackHistory = require('../models/CashbackHistory');

class CRMService {
  /**
   * Obter estatísticas completas de um cliente
   */
  async getCustomerStats(userId) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password', 'smsCode', 'smsAttempts', 'smsCodeExpiry']
      }
    });

    if (!user) {
      throw new Error('Cliente não encontrado');
    }

    // Buscar pedidos
    const orders = await Order.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Calcular estatísticas
    const totalOrders = user.totalOrders || 0;
    const totalSpent = parseFloat(user.totalSpent) || 0;
    const cashbackBalance = parseFloat(user.cashbackBalance) || 0;
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Obter benefícios do tier atual
    const tierBenefits = user.getTierBenefits();

    // Obter informações do próximo tier
    const nextTierInfo = user.getNextTierInfo();

    // Buscar histórico de cashback recente
    const cashbackHistory = await CashbackHistory.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    return {
      user: user.toJSON(),
      stats: {
        totalOrders,
        totalSpent,
        averageOrderValue,
        cashbackBalance,
        tier: user.loyaltyTier,
        tierBenefits,
        nextTierInfo,
        lastVisit: user.lastVisit,
        lastOrderDate: user.lastOrderDate
      },
      recentOrders: orders,
      recentCashback: cashbackHistory
    };
  }

  /**
   * Listar clientes com filtros
   */
  async listCustomers({
    page = 1,
    limit = 20,
    search = '',
    tier = null,
    sortBy = 'totalSpent',
    sortOrder = 'DESC'
  }) {
    const offset = (page - 1) * limit;

    const where = {
      role: 'cliente'
    };

    // Filtro de busca
    if (search) {
      where[Op.or] = [
        { nome: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { celular: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filtro por tier
    if (tier) {
      where.loyaltyTier = tier;
    }

    const { count, rows: customers } = await User.findAndCountAll({
      where,
      attributes: {
        exclude: ['password', 'smsCode', 'smsAttempts', 'smsCodeExpiry']
      },
      order: [[sortBy, sortOrder]],
      limit,
      offset
    });

    return {
      customers,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Obter histórico de cashback de um cliente
   */
  async getCashbackHistory(userId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;

    const { count, rows: history } = await CashbackHistory.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'orderNumber', 'total', 'status']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return {
      history,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Dashboard de estatísticas gerais de CRM
   */
  async getDashboardStats() {
    // Total de clientes
    const totalCustomers = await User.count({
      where: { role: 'cliente' }
    });

    // Clientes por tier
    const customersByTier = await User.findAll({
      where: { role: 'cliente' },
      attributes: [
        'loyaltyTier',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      group: ['loyaltyTier']
    });

    // Total de cashback distribuído
    const totalCashbackDistributed = await CashbackHistory.sum('amount', {
      where: {
        type: 'earned',
        amount: { [Op.gt]: 0 }
      }
    }) || 0;

    // Total de cashback usado
    const totalCashbackUsed = await CashbackHistory.sum('amount', {
      where: {
        type: 'redeemed',
        amount: { [Op.lt]: 0 }
      }
    }) || 0;

    // Saldo total de cashback disponível
    const totalCashbackBalance = await User.sum('cashbackBalance', {
      where: { role: 'cliente' }
    }) || 0;

    // Clientes ativos (compraram nos últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeCustomers = await User.count({
      where: {
        role: 'cliente',
        lastOrderDate: { [Op.gte]: thirtyDaysAgo }
      }
    });

    // Top 10 clientes por gasto total
    const topCustomers = await User.findAll({
      where: { role: 'cliente' },
      attributes: {
        exclude: ['password', 'smsCode', 'smsAttempts', 'smsCodeExpiry']
      },
      order: [['totalSpent', 'DESC']],
      limit: 10
    });

    return {
      totalCustomers,
      activeCustomers,
      customersByTier: customersByTier.reduce((acc, item) => {
        acc[item.loyaltyTier] = parseInt(item.getDataValue('count'));
        return acc;
      }, {}),
      cashback: {
        totalDistributed: parseFloat(totalCashbackDistributed),
        totalUsed: Math.abs(parseFloat(totalCashbackUsed)),
        totalBalance: parseFloat(totalCashbackBalance)
      },
      topCustomers
    };
  }

  /**
   * Adicionar cashback manualmente (admin)
   */
  async addManualCashback(userId, amount, description = 'Bônus manual') {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('Cliente não encontrado');
    }

    await user.addCashback(amount, null, description);

    return {
      success: true,
      newBalance: parseFloat(user.cashbackBalance)
    };
  }

  /**
   * Obter clientes inativos
   */
  async getInactiveCustomers(days = 30) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const inactiveCustomers = await User.findAll({
      where: {
        role: 'cliente',
        [Op.or]: [
          { lastOrderDate: { [Op.lt]: dateThreshold } },
          { lastOrderDate: null }
        ]
      },
      attributes: {
        exclude: ['password', 'smsCode', 'smsAttempts', 'smsCodeExpiry']
      },
      order: [['lastOrderDate', 'DESC']]
    });

    return inactiveCustomers;
  }

  /**
   * Obter clientes próximos de subir de tier
   */
  async getCustomersNearTierUpgrade(threshold = 100) {
    const customers = await User.findAll({
      where: {
        role: 'cliente',
        loyaltyTier: { [Op.ne]: 'platinum' } // Excluir platinum (já é o máximo)
      },
      attributes: {
        exclude: ['password', 'smsCode', 'smsAttempts', 'smsCodeExpiry']
      }
    });

    // Filtrar clientes que estão perto de subir de tier
    const nearUpgrade = customers
      .map(user => {
        const nextTierInfo = user.getNextTierInfo();
        if (nextTierInfo && nextTierInfo.remaining <= threshold) {
          return {
            user: user.toJSON(),
            nextTierInfo
          };
        }
        return null;
      })
      .filter(item => item !== null)
      .sort((a, b) => a.nextTierInfo.remaining - b.nextTierInfo.remaining);

    return nearUpgrade;
  }

  /**
   * Ajustar tier manualmente (se necessário)
   */
  async adjustTier(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('Cliente não encontrado');
    }

    const oldTier = user.loyaltyTier;
    const newTier = await user.updateTier();

    return {
      updated: newTier !== null,
      oldTier,
      newTier: user.loyaltyTier
    };
  }
}

module.exports = new CRMService();
