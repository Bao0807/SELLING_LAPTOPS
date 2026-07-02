const express = require('express');
const router = express.Router();
const { createReview, updateReview, deleteReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/products/:id/reviews', getProductReviews);

router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
