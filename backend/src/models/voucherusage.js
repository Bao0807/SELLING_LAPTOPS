'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VoucherUsage extends Model {
    static associate(models) {
      VoucherUsage.belongsTo(models.User, { foreignKey: 'user_id' });
      VoucherUsage.belongsTo(models.Voucher, { foreignKey: 'voucher_id' });
      VoucherUsage.belongsTo(models.Order, { foreignKey: 'order_id' });
    }
  }
  VoucherUsage.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    voucher_id: { type: DataTypes.INTEGER, allowNull: false },
    order_id: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'VoucherUsage',
  });
  return VoucherUsage;
};