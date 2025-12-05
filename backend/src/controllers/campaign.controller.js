const campaignService = require('../services/campaign.service');

class CampaignController {
  /**
   * POST /api/campaigns
   * Criar nova campanha
   */
  async create(req, res, next) {
    try {
      const campaign = await campaignService.create(req.body, req.user.id);

      res.status(201).json({
        success: true,
        message: 'Campanha criada com sucesso',
        data: campaign
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/campaigns
   * Listar campanhas
   */
  async list(req, res, next) {
    try {
      const { page = 1, limit = 20, status, type } = req.query;

      const result = await campaignService.list({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        type
      });

      res.json({
        success: true,
        data: result.campaigns,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/campaigns/stats
   * Estatísticas de campanhas
   */
  async getStats(req, res, next) {
    try {
      const stats = await campaignService.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/campaigns/:id
   * Obter campanha por ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const campaign = await campaignService.getById(id);

      res.json({
        success: true,
        data: campaign
      });
    } catch (error) {
      if (error.message === 'Campanha não encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * PUT /api/campaigns/:id
   * Atualizar campanha
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const campaign = await campaignService.update(id, req.body);

      res.json({
        success: true,
        message: 'Campanha atualizada com sucesso',
        data: campaign
      });
    } catch (error) {
      if (error.message === 'Campanha não encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Não é possível editar uma campanha concluída') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/campaigns/:id
   * Deletar campanha
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await campaignService.delete(id);

      res.json({
        success: true,
        message: 'Campanha deletada com sucesso'
      });
    } catch (error) {
      if (error.message === 'Campanha não encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Apenas campanhas em rascunho podem ser deletadas') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/campaigns/:id/audience
   * Obter público-alvo da campanha
   */
  async getAudience(req, res, next) {
    try {
      const { id } = req.params;
      const audience = await campaignService.getTargetAudience(id);

      res.json({
        success: true,
        data: audience,
        total: audience.length
      });
    } catch (error) {
      if (error.message === 'Campanha não encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/campaigns/:id/simulate
   * Simular envio da campanha
   */
  async simulate(req, res, next) {
    try {
      const { id } = req.params;
      const stats = await campaignService.simulateSend(id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      if (error.message === 'Campanha não encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/campaigns/:id/execute
   * Executar/enviar campanha
   */
  async execute(req, res, next) {
    try {
      const { id } = req.params;
      const result = await campaignService.execute(id);

      res.json({
        success: true,
        message: `Campanha enviada para ${result.sent} destinatários`,
        data: result
      });
    } catch (error) {
      if (error.message === 'Campanha não encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Campanha não pode ser executada neste status') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/campaigns/:id/pause
   * Pausar campanha
   */
  async pause(req, res, next) {
    try {
      const { id } = req.params;
      const campaign = await campaignService.pause(id);

      res.json({
        success: true,
        message: 'Campanha pausada',
        data: campaign
      });
    } catch (error) {
      if (error.message === 'Campanha não encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Apenas campanhas ativas podem ser pausadas') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/campaigns/:id/complete
   * Marcar campanha como concluída
   */
  async complete(req, res, next) {
    try {
      const { id } = req.params;
      const campaign = await campaignService.complete(id);

      res.json({
        success: true,
        message: 'Campanha concluída',
        data: campaign
      });
    } catch (error) {
      if (error.message === 'Campanha não encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/campaigns/quick-reactivation
   * Criar campanha rápida de reativação
   */
  async createQuickReactivation(req, res, next) {
    try {
      const { days = 30 } = req.body;
      const campaign = await campaignService.createReactivationCampaign(
        parseInt(days),
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: 'Campanha de reativação criada',
        data: campaign
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CampaignController();
