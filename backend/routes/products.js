const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

// Public: list products
router.get('/', async (req,res)=>{
  const list = await Product.find().sort('-createdAt');
  res.json(list);
});

// Public: get single
router.get('/:id', async (req,res)=>{
  const p = await Product.findById(req.params.id);
  if(!p) return res.status(404).json({ message:'Not found' });
  res.json(p);
});

// Admin: add product
router.post('/', auth, adminOnly, async (req,res)=>{
  const { name, price, image, description } = req.body;
  const p = await Product.create({ name, price, image, description });
  res.json(p);
});

// Admin: delete
router.delete('/:id', auth, adminOnly, async (req,res)=>{
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message:'Deleted' });
});

module.exports = router;
