const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kitchen: { type: mongoose.Schema.Types.ObjectId, ref: 'Kitchen', required: true },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 150 },
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    customerPhone: { type: String, required: true },
    orderNote: { type: String, default: '' },
    paymentMethod: { type: String, enum: ['COD', 'ONLINE'], default: 'COD' },
    isPaid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    cancellationReason: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);