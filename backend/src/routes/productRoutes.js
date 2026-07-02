const express = require('express');
const router = express.Router();
const { getProducts, getProductById, searchProducts, getFeaturedProducts, getBestsellers } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestsellers);
router.get('/:id', getProductById);

module.exports = router;
