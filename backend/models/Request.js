const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  bookTitle: { type: String, required: true },
  bookImage: { type: String },
  status: { type: String, default: 'Pending' }, // Pending, Approved, HandedOver
  handoverDate: { type: Date },
  dueDate: { type: Date },
  renewalCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);