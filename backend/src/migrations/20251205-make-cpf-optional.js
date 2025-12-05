'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make CPF column nullable
    await queryInterface.changeColumn('Users', 'cpf', {
      type: Sequelize.STRING(14),
      allowNull: true,
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to NOT NULL (only if all rows have CPF)
    await queryInterface.changeColumn('Users', 'cpf', {
      type: Sequelize.STRING(14),
      allowNull: false,
      unique: true
    });
  }
};
