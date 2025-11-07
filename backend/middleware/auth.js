const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

module.exports = {
  auth: async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'No token' });
    const token = header.split(' ')[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(payload.id).select('-password');
      if (!req.user) return res.status(401).json({ message:'Invalid token' });
      next();
    } catch(err){
      return res.status(401).json({ message:'Invalid token' });
    }
  },

  adminOnly: (req, res, next) => {
    if (!req.user) return res.status(401).json({ message:'Not authenticated' });
    if (req.user.role !== 'admin') return res.status(403).json({ message:'Admin only' });
    next();
  }
};
