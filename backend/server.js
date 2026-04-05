const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); 
const bookRoutes = require('./routes/books'); 
const wishlistRoutes = require('./routes/wishlistRoutes');

dotenv.config();
const app = express();

// --- CORS CONFIGURATION (Idi okkate unchu mama) ---
const allowedOrigins = [
  'http://localhost:5173', 
  'https://book-stall-25935.web.app', 
  'https://book-stall-25935.firebaseapp.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS block chesindi mama!'));
    }
  },
  credentials: true
}));

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