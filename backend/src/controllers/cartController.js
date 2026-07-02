const { CartItem, Product } = require('../models');

const parsePositiveQuantity = (value, fallback = 1) => {
  const quantity = Number(value ?? fallback);
  return Number.isInteger(quantity) && quantity > 0 ? quantity : null;
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product, as: 'product' }]
    });
    res.json({ success: true, message: 'Cart retrieved', data: cart });
  } catch (error) { next(error); }
};

exports.addToCart = async (req, res, next) => {
  const { product_id, quantity } = req.body;
  try {
    const addQuantity = parsePositiveQuantity(quantity);
    if (!product_id || !addQuantity) {
      return res.status(400).json({ success: false, message: 'product_id and positive quantity are required' });
    }

    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const [item, created] = await CartItem.findOrCreate({
      where: { user_id: req.user.id, product_id },
      defaults: { user_id: req.user.id, product_id, quantity: 0 }
    });
    const nextQuantity = item ? item.quantity + addQuantity : addQuantity;
    if (nextQuantity > product.stock_quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    item.quantity = nextQuantity;
    await item.save();
    res.status(created ? 201 : 200).json({ success: true, message: 'Item added to cart', data: item });
  } catch (error) { next(error); }
};

exports.updateCartItem = async (req, res, next) => {
  const { quantity } = req.body;
  try {
    const nextQuantity = parsePositiveQuantity(quantity, null);
    if (!nextQuantity) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive integer' });
    }

    const item = await CartItem.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    const product = await Product.findByPk(item.product_id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (nextQuantity > product.stock_quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }
    
    item.quantity = nextQuantity;
    await item.save();
    res.json({ success: true, message: 'Cart item updated', data: item });
  } catch (error) { next(error); }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const item = await CartItem.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    
    await item.destroy();
    res.json({ success: true, message: 'Item removed from cart', data: null });
  } catch (error) { next(error); }
};

exports.clearCart = async (req, res, next) => {
  try {
    await CartItem.destroy({ where: { user_id: req.user.id } });
    res.json({ success: true, message: 'Cart cleared', data: null });
  } catch (error) { next(error); }
};
