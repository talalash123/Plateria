const Order = require('../models/Order');
const Kitchen = require('../models/Kitchen');
const Review = require('../models/Review');

// Create New Order
exports.createOrder = async (req, res) => {
  try {
    const { kitchenId, items, subtotal, deliveryFee, totalAmount, deliveryAddress, customerPhone, orderNote, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    const order = await Order.create({
      customer: req.user._id,
      kitchen: kitchenId,
      items,
      subtotal,
      deliveryFee: deliveryFee || 150,
      totalAmount,
      deliveryAddress,
      customerPhone,
      orderNote: orderNote || '',
      paymentMethod: paymentMethod || 'COD',
    });

    return res.status(201).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Customer Orders
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('kitchen', 'name profileImage phone')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Vendor Orders
exports.getVendorOrders = async (req, res) => {
  try {
    const kitchen = await Kitchen.findOne({ owner: req.user._id });
    if (!kitchen) return res.status(404).json({ success: false, message: 'Kitchen profile not found' });

    const orders = await Order.find({ kitchen: kitchen._id })
      .populate('customer', 'name phone email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status (Vendor)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    if (cancellationReason) order.cancellationReason = cancellationReason;

    await order.save();
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Submit Order Review & Rating (Supports overall rating & fallback sub-scores)
exports.submitReview = async (req, res) => {
  try {
    const { orderId, kitchenId, rating, foodQuality, hygiene, packaging, delivery, comment } = req.body;

    // Fallback: Agar simple single rating pass hui ho toh sub-fields auto fill honge
    const baseRating = rating || 5;
    const fQuality = foodQuality || baseRating;
    const fHygiene = hygiene || baseRating;
    const fPackaging = packaging || baseRating;
    const fDelivery = delivery || baseRating;

    const overallRating = parseFloat(((fQuality + fHygiene + fPackaging + fDelivery) / 4).toFixed(1));

    const review = await Review.create({
      order: orderId,
      kitchen: kitchenId,
      customer: req.user._id,
      foodQuality: fQuality,
      hygiene: fHygiene,
      packaging: fPackaging,
      delivery: fDelivery,
      overallRating,
      comment: comment || '',
    });

    // Mark order as reviewed
    await Order.findByIdAndUpdate(orderId, { isReviewed: true });

    // Update Kitchen Rating Average
    const kitchen = await Kitchen.findById(kitchenId);
    if (kitchen) {
      const allReviews = await Review.find({ kitchen: kitchenId });
      const avgRating = allReviews.reduce((acc, item) => item.overallRating + acc, 0) / allReviews.length;
      kitchen.rating = parseFloat(avgRating.toFixed(1));
      kitchen.totalReviews = allReviews.length;
      await kitchen.save();
    }

    return res.status(201).json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};