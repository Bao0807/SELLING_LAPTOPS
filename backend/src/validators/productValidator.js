'use strict';
const { check } = require('express-validator');

exports.createProductValidator = [
  check('name', 'Product name is required').trim().not().isEmpty(),
  check('price', 'Price must be a positive number').isNumeric({ no_symbols: false }).custom(v => v > 0),
  check('stock_quantity', 'Stock quantity must be 0 or more').optional().isInt({ min: 0 }),
  check('category_id', 'Category ID must be a number').optional().isNumeric()
];

exports.updateProductValidator = [
  check('price', 'Price must be a positive number').optional().isNumeric().custom(v => v > 0),
  check('stock_quantity', 'Stock quantity must be 0 or more').optional().isInt({ min: 0 }),
  check('discount_price', 'Discount price must be a positive number').optional().isNumeric().custom(v => v > 0)
];
