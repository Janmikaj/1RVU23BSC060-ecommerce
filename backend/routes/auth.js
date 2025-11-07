const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Register
router.post('/register', async (req,res)=>{
  try{
    const { name, email, password } = req.body;
    if(!email || !password || !name) return res.status(400).json({ message:'Missing fields' });
    let user = await User.findOne({ email });
    if(user) return res.status(400).json({ message:'Email exists' });
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn:'7d' });
    res.json({ token, user:{ id:user._id, name:user.name, email:user.email, role:user.role }});
  }catch(e){ res.status(500).json({ message:e.message }) }
});

// Login
router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message:'Invalid creds' });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({ message:'Invalid creds' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn:'7d' });
    res.json({ token, user:{ id:user._id, name:user.name, email:user.email, role:user.role }});
  }catch(e){ res.status(500).json({ message:e.message }) }
});

module.exports = router;
