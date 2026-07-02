const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const { getProducts, createProduct, updateProduct, deleteProduct, addProductImages } = require('../controllers/productController');
const { getAllOrders, getAdminOrderById, updateOrderStatus } = require('../controllers/orderController');
const { createVoucher, getVouchers, updateVoucher, deleteVoucher } = require('../controllers/voucherController');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllReviews,
  deleteReview
} = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Products CRUD
router.get('/products', getProducts);
router.post('/products', upload.single('image'), createProduct);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/:id/images', upload.array('images', 10), addProductImages);

// Categories CRUD
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Orders management
router.get('/orders', getAllOrders);
router.get('/orders/:id', getAdminOrderById);
router.put('/orders/:id/status', updateOrderStatus);

// Vouchers CRUD
router.post('/vouchers', createVoucher);
router.get('/vouchers', getVouchers);
router.put('/vouchers/:id', updateVoucher);
router.delete('/vouchers/:id', deleteVoucher);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Review moderation
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
