const { Op } = require('sequelize');
const { Cashier, CashierMovement, User, Order } = require('../models');

class CashierService {
  /**
   * Abre um novo caixa
   */
  async openCashier(operatorId, operatorName, openingAmount = 0, notes = null) {
    // Verifica se já existe um caixa aberto
    const existingOpen = await Cashier.findOne({
      where: { status: 'open' }
    });

    if (existingOpen) {
      throw new Error('Já existe um caixa aberto. Feche o caixa atual antes de abrir um novo.');
    }

    // Cria o novo caixa
    const cashier = await Cashier.create({
      operatorId,
      operatorName,
      openingAmount: parseFloat(openingAmount),
      notes,
      status: 'open'
    });

    // Registra a movimentação de abertura
    if (parseFloat(openingAmount) > 0) {
      await CashierMovement.create({
        cashierId: cashier.id,
        type: 'opening',
        amount: parseFloat(openingAmount),
        description: `Abertura de caixa com R$ ${parseFloat(openingAmount).toFixed(2)}`,
        createdBy: operatorId,
        createdByName: operatorName
      });
    }

    return cashier;
  }

  /**
   * Busca o caixa atualmente aberto
   */
  async getCurrentCashier() {
    const cashier = await Cashier.findOne({
      where: { status: 'open' },
      include: [
        {
          model: User,
          as: 'operator',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: CashierMovement,
          as: 'movements',
          order: [['createdAt', 'DESC']],
          limit: 50
        }
      ]
    });

    if (!cashier) {
      return null;
    }

    return {
      ...cashier.toJSON(),
      summary: cashier.getSummary()
    };
  }

  /**
   * Registra uma venda em dinheiro
   */
  async registerSale(cashierId, orderId, orderNumber, amount, userId, userName) {
    const cashier = await Cashier.findByPk(cashierId);

    if (!cashier) {
      throw new Error('Caixa não encontrado');
    }

    if (cashier.status !== 'open') {
      throw new Error('Caixa não está aberto');
    }

    // Atualiza total de vendas
    cashier.totalSales = parseFloat(cashier.totalSales) + parseFloat(amount);
    await cashier.save();

    // Registra a movimentação
    const movement = await CashierMovement.create({
      cashierId,
      type: 'sale',
      amount: parseFloat(amount),
      description: `Venda em dinheiro - Pedido #${orderNumber}`,
      orderId,
      orderNumber,
      createdBy: userId,
      createdByName: userName
    });

    return movement;
  }

  /**
   * Registra um suprimento (entrada de dinheiro)
   */
  async registerDeposit(cashierId, amount, description, userId, userName) {
    const cashier = await Cashier.findByPk(cashierId);

    if (!cashier) {
      throw new Error('Caixa não encontrado');
    }

    if (cashier.status !== 'open') {
      throw new Error('Caixa não está aberto');
    }

    // Atualiza total de suprimentos
    cashier.totalDeposits = parseFloat(cashier.totalDeposits) + parseFloat(amount);
    await cashier.save();

    // Registra a movimentação
    const movement = await CashierMovement.create({
      cashierId,
      type: 'deposit',
      amount: parseFloat(amount),
      description: description || 'Suprimento de caixa',
      createdBy: userId,
      createdByName: userName
    });

    return movement;
  }

  /**
   * Registra uma sangria (retirada de dinheiro)
   */
  async registerWithdrawal(cashierId, amount, description, userId, userName) {
    const cashier = await Cashier.findByPk(cashierId);

    if (!cashier) {
      throw new Error('Caixa não encontrado');
    }

    if (cashier.status !== 'open') {
      throw new Error('Caixa não está aberto');
    }

    // Atualiza total de sangrias
    cashier.totalWithdrawals = parseFloat(cashier.totalWithdrawals) + parseFloat(amount);
    await cashier.save();

    // Registra a movimentação
    const movement = await CashierMovement.create({
      cashierId,
      type: 'withdrawal',
      amount: -parseFloat(amount), // Negativo para sangria
      description: description || 'Sangria de caixa',
      createdBy: userId,
      createdByName: userName
    });

    return movement;
  }

  /**
   * Fecha o caixa
   */
  async closeCashier(cashierId, closingAmount, userId, userName, notes = null) {
    const cashier = await Cashier.findByPk(cashierId);

    if (!cashier) {
      throw new Error('Caixa não encontrado');
    }

    if (cashier.status !== 'open') {
      throw new Error('Caixa já está fechado');
    }

    // Atualiza o caixa
    cashier.closingAmount = parseFloat(closingAmount);
    cashier.closedAt = new Date();
    cashier.status = 'closed';
    cashier.closedBy = userId;
    cashier.closedByName = userName;
    if (notes) {
      cashier.notes = notes;
    }

    await cashier.save();

    // Registra a movimentação de fechamento
    await CashierMovement.create({
      cashierId,
      type: 'closing',
      amount: parseFloat(closingAmount),
      description: `Fechamento de caixa - Total contado: R$ ${parseFloat(closingAmount).toFixed(2)}`,
      createdBy: userId,
      createdByName: userName
    });

    return {
      ...cashier.toJSON(),
      summary: cashier.getSummary()
    };
  }

  /**
   * Busca histórico de caixas
   */
  async getCashierHistory({ page = 1, limit = 20, status = null, startDate = null, endDate = null }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.openedAt = {};
      if (startDate) {
        where.openedAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.openedAt[Op.lte] = new Date(endDate);
      }
    }

    const { count, rows: cashiers } = await Cashier.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'operator',
          attributes: ['id', 'nome']
        },
        {
          model: User,
          as: 'closer',
          attributes: ['id', 'nome']
        }
      ],
      order: [['openedAt', 'DESC']],
      limit,
      offset
    });

    return {
      cashiers: cashiers.map(c => ({
        ...c.toJSON(),
        summary: c.getSummary()
      })),
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Busca detalhes de um caixa específico
   */
  async getCashierDetails(cashierId) {
    const cashier = await Cashier.findByPk(cashierId, {
      include: [
        {
          model: User,
          as: 'operator',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: User,
          as: 'closer',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: CashierMovement,
          as: 'movements',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'nome']
            },
            {
              model: Order,
              as: 'order',
              attributes: ['id', 'orderNumber', 'total']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!cashier) {
      throw new Error('Caixa não encontrado');
    }

    return {
      ...cashier.toJSON(),
      summary: cashier.getSummary(),
      movements: cashier.movements.map(m => m.toSummary())
    };
  }

  /**
   * Busca estatísticas de caixas
   */
  async getCashierStats(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const cashiers = await Cashier.findAll({
      where: {
        status: 'closed',
        closedAt: {
          [Op.gte]: startDate
        }
      }
    });

    let totalSales = 0;
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalDifference = 0;
    let positiveCount = 0;
    let negativeCount = 0;

    cashiers.forEach(cashier => {
      totalSales += parseFloat(cashier.totalSales) || 0;
      totalDeposits += parseFloat(cashier.totalDeposits) || 0;
      totalWithdrawals += parseFloat(cashier.totalWithdrawals) || 0;

      const diff = cashier.calculateDifference();
      totalDifference += diff;

      if (diff > 0) positiveCount++;
      if (diff < 0) negativeCount++;
    });

    return {
      period: days,
      totalCashiers: cashiers.length,
      totalSales,
      totalDeposits,
      totalWithdrawals,
      averageSales: cashiers.length > 0 ? totalSales / cashiers.length : 0,
      totalDifference,
      averageDifference: cashiers.length > 0 ? totalDifference / cashiers.length : 0,
      positiveCount,
      negativeCount,
      exactCount: cashiers.length - positiveCount - negativeCount
    };
  }
}

module.exports = new CashierService();
