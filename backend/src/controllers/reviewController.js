const { Review, User, Order, OrderItem } = require('../models');

const validateReviewPayload = ({ product_id, rating, comment }, isUpdate = false) => {
  const errors = [];
  const ratingNumber = Number(rating);
  if (!isUpdate && !product_id) errors.push('product_id is required');
  if (rating !== undefined && (!Number.isInteger(ratingNumber) || ratingNumber < 1 || ratingNumber > 5)) {
    errors.push('Rating must be an integer from 1 to 5');
  }
  if (!isUpdate && rating === undefined) errors.push('Rating is required');
  if (comment !== undefined && String(comment).length > 1000) errors.push('Comment must be 1000 characters or less');
  return errors;
};

exports.createReview = async (req, res, next) => {
  const { product_id, rating, comment } = req.body;
  try {
    const errors = validateReviewPayload(req.body);
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0] });

    const purchased = await Order.findOne({
      where: { user_id: req.user.id, status: 'delivered' },
      include: [{ model: OrderItem, as: 'items', where: { product_id } }]
    });
    if (!purchased) {
      return res.status(403).json({ success: false, message: 'You can only review products you have purchased' });
    }

    const existing = await Review.findOne({ where: { user_id: req.user.id, product_id } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already reviewed this product' });
    }

    const review = await Review.create({
      user_id: req.user.id,
      product_id,
      rating: Number(rating),
      comment: String(comment || '').trim()
    });
    res.status(201).json({ success: true, message: 'Review created', data: review });
  } catch (error) { next(error); }
};

exports.updateReview = async (req, res, next) => {
  try {
    const errors = validateReviewPayload(req.body, true);
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0] });

    const review = await Review.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
    
    await review.update({
      ...req.body,
      rating: req.body.rating === undefined ? review.rating : Number(req.body.rating),
      comment: req.body.comment === undefined ? review.comment : String(req.body.comment).trim()
    });
    res.json({ success: true, message: 'Review updated', data: review });
  } catch (error) { next(error); }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
    
    await review.destroy();
    res.json({ success: true, message: 'Review deleted', data: null });
  } catch (error) { next(error); }
};

exports.getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Review.findAndCountAll({
      where: { product_id: req.params.id },
      include: [{ model: User, as: 'user', attributes: ['full_name', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    res.json({
      success: true,
      message: 'Product reviews retrieved',
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
