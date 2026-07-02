'use strict';
const { Product, User, Order, OrderItem, Review, sequelize } = require('../models');
const { fn, col, literal, Op } = require('sequelize');

/**
 * GET /api/admin/dashboard
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts
    ] = await Promise.all([
      Product.count(),
      User.count({ where: { role: 'customer' } }),
      Order.count(),
      Order.sum('total_amount', { where: { status: 'delivered' } }),
      Order.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }]
      }),
      // Best selling products by total units sold
      Product.findAll({
        attributes: {
          include: [
            [fn('COALESCE', fn('SUM', col('orderItems.quantity')), 0), 'totalSold']
          ]
        },
        include: [{
          model: OrderItem,
          as: 'orderItems',
          attributes: [],
          required: false
        }],
        group: ['Product.id'],
        order: [[literal('totalSold'), 'DESC']],
        limit: 5,
        subQuery: false
      })
    ]);

    res.json({
      success: true,
      message: 'Dashboard stats retrieved',
      data: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue || 0,
        recentOrders,
        topProducts
      }
    });
  } catch (error) { next(error); }
};

/**
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, q } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (role) where.role = role;
    if (q) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
        { phone: { [Op.like]: `%${q}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      message: 'Users retrieved',
      data: {
        users: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) { next(error); }
};

/**
 * PUT /api/admin/users/:id/role
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be customer or admin' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.id === req.user.id && role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You cannot remove your own admin role' });
    }

    user.role = role;
    await user.save();
    const safeUser = user.toJSON();
    delete safeUser.password;
    res.json({ success: true, message: 'User role updated', data: safeUser });
  } catch (error) { next(error); }
};

/**
 * GET /api/admin/users/:id
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Order, as: 'orders', attributes: ['id', 'total_amount', 'status', 'createdAt'] }]
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User retrieved', data: user });
  } catch (error) { next(error); }
};

/**
 * DELETE /api/admin/users/:id
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.id === req.user.id) {
      return res.status(403).json({ success: false, message: 'You cannot delete your own account' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin accounts' });
    }
    await user.destroy();
    res.json({ success: true, message: 'User deleted', data: null });
  } catch (error) { next(error); }
};

/**
 * GET /api/admin/reviews  — manage all reviews
 */
exports.getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Review.findAndCountAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'email'] },
        { model: Product, as: 'product', attributes: ['name', 'thumbnail'] }
      ],
      limit: parseInt(limit),
      offset
    });
    res.json({
      success: true,
      message: 'Reviews retrieved',
      data: {
        reviews: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) { next(error); }
};

/**
 * DELETE /api/admin/reviews/:id
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.destroy();
    res.json({ success: true, message: 'Review deleted', data: null });
  } catch (error) { next(error); }
};
