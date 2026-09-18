const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    kitchen: { type: mongoose.Schema.Types.ObjectId, ref: 'Kitchen', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodQuality: { type: Number, required: true, min: 1, max: 5 },
    hygiene: { type: Number, required: true, min: 1, max: 5 },
    packaging: { type: Number, required: true, min: 1, max: 5 },
    delivery: { type: Number, required: true, min: 1, max: 5 },
    overallRating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);