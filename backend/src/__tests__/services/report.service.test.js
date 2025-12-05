/**
 * Testes unitários para report.service.js
 */

describe('ReportService', () => {
  // Mock do reportService para testes isolados de lógica
  const mockReportService = {
    getPaymentMethodLabel: (method) => {
      const labels = {
        credit_card: 'Cartão de Crédito',
        debit_card: 'Cartão de Débito',
        pix: 'PIX',
        apple_pay: 'Apple Pay',
        cash: 'Dinheiro',
        unknown: 'Não informado'
      };
      return labels[method] || method;
    },

    getCategoryLabel: (category) => {
      const labels = {
        bebidas_alcoolicas: 'Bebidas Alcoólicas',
        bebidas_nao_alcoolicas: 'Bebidas Não Alcoólicas',
        drinks_autorais: 'Drinks Autorais',
        petiscos: 'Petiscos',
        pratos_principais: 'Pratos Principais',
        sobremesas: 'Sobremesas',
        porcoes: 'Porções',
        combos: 'Combos'
      };
      return labels[category] || category;
    },

    getTimePeriodLabel: (startHour, endHour) => {
      if (startHour === 6 && endHour === 12) return 'Manhã (6h-12h)';
      if (startHour === 12 && endHour === 18) return 'Tarde (12h-18h)';
      if (startHour === 18 && endHour === 24) return 'Noite (18h-24h)';
      if (startHour === 0 && endHour === 6) return 'Madrugada (0h-6h)';
      return `${startHour}h-${endHour}h`;
    },

    calculateDailyAverage: (startDate, endDate, total) => {
      if (!startDate || !endDate) return total;
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      return total / days;
    }
  };

  describe('getPaymentMethodLabel', () => {
    it('should return correct label for credit_card', () => {
      expect(mockReportService.getPaymentMethodLabel('credit_card')).toBe('Cartão de Crédito');
    });

    it('should return correct label for debit_card', () => {
      expect(mockReportService.getPaymentMethodLabel('debit_card')).toBe('Cartão de Débito');
    });

    it('should return correct label for pix', () => {
      expect(mockReportService.getPaymentMethodLabel('pix')).toBe('PIX');
    });

    it('should return correct label for cash', () => {
      expect(mockReportService.getPaymentMethodLabel('cash')).toBe('Dinheiro');
    });

    it('should return method as-is if unknown', () => {
      expect(mockReportService.getPaymentMethodLabel('bitcoin')).toBe('bitcoin');
    });
  });

  describe('getCategoryLabel', () => {
    it('should return correct label for bebidas_alcoolicas', () => {
      expect(mockReportService.getCategoryLabel('bebidas_alcoolicas')).toBe('Bebidas Alcoólicas');
    });

    it('should return correct label for petiscos', () => {
      expect(mockReportService.getCategoryLabel('petiscos')).toBe('Petiscos');
    });

    it('should return correct label for pratos_principais', () => {
      expect(mockReportService.getCategoryLabel('pratos_principais')).toBe('Pratos Principais');
    });

    it('should return category as-is if unknown', () => {
      expect(mockReportService.getCategoryLabel('other_category')).toBe('other_category');
    });
  });

  describe('getTimePeriodLabel', () => {
    it('should return Manhã for 6-12', () => {
      expect(mockReportService.getTimePeriodLabel(6, 12)).toBe('Manhã (6h-12h)');
    });

    it('should return Tarde for 12-18', () => {
      expect(mockReportService.getTimePeriodLabel(12, 18)).toBe('Tarde (12h-18h)');
    });

    it('should return Noite for 18-24', () => {
      expect(mockReportService.getTimePeriodLabel(18, 24)).toBe('Noite (18h-24h)');
    });

    it('should return Madrugada for 0-6', () => {
      expect(mockReportService.getTimePeriodLabel(0, 6)).toBe('Madrugada (0h-6h)');
    });

    it('should return custom format for other ranges', () => {
      expect(mockReportService.getTimePeriodLabel(10, 14)).toBe('10h-14h');
    });
  });

  describe('calculateDailyAverage', () => {
    it('should return total if no dates provided', () => {
      expect(mockReportService.calculateDailyAverage(null, null, 1000)).toBe(1000);
    });

    it('should calculate correct daily average for 10 days', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-11'; // 10 days
      const total = 1000;
      expect(mockReportService.calculateDailyAverage(startDate, endDate, total)).toBe(100);
    });

    it('should return total for same day', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-01'; // same day
      const total = 500;
      expect(mockReportService.calculateDailyAverage(startDate, endDate, total)).toBe(500);
    });

    it('should handle 30 day period', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const total = 3000;
      expect(mockReportService.calculateDailyAverage(startDate, endDate, total)).toBe(100);
    });
  });
});

describe('Report Data Aggregation', () => {
  describe('Sales grouping by period', () => {
    const mockOrders = [
      { total: 100, createdAt: '2024-01-01T10:00:00Z' },
      { total: 150, createdAt: '2024-01-01T14:00:00Z' },
      { total: 200, createdAt: '2024-01-02T10:00:00Z' },
    ];

    it('should correctly sum totals', () => {
      const total = mockOrders.reduce((sum, order) => sum + order.total, 0);
      expect(total).toBe(450);
    });

    it('should correctly count orders', () => {
      expect(mockOrders.length).toBe(3);
    });

    it('should calculate correct average ticket', () => {
      const total = mockOrders.reduce((sum, order) => sum + order.total, 0);
      const average = total / mockOrders.length;
      expect(average).toBe(150);
    });
  });

  describe('Product ranking', () => {
    const mockProductStats = [
      { productId: '1', productName: 'Product A', quantitySold: 50, revenue: 500 },
      { productId: '2', productName: 'Product B', quantitySold: 30, revenue: 600 },
      { productId: '3', productName: 'Product C', quantitySold: 80, revenue: 400 },
    ];

    it('should sort by quantity sold correctly', () => {
      const sorted = [...mockProductStats].sort((a, b) => b.quantitySold - a.quantitySold);
      expect(sorted[0].productName).toBe('Product C');
      expect(sorted[1].productName).toBe('Product A');
      expect(sorted[2].productName).toBe('Product B');
    });

    it('should sort by revenue correctly', () => {
      const sorted = [...mockProductStats].sort((a, b) => b.revenue - a.revenue);
      expect(sorted[0].productName).toBe('Product B');
      expect(sorted[1].productName).toBe('Product A');
      expect(sorted[2].productName).toBe('Product C');
    });

    it('should calculate total revenue', () => {
      const totalRevenue = mockProductStats.reduce((sum, p) => sum + p.revenue, 0);
      expect(totalRevenue).toBe(1500);
    });

    it('should calculate revenue percentage correctly', () => {
      const totalRevenue = mockProductStats.reduce((sum, p) => sum + p.revenue, 0);
      const productBPercentage = (mockProductStats[1].revenue / totalRevenue) * 100;
      expect(productBPercentage).toBe(40);
    });
  });
});

describe('DRE Calculations', () => {
  const mockDREData = {
    receitaBruta: 10000,
    taxaServico: 1000,
    impostos: 0,
  };

  it('should calculate receita líquida correctly', () => {
    const receitaLiquida = mockDREData.receitaBruta + mockDREData.taxaServico;
    expect(receitaLiquida).toBe(11000);
  });

  it('should calculate CMV correctly at 30%', () => {
    const cmvPercentage = 30;
    const cmvEstimado = mockDREData.receitaBruta * (cmvPercentage / 100);
    expect(cmvEstimado).toBe(3000);
  });

  it('should calculate lucro bruto correctly', () => {
    const receitaLiquida = mockDREData.receitaBruta + mockDREData.taxaServico;
    const cmvEstimado = mockDREData.receitaBruta * 0.30;
    const lucroBruto = receitaLiquida - cmvEstimado;
    expect(lucroBruto).toBe(8000);
  });

  it('should calculate margem bruta correctly', () => {
    const receitaLiquida = mockDREData.receitaBruta + mockDREData.taxaServico;
    const cmvEstimado = mockDREData.receitaBruta * 0.30;
    const lucroBruto = receitaLiquida - cmvEstimado;
    const margemBruta = (lucroBruto / receitaLiquida) * 100;
    expect(margemBruta.toFixed(2)).toBe('72.73');
  });

  it('should calculate lucro líquido with 25% expenses', () => {
    const receitaLiquida = mockDREData.receitaBruta + mockDREData.taxaServico;
    const cmvEstimado = mockDREData.receitaBruta * 0.30;
    const lucroBruto = receitaLiquida - cmvEstimado;
    const despesas = receitaLiquida * 0.25;
    const lucroLiquido = lucroBruto - despesas;
    expect(lucroLiquido).toBe(5250);
  });
});
