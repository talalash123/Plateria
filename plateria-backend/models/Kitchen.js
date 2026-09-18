const mongoose = require('mongoose');

const kitchenSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    city: { type: String, required: true, default: 'Islamabad' },
    address: { type: String, default: '' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [73.0479, 33.6844] }, // [lng, lat]
    },
    deliveryRadiusKm: { type: Number, default: 10 },
    openingHours: { type: String, default: '12:00 PM - 11:00 PM' },
    isOpen: { type: Boolean, default: true },
    isSubscribed: { type: Boolean, default: true }, // Vendor $1 plan active state
    subscribersCount: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    totalReviews: { type: Number, default: 0 },
    categories: [{ type: String }],
  },
  { timestamps: true }
);

kitchenSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Kitchen', kitchenSchema);