require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

async function seed(){
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany();
  await Product.deleteMany();

  const admin = new User({
    name:'Admin',
    email:'admin@techstore.com',
    password: await bcrypt.hash('admin123', 10),
    role:'admin'
  });
  await admin.save();

  const products = [
    { name:'Wireless Headphones', price:2999, image:'https://images.unsplash.com/photo-1518444089045-2f7e83f1a3ca?auto=format&fit=crop&w=800&q=60', description:'Comfortable over-ear headphones with noise cancellation.' },
    { name:'Smartwatch Series 5', price:7999, image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60', description:'Track fitness, messages, and heart rate.' },
    { name:'Gaming Laptop', price:85999, image:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60', description:'Powerful laptop designed for gaming and creative work.' },
    { name:'Bluetooth Speaker', price:1999, image:'https://images.unsplash.com/photo-1518444023248-9f4d4b9c3f37?auto=format&fit=crop&w=800&q=60', description:'Portable speaker with deep bass.' },
    { name:'Sneakers (Tech Edition)', price:3499, image:'https://images.unsplash.com/photo-1528701800489-476fdb5f3278?auto=format&fit=crop&w=800&q=60', description:'Comfortable sneakers with tech-friendly design.' }
  ];
  await Product.insertMany(products);
  console.log('Seed done');
  process.exit(0);
}
seed();
