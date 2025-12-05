const reportService = require('../services/report.service');

class ReportController {
  /**
   * Relatório de Vendas
   * GET /api/reports/sales?startDate=2024-01-01&endDate=2024-12-31&groupBy=day
   */
  async getSalesReport(req, res) {
    try {
      const { startDate, endDate, groupBy } = req.query;

      const report = await reportService.getSalesReport({
        startDate,
        endDate,
        groupBy: groupBy || 'day'
      });

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Erro ao gerar relatório de vendas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar relatório de vendas'
      });
    }
  }

  /**
   * Relatório de Produtos
   * GET /api/reports/products?startDate=2024-01-01&endDate=2024-12-31&limit=20
   */
  async getProductsReport(req, res) {
    try {
      const { startDate, endDate, limit } = req.query;

      const report = await reportService.getProductsReport({
        startDate,
        endDate,
        limit: parseInt(limit) || 20
      });

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Erro ao gerar relatório de produtos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar relatório de produtos'
      });
    }
  }

  /**
   * Relatório de Categorias
   * GET /api/reports/categories?startDate=2024-01-01&endDate=2024-12-31
   */
  async getCategoriesReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const report = await reportService.getCategoriesReport({
        startDate,
        endDate
      });

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Erro ao gerar relatório de categorias:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar relatório de categorias'
      });
    }
  }

  /**
   * Relatório por Horário
   * GET /api/reports/hourly?startDate=2024-01-01&endDate=2024-12-31
   */
  async getHourlyReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const report = await reportService.getHourlyReport({
        startDate,
        endDate
      });

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Erro ao gerar relatório por horário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar relatório por horário'
      });
    }
  }

  /**
   * DRE Simplificado
   * GET /api/reports/dre?startDate=2024-01-01&endDate=2024-12-31
   */
  async getDREReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const report = await reportService.getDREReport({
        startDate,
        endDate
      });

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Erro ao gerar DRE:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar DRE'
      });
    }
  }

  /**
   * Dashboard consolidado com todos os relatórios resumidos
   * GET /api/reports/dashboard?days=30
   */
  async getDashboard(req, res) {
    try {
      const { days } = req.query;
      const daysNum = parseInt(days) || 30;

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Buscar todos os relatórios em paralelo
      const [salesReport, productsReport, categoriesReport, hourlyReport] = await Promise.all([
        reportService.getSalesReport({ startDate: startDateStr, endDate: endDateStr, groupBy: 'day' }),
        reportService.getProductsReport({ startDate: startDateStr, endDate: endDateStr, limit: 5 }),
        reportService.getCategoriesReport({ startDate: startDateStr, endDate: endDateStr }),
        reportService.getHourlyReport({ startDate: startDateStr, endDate: endDateStr })
      ]);

      res.json({
        success: true,
        data: {
          period: {
            days: daysNum,
            startDate: startDateStr,
            endDate: endDateStr
          },
          sales: salesReport.summary,
          topProducts: productsReport.topProducts.slice(0, 5),
          topCategories: categoriesReport.categories.slice(0, 5),
          peakHours: {
            hour: hourlyReport.summary.peakHour,
            orders: hourlyReport.summary.peakOrders
          },
          salesByPeriod: salesReport.byPeriod.slice(-7), // Últimos 7 períodos
          paymentMethods: salesReport.byPaymentMethod
        }
      });
    } catch (error) {
      console.error('Erro ao gerar dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar dashboard'
      });
    }
  }
}

module.exports = new ReportController();
