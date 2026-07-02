'use strict';

const { Order, OrderItem, CartItem, Product, Voucher, VoucherUsage, User, sequelize } = require('../models');
const { Op } = require('sequelize');

const VALID_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
};
const FREE_SHIPPING_THRESHOLD = 5000000;
const STANDARD_SHIPPING_FEE = 50000;

const calculateShippingFee = (subtotal) => subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

const calculateVoucherDiscount = (voucher, subtotal) => {
  const rawDiscount = voucher.discount_type === 'percent'
    ? Math.round(subtotal * Number(voucher.discount_value) / 100)
    : Number(voucher.discount_value);
  return Math.min(Math.max(rawDiscount, 0), subtotal);
};

const validateOrderPayload = ({ payment_method, shipping_address, phone, full_name }) => {
  if (payment_method !== 'cod') return 'Only COD payment is supported';
  if (!shipping_address || !String(shipping_address).trim()) return 'Shipping address is required';
  if (!phone || !String(phone).trim()) return 'Phone is required';
  if (!full_name || !String(full_name).trim()) return 'Full name is required';
  return null;
};

const validateVoucherForOrder = async ({ voucher_code, subtotal, userId, transaction }) => {
  if (!voucher_code) return null;

  const voucher = await Voucher.findOne({
    where: { code: String(voucher_code).trim().toUpperCase() },
    transaction,
    lock: transaction.LOCK.UPDATE
  });

  if (!voucher) {
    const error = new Error('Voucher not found');
    error.statusCode = 400;
    throw error;
  }

  const now = new Date();
  if (voucher.status !== 'active' || now < voucher.start_date || now > voucher.end_date) {
    const error = new Error('Voucher is expired or inactive');
    error.statusCode = 400;
    throw error;
  }

  if (voucher.usage_limit > 0 && voucher.used_count >= voucher.usage_limit) {
    const error = new Error('Voucher usage limit reached');
    error.statusCode = 400;
    throw error;
  }

  if (subtotal < voucher.minimum_order_amount) {
    const error = new Error(`Minimum order amount for this voucher is ${voucher.minimum_order_amount}`);
    error.statusCode = 400;
    throw error;
  }

  const existingUsage = await VoucherUsage.findOne({
    where: { user_id: userId, voucher_id: voucher.id },
    transaction
  });
  if (existingUsage) {
    const error = new Error('You already used this voucher');
    error.statusCode = 400;
    throw error;
  }

  return voucher;
};

const restoreOrderInventoryAndVoucher = async (order, transaction) => {
  const items = await OrderItem.findAll({ where: { order_id: order.id }, transaction });

  await Promise.all(items.map((item) =>
    Product.increment('stock_quantity', {
      by: item.quantity,
      where: { id: item.product_id },
      transaction
    })
  ));

  if (order.voucher_id) {
    await Voucher.decrement('used_count', {
      by: 1,
      where: {
        id: order.voucher_id,
        used_count: { [Op.gt]: 0 }
      },
      transaction
    });
    await VoucherUsage.destroy({ where: { order_id: order.id }, transaction });
  }
};

const ensureStatusTransition = (currentStatus, nextStatus) => {
  if (!VALID_STATUSES.includes(nextStatus)) {
    return `Status must be one of: ${VALID_STATUSES.join(', ')}`;
  }
  if (currentStatus === nextStatus) return null;
  const allowed = STATUS_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(nextStatus)) {
    return `Cannot change order status from ${currentStatus} to ${nextStatus}`;
  }
  return null;
};

exports.createOrder = async (req, res, next) => {
  const { payment_method, shipping_address, phone, full_name, voucher_code } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const payloadError = validateOrderPayload({ payment_method, shipping_address, phone, full_name });
    if (payloadError) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: payloadError });
    }

    const cartItems = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product, as: 'product' }],
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let subtotal = 0;
    for (const item of cartItems) {
      if (!item.product) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: 'Product not found in cart' });
      }
      if (item.quantity <= 0) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: 'Cart item quantity must be positive' });
      }
      if (item.product.stock_quantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: `${item.product.name} is out of stock` });
      }
      subtotal += Number(item.product.discount_price || item.product.price) * item.quantity;
    }

    const appliedVoucher = await validateVoucherForOrder({
      voucher_code,
      subtotal,
      userId: req.user.id,
      transaction
    });
    const discount = appliedVoucher ? calculateVoucherDiscount(appliedVoucher, subtotal) : 0;
    const shippingFee = calculateShippingFee(subtotal);
    const total = Math.max(0, subtotal + shippingFee - discount);

    const order = await Order.create({
      user_id: req.user.id,
      subtotal_amount: subtotal,
      discount_amount: discount,
      shipping_fee: shippingFee,
      total_amount: total,
      payment_method,
      shipping_address: String(shipping_address).trim(),
      phone: String(phone).trim(),
      full_name: String(full_name).trim(),
      voucher_id: appliedVoucher ? appliedVoucher.id : null
    }, { transaction });

    await OrderItem.bulkCreate(cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.product.discount_price || item.product.price
    })), { transaction });

    for (const item of cartItems) {
      await Product.decrement('stock_quantity', {
        by: item.quantity,
        where: { id: item.product_id },
        transaction
      });
    }

    if (appliedVoucher) {
      await VoucherUsage.create({
        user_id: req.user.id,
        voucher_id: appliedVoucher.id,
        order_id: order.id
      }, { transaction });
      await appliedVoucher.increment('used_count', { transaction });
    }

    await CartItem.destroy({ where: { user_id: req.user.id }, transaction });
    await transaction.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['name', 'thumbnail', 'brand'] }] },
        { model: Voucher, as: 'voucher' }
      ]
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: fullOrder });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['name', 'thumbnail', 'brand'] }]
        },
        { model: Voucher, as: 'voucher' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, message: 'Orders retrieved', data: orders });
  } catch (error) { next(error); }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['name', 'thumbnail', 'brand'] }]
        },
        { model: Voucher, as: 'voucher' }
      ]
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order details', data: order });
  } catch (error) { next(error); }
};

exports.cancelMyOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      transaction,
      lock: transaction.LOCK.UPDATE
    });
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const transitionError = ensureStatusTransition(order.status, 'cancelled');
    if (transitionError) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: transitionError });
    }

    await restoreOrderInventoryAndVoucher(order, transaction);
    order.status = 'cancelled';
    await order.save({ transaction });
    await transaction.commit();

    res.json({ success: true, message: 'Order cancelled', data: order });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, q } = req.query;
    const safePage = Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const safeLimit = Math.min(Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 20, 100);
    const offset = (safePage - 1) * safeLimit;
    const where = {};

    if (status) where.status = status;
    if (q) {
      const keyword = String(q).trim();
      where[Op.or] = [
        { id: Number(keyword) || 0 },
        { full_name: { [Op.like]: `%${keyword}%` } },
        { phone: { [Op.like]: `%${keyword}%` } }
      ];
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['name', 'thumbnail'] }] },
        { model: User, as: 'user', attributes: ['full_name', 'email'] },
        { model: Voucher, as: 'voucher' }
      ],
      order: [['createdAt', 'DESC']],
      limit: safeLimit,
      offset,
      distinct: true
    });

    res.json({
      success: true,
      message: 'All orders retrieved',
      data: {
        orders: rows,
        pagination: {
          total: count,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(count / safeLimit)
        }
      }
    });
  } catch (error) { next(error); }
};

exports.getAdminOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['name', 'thumbnail', 'brand'] }] },
        { model: User, as: 'user', attributes: ['full_name', 'email', 'phone'] },
        { model: Voucher, as: 'voucher' }
      ]
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order details', data: order });
  } catch (error) { next(error); }
};

exports.updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findByPk(req.params.id, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const transitionError = ensureStatusTransition(order.status, status);
    if (transitionError) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: transitionError });
    }

    if (status === 'cancelled' && order.status !== 'cancelled') {
      await restoreOrderInventoryAndVoucher(order, transaction);
    }

    order.status = status;
    await order.save({ transaction });
    await transaction.commit();

    res.json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    next(error);
  }
};
