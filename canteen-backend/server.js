const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Import models
const User = require('./models/User');
const Order = require('./models/Order');
const Product = require('./models/Product');

// Import middleware
const { authenticateToken, isSeller } = require('./middleware/auth');

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/canteen';
console.log('MongoDB URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Successfully connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  console.error('Please ensure MongoDB is running and the connection string is correct');
  process.exit(1);
});

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with buyer role
    const user = new User({
      username,
      password: hashedPassword,
      role: 'buyer' // Always set as buyer
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Product routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

app.post('/api/products', authenticateToken, isSeller, async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = new Product({
      name,
      price: parseFloat(price),
      description,
      seller: req.user.id
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

app.put('/api/products/:id', authenticateToken, isSeller, async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price: parseFloat(price), description },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

app.delete('/api/products/:id', authenticateToken, isSeller, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Order routes
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    let query = {};
    // If user is a buyer, only show their orders
    if (req.user.role === 'buyer') {
      query.userId = req.user.id;
    }
    // For sellers, no query filter (show all orders)
    
    const orders = await Order.find(query)
      .populate('userId', 'username')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

app.get('/api/orders/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('userId', 'username')
      .populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If user is a buyer, check if the order belongs to them
    if (req.user.role === 'buyer' && order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can create orders' });
    }

    const order = new Order({
      userId: req.user.id,
      items: req.body.items,
      total: req.body.total,
      status: 'pending'
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

app.patch('/api/orders/:orderId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can update order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: req.body.status },
      { new: true }
    ).populate('userId', 'username')
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
