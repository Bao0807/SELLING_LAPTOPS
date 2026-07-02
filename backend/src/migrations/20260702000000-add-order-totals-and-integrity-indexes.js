'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'subtotal_amount', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('Orders', 'discount_amount', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('Orders', 'shipping_fee', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.sequelize.query(`
      UPDATE Orders
      SET subtotal_amount = total_amount
      WHERE subtotal_amount = 0
    `);

    await queryInterface.sequelize.query(`
      DELETE c1 FROM CartItems c1
      INNER JOIN CartItems c2
        ON c1.user_id = c2.user_id
       AND c1.product_id = c2.product_id
       AND c1.id > c2.id
    `);
    await queryInterface.sequelize.query(`
      DELETE w1 FROM WishlistItems w1
      INNER JOIN WishlistItems w2
        ON w1.user_id = w2.user_id
       AND w1.product_id = w2.product_id
       AND w1.id > w2.id
    `);
    await queryInterface.sequelize.query(`
      DELETE r1 FROM Reviews r1
      INNER JOIN Reviews r2
        ON r1.user_id = r2.user_id
       AND r1.product_id = r2.product_id
       AND r1.id > r2.id
    `);

    await queryInterface.addIndex('CartItems', ['user_id', 'product_id'], {
      unique: true,
      name: 'cart_items_user_product_unique'
    });
    await queryInterface.addIndex('WishlistItems', ['user_id', 'product_id'], {
      unique: true,
      name: 'wishlist_items_user_product_unique'
    });
    await queryInterface.addIndex('Reviews', ['user_id', 'product_id'], {
      unique: true,
      name: 'reviews_user_product_unique'
    });

    await queryInterface.addIndex('Products', ['category_id'], { name: 'products_category_idx' });
    await queryInterface.addIndex('Products', ['brand'], { name: 'products_brand_idx' });
    await queryInterface.addIndex('Products', ['price'], { name: 'products_price_idx' });
    await queryInterface.addIndex('Products', ['discount_price'], { name: 'products_discount_price_idx' });
    await queryInterface.addIndex('Orders', ['status'], { name: 'orders_status_idx' });
    await queryInterface.addIndex('Orders', ['user_id', 'createdAt'], { name: 'orders_user_created_idx' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Orders', 'orders_user_created_idx');
    await queryInterface.removeIndex('Orders', 'orders_status_idx');
    await queryInterface.removeIndex('Products', 'products_discount_price_idx');
    await queryInterface.removeIndex('Products', 'products_price_idx');
    await queryInterface.removeIndex('Products', 'products_brand_idx');
    await queryInterface.removeIndex('Products', 'products_category_idx');
    await queryInterface.removeIndex('Reviews', 'reviews_user_product_unique');
    await queryInterface.removeIndex('WishlistItems', 'wishlist_items_user_product_unique');
    await queryInterface.removeIndex('CartItems', 'cart_items_user_product_unique');
    await queryInterface.removeColumn('Orders', 'shipping_fee');
    await queryInterface.removeColumn('Orders', 'discount_amount');
    await queryInterface.removeColumn('Orders', 'subtotal_amount');
  }
};
