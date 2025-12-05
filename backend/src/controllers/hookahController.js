const hookahService = require('../services/hookahService');
const { HookahFlavor } = require('../models');
const socketService = require('../services/socket.service');

class HookahController {
  /**
   * GET /api/hookah/flavors
   * Obter todos os sabores disponíveis
   */
  static async getFlavors(req, res) {
    try {
      const flavors = await HookahFlavor.findAll({
        where: { inStock: true },
        order: [['name', 'ASC']],
        attributes: ['id', 'name', 'description', 'category', 'image', 'price', 'popularity', 'rating'],
      });

      return res.json({
        success: true,
        data: flavors,
        count: flavors.length,
      });
    } catch (error) {
      console.error('Erro ao obter sabores:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * POST /api/hookah/sessions
   * Criar nova sessão de narguilé
   * Body: { mesaId, flavorId, quantity=1, duration=30 }
   */
  static async createSession(req, res) {
    try {
      const { mesaId, flavorId, quantity = 1, duration = 30 } = req.body;

      if (!mesaId || !flavorId) {
        return res.status(400).json({
          success: false,
          error: 'mesaId e flavorId são obrigatórios',
        });
      }

      const session = await hookahService.createSession(mesaId, flavorId, quantity, duration);

      // Notificar bar via Socket.IO
      socketService.notifyNewHookahSession(session);

      return res.status(201).json({
        success: true,
        data: session,
        message: 'Sessão de narguilé iniciada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/hookah/sessions
   * Obter todas as sessões ativas
   */
  static async getActiveSessions(req, res) {
    try {
      const sessions = await hookahService.getActiveSessions();

      return res.json({
        success: true,
        data: sessions,
        count: sessions.length,
      });
    } catch (error) {
      console.error('Erro ao obter sessões ativas:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/hookah/sessions/:id
   * Obter detalhes de uma sessão
   */
  static async getSessionDetails(req, res) {
    try {
      const { id } = req.params;

      const session = await hookahService.getSessionDetails(id);

      return res.json({
        success: true,
        data: session,
      });
    } catch (error) {
      console.error('Erro ao obter detalhes da sessão:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/hookah/sessions/:id/coal
   * Registrar troca de carvão
   */
  static async registerCoalChange(req, res) {
    try {
      const { id } = req.params;

      const session = await hookahService.registerCoalChange(id);

      // Notificar via Socket.IO
      socketService.emitToRoom(`hookah_${id}`, 'hookah:coal_changed', {
        sessionId: id,
        coalChangeCount: session.coalChangeCount,
        timestamp: new Date()
      });

      return res.json({
        success: true,
        data: session,
        message: 'Troca de carvão registrada',
      });
    } catch (error) {
      console.error('Erro ao registrar troca de carvão:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/hookah/sessions/:id/pause
   * Pausar sessão
   */
  static async pauseSession(req, res) {
    try {
      const { id } = req.params;

      const session = await hookahService.pauseSession(id);

      // Notificar via Socket.IO
      socketService.emitToRoom(`hookah_${id}`, 'hookah:paused', {
        sessionId: id,
        timestamp: new Date()
      });

      return res.json({
        success: true,
        data: session,
        message: 'Sessão pausada',
      });
    } catch (error) {
      console.error('Erro ao pausar sessão:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/hookah/sessions/:id/resume
   * Retomar sessão pausada
   */
  static async resumeSession(req, res) {
    try {
      const { id } = req.params;

      const session = await hookahService.resumeSession(id);

      // Notificar via Socket.IO
      socketService.emitToRoom(`hookah_${id}`, 'hookah:resumed', {
        sessionId: id,
        timestamp: new Date()
      });

      return res.json({
        success: true,
        data: session,
        message: 'Sessão retomada',
      });
    } catch (error) {
      console.error('Erro ao retomar sessão:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/hookah/sessions/:id/end
   * Finalizar sessão
   */
  static async endSession(req, res) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const session = await hookahService.endSession(id);

      if (notes) {
        session.notes = notes;
        await session.save();
      }

      // Notificar fim de sessão via Socket.IO
      socketService.notifyHookahSessionEnded(session);

      return res.json({
        success: true,
        data: session,
        message: 'Sessão finalizada',
      });
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/hookah/history?days=30
   * Obter histórico de sessões
   */
  static async getHistory(req, res) {
    try {
      const { days = 30 } = req.query;

      const sessions = await hookahService.getSessionHistory(parseInt(days));

      return res.json({
        success: true,
        data: sessions,
        count: sessions.length,
        period: `${days} dias`,
      });
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/hookah/revenue-report?days=30
   * Obter relatório de receita
   */
  static async getRevenueReport(req, res) {
    try {
      const { days = 30 } = req.query;

      const report = await hookahService.getRevenueReport(parseInt(days));

      return res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      console.error('Erro ao obter relatório:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/hookah/popular-flavors?limit=5
   * Obter sabores mais populares
   */
  static async getPopularFlavors(req, res) {
    try {
      const { limit = 5 } = req.query;

      const flavors = await hookahService.getPopularFlavors(parseInt(limit));

      return res.json({
        success: true,
        data: flavors,
        count: flavors.length,
      });
    } catch (error) {
      console.error('Erro ao obter sabores populares:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/hookah/flavors/category/:category
   * Obter sabores por categoria
   */
  static async getFlavorsByCategory(req, res) {
    try {
      const { category } = req.params;

      const flavors = await hookahService.getFlavorsByCategory(category);

      return res.json({
        success: true,
        data: flavors,
        count: flavors.length,
        category,
      });
    } catch (error) {
      console.error('Erro ao obter sabores por categoria:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = HookahController;
