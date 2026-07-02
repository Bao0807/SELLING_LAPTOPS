const { WishlistItem, Product } = require('../models');

exports.getWishlist = async (req, res, next) => {
  try {
    const items = await WishlistItem.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product, as: 'product' }]
    });
    res.json({ success: true, message: 'Wishlist retrieved', data: items });
  } catch (error) { next(error); }
};

exports.addToWishlist = async (req, res, next) => {
  const { product_id } = req.body;
  try {
    if (!product_id) {
      return res.status(400).json({ success: false, message: 'product_id is required' });
    }
    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const [item, created] = await WishlistItem.findOrCreate({
      where: { user_id: req.user.id, product_id },
      defaults: { user_id: req.user.id, product_id }
    });
    res.status(created ? 201 : 200).json({ success: true, message: 'Item added to wishlist', data: item });
  } catch (error) { next(error); }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const item = await WishlistItem.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    
    await item.destroy();
    res.json({ success: true, message: 'Item removed from wishlist', data: null });
  } catch (error) { next(error); }
};
