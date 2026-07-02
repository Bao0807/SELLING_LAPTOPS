const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { register, login, logout, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');
const { rateLimit } = require('../middlewares/rateLimitMiddleware');

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 40 });

// Public
router.post('/register', authLimiter, [
  check('full_name', 'Full name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], register);

router.post('/login', authLimiter, login);
router.post('/logout', logout);

// Protected
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
