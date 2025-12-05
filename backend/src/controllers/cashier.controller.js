const cashierService = require('../services/cashier.service');

class CashierController {
  /**
   * Abre um novo caixa
   * POST /api/cashier/open
   */
  async openCashier(req, res) {
    try {
      const { openingAmount, notes } = req.body;
      const { id: operatorId, nome: operatorName } = req.user;

      const cashier = await cashierService.openCashier(
        operatorId,
        operatorName,
        openingAmount,
        notes
      );

      res.status(201).json({
        success: true,
        message: 'Caixa aberto com sucesso',
        data: cashier
      });
    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao abrir caixa'
      });
    }
  }

  /**
   * Busca o caixa atualmente aberto
   * GET /api/cashier/current
   */
  async getCurrentCashier(req, res) {
    try {
      const cashier = await cashierService.getCurrentCashier();

      if (!cashier) {
        return res.status(404).json({
          success: false,
          message: 'Nenhum caixa aberto no momento'
        });
      }

      res.json({
        success: true,
        data: cashier
      });
    } catch (error) {
      console.error('Erro ao buscar caixa atual:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar caixa atual'
      });
    }
  }

  /**
   * Registra um suprimento (entrada de dinheiro)
   * POST /api/cashier/deposit
   */
  async registerDeposit(req, res) {
    try {
      const { cashierId, amount, description } = req.body;
      const { id: userId, nome: userName } = req.user;

      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valor inválido'
        });
      }

      const movement = await cashierService.registerDeposit(
        cashierId,
        amount,
        description,
        userId,
        userName
      );

      res.status(201).json({
        success: true,
        message: 'Suprimento registrado com sucesso',
        data: movement
      });
    } catch (error) {
      console.error('Erro ao registrar suprimento:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao registrar suprimento'
      });
    }
  }

  /**
   * Registra uma sangria (retirada de dinheiro)
   * POST /api/cashier/withdrawal
   */
  async registerWithdrawal(req, res) {
    try {
      const { cashierId, amount, description } = req.body;
      const { id: userId, nome: userName } = req.user;

      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valor inválido'
        });
      }

      const movement = await cashierService.registerWithdrawal(
        cashierId,
        amount,
        description,
        userId,
        userName
      );

      res.status(201).json({
        success: true,
        message: 'Sangria registrada com sucesso',
        data: movement
      });
    } catch (error) {
      console.error('Erro ao registrar sangria:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao registrar sangria'
      });
    }
  }

  /**
   * Fecha o caixa
   * POST /api/cashier/close
   */
  async closeCashier(req, res) {
    try {
      const { cashierId, closingAmount, notes } = req.body;
      const { id: userId, nome: userName } = req.user;

      if (closingAmount === undefined || closingAmount === null) {
        return res.status(400).json({
          success: false,
          message: 'Valor de fechamento é obrigatório'
        });
      }

      const cashier = await cashierService.closeCashier(
        cashierId,
        closingAmount,
        userId,
        userName,
        notes
      );

      res.json({
        success: true,
        message: 'Caixa fechado com sucesso',
        data: cashier
      });
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao fechar caixa'
      });
    }
  }

  /**
   * Busca histórico de caixas
   * GET /api/cashier/history?page=1&limit=20&status=closed&startDate=2024-01-01&endDate=2024-12-31
   */
  async getCashierHistory(req, res) {
    try {
      const { page, limit, status, startDate, endDate } = req.query;

      const result = await cashierService.getCashierHistory({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status,
        startDate,
        endDate
      });

      res.json({
        success: true,
        data: result.cashiers,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Erro ao buscar histórico de caixas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar histórico de caixas'
      });
    }
  }

  /**
   * Busca detalhes de um caixa específico
   * GET /api/cashier/:id
   */
  async getCashierDetails(req, res) {
    try {
      const { id } = req.params;

      const cashier = await cashierService.getCashierDetails(id);

      res.json({
        success: true,
        data: cashier
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes do caixa:', error);

      if (error.message === 'Caixa não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao buscar detalhes do caixa'
      });
    }
  }

  /**
   * Busca estatísticas de caixas
   * GET /api/cashier/stats?days=30
   */
  async getCashierStats(req, res) {
    try {
      const { days } = req.query;

      const stats = await cashierService.getCashierStats(
        parseInt(days) || 30
      );

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar estatísticas'
      });
    }
  }
}

module.exports = new CashierController();
