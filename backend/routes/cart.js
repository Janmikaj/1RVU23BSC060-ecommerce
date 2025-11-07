const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

router.post('/checkout', auth, async (req,res)=>{
  const { items } = req.body; // [{ productId, quantity }]
  if(!items || !items.length) return res.status(400).json({ message:'Cart empty' });
  const populated = await Promise.all(items.map(async it=>{
    const p = await Product.findById(it.productId);
    return { product: p._id, quantity: it.quantity, price: p.price };
  }));
  const total = populated.reduce((s,i)=> s + i.price * i.quantity, 0);
  const order = await Order.create({ user: req.user._id, items: populated, total });
  res.json({ order });
});

module.exports = router;
