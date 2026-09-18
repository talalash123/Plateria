const express = require('express');
const router = express.Router();
const Kitchen = require('../models/Kitchen');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Review = require('../models/Review');

// 1. GET DYNAMIC DASHBOARD DATA (VendorDashboardScreen.js)
router.get('/dashboard/:kitchenId', async (req, res) => {
  try {
    const { kitchenId } = req.params;

    // Parallel Database Queries for Maximum Performance
    const [kitchen, menuItemsCount, orders, recentReviews] = await Promise.all([
      Kitchen.findById(kitchenId),
      MenuItem.countDocuments({ kitchen: kitchenId }),
      Order.find({ kitchen: kitchenId }).sort({ createdAt: -1 }),
      Review.find({ kitchen: kitchenId }).populate('customer', 'name profilePicture').sort({ createdAt: -1 }).limit(5)
    ]);

    if (!kitchen) {
      return res.status(404).json({ success: false, message: 'Kitchen not found' });
    }

    // Dynamic Financial & Analytics Calculations
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'Delivered');
    const totalEarnings = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const activeOrdersCount = orders.filter(o => ['Pending', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery'].includes(o.status)).length;

    res.status(200).json({
      success: true,
      data: {
        kitchenInfo: {
          name: kitchen.name,
          isOpen: kitchen.isOpen,
          rating: kitchen.rating,
          totalReviews: kitchen.totalReviews
        },
        stats: {
          totalEarnings,
          totalOrders,
          activeOrdersCount,
          menuItemsCount
        },
        recentOrders: orders.slice(0, 5),
        recentReviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. ADD NEW MENU ITEM (VendorAddFoodScreen.js)
router.post('/menu/add', async (req, res) => {
  try {
    const { kitchen, title, description, price, category, image, customizations } = req.body;

    const newItem = await MenuItem.create({
      kitchen,
      title,
      description,
      price,
      category,
      image,
      customizations
    });

    res.status(201).json({
      success: true,
      message: 'Item published successfully!',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. FETCH & MANAGE KITCHEN PROFILE (KitchenProfileScreen.js)
router.get('/profile/:kitchenId', async (req, res) => {
  try {
    const kitchen = await Kitchen.findById(req.params.kitchenId).populate('owner', 'name email phone');
    const menuItems = await MenuItem.find({ kitchen: req.params.kitchenId });
    const reviews = await Review.find({ kitchen: req.params.kitchenId }).populate('customer', 'name profilePicture');

    res.status(200).json({
      success: true,
      kitchen,
      menuItems,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. UPDATE KITCHEN PROFILE & TOGGLE STATUS
router.put('/profile/update/:kitchenId', async (req, res) => {
  try {
    const updatedKitchen = await Kitchen.findByIdAndUpdate(
      req.params.kitchenId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Kitchen updated successfully',
      kitchen: updatedKitchen
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. UPDATE ORDER STATUS (VendorOrdersScreen.js)
router.patch('/order/status/:orderId', async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status, cancellationReason },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;