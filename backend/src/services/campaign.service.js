const { Op } = require('sequelize');
const Campaign = require('../models/Campaign');
const User = require('../models/User');

class CampaignService {
  /**
   * Criar nova campanha
   */
  async create(data, userId) {
    const campaign = await Campaign.create({
      ...data,
      createdBy: userId
    });

    return campaign;
  }

  /**
   * Listar campanhas com filtros
   */
  async list({ page = 1, limit = 20, status = null, type = null }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const { count, rows: campaigns } = await Campaign.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'nome', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return {
      campaigns,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Obter campanha por ID
   */
  async getById(id) {
    const campaign = await Campaign.findByPk(id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'nome', 'email']
      }]
    });

    if (!campaign) {
      throw new Error('Campanha não encontrada');
    }

    return campaign;
  }

  /**
   * Atualizar campanha
   */
  async update(id, data) {
    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      throw new Error('Campanha não encontrada');
    }

    if (campaign.status === 'completed') {
      throw new Error('Não é possível editar uma campanha concluída');
    }

    await campaign.update(data);
    return campaign;
  }

  /**
   * Deletar campanha (apenas drafts)
   */
  async delete(id) {
    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      throw new Error('Campanha não encontrada');
    }

    if (campaign.status !== 'draft') {
      throw new Error('Apenas campanhas em rascunho podem ser deletadas');
    }

    await campaign.destroy();
    return true;
  }

  /**
   * Obter público-alvo da campanha
   */
  async getTargetAudience(campaignId) {
    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      throw new Error('Campanha não encontrada');
    }

    const where = { role: 'cliente' };
    const { targetType, targetFilters } = campaign;

    switch (targetType) {
      case 'inactive': {
        const days = targetFilters.inactiveDays || 30;
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - days);
        where[Op.or] = [
          { lastOrderDate: { [Op.lt]: dateThreshold } },
          { lastOrderDate: null }
        ];
        break;
      }
      case 'tier': {
        if (targetFilters.tiers && targetFilters.tiers.length > 0) {
          where.loyaltyTier = { [Op.in]: targetFilters.tiers };
        }
        break;
      }
      case 'custom': {
        if (targetFilters.minSpent) {
          where.totalSpent = { [Op.gte]: targetFilters.minSpent };
        }
        if (targetFilters.minOrders) {
          where.totalOrders = { [Op.gte]: targetFilters.minOrders };
        }
        break;
      }
      case 'all':
      default:
        break;
    }

    const customers = await User.findAll({
      where,
      attributes: ['id', 'nome', 'email', 'celular', 'loyaltyTier', 'totalSpent', 'lastOrderDate']
    });

    return customers;
  }

  /**
   * Simular envio - retorna contagem de destinatários
   */
  async simulateSend(campaignId) {
    const audience = await this.getTargetAudience(campaignId);

    const stats = {
      total: audience.length,
      withEmail: audience.filter(c => c.email).length,
      withPhone: audience.filter(c => c.celular).length,
      byTier: audience.reduce((acc, c) => {
        acc[c.loyaltyTier] = (acc[c.loyaltyTier] || 0) + 1;
        return acc;
      }, {})
    };

    return stats;
  }

  /**
   * Executar campanha
   */
  async execute(campaignId) {
    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      throw new Error('Campanha não encontrada');
    }

    if (campaign.status !== 'draft' && campaign.status !== 'paused') {
      throw new Error('Campanha não pode ser executada neste status');
    }

    const audience = await this.getTargetAudience(campaignId);

    // Atualizar stats
    const stats = {
      totalTargets: audience.length,
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0
    };

    // Simular envio (em produção, integrar com serviço de email/SMS)
    for (const customer of audience) {
      const channels = campaign.channels || ['email'];

      if (channels.includes('email') && customer.email) {
        // Aqui integraria com serviço de email
        stats.sent++;
      }

      if (channels.includes('sms') && customer.celular) {
        // Aqui integraria com serviço de SMS
        stats.sent++;
      }
    }

    await campaign.update({
      status: 'active',
      sentAt: new Date(),
      stats
    });

    return {
      success: true,
      sent: stats.sent,
      campaign
    };
  }

  /**
   * Pausar campanha
   */
  async pause(campaignId) {
    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      throw new Error('Campanha não encontrada');
    }

    if (campaign.status !== 'active') {
      throw new Error('Apenas campanhas ativas podem ser pausadas');
    }

    await campaign.update({ status: 'paused' });
    return campaign;
  }

  /**
   * Completar campanha
   */
  async complete(campaignId) {
    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      throw new Error('Campanha não encontrada');
    }

    await campaign.update({ status: 'completed' });
    return campaign;
  }

  /**
   * Estatísticas gerais de campanhas
   */
  async getStats() {
    const total = await Campaign.count();
    const active = await Campaign.count({ where: { status: 'active' } });
    const completed = await Campaign.count({ where: { status: 'completed' } });
    const draft = await Campaign.count({ where: { status: 'draft' } });

    const byType = await Campaign.findAll({
      attributes: [
        'type',
        [Campaign.sequelize.fn('COUNT', Campaign.sequelize.col('id')), 'count']
      ],
      group: ['type']
    });

    const recentCampaigns = await Campaign.findAll({
      where: { status: { [Op.in]: ['active', 'completed'] } },
      order: [['sentAt', 'DESC']],
      limit: 5
    });

    // Calcular total de pessoas alcançadas
    const totalReached = await Campaign.sum('stats.sent', {
      where: { status: { [Op.in]: ['active', 'completed'] } }
    }) || 0;

    return {
      total,
      active,
      completed,
      draft,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = parseInt(item.getDataValue('count'));
        return acc;
      }, {}),
      recentCampaigns,
      totalReached
    };
  }

  /**
   * Criar campanha rápida de reativação
   */
  async createReactivationCampaign(days, userId) {
    const campaign = await this.create({
      name: `Reativação - Clientes ${days}+ dias`,
      description: `Campanha automática para reativar clientes inativos há ${days} dias ou mais`,
      type: 'reactivation',
      targetType: 'inactive',
      targetFilters: { inactiveDays: days },
      content: {
        subject: 'Sentimos sua falta na FLAME!',
        body: `Olá {nome}!\n\nFaz tempo que não nos visitamos. Venha aproveitar nosso cardápio e suas ofertas exclusivas!\n\nEquipe FLAME`,
        sms: 'FLAME: Sentimos sua falta! Venha nos visitar e aproveite ofertas especiais.'
      },
      channels: ['email']
    }, userId);

    return campaign;
  }
}

module.exports = new CampaignService();
