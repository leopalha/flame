const crmService = require('../services/crm.service');

class CRMController {
  /**
   * GET /api/crm/dashboard
   * Obter estatísticas gerais do CRM
   */
  async getDashboard(req, res, next) {
    try {
      const stats = await crmService.getDashboardStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/crm/customers
   * Listar clientes com filtros
   */
  async listCustomers(req, res, next) {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        tier = null,
        sortBy = 'totalSpent',
        sortOrder = 'DESC'
      } = req.query;

      const result = await crmService.listCustomers({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        tier,
        sortBy,
        sortOrder
      });

      res.json({
        success: true,
        data: result.customers,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/crm/customers/:id
   * Obter detalhes completos de um cliente
   */
  async getCustomer(req, res, next) {
    try {
      const { id } = req.params;

      const stats = await crmService.getCustomerStats(id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/crm/customers/:id/cashback-history
   * Obter histórico de cashback de um cliente
   */
  async getCashbackHistory(req, res, next) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await crmService.getCashbackHistory(id, {
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: result.history,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/crm/customers/:id/cashback
   * Adicionar cashback manualmente (admin)
   */
  async addCashback(req, res, next) {
    try {
      const { id } = req.params;
      const { amount, description } = req.body;

      if (!amount || isNaN(amount)) {
        return res.status(400).json({
          success: false,
          message: 'Valor de cashback inválido'
        });
      }

      const result = await crmService.addManualCashback(
        id,
        parseFloat(amount),
        description
      );

      res.json({
        success: true,
        message: 'Cashback adicionado com sucesso',
        data: result
      });
    } catch (error) {
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/crm/inactive
   * Obter clientes inativos
   */
  async getInactiveCustomers(req, res, next) {
    try {
      const { days = 30 } = req.query;

      const customers = await crmService.getInactiveCustomers(parseInt(days));

      res.json({
        success: true,
        data: customers,
        total: customers.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/crm/near-upgrade
   * Obter clientes próximos de subir de tier
   */
  async getNearUpgrade(req, res, next) {
    try {
      const { threshold = 100 } = req.query;

      const customers = await crmService.getCustomersNearTierUpgrade(
        parseFloat(threshold)
      );

      res.json({
        success: true,
        data: customers,
        total: customers.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/crm/customers/:id/tier
   * Ajustar tier manualmente
   */
  async adjustTier(req, res, next) {
    try {
      const { id } = req.params;

      const result = await crmService.adjustTier(id);

      res.json({
        success: true,
        message: result.updated
          ? `Tier atualizado de ${result.oldTier} para ${result.newTier}`
          : 'Tier já está correto',
        data: result
      });
    } catch (error) {
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = new CRMController();
