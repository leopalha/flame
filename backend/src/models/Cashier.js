const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Cashier extends Model {
  // Calcula o total esperado baseado nas movimentações
  calculateExpectedTotal() {
    const openingAmount = parseFloat(this.openingAmount) || 0;
    const sales = parseFloat(this.totalSales) || 0;
    const deposits = parseFloat(this.totalDeposits) || 0;
    const withdrawals = parseFloat(this.totalWithdrawals) || 0;

    return openingAmount + sales + deposits - withdrawals;
  }

  // Calcula a diferença (sobra/falta)
  calculateDifference() {
    if (this.status !== 'closed') return 0;

    const expected = this.calculateExpectedTotal();
    const closing = parseFloat(this.closingAmount) || 0;

    return closing - expected;
  }

  // Retorna status formatado
  getStatus() {
    const statusMap = {
      open: 'Aberto',
      closed: 'Fechado'
    };
    return statusMap[this.status] || this.status;
  }

  // Formata resumo do caixa
  getSummary() {
    const difference = this.calculateDifference();
    const diffType = difference > 0 ? 'sobra' : difference < 0 ? 'falta' : 'correto';

    return {
      id: this.id,
      status: this.status,
      statusLabel: this.getStatus(),
      operator: this.operatorName,
      openedAt: this.openedAt,
      closedAt: this.closedAt,
      duration: this.closedAt ? Math.floor((new Date(this.closedAt) - new Date(this.openedAt)) / 60000) : null,
      opening: parseFloat(this.openingAmount),
      sales: parseFloat(this.totalSales),
      deposits: parseFloat(this.totalDeposits),
      withdrawals: parseFloat(this.totalWithdrawals),
      expected: this.calculateExpectedTotal(),
      closing: parseFloat(this.closingAmount) || 0,
      difference: Math.abs(difference),
      differenceType: diffType,
      notes: this.notes
    };
  }
}

Cashier.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  operatorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'ID do operador que abriu o caixa'
  },
  operatorName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nome do operador (desnormalizado para histórico)'
  },
  openedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Data/hora da abertura'
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Data/hora do fechamento'
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    allowNull: false,
    defaultValue: 'open',
    comment: 'Status do caixa'
  },
  openingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Valor inicial em caixa (R$)'
  },
  closingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Valor contado no fechamento (R$)'
  },
  totalSales: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Total de vendas em dinheiro (R$)'
  },
  totalDeposits: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Total de suprimentos (R$)'
  },
  totalWithdrawals: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Total de sangrias (R$)'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observações sobre o caixa'
  },
  closedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'ID do usuário que fechou o caixa'
  },
  closedByName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Nome de quem fechou (desnormalizado)'
  }
}, {
  sequelize,
  modelName: 'Cashier',
  tableName: 'cashiers',
  timestamps: true,
  indexes: [
    {
      fields: ['operatorId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['openedAt']
    },
    {
      fields: ['closedAt']
    },
    {
      fields: ['status', 'openedAt'],
      name: 'idx_cashier_status_date'
    }
  ]
});

module.exports = Cashier;
