const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); 
const bookRoutes = require('./routes/books'); 
const wishlistRoutes = require('./routes/wishlistRoutes');

dotenv.config();
const app = express();

// --- SINGLE SOLID CORS & PRE-FLIGHT MIDDLEWARE ---
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173', 
    'https://book-stall-25935.web.app', 
    'https://book-stall-25935.firebaseapp.com'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Mobile apps leda direct requests ni allow cheyadaniki
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// --- MIDDLEWARES ---
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));

// --- ROUTES ---
app.use('/api/auth', authRoutes); 
app.use('/api/books', bookRoutes); 
app.use('/api/wishlist', wishlistRoutes);

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Elahi Book Stall Database Connected!"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

app.get('/', (req, res) => {
  res.send("Elahi Book Stall Server is Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});