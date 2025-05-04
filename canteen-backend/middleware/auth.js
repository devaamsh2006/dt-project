const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

const isSeller = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Access denied. Seller only.' });
  }
  next();
};

module.exports = { authenticateToken, isSeller };
