const express = require('express');
const router = express.Router();
const { validateVoucher } = require('../controllers/voucherController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/validate', protect, validateVoucher);

module.exports = router;
