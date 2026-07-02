const { Voucher, VoucherUsage } = require('../models');

const validateVoucherPayload = (body, isUpdate = false) => {
  const errors = [];
  const type = body.discount_type;
  const value = body.discount_value === undefined || body.discount_value === '' ? null : Number(body.discount_value);
  const minimum = body.minimum_order_amount === undefined || body.minimum_order_amount === '' ? 0 : Number(body.minimum_order_amount);
  const limit = body.usage_limit === undefined || body.usage_limit === '' ? 0 : Number(body.usage_limit);
  const startDate = body.start_date ? new Date(body.start_date) : null;
  const endDate = body.end_date ? new Date(body.end_date) : null;

  if (!isUpdate && !String(body.code || '').trim()) errors.push('Voucher code is required');
  if (type !== undefined && !['percent', 'fixed'].includes(type)) errors.push('Discount type must be percent or fixed');
  if (!isUpdate && !type) errors.push('Discount type is required');
  if (!isUpdate && value === null) errors.push('Discount value is required');
  if (value !== null && (!Number.isFinite(value) || value <= 0)) errors.push('Discount value must be greater than 0');
  if (type === 'percent' && value !== null && value > 100) errors.push('Percent discount cannot be greater than 100');
  if (!Number.isFinite(minimum) || minimum < 0) errors.push('Minimum order amount must be 0 or more');
  if (!Number.isInteger(limit) || limit < 0) errors.push('Usage limit must be 0 or more');
  if (!isUpdate && !startDate) errors.push('Start date is required');
  if (!isUpdate && !endDate) errors.push('End date is required');
  if (startDate && Number.isNaN(startDate.getTime())) errors.push('Start date is invalid');
  if (endDate && Number.isNaN(endDate.getTime())) errors.push('End date is invalid');
  if (startDate && endDate && startDate >= endDate) errors.push('End date must be after start date');
  if (body.status !== undefined && !['active', 'inactive'].includes(body.status)) errors.push('Status must be active or inactive');

  return errors;
};

exports.createVoucher = async (req, res, next) => {
  try {
    const errors = validateVoucherPayload(req.body);
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0] });

    const voucher = await Voucher.create({
      ...req.body,
      code: String(req.body.code).trim().toUpperCase()
    });
    res.status(201).json({ success: true, message: 'Voucher created', data: voucher });
  } catch (error) { next(error); }
};

exports.getVouchers = async (req, res, next) => {
  try {
    const vouchers = await Voucher.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, message: 'Vouchers retrieved', data: vouchers });
  } catch (error) { next(error); }
};

exports.updateVoucher = async (req, res, next) => {
  try {
    const errors = validateVoucherPayload(req.body, true);
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0] });

    const voucher = await Voucher.findByPk(req.params.id);
    if (!voucher) return res.status(404).json({ success: false, message: 'Voucher not found' });

    const payload = { ...req.body };
    if (payload.code) payload.code = String(payload.code).trim().toUpperCase();

    await voucher.update(payload);
    res.json({ success: true, message: 'Voucher updated', data: voucher });
  } catch (error) { next(error); }
};

exports.deleteVoucher = async (req, res, next) => {
  try {
    const voucher = await Voucher.findByPk(req.params.id);
    if (!voucher) return res.status(404).json({ success: false, message: 'Voucher not found' });
    await voucher.destroy();
    res.json({ success: true, message: 'Voucher deleted', data: null });
  } catch (error) { next(error); }
};

exports.validateVoucher = async (req, res, next) => {
  const code = String(req.body.code || '').trim().toUpperCase();
  const cartTotal = Number(req.body.cartTotal);

  try {
    if (!code) return res.status(400).json({ success: false, message: 'Voucher code is required' });
    if (!Number.isFinite(cartTotal) || cartTotal <= 0) {
      return res.status(400).json({ success: false, message: 'Cart total must be greater than 0' });
    }

    const voucher = await Voucher.findOne({ where: { code } });
    if (!voucher) return res.status(404).json({ success: false, message: 'Voucher not found' });

    const now = new Date();
    if (voucher.status !== 'active' || now < voucher.start_date || now > voucher.end_date) {
      return res.status(400).json({ success: false, message: 'Voucher is expired or inactive' });
    }

    if (voucher.usage_limit > 0 && voucher.used_count >= voucher.usage_limit) {
      return res.status(400).json({ success: false, message: 'Voucher usage limit reached' });
    }

    const existingUsage = await VoucherUsage.findOne({
      where: { user_id: req.user.id, voucher_id: voucher.id }
    });
    if (existingUsage) {
      return res.status(400).json({ success: false, message: 'You already used this voucher' });
    }

    if (cartTotal < voucher.minimum_order_amount) {
      return res.status(400).json({ success: false, message: `Minimum order amount is ${voucher.minimum_order_amount}` });
    }

    res.json({ success: true, message: 'Voucher is valid', data: voucher });
  } catch (error) { next(error); }
};
