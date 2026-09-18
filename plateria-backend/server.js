const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Configurations
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'PLATERIA_SECRET_KEY';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/plateria';

// Database Connection with Async Handling
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected Successfully!');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
};
connectDB();

// --- SCHEMAS & MODELS ---

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: String,
  role: { type: String, enum: ['customer', 'vendor'], default: 'customer' },
  kitchenName: String,
  profileImage: String,
  coverImage: String,
  rating: { type: Number, default: 5.0 },
  subscribersCount: { type: Number, default: 0 }
}, { timestamps: true });

const FoodSchema = new mongoose.Schema({
  kitchenId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kitchenName: String,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: String,
  description: String,
  imageUrl: String
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: String,
  kitchenId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: Array,
  totalAmount: { type: Number, required: true },
  deliveryAddress: String,
  status: { type: String, default: 'Placed' }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Food = mongoose.model('Food', FoodSchema);
const Order = mongoose.model('Order', OrderSchema);

// --- MIDDLEWARES ---

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// --- ROUTES ---

// 1. Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ ...req.body, password: hashedPassword });
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

app.put('/api/auth/profile', auth, async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

// 2. Kitchen & Food Routes
app.get('/api/kitchens', async (req, res) => {
  try {
    const kitchens = await User.find({ role: 'vendor' }).select('-password');
    res.json({ kitchens });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching kitchens', error: err.message });
  }
});

app.get('/api/foods/popular', async (req, res) => {
  try {
    const products = await Food.find().limit(10);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching popular foods', error: err.message });
  }
});

app.post('/api/foods', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can add food items' });
    }

    const food = await Food.create({
      ...req.body,
      kitchenId: user._id,
      kitchenName: user.kitchenName || user.name
    });

    res.status(201).json({ success: true, food });
  } catch (err) {
    res.status(500).json({ message: 'Error creating food item', error: err.message });
  }
});

// 3. Order Routes
app.post('/api/orders', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const order = await Order.create({
      ...req.body,
      customerId: user._id,
      customerName: user.name
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

app.get('/api/orders/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

app.get('/api/orders/vendor', auth, async (req, res) => {
  try {
    const orders = await Order.find({ kitchenId: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vendor orders', error: err.message });
  }
});

app.put('/api/orders/:id/status', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
});

// 4. Vendor Dashboard Stats Route
app.get('/api/vendor/dashboard-stats', auth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ kitchenId: req.user.id });
    const pendingOrders = await Order.countDocuments({ kitchenId: req.user.id, status: 'Placed' });
    
    // Calculate total sales for completed orders
    const completedOrders = await Order.find({ kitchenId: req.user.id, status: 'Delivered' });
    const totalSales = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const vendor = await User.findById(req.user.id);

    res.json({
      totalOrders,
      pendingOrders,
      sales: totalSales,
      rating: vendor?.rating || 5.0,
      subscribers: vendor?.subscribersCount || 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
});

// Server Initialization
app.listen(PORT, () => {
  console.log(`Plateria Backend Active on Port ${PORT}`);
});