const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Drop the email index if it exists
    try {
      await mongoose.connection.db.collection('users').dropIndex('email_1');
      console.log('Dropped email index');
    } catch (err) {
      // Index might not exist, that's okay
      console.log('No email index found');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function createUsers() {
  try {
    // Delete existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create buyer user
    const buyerSalt = await bcrypt.genSalt(10);
    const buyerHash = await bcrypt.hash('customer123', buyerSalt);
    const buyer = new User({
      username: 'customer1',
      password: buyerHash,
      role: 'buyer'
    });
    await buyer.save();
    console.log('Created buyer user:', buyer.username);

    // Create seller user
    const sellerSalt = await bcrypt.genSalt(10);
    const sellerHash = await bcrypt.hash('owner123', sellerSalt);
    const seller = new User({
      username: 'owner1',
      password: sellerHash,
      role: 'seller'
    });
    await seller.save();
    console.log('Created seller user:', seller.username);

    console.log('\nUser Credentials:');
    console.log('Buyer - Username: customer1, Password: customer123');
    console.log('Seller - Username: owner1, Password: owner123');

    mongoose.disconnect();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error creating users:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}

// Wait a bit for the index to be dropped before creating users
setTimeout(createUsers, 1000);
