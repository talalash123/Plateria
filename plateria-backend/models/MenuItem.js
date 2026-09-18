const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    kitchen: { type: mongoose.Schema.Types.ObjectId, ref: 'Kitchen', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // e.g. Burger, Pizza, BBQ
    image: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    customizations: [
      {
        name: { type: String },
        extraPrice: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);