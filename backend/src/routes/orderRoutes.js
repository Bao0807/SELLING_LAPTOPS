const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, cancelMyOrder } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelMyOrder);

module.exports = router;
