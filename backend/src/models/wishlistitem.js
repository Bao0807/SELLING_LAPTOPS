'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WishlistItem extends Model {
    static associate(models) {
      WishlistItem.belongsTo(models.User, { foreignKey: 'user_id' });
      WishlistItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    }
  }
  WishlistItem.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'WishlistItem',
  });
  return WishlistItem;
};