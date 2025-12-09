/**
 * Migration: Create messages table
 * Sprint 56: Chat staff-cliente
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Verificar se a tabela já existe
      const tables = await queryInterface.showAllTables();

      if (tables.includes('messages')) {
        console.log('⚠️ Tabela messages já existe, pulando criação');
        await transaction.commit();
        return;
      }

      await queryInterface.createTable('messages', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        orderId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'orders',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        senderId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        senderType: {
          type: Sequelize.ENUM('cliente', 'staff', 'sistema'),
          allowNull: false,
          defaultValue: 'cliente'
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        messageType: {
          type: Sequelize.ENUM('text', 'status_update', 'system', 'image'),
          allowNull: false,
          defaultValue: 'text'
        },
        isRead: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        readAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
        metadata: {
          type: Sequelize.JSON,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // Adicionar índices
      await queryInterface.addIndex('messages', ['orderId'], { transaction });
      await queryInterface.addIndex('messages', ['senderId'], { transaction });
      await queryInterface.addIndex('messages', ['createdAt'], { transaction });

      await transaction.commit();
      console.log('✅ Tabela messages criada com sucesso');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Erro na migration:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('messages', { transaction });
      await transaction.commit();
      console.log('✅ Tabela messages removida');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
