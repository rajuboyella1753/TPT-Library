const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // sparse: true valla email leni (null) users ni MongoDB allow chestundi
  email: { 
    type: String, 
    unique: true, 
    sparse: true, 
    lowercase: true, // Email eppudu lowercase lo undela chustundi
    trim: true 
  }, 
  userId: { 
    type: String, 
    unique: true, 
    sparse: true,
    trim: true 
  }, 
  password: { type: String, required: true },
  gender: { 
    type: String, 
    enum: ['Male', 'Female'], 
    required: true
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  role: { 
    type: String, 
    enum: ['student', 'admin', 'super-admin'], 
    default: 'student' 
  },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);