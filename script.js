/* script.js – TechStore (Full working version with cart update & no popups) */

/* ================================
   Default Product List
================================= */
const SEED_PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: 2999, image: "https://images.unsplash.com/photo-1518444089045-2f7e83f1a3ca?auto=format&fit=crop&w=800&q=60", description: "Comfortable over-ear headphones with noise cancellation." },
  { id: 2, name: "Smartwatch Series 5", price: 7999, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60", description: "Track fitness, messages, and heart rate." },
  { id: 3, name: "Gaming Laptop", price: 85999, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60", description: "Powerful laptop designed for gaming and creative work." },
  { id: 4, name: "Bluetooth Speaker", price: 1999, image: "https://images.unsplash.com/photo-1518444023248-9f4d4b9c3f37?auto=format&fit=crop&w=800&q=60", description: "Portable speaker with deep bass." },
  { id: 5, name: "Sneakers (Tech Edition)", price: 3499, image: "https://images.unsplash.com/photo-1528701800489-476fdb5f3278?auto=format&fit=crop&w=800&q=60", description: "Comfortable sneakers with tech-friendly design." },
  { id: 6, name: "Mechanical Keyboard", price: 4499, image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=800&q=60", description: "RGB backlit keyboard with tactile keys for fast typing." },
  { id: 7, name: "Wireless Mouse", price: 999, image: "https://images.unsplash.com/photo-1587202372775-98907c6f0e49?auto=format&fit=crop&w=800&q=60", description: "Ergonomic wireless mouse with precision tracking." },
  { id: 8, name: "4K Monitor", price: 18999, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60", description: "Crisp, ultra HD display for productivity and gaming." }
];

/* ================================
   Local Storage Helpers
================================= */
function loadProducts() {
  const data = localStorage.getItem('products');
  if (data) {
    try { return JSON.parse(data); } catch (e) { console.error(e); }
  }
  localStorage.setItem('products', JSON.stringify(SEED_PRODUCTS));
  return SEED_PRODUCTS;
}

function saveProducts(p) { localStorage.setItem('products', JSON.stringify(p)); }
function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(c) { localStorage.setItem('cart', JSON.stringify(c)); updateCartCount(); }

/* ================================
   Cart Count Update
================================= */
function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (!el) return;
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  el.innerText = count;
}

/* ================================
   Shop Page – Render Products
================================= */
function renderProductsList() {
  const products = loadProducts();
  const shop = document.getElementById('products');
  if (!shop) return;

  shop.innerHTML = '';
  products.forEach(p => {
    const el = document.createElement('div');
    el.className = 'product card';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="price">₹${p.price}</div>
      <button class="btn" onclick="addToCart(${p.id}, this)">Add to Cart</button>
    `;
    shop.appendChild(el);
  });
}

/* ================================
   Add to Cart Function
================================= */
function addToCart(productId, btn) {
  const products = loadProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
  if (item) item.quantity += 1;
  else cart.push({ productId, quantity: 1, name: product.name, price: product.price, image: product.image });

  saveCart(cart);
  updateCartCount();

  // Visual feedback instead of alert
  btn.innerText = "✓ Added!";
  btn.disabled = true;
  setTimeout(() => {
    btn.innerText = "Add to Cart";
    btn.disabled = false;
  }, 1200);
}

/* ================================
   Cart Page Rendering
================================= */
function renderCartPage() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  const cart = getCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('cart-summary').innerHTML = '';
    return;
  }

  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.quantity;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1">
        <strong>${item.name}</strong>
        <p>₹${item.price} × ${item.quantity}</p>
      </div>
      <div>
        <button class="btn ghost" onclick="removeFromCart(${idx})">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  document.getElementById('cart-summary').innerHTML = `
    <h3>Total: ₹${total}</h3>
    <div style="margin-top:12px">
      <button class="btn" onclick="checkout()">Checkout</button>
      <button class="btn ghost" onclick="clearCart()">Clear Cart</button>
    </div>
  `;
}

function removeFromCart(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart);
  renderCartPage();
}

function clearCart() {
  localStorage.removeItem('cart');
  renderCartPage();
  updateCartCount();
}

function checkout() {
  clearCart();
  alert("Thank you for shopping with TechStore!");
}

/* ================================
   Initialize All Pages
================================= */
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  updateCartCount();
  renderProductsList();
  renderCartPage();
});
