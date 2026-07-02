'use strict';
const { check } = require('express-validator');

exports.registerValidator = [
  check('full_name', 'Full name is required').trim().not().isEmpty(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('phone', 'Phone number is required').trim().not().isEmpty(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
];

exports.loginValidator = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').not().isEmpty()
];

exports.changePasswordValidator = [
  check('currentPassword', 'Current password is required').not().isEmpty(),
  check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
];
