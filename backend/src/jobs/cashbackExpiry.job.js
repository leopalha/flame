/**
 * Cashback Expiry Job - FLAME Lounge Bar
 * Expira cashback não utilizado após 90 dias
 */

const { User, CashbackHistory } = require('../models');
const { Op } = require('sequelize');

/**
 * Expira cashback antigo (>90 dias sem uso)
 * Executa diariamente às 00h
 */
async function expireCashback() {
  const startTime = Date.now();
  console.log(`[CASHBACK-EXPIRY] Iniciando verificação - ${new Date().toISOString()}`);

  try {
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Buscar usuários com cashback > 0 e sem transações recentes
    const usersWithCashback = await User.findAll({
      where: {
        cashbackBalance: {
          [Op.gt]: 0
        }
      },
      attributes: ['id', 'nome', 'cashbackBalance', 'updatedAt']
    });

    console.log(`[CASHBACK-EXPIRY] Verificando ${usersWithCashback.length} usuários com cashback`);

    let expiredCount = 0;
    let totalExpiredAmount = 0;

    for (const user of usersWithCashback) {
      try {
        // Verificar última transação de cashback
        const lastTransaction = await CashbackHistory.findOne({
          where: {
            userId: user.id,
            type: {
              [Op.in]: ['earned', 'bonus']
            }
          },
          order: [['createdAt', 'DESC']]
        });

        // Se não tem transação ou última transação foi há mais de 90 dias
        const lastTransactionDate = lastTransaction?.createdAt || user.createdAt;

        if (new Date(lastTransactionDate) < ninetyDaysAgo) {
          const expiredAmount = parseFloat(user.cashbackBalance);

          // Registrar expiração
          await CashbackHistory.create({
            userId: user.id,
            type: 'expired',
            amount: -expiredAmount,
            description: 'Cashback expirado após 90 dias de inatividade',
            balanceBefore: expiredAmount,
            balanceAfter: 0
          });

          // Zerar cashback do usuário
          await user.update({ cashbackBalance: 0 });

          expiredCount++;
          totalExpiredAmount += expiredAmount;

          console.log(`[CASHBACK-EXPIRY] Expirado R$ ${expiredAmount.toFixed(2)} de ${user.nome}`);
        }
      } catch (error) {
        console.error(`[CASHBACK-EXPIRY] Erro ao processar usuário ${user.id}:`, error.message);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[CASHBACK-EXPIRY] Concluído em ${duration}ms - ${expiredCount} usuários, R$ ${totalExpiredAmount.toFixed(2)} expirados`);

    return {
      success: true,
      expiredCount,
      totalExpiredAmount,
      duration
    };
  } catch (error) {
    console.error('[CASHBACK-EXPIRY] Erro no job:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  name: 'cashbackExpiry',
  schedule: '0 0 * * *', // Diariamente às 00h
  handler: expireCashback
};
