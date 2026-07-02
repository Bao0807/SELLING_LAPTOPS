'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
      Product.hasMany(models.ProductImage, { foreignKey: 'product_id', as: 'images' });
      Product.hasMany(models.CartItem, { foreignKey: 'product_id', as: 'cartItems' });
      Product.hasMany(models.WishlistItem, { foreignKey: 'product_id', as: 'wishlistItems' });
      Product.hasMany(models.OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
      Product.hasMany(models.Review, { foreignKey: 'product_id', as: 'reviews' });
    }
  }
  Product.init({
    name:           { type: DataTypes.STRING,  allowNull: false },
    slug:           { type: DataTypes.STRING,  allowNull: false, unique: true },
    description:    DataTypes.TEXT,
    brand:          DataTypes.STRING,
    cpu:            DataTypes.STRING,
    ram:            DataTypes.STRING,
    storage:        DataTypes.STRING,
    gpu:            DataTypes.STRING,
    display:        DataTypes.STRING,
    battery:        DataTypes.STRING,
    weight:         DataTypes.STRING,
    price:          { type: DataTypes.BIGINT, allowNull: false },
    discount_price: DataTypes.BIGINT,
    stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    thumbnail:      DataTypes.STRING,
    is_featured:    { type: DataTypes.BOOLEAN, defaultValue: false },
    category_id:    DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};