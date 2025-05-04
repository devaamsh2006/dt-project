const mongoose = require('mongoose');

// Remove the existing qrCode index if it exists
mongoose.connection.on('open', async () => {
  try {
    await mongoose.connection.collection('orders').dropIndex('qrCode_1');
  } catch (error) {
    // Index might not exist, that's okay
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  qrCode: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Order', orderSchema);
