const User = require('../models/User');
const Kitchen = require('../models/Kitchen');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'plateria_secret_key_123', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, city, address, kitchenName, kitchenDescription } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: role || 'customer',
      phone: phone || '',
      city: city || 'Islamabad',
      location: { type: 'Point', coordinates: [73.0479, 33.6844], address: address || '' },
    });

    let kitchen = null;
    if (user.role === 'vendor') {
      kitchen = await Kitchen.create({
        owner: user._id,
        name: kitchenName || `${user.name}'s Kitchen`,
        description: kitchenDescription || 'Fresh home-cooked food',
        city: user.city,
        address: address || '',
      });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        followedKitchens: user.followedKitchens || [],
        kitchenId: kitchen ? kitchen._id : null,
      },
    });
  } catch (error) {
    console.error('❌ Register Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let kitchen = null;
    if (user.role === 'vendor') {
      kitchen = await Kitchen.findOne({ owner: user._id });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        followedKitchens: user.followedKitchens || [],
        kitchenId: kitchen ? kitchen._id : null,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/auth/profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('followedKitchens');
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};