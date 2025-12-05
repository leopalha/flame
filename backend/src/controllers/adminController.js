const { User, Order, OrderItem, Product, Table } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AdminController {
  // Dashboard principal com métricas gerais
  async getDashboard(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      
      // Métricas de hoje
      const [
        todayOrders,
        yesterdayOrders,
        thisMonthOrders,
        lastMonthOrders,
        totalUsers,
        activeUsers,
        totalProducts,
        activeProducts,
        totalTables,
        availableTables
      ] = await Promise.all([
        // Pedidos de hoje
        Order.findAll({
          where: {
            createdAt: { [Op.gte]: today }
          }
        }),
        // Pedidos de ontem
        Order.findAll({
          where: {
            createdAt: { 
              [Op.gte]: yesterday,
              [Op.lt]: today
            }
          }
        }),
        // Pedidos deste mês
        Order.findAll({
          where: {
            createdAt: { [Op.gte]: thisMonth }
          }
        }),
        // Pedidos do mês passado
        Order.findAll({
          where: {
            createdAt: { 
              [Op.gte]: lastMonth,
              [Op.lt]: thisMonth
            }
          }
        }),
        // Total de usuários
        User.count(),
        // Usuários ativos (últimos 30 dias)
        User.count({
          where: {
            lastLogin: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        // Total de produtos
        Product.count(),
        // Produtos ativos
        Product.count({ where: { isActive: true } }),
        // Total de mesas
        Table.count(),
        // Mesas disponíveis
        Table.count({ where: { status: 'available', isActive: true } })
      ]);

      // Cálculos de receita
      const todayRevenue = todayOrders
        .filter(order => order.paymentStatus === 'completed')
        .reduce((sum, order) => sum + parseFloat(order.total), 0);

      const yesterdayRevenue = yesterdayOrders
        .filter(order => order.paymentStatus === 'completed')
        .reduce((sum, order) => sum + parseFloat(order.total), 0);

      const thisMonthRevenue = thisMonthOrders
        .filter(order => order.paymentStatus === 'completed')
        .reduce((sum, order) => sum + parseFloat(order.total), 0);

      const lastMonthRevenue = lastMonthOrders
        .filter(order => order.paymentStatus === 'completed')
        .reduce((sum, order) => sum + parseFloat(order.total), 0);

      // Cálculos de crescimento
      const revenueGrowth = yesterdayRevenue > 0 
        ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1)
        : 0;

      const ordersGrowth = yesterdayOrders.length > 0
        ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length * 100).toFixed(1)
        : 0;

      const monthlyRevenueGrowth = lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
        : 0;

      // Ticket médio
      const todayAverageTicket = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;

      // Status dos pedidos de hoje
      const orderStatusToday = await Order.findAll({
        attributes: [
          'status',
          [fn('COUNT', col('id')), 'count'],
          [fn('SUM', col('total')), 'revenue']
        ],
        where: {
          createdAt: { [Op.gte]: today }
        },
        group: ['status'],
        raw: true
      });

      // Taxa de ocupação das mesas
      const occupancyRate = totalTables > 0 
        ? ((totalTables - availableTables) / totalTables * 100).toFixed(1)
        : 0;

      res.status(200).json({
        success: true,
        data: {
          revenue: {
            today: todayRevenue.toFixed(2),
            yesterday: yesterdayRevenue.toFixed(2),
            thisMonth: thisMonthRevenue.toFixed(2),
            lastMonth: lastMonthRevenue.toFixed(2),
            growth: parseFloat(revenueGrowth),
            monthlyGrowth: parseFloat(monthlyRevenueGrowth)
          },
          orders: {
            today: todayOrders.length,
            yesterday: yesterdayOrders.length,
            thisMonth: thisMonthOrders.length,
            lastMonth: lastMonthOrders.length,
            growth: parseFloat(ordersGrowth),
            averageTicket: todayAverageTicket.toFixed(2),
            statusBreakdown: orderStatusToday
          },
          users: {
            total: totalUsers,
            active: activeUsers,
            activeRate: totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(1) : 0
          },
          products: {
            total: totalProducts,
            active: activeProducts,
            activeRate: totalProducts > 0 ? (activeProducts / totalProducts * 100).toFixed(1) : 0
          },
          tables: {
            total: totalTables,
            available: availableTables,
            occupied: totalTables - availableTables,
            occupancyRate: parseFloat(occupancyRate)
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Relatórios de vendas
  async getSalesReport(req, res) {
    try {
      const { startDate, endDate, groupBy = 'day' } = req.query;

      let start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      let end = endDate ? new Date(endDate) : new Date();

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      let dateFormat;
      switch (groupBy) {
        case 'hour':
          dateFormat = '%Y-%m-%d %H:00:00';
          break;
        case 'day':
          dateFormat = '%Y-%m-%d';
          break;
        case 'week':
          dateFormat = '%Y-%u';
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        default:
          dateFormat = '%Y-%m-%d';
      }

      const salesData = await Order.findAll({
        attributes: [
          [fn('DATE_FORMAT', col('createdAt'), dateFormat), 'period'],
          [fn('COUNT', col('id')), 'totalOrders'],
          [fn('SUM', col('total')), 'totalRevenue'],
          [fn('AVG', col('total')), 'averageTicket']
        ],
        where: {
          createdAt: {
            [Op.between]: [start, end]
          },
          paymentStatus: 'completed'
        },
        group: [fn('DATE_FORMAT', col('createdAt'), dateFormat)],
        order: [[fn('DATE_FORMAT', col('createdAt'), dateFormat), 'ASC']],
        raw: true
      });

      // Produtos mais vendidos no período
      const topProducts = await OrderItem.findAll({
        attributes: [
          'productName',
          'productCategory',
          [fn('SUM', col('quantity')), 'totalQuantity'],
          [fn('SUM', col('subtotal')), 'totalRevenue']
        ],
        include: [
          {
            model: Order,
            as: 'order',
            where: {
              createdAt: {
                [Op.between]: [start, end]
              },
              paymentStatus: 'completed'
            },
            attributes: []
          }
        ],
        group: ['productName', 'productCategory'],
        order: [[fn('SUM', col('quantity')), 'DESC']],
        limit: 10,
        raw: true
      });

      // Métodos de pagamento
      const paymentMethods = await Order.findAll({
        attributes: [
          'paymentMethod',
          [fn('COUNT', col('id')), 'count'],
          [fn('SUM', col('total')), 'revenue']
        ],
        where: {
          createdAt: {
            [Op.between]: [start, end]
          },
          paymentStatus: 'completed'
        },
        group: ['paymentMethod'],
        raw: true
      });

      res.status(200).json({
        success: true,
        data: {
          period: { start, end },
          salesData,
          topProducts,
          paymentMethods
        }
      });
    } catch (error) {
      console.error('Erro ao gerar relatório de vendas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Gerenciamento de usuários
  async getUsers(req, res) {
    try {
      const { role, status, search, page = 1, limit = 20 } = req.query;

      const where = {};

      if (role) where.role = role;
      if (status) where.isActive = status === 'active';
      if (search) {
        where[Op.or] = [
          { nome: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { celular: { [Op.like]: `%${search}%` } }
        ];
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows: users } = await User.findAndCountAll({
        where,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      res.status(200).json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalUsers: count
          }
        }
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Criar usuário funcionário
  async createEmployee(req, res) {
    try {
      const { nome, email, celular, role, password } = req.body;

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { celular }]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email ou celular já cadastrado'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        nome,
        email,
        celular,
        password: hashedPassword,
        role,
        isEmailVerified: true,
        isCelularVerified: true,
        isActive: true
      });

      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'Funcionário criado com sucesso',
        data: { user: userResponse }
      });
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar usuário
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Se está atualizando senha, fazer hash
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      // Não permitir alterar role se não for admin
      if (updateData.role && req.user.role !== 'admin') {
        delete updateData.role;
      }

      await user.update(updateData);

      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: { user: userResponse }
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Ativar/Desativar usuário
  async toggleUserStatus(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Não permitir desativar próprio usuário
      if (user.id === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível desativar próprio usuário'
        });
      }

      await user.update({ isActive: !user.isActive });

      res.status(200).json({
        success: true,
        message: `Usuário ${user.isActive ? 'ativado' : 'desativado'} com sucesso`,
        data: { user }
      });
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Configurações do sistema
  async getSystemSettings(req, res) {
    try {
      const settings = {
        minimumOrderValue: process.env.MINIMUM_ORDER_VALUE || '15.00',
        maxDeliveryDistance: process.env.MAX_DELIVERY_DISTANCE || '10',
        deliveryFee: process.env.DELIVERY_FEE || '5.00',
        businessHours: {
          monday: { open: '18:00', close: '02:00' },
          tuesday: { open: '18:00', close: '02:00' },
          wednesday: { open: '18:00', close: '02:00' },
          thursday: { open: '18:00', close: '02:00' },
          friday: { open: '18:00', close: '03:00' },
          saturday: { open: '18:00', close: '03:00' },
          sunday: { open: '18:00', close: '02:00' }
        },
        acceptingOrders: true,
        maintenanceMode: false
      };

      res.status(200).json({
        success: true,
        data: { settings }
      });
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Logs do sistema
  async getSystemLogs(req, res) {
    try {
      const { level, startDate, endDate, page = 1, limit = 50 } = req.query;

      // Este seria conectado ao seu sistema de logs (Winston, etc)
      // Por enquanto, retornando logs simulados
      const logs = [
        {
          id: 1,
          timestamp: new Date(),
          level: 'info',
          message: 'Usuário admin logou no sistema',
          meta: { userId: req.user.id, ip: req.ip }
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 60000),
          level: 'error',
          message: 'Falha na conexão com serviço de pagamento',
          meta: { error: 'Connection timeout' }
        }
      ];

      res.status(200).json({
        success: true,
        data: {
          logs,
          pagination: {
            currentPage: parseInt(page),
            totalPages: 1,
            totalLogs: logs.length
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Backup dos dados
  async createBackup(req, res) {
    try {
      // Implementar lógica de backup do banco de dados
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `flame_backup_${timestamp}`;

      // Simulando criação de backup
      console.log(`Criando backup: ${backupName}`);

      res.status(200).json({
        success: true,
        message: 'Backup criado com sucesso',
        data: { 
          backupName,
          timestamp: new Date(),
          size: '15.2MB' // Simulado
        }
      });
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Estatísticas avançadas
  async getAdvancedStats(req, res) {
    try {
      const { period = '30' } = req.query; // últimos N dias

      const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

      // Horários de pico
      const peakHours = await Order.findAll({
        attributes: [
          [fn('HOUR', col('createdAt')), 'hour'],
          [fn('COUNT', col('id')), 'orderCount']
        ],
        where: {
          createdAt: { [Op.gte]: startDate },
          paymentStatus: 'completed'
        },
        group: [fn('HOUR', col('createdAt'))],
        order: [[fn('COUNT', col('id')), 'DESC']],
        raw: true
      });

      // Tempo médio de preparo por categoria
      const preparationTimes = await Order.findAll({
        attributes: [
          [fn('AVG', col('preparationTime')), 'avgTime']
        ],
        include: [
          {
            model: OrderItem,
            as: 'items',
            attributes: ['productCategory'],
            group: ['productCategory']
          }
        ],
        where: {
          createdAt: { [Op.gte]: startDate },
          status: 'delivered'
        },
        group: ['items.productCategory'],
        raw: true
      });

      // Taxa de cancelamento
      const totalOrdersPeriod = await Order.count({
        where: { createdAt: { [Op.gte]: startDate } }
      });

      const cancelledOrders = await Order.count({
        where: { 
          createdAt: { [Op.gte]: startDate },
          status: 'cancelled'
        }
      });

      const cancellationRate = totalOrdersPeriod > 0 
        ? (cancelledOrders / totalOrdersPeriod * 100).toFixed(2)
        : 0;

      // Clientes mais frequentes
      const topCustomers = await Order.findAll({
        attributes: [
          'userId',
          [fn('COUNT', col('id')), 'orderCount'],
          [fn('SUM', col('total')), 'totalSpent']
        ],
        include: [
          {
            model: User,
            as: 'customer',
            attributes: ['nome', 'celular']
          }
        ],
        where: {
          createdAt: { [Op.gte]: startDate },
          paymentStatus: 'completed'
        },
        group: ['userId'],
        order: [[fn('COUNT', col('id')), 'DESC']],
        limit: 10
      });

      res.status(200).json({
        success: true,
        data: {
          period: parseInt(period),
          peakHours,
          preparationTimes,
          cancellationRate: parseFloat(cancellationRate),
          topCustomers
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas avançadas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new AdminController();