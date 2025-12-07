/**
 * Referral Bonus Job
 * Sprint 29 - Bônus de Indicação
 *
 * Processa bônus de indicação quando:
 * 1. Novo usuário completa o perfil (referido recebe R$10)
 * 2. Quem indicou recebe R$15 quando o indicado faz primeira compra
 */

const User = require('../models/User');
const CashbackHistory = require('../models/CashbackHistory');
const Order = require('../models/Order');
const { Op } = require('sequelize');

// Valores dos bônus
const REFEREE_BONUS = 10; // Quem foi indicado recebe R$10
const REFERRER_BONUS = 15; // Quem indicou recebe R$15 após primeira compra

/**
 * Gera um código de referral único
 */
function generateReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'FLAME';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Gera código de referral para usuário se não tiver
 */
async function ensureReferralCode(user) {
  if (!user.referralCode) {
    let code;
    let attempts = 0;

    // Tentar gerar código único
    while (attempts < 10) {
      code = generateReferralCode();
      const existing = await User.findOne({ where: { referralCode: code } });
      if (!existing) break;
      attempts++;
    }

    user.referralCode = code;
    await user.save();
    console.log(`✅ Código de referral gerado para ${user.nome}: ${code}`);
  }
  return user.referralCode;
}

/**
 * Processa bônus para novo usuário indicado
 * Chamado quando usuário completa perfil
 */
async function processNewUserBonus(userId) {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      console.log(`❌ Usuário ${userId} não encontrado`);
      return null;
    }

    // Verificar se foi indicado e ainda não recebeu bônus
    if (!user.referredBy || user.referralBonusGiven) {
      return null;
    }

    // Verificar se perfil está completo
    if (!user.profileComplete || !user.phoneVerified) {
      return null;
    }

    // Dar bônus ao indicado
    const balanceBefore = parseFloat(user.cashbackBalance) || 0;
    user.cashbackBalance = (balanceBefore + REFEREE_BONUS).toFixed(2);
    user.referralBonusGiven = true;
    await user.save();

    // Registrar no histórico
    await CashbackHistory.create({
      userId: user.id,
      amount: REFEREE_BONUS,
      type: 'bonus',
      description: 'Bônus de boas-vindas por indicação',
      balanceBefore,
      balanceAfter: parseFloat(user.cashbackBalance)
    });

    console.log(`✅ Bônus de R$${REFEREE_BONUS} dado para ${user.nome} (indicado)`);
    return { userId: user.id, bonus: REFEREE_BONUS };
  } catch (error) {
    console.error('❌ Erro ao processar bônus de novo usuário:', error);
    return null;
  }
}

/**
 * Processa bônus para quem indicou após primeira compra
 * Chamado quando um pedido é entregue
 */
async function processReferrerBonus(orderId) {
  try {
    const order = await Order.findByPk(orderId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!order || !order.user) {
      return null;
    }

    const buyer = order.user;

    // Verificar se este usuário foi indicado
    if (!buyer.referredBy) {
      return null;
    }

    // Verificar se esta é a primeira compra entregue
    const previousOrders = await Order.count({
      where: {
        userId: buyer.id,
        status: 'delivered',
        id: { [Op.ne]: orderId }
      }
    });

    if (previousOrders > 0) {
      // Não é a primeira compra
      return null;
    }

    // Buscar quem indicou
    const referrer = await User.findByPk(buyer.referredBy);
    if (!referrer) {
      console.log(`❌ Referrer ${buyer.referredBy} não encontrado`);
      return null;
    }

    // Verificar se já recebeu bônus por este indicado (usando CashbackHistory)
    const existingBonus = await CashbackHistory.findOne({
      where: {
        userId: referrer.id,
        type: 'bonus',
        description: { [Op.like]: `%indicou ${buyer.nome}%` }
      }
    });

    if (existingBonus) {
      return null;
    }

    // Dar bônus ao referrer
    const balanceBefore = parseFloat(referrer.cashbackBalance) || 0;
    referrer.cashbackBalance = (balanceBefore + REFERRER_BONUS).toFixed(2);
    referrer.totalReferrals = (referrer.totalReferrals || 0) + 1;
    await referrer.save();

    // Registrar no histórico
    await CashbackHistory.create({
      userId: referrer.id,
      amount: REFERRER_BONUS,
      type: 'bonus',
      description: `Bônus de indicação - Você indicou ${buyer.nome}`,
      balanceBefore,
      balanceAfter: parseFloat(referrer.cashbackBalance)
    });

    console.log(`✅ Bônus de R$${REFERRER_BONUS} dado para ${referrer.nome} (indicou ${buyer.nome})`);
    return { referrerId: referrer.id, refereeId: buyer.id, bonus: REFERRER_BONUS };
  } catch (error) {
    console.error('❌ Erro ao processar bônus de indicação:', error);
    return null;
  }
}

/**
 * Valida código de referral e retorna o usuário que indicou
 */
async function validateReferralCode(code) {
  if (!code) return null;

  const referrer = await User.findOne({
    where: { referralCode: code.toUpperCase() }
  });

  return referrer;
}

/**
 * Job para processar bônus pendentes (roda a cada hora)
 */
async function runReferralBonusJob() {
  console.log('🔄 Executando job de bônus de indicação...');

  try {
    // Processar usuários que completaram perfil mas não receberam bônus
    const pendingUsers = await User.findAll({
      where: {
        referredBy: { [Op.ne]: null },
        referralBonusGiven: false,
        profileComplete: true,
        phoneVerified: true
      }
    });

    let bonusesGiven = 0;
    for (const user of pendingUsers) {
      const result = await processNewUserBonus(user.id);
      if (result) bonusesGiven++;
    }

    console.log(`✅ Job de indicação concluído: ${bonusesGiven} bônus processados`);
    return bonusesGiven;
  } catch (error) {
    console.error('❌ Erro no job de bônus de indicação:', error);
    return 0;
  }
}

module.exports = {
  generateReferralCode,
  ensureReferralCode,
  processNewUserBonus,
  processReferrerBonus,
  validateReferralCode,
  runReferralBonusJob,
  REFEREE_BONUS,
  REFERRER_BONUS
};
