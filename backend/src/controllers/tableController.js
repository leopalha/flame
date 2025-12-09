const { Table, Order, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const QRCode = require('qrcode');

class TableController {
  // Listar todas as mesas
  async getAllTables(req, res) {
    try {
      const { status, area, page = 1, limit = 50 } = req.query;

      const where = {};

      if (status) {
        where.status = status;
      }

      if (area) {
        where.area = area;
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows: tables } = await Table.findAndCountAll({
        where,
        include: [
          {
            model: Order,
            as: 'orders',
            where: {
              status: {
                [Op.in]: ['pending', 'confirmed', 'preparing', 'ready', 'on_way']
              }
            },
            required: false,
            include: [
              {
                model: User,
                as: 'customer',
                attributes: ['nome', 'celular']
              }
            ]
          }
        ],
        order: [['number', 'ASC']],
        limit: parseInt(limit),
        offset
      });

      res.status(200).json({
        success: true,
        data: {
          tables,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalTables: count
          }
        }
      });
    } catch (error) {
      console.error('Erro ao listar mesas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Buscar mesa por ID
  async getTableById(req, res) {
    try {
      const { id } = req.params;

      const table = await Table.findByPk(id, {
        include: [
          {
            model: Order,
            as: 'orders',
            where: {
              status: {
                [Op.in]: ['pending', 'confirmed', 'preparing', 'ready', 'on_way']
              }
            },
            required: false,
            include: [
              {
                model: User,
                as: 'customer',
                attributes: ['nome', 'celular']
              }
            ]
          }
        ]
      });

      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Mesa não encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: { table }
      });
    } catch (error) {
      console.error('Erro ao buscar mesa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Buscar mesa por número
  async getTableByNumber(req, res) {
    try {
      const { number } = req.params;

      // Busca simples - apenas a mesa, sem pedidos
      const table = await Table.findOne({
        where: { number: parseInt(number) }
      });

      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Mesa não encontrada'
        });
      }

      if (!table.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Mesa indisponível'
        });
      }

      res.status(200).json({
        success: true,
        data: { table }
      });
    } catch (error) {
      console.error('Erro ao buscar mesa por número:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Criar nova mesa
  async createTable(req, res) {
    try {
      const {
        number,
        name,
        capacity,
        area,
        description,
        isActive = true,
        x,
        y
      } = req.body;

      // Verificar se já existe mesa com esse número
      const existingTable = await Table.findOne({ where: { number } });
      if (existingTable) {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma mesa com esse número'
        });
      }

      const table = await Table.create({
        number,
        name,
        capacity,
        area,
        description,
        isActive,
        position: x && y ? { x, y } : null
      });

      // Gerar QR Code para a mesa - URL correta para cardápio com mesa
      const qrCodeUrl = `${process.env.FRONTEND_URL}/cardapio?mesa=${table.number}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      await table.update({ qrCode: qrCodeDataURL });

      res.status(201).json({
        success: true,
        message: 'Mesa criada com sucesso',
        data: { table }
      });
    } catch (error) {
      console.error('Erro ao criar mesa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar mesa
  async updateTable(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const table = await Table.findByPk(id);

      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Mesa não encontrada'
        });
      }

      // Se mudou o número, verificar se não há conflito
      if (updateData.number && updateData.number !== table.number) {
        const existingTable = await Table.findOne({
          where: { 
            number: updateData.number,
            id: { [Op.ne]: id }
          }
        });

        if (existingTable) {
          return res.status(400).json({
            success: false,
            message: 'Já existe uma mesa com esse número'
          });
        }

        // Regenerar QR Code se mudou o número - URL correta para cardápio com mesa
        const qrCodeUrl = `${process.env.FRONTEND_URL}/cardapio?mesa=${updateData.number}`;
        const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        updateData.qrCode = qrCodeDataURL;
      }

      // Tratar posição se foi enviada
      if (updateData.x !== undefined && updateData.y !== undefined) {
        updateData.position = { x: updateData.x, y: updateData.y };
        delete updateData.x;
        delete updateData.y;
      }

      await table.update(updateData);

      res.status(200).json({
        success: true,
        message: 'Mesa atualizada com sucesso',
        data: { table }
      });
    } catch (error) {
      console.error('Erro ao atualizar mesa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Deletar mesa
  async deleteTable(req, res) {
    try {
      const { id } = req.params;

      const table = await Table.findByPk(id);

      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Mesa não encontrada'
        });
      }

      // Verificar se mesa tem pedidos ativos
      const activeOrder = await Order.findOne({
        where: {
          tableId: id,
          status: {
            [Op.in]: ['pending', 'confirmed', 'preparing', 'ready', 'on_way']
          }
        }
      });

      if (activeOrder) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível excluir mesa com pedidos ativos'
        });
      }

      await table.destroy();

      res.status(200).json({
        success: true,
        message: 'Mesa excluída com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir mesa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Ativar/Desativar mesa
  async toggleTableStatus(req, res) {
    try {
      const { id } = req.params;

      const table = await Table.findByPk(id);

      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Mesa não encontrada'
        });
      }

      // Se está desativando, verificar se não tem pedidos ativos
      if (table.isActive) {
        const activeOrder = await Order.findOne({
          where: {
            tableId: id,
            status: {
              [Op.in]: ['pending', 'confirmed', 'preparing', 'ready', 'on_way']
            }
          }
        });

        if (activeOrder) {
          return res.status(400).json({
            success: false,
            message: 'Não é possível desativar mesa com pedidos ativos'
          });
        }
      }

      await table.update({
        isActive: !table.isActive,
        status: !table.isActive ? 'available' : 'unavailable'
      });

      res.status(200).json({
        success: true,
        message: `Mesa ${table.isActive ? 'ativada' : 'desativada'} com sucesso`,
        data: { table }
      });
    } catch (error) {
      console.error('Erro ao alterar status da mesa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar status da mesa (ocupada, livre, etc)
  async updateTableStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['available', 'occupied', 'reserved', 'cleaning', 'unavailable'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status inválido'
        });
      }

      const table = await Table.findByPk(id);

      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Mesa não encontrada'
        });
      }

      await table.update({ status });

      res.status(200).json({
        success: true,
        message: 'Status da mesa atualizado com sucesso',
        data: { table }
      });
    } catch (error) {
      console.error('Erro ao atualizar status da mesa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Reservar mesa
  async reserveTable(req, res) {
    try {
      const { id } = req.params;
      const { customerName, customerPhone, reservationTime, notes } = req.body;

      const table = await Table.findByPk(id);

      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Mesa não encontrada'
        });
      }

      if (!table.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Mesa não está disponível para reserva'
        });
      }

      if (table.status !== 'available') {
        return res.status(400).json({
          success: false,
          message: 'Mesa não está disponível no momento'
        });
      }

      await table.update({
        status: 'reserved',
        reservationData: {
          customerName,
          customerPhone,
          reservationTime,
          notes,
          reservedAt: new Date(),
          reservedBy: req.user?.id || null
        }
      });

      res.status(200).json({
        success: true,
        message: 'Mesa reservada com sucesso',
        data: { table }
      });
    } catch (error) {
      console.error('Erro ao reservar mesa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Cancelar reserva
  async cancelReservation(req, res) {
    try {
      const { id } = req.params;

      const table = await Table.findByPk(id);

      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Mesa não encontrada'
        });
      }

      if (table.status !== 'reserved') {
        return res.status(400).json({
          success: false,
          message: 'Mesa não está reservada'
        });
      }

      await table.update({
        status: 'available',
        reservationData: null
      });

      res.status(200).json({
        success: true,
        message: 'Reserva cancelada com sucesso',
        data: { table }
      });
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Gerar QR Code para mesa específica
  async generateQRCode(req, res) {
    try {
      const { id } = req.params;

      const table = await Table.findByPk(id);

      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Mesa não encontrada'
        });
      }

      // URL correta para cardápio com mesa pré-selecionada
      const qrCodeUrl = `${process.env.FRONTEND_URL}/cardapio?mesa=${table.number}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      await table.update({ qrCode: qrCodeDataURL });

      res.status(200).json({
        success: true,
        message: 'QR Code gerado com sucesso',
        data: {
          qrCode: qrCodeDataURL,
          url: qrCodeUrl
        }
      });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Estatísticas das mesas
  async getTablesStats(req, res) {
    try {
      const totalTables = await Table.count();
      const activeTables = await Table.count({ where: { isActive: true } });
      
      const tablesByStatus = await Table.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where: { isActive: true },
        group: ['status'],
        raw: true
      });

      const tablesByArea = await Table.findAll({
        attributes: ['area', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where: { isActive: true },
        group: ['area'],
        raw: true
      });

      // Ocupação atual
      const occupiedTables = await Table.count({
        where: { 
          isActive: true,
          status: 'occupied'
        }
      });

      const occupancyRate = activeTables > 0 ? (occupiedTables / activeTables * 100).toFixed(1) : 0;

      res.status(200).json({
        success: true,
        data: {
          totalTables,
          activeTables,
          occupiedTables,
          occupancyRate: parseFloat(occupancyRate),
          tablesByStatus,
          tablesByArea
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas das mesas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Listar áreas disponíveis
  async getAreas(req, res) {
    try {
      const areas = await Table.findAll({
        attributes: ['area'],
        where: {
          area: { [Op.ne]: null },
          isActive: true
        },
        group: ['area'],
        raw: true
      });

      const areaList = areas.map(item => item.area).filter(Boolean);

      res.status(200).json({
        success: true,
        data: { areas: areaList }
      });
    } catch (error) {
      console.error('Erro ao listar áreas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Sprint 56: Atualizar posições de múltiplas mesas (para mapa drag & drop)
  async updatePositions(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { positions } = req.body;

      if (!Array.isArray(positions) || positions.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Lista de posições é obrigatória'
        });
      }

      // Validar formato
      for (const pos of positions) {
        if (!pos.id || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Cada posição deve ter id, x e y'
          });
        }
      }

      // Atualizar cada mesa dentro da transação
      for (const pos of positions) {
        await Table.update(
          { position: { x: pos.x, y: pos.y } },
          { where: { id: pos.id }, transaction }
        );
      }

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: `${positions.length} posições atualizadas com sucesso`
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao atualizar posições:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new TableController();