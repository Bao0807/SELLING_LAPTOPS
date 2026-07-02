'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vouchers', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      code: { type: Sequelize.STRING, allowNull: false, unique: true },
      discount_type: { type: Sequelize.STRING, allowNull: false },
      discount_value: { type: Sequelize.INTEGER, allowNull: false },
      minimum_order_amount: { type: Sequelize.INTEGER, defaultValue: 0 },
      usage_limit: { type: Sequelize.INTEGER, defaultValue: 0 },
      used_count: { type: Sequelize.INTEGER, defaultValue: 0 },
      start_date: { type: Sequelize.DATE, allowNull: false },
      end_date: { type: Sequelize.DATE, allowNull: false },
      status: { type: Sequelize.STRING, defaultValue: 'active' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vouchers');
  }
};