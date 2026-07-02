'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    static associate(models) {
      Voucher.hasMany(models.VoucherUsage, { foreignKey: 'voucher_id' });
      Voucher.hasMany(models.Order, { foreignKey: 'voucher_id' });
    }
  }
  Voucher.init({
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    discount_type: { type: DataTypes.STRING, allowNull: false },
    discount_value: { type: DataTypes.INTEGER, allowNull: false },
    minimum_order_amount: { type: DataTypes.INTEGER, defaultValue: 0 },
    usage_limit: { type: DataTypes.INTEGER, defaultValue: 0 },
    used_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'active' }
  }, {
    sequelize,
    modelName: 'Voucher',
  });
  return Voucher;
};