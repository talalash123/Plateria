const express = require('express');
const router = express.Router();
const {
  createOrder,
  getCustomerOrders,
  getVendorOrders,
  updateOrderStatus,
  submitReview,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createOrder);
router.get('/customer', protect, getCustomerOrders);
router.get('/vendor', protect, getVendorOrders);
router.put('/:id/status', protect, updateOrderStatus);
router.post('/review', protect, submitReview);

module.exports = router;