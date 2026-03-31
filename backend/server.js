const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); 
const bookRoutes = require('./routes/books'); // <--- Ee line add chesa (Check file name correctly)
const wishlistRoutes = require('./routes/wishlistRoutes');
// Config load chey
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

// Static folder for images
app.use('/uploads', express.static('uploads'));

// Routes Link Cheyadam
app.use('/api/auth', authRoutes); 
app.use('/api/books', bookRoutes); // <--- IDI MISS AYYINDI! Ippudu 404 error raadu.
app.use('/api/wishlist', wishlistRoutes);
// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Elahi Book Stall Database Connected!"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// Basic Route
app.get('/', (req, res) => {
  res.send("Elahi Book Stall Server is Running...");
});

// Port Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});