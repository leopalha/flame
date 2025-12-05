const { Op, fn, col, literal } = require('sequelize');
const { sequelize, Order, OrderItem, Product, User, Cashier, CashierMovement } = require('../models');

class ReportService {
  /**
   * Relatório de Vendas
   * Retorna vendas agregadas por período
   */
  async getSalesReport({ startDate, endDate, groupBy = 'day' }) {
    const whereClause = {
      status: { [Op.notIn]: ['cancelled', 'pending'] },
      paymentStatus: 'completed'
    };

    if (startDate) {
      whereClause.createdAt = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        [Op.lte]: new Date(endDate)
      };
    }

    // Buscar todos os pedidos no período
    const orders = await Order.findAll({
      where: whereClause,
      attributes: [
        'id', 'orderNumber', 'total', 'subtotal', 'serviceFee',
        'paymentMethod', 'createdAt'
      ],
      order: [['createdAt', 'ASC']]
    });

    // Agrupar por período
    const grouped = {};
    const paymentMethods = {};
    let totalRevenue = 0;
    let totalOrders = 0;
    let totalServiceFee = 0;

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      let key;

      switch (groupBy) {
        case 'hour':
          key = `${date.toISOString().split('T')[0]} ${date.getHours().toString().padStart(2, '0')}:00`;
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
        case 'day':
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!grouped[key]) {
        grouped[key] = {
          period: key,
          orders: 0,
          revenue: 0,
          serviceFee: 0,
          averageTicket: 0
        };
      }

      grouped[key].orders += 1;
      grouped[key].revenue += parseFloat(order.total);
      grouped[key].serviceFee += parseFloat(order.serviceFee);

      // Contar métodos de pagamento
      const method = order.paymentMethod || 'unknown';
      if (!paymentMethods[method]) {
        paymentMethods[method] = { count: 0, total: 0 };
      }
      paymentMethods[method].count += 1;
      paymentMethods[method].total += parseFloat(order.total);

      totalRevenue += parseFloat(order.total);
      totalOrders += 1;
      totalServiceFee += parseFloat(order.serviceFee);
    });

    // Calcular ticket médio por período
    Object.keys(grouped).forEach(key => {
      grouped[key].averageTicket = grouped[key].orders > 0
        ? grouped[key].revenue / grouped[key].orders
        : 0;
    });

    return {
      summary: {
        totalOrders,
        totalRevenue,
        totalServiceFee,
        averageTicket: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        period: { startDate, endDate }
      },
      byPeriod: Object.values(grouped),
      byPaymentMethod: Object.entries(paymentMethods).map(([method, data]) => ({
        method,
        methodLabel: this.getPaymentMethodLabel(method),
        count: data.count,
        total: data.total,
        percentage: totalRevenue > 0 ? (data.total / totalRevenue * 100) : 0
      }))
    };
  }

  /**
   * Relatório de Produtos
   * Ranking de produtos mais vendidos
   */
  async getProductsReport({ startDate, endDate, limit = 20 }) {
    const whereClause = {};
    const orderWhereClause = {
      status: { [Op.notIn]: ['cancelled', 'pending'] }
    };

    if (startDate) {
      orderWhereClause.createdAt = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      orderWhereClause.createdAt = {
        ...orderWhereClause.createdAt,
        [Op.lte]: new Date(endDate)
      };
    }

    // Buscar itens de pedidos com informações do pedido
    const orderItems = await OrderItem.findAll({
      include: [{
        model: Order,
        as: 'order',
        where: orderWhereClause,
        attributes: ['id', 'status']
      }, {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'category', 'price', 'image']
      }],
      attributes: ['productId', 'productName', 'productCategory', 'quantity', 'subtotal']
    });

    // Agregar por produto
    const productStats = {};
    let totalQuantity = 0;
    let totalRevenue = 0;

    orderItems.forEach(item => {
      const productId = item.productId;

      if (!productStats[productId]) {
        productStats[productId] = {
          productId,
          productName: item.productName,
          category: item.productCategory,
          categoryLabel: this.getCategoryLabel(item.productCategory),
          currentPrice: item.product ? parseFloat(item.product.price) : null,
          image: item.product?.image,
          quantitySold: 0,
          revenue: 0,
          orderCount: 0
        };
      }

      productStats[productId].quantitySold += parseInt(item.quantity);
      productStats[productId].revenue += parseFloat(item.subtotal);
      productStats[productId].orderCount += 1;

      totalQuantity += parseInt(item.quantity);
      totalRevenue += parseFloat(item.subtotal);
    });

    // Converter para array e ordenar
    const products = Object.values(productStats)
      .map(p => ({
        ...p,
        averagePerOrder: p.orderCount > 0 ? p.quantitySold / p.orderCount : 0,
        revenuePercentage: totalRevenue > 0 ? (p.revenue / totalRevenue * 100) : 0
      }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, limit);

    // Ranking position
    products.forEach((p, index) => {
      p.rank = index + 1;
    });

    return {
      summary: {
        totalProducts: Object.keys(productStats).length,
        totalQuantitySold: totalQuantity,
        totalRevenue,
        period: { startDate, endDate }
      },
      topProducts: products,
      bottomProducts: Object.values(productStats)
        .sort((a, b) => a.quantitySold - b.quantitySold)
        .slice(0, 5)
        .map((p, index) => ({ ...p, rank: index + 1 }))
    };
  }

  /**
   * Relatório por Categorias
   * Vendas agregadas por categoria de produto
   */
  async getCategoriesReport({ startDate, endDate }) {
    const orderWhereClause = {
      status: { [Op.notIn]: ['cancelled', 'pending'] }
    };

    if (startDate) {
      orderWhereClause.createdAt = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      orderWhereClause.createdAt = {
        ...orderWhereClause.createdAt,
        [Op.lte]: new Date(endDate)
      };
    }

    // Buscar itens de pedidos
    const orderItems = await OrderItem.findAll({
      include: [{
        model: Order,
        as: 'order',
        where: orderWhereClause,
        attributes: ['id']
      }],
      attributes: ['productCategory', 'quantity', 'subtotal']
    });

    // Agregar por categoria
    const categoryStats = {};
    let totalRevenue = 0;
    let totalQuantity = 0;

    orderItems.forEach(item => {
      const category = item.productCategory;

      if (!categoryStats[category]) {
        categoryStats[category] = {
          category,
          categoryLabel: this.getCategoryLabel(category),
          quantitySold: 0,
          revenue: 0,
          itemCount: 0
        };
      }

      categoryStats[category].quantitySold += parseInt(item.quantity);
      categoryStats[category].revenue += parseFloat(item.subtotal);
      categoryStats[category].itemCount += 1;

      totalRevenue += parseFloat(item.subtotal);
      totalQuantity += parseInt(item.quantity);
    });

    // Converter para array e calcular percentuais
    const categories = Object.values(categoryStats)
      .map(c => ({
        ...c,
        revenuePercentage: totalRevenue > 0 ? (c.revenue / totalRevenue * 100) : 0,
        quantityPercentage: totalQuantity > 0 ? (c.quantitySold / totalQuantity * 100) : 0,
        averageItemValue: c.quantitySold > 0 ? c.revenue / c.quantitySold : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);

    return {
      summary: {
        totalCategories: categories.length,
        totalRevenue,
        totalQuantitySold: totalQuantity,
        period: { startDate, endDate }
      },
      categories
    };
  }

  /**
   * Relatório por Horário
   * Análise de vendas por hora do dia
   */
  async getHourlyReport({ startDate, endDate }) {
    const whereClause = {
      status: { [Op.notIn]: ['cancelled', 'pending'] },
      paymentStatus: 'completed'
    };

    if (startDate) {
      whereClause.createdAt = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        [Op.lte]: new Date(endDate)
      };
    }

    const orders = await Order.findAll({
      where: whereClause,
      attributes: ['id', 'total', 'createdAt']
    });

    // Agregar por hora
    const hourlyStats = {};
    for (let h = 0; h < 24; h++) {
      hourlyStats[h] = {
        hour: h,
        hourLabel: `${h.toString().padStart(2, '0')}:00`,
        orders: 0,
        revenue: 0
      };
    }

    let totalOrders = 0;
    let totalRevenue = 0;

    orders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourlyStats[hour].orders += 1;
      hourlyStats[hour].revenue += parseFloat(order.total);
      totalOrders += 1;
      totalRevenue += parseFloat(order.total);
    });

    // Calcular médias e percentuais
    const hourlyData = Object.values(hourlyStats).map(h => ({
      ...h,
      averageTicket: h.orders > 0 ? h.revenue / h.orders : 0,
      ordersPercentage: totalOrders > 0 ? (h.orders / totalOrders * 100) : 0,
      revenuePercentage: totalRevenue > 0 ? (h.revenue / totalRevenue * 100) : 0
    }));

    // Identificar picos
    const peakHour = hourlyData.reduce((max, h) =>
      h.orders > max.orders ? h : max, { orders: 0 }
    );

    const peakRevenueHour = hourlyData.reduce((max, h) =>
      h.revenue > max.revenue ? h : max, { revenue: 0 }
    );

    // Horários com vendas
    const activeHours = hourlyData.filter(h => h.orders > 0);

    return {
      summary: {
        totalOrders,
        totalRevenue,
        peakHour: peakHour.hourLabel,
        peakOrders: peakHour.orders,
        peakRevenueHour: peakRevenueHour.hourLabel,
        peakRevenue: peakRevenueHour.revenue,
        activeHoursCount: activeHours.length,
        period: { startDate, endDate }
      },
      hourlyData,
      peakAnalysis: {
        morningPeak: this.getTimePeriodStats(hourlyData, 6, 12),
        afternoonPeak: this.getTimePeriodStats(hourlyData, 12, 18),
        eveningPeak: this.getTimePeriodStats(hourlyData, 18, 24),
        nightPeak: this.getTimePeriodStats(hourlyData, 0, 6)
      }
    };
  }

  /**
   * DRE Simplificado (Demonstração de Resultado)
   * Relatório financeiro consolidado
   */
  async getDREReport({ startDate, endDate }) {
    const whereClause = {
      status: { [Op.notIn]: ['cancelled'] }
    };

    if (startDate) {
      whereClause.createdAt = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        [Op.lte]: new Date(endDate)
      };
    }

    // Buscar pedidos
    const orders = await Order.findAll({
      where: {
        ...whereClause,
        paymentStatus: 'completed'
      },
      attributes: ['id', 'total', 'subtotal', 'serviceFee', 'taxes', 'paymentMethod']
    });

    // Buscar caixas fechados no período
    const cashierWhereClause = {
      status: 'closed'
    };

    if (startDate) {
      cashierWhereClause.closedAt = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      cashierWhereClause.closedAt = {
        ...cashierWhereClause.closedAt,
        [Op.lte]: new Date(endDate)
      };
    }

    const cashiers = await Cashier.findAll({
      where: cashierWhereClause,
      attributes: ['id', 'totalSales', 'totalDeposits', 'totalWithdrawals', 'closingAmount']
    });

    // Calcular totais
    let receitaBruta = 0;
    let taxaServico = 0;
    let impostos = 0;

    orders.forEach(order => {
      receitaBruta += parseFloat(order.subtotal);
      taxaServico += parseFloat(order.serviceFee);
      impostos += parseFloat(order.taxes || 0);
    });

    // Movimentações do caixa
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let cashSales = 0;

    cashiers.forEach(cashier => {
      totalDeposits += parseFloat(cashier.totalDeposits);
      totalWithdrawals += parseFloat(cashier.totalWithdrawals);
      cashSales += parseFloat(cashier.totalSales);
    });

    // Cálculos DRE simplificados
    const receitaLiquida = receitaBruta + taxaServico;

    // Estimativas de custos (placeholder - seria customizado pelo cliente)
    const cmvEstimado = receitaBruta * 0.30; // 30% custo das mercadorias vendidas
    const lucroOperacionalBruto = receitaLiquida - cmvEstimado;

    // Despesas operacionais estimadas
    const despesasOperacionais = receitaLiquida * 0.25; // 25% despesas operacionais
    const lucroOperacionalLiquido = lucroOperacionalBruto - despesasOperacionais;

    // Margem de lucro
    const margemBruta = receitaLiquida > 0 ? (lucroOperacionalBruto / receitaLiquida * 100) : 0;
    const margemLiquida = receitaLiquida > 0 ? (lucroOperacionalLiquido / receitaLiquida * 100) : 0;

    return {
      periodo: { startDate, endDate },
      receitas: {
        receitaBruta,
        taxaServico,
        impostos,
        receitaLiquida,
        totalPedidos: orders.length
      },
      custos: {
        cmvEstimado,
        percentualCMV: 30,
        nota: 'CMV estimado em 30% - ajustar conforme dados reais'
      },
      lucroOperacional: {
        bruto: lucroOperacionalBruto,
        despesasOperacionais,
        percentualDespesas: 25,
        liquido: lucroOperacionalLiquido,
        nota: 'Despesas estimadas em 25% - ajustar conforme dados reais'
      },
      margens: {
        bruta: margemBruta,
        liquida: margemLiquida
      },
      fluxoCaixa: {
        totalCaixasFechados: cashiers.length,
        vendasEmDinheiro: cashSales,
        suprimentos: totalDeposits,
        sangrias: totalWithdrawals
      },
      indicadores: {
        ticketMedio: orders.length > 0 ? receitaLiquida / orders.length : 0,
        receitaPorDia: this.calculateDailyAverage(startDate, endDate, receitaLiquida),
        pedidosPorDia: this.calculateDailyAverage(startDate, endDate, orders.length)
      }
    };
  }

  // Métodos auxiliares
  getPaymentMethodLabel(method) {
    const labels = {
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      pix: 'PIX',
      apple_pay: 'Apple Pay',
      cash: 'Dinheiro',
      unknown: 'Não informado'
    };
    return labels[method] || method;
  }

  getCategoryLabel(category) {
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
  }

  getTimePeriodStats(hourlyData, startHour, endHour) {
    const periodData = hourlyData.filter(h => h.hour >= startHour && h.hour < endHour);
    const totalOrders = periodData.reduce((sum, h) => sum + h.orders, 0);
    const totalRevenue = periodData.reduce((sum, h) => sum + h.revenue, 0);

    return {
      label: this.getTimePeriodLabel(startHour, endHour),
      orders: totalOrders,
      revenue: totalRevenue,
      averageTicket: totalOrders > 0 ? totalRevenue / totalOrders : 0
    };
  }

  getTimePeriodLabel(startHour, endHour) {
    if (startHour === 6 && endHour === 12) return 'Manhã (6h-12h)';
    if (startHour === 12 && endHour === 18) return 'Tarde (12h-18h)';
    if (startHour === 18 && endHour === 24) return 'Noite (18h-24h)';
    if (startHour === 0 && endHour === 6) return 'Madrugada (0h-6h)';
    return `${startHour}h-${endHour}h`;
  }

  calculateDailyAverage(startDate, endDate, total) {
    if (!startDate || !endDate) return total;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    return total / days;
  }
}

module.exports = new ReportService();
