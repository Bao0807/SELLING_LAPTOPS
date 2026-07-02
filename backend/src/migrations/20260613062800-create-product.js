'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id:             { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name:           { type: Sequelize.STRING,  allowNull: false },
      slug:           { type: Sequelize.STRING,  allowNull: false, unique: true },
      description:    { type: Sequelize.TEXT },
      brand:          { type: Sequelize.STRING },
      cpu:            { type: Sequelize.STRING },
      ram:            { type: Sequelize.STRING },
      storage:        { type: Sequelize.STRING },
      gpu:            { type: Sequelize.STRING },
      display:        { type: Sequelize.STRING },
      battery:        { type: Sequelize.STRING },
      weight:         { type: Sequelize.STRING },
      price:          { type: Sequelize.BIGINT,  allowNull: false },
      discount_price: { type: Sequelize.BIGINT },
      stock_quantity: { type: Sequelize.INTEGER, defaultValue: 0 },
      thumbnail:      { type: Sequelize.STRING },
      is_featured:    { type: Sequelize.BOOLEAN, defaultValue: false },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};