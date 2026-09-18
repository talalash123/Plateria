const Kitchen = require('../models/Kitchen');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// Get all active kitchens (Marketplace & Search & Subscribed filter)
exports.getAllKitchens = async (req, res) => {
  try {
    const { city, search, subscribedOnly } = req.query;
    let query = {};

    if (city) query.city = new RegExp(city, 'i');
    if (search) query.name = new RegExp(search, 'i');

    if (subscribedOnly === 'true' && req.user) {
      const user = await User.findById(req.user._id);
      query._id = { $in: user.followedKitchens };
    }

    const kitchens = await Kitchen.find(query).populate('owner', 'name email phone');
    return res.status(200).json({ success: true, count: kitchens.length, kitchens });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single Kitchen by ID
exports.getKitchenById = async (req, res) => {
  try {
    const kitchen = await Kitchen.findById(req.params.id).populate('owner', 'name email phone');
    if (!kitchen) return res.status(404).json({ success: false, message: 'Kitchen not found' });

    const menuItems = await MenuItem.find({ kitchen: kitchen._id });

    let isSubscribed = false;
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user && user.followedKitchens) {
        // String conversion fix
        isSubscribed = user.followedKitchens.some(
          (id) => id.toString() === kitchen._id.toString()
        );
      }
    }

    return res.status(200).json({ success: true, kitchen, menuItems, isSubscribed });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Subscribe / Unsubscribe Kitchen
exports.toggleSubscribeKitchen = async (req, res) => {
  try {
    const kitchenId = req.params.id;
    const user = await User.findById(req.user._id);
    const kitchen = await Kitchen.findById(kitchenId);

    if (!kitchen) return res.status(404).json({ success: false, message: 'Kitchen not found' });

    // String comparison fix for MongoDB ObjectIds
    const isSubscribed = user.followedKitchens.some(
      (id) => id.toString() === kitchenId.toString()
    );

    if (isSubscribed) {
      user.followedKitchens = user.followedKitchens.filter(
        (id) => id.toString() !== kitchenId.toString()
      );
      kitchen.subscribersCount = Math.max(0, (kitchen.subscribersCount || 1) - 1);
    } else {
      user.followedKitchens.push(kitchenId);
      kitchen.subscribersCount = (kitchen.subscribersCount || 0) + 1;
    }

    await user.save();
    await kitchen.save();

    return res.status(200).json({
      success: true,
      isSubscribed: !isSubscribed,
      subscribersCount: kitchen.subscribersCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Add Menu Item (Vendor Only)
exports.addMenuItem = async (req, res) => {
  try {
    const kitchen = await Kitchen.findOne({ owner: req.user._id });
    if (!kitchen) return res.status(404).json({ success: false, message: 'Kitchen profile not found' });

    const { title, description, price, category, image } = req.body;

    const item = await MenuItem.create({
      kitchen: kitchen._id,
      title,
      description,
      price: Number(price),
      category: category || 'General',
      image: image || '',
    });

    if (category && !kitchen.categories.includes(category)) {
      kitchen.categories.push(category);
      await kitchen.save();
    }

    return res.status(201).json({ success: true, item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Menu Items (With Search & Category Filters)
exports.getAllMenuItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {}; // isAvailable field optional rakha hai taake issue na aaye

    if (category) query.category = category;
    if (search) query.title = new RegExp(search, 'i');

    const items = await MenuItem.find(query).populate('kitchen', 'name rating subscribersCount profileImage');
    return res.status(200).json({ success: true, count: items.length, items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};