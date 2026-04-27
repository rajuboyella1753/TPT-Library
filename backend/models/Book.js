const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, default: 'Spiritual' },
  image: { type: String, required: true },
  description: { type: String },
  totalCopies: { type: Number, default: 1 }, // Kotha field
  availableCopies: { type: Number, default: 1 }, // Kotha field
  status: { 
    type: String, 
    enum: ['Available', 'Borrowed', 'Out of Stock'], 
    default: 'Available' 
  },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);