'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
      Order.belongsTo(models.Voucher, { foreignKey: 'voucher_id', as: 'voucher' });
      Order.hasOne(models.VoucherUsage, { foreignKey: 'order_id' });
    }
  }
  Order.init({
    user_id:          { type: DataTypes.INTEGER, allowNull: false },
    total_amount:     { type: DataTypes.BIGINT,  allowNull: false },
    subtotal_amount:  { type: DataTypes.BIGINT,  allowNull: false, defaultValue: 0 },
    discount_amount:  { type: DataTypes.BIGINT,  allowNull: false, defaultValue: 0 },
    shipping_fee:     { type: DataTypes.BIGINT,  allowNull: false, defaultValue: 0 },
    status:           { type: DataTypes.STRING,  defaultValue: 'pending' },
    payment_method:   { type: DataTypes.STRING,  allowNull: false },
    shipping_address: { type: DataTypes.TEXT,    allowNull: false },
    phone:            { type: DataTypes.STRING,  allowNull: false },
    full_name:        { type: DataTypes.STRING,  allowNull: false },
    voucher_id:       DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
