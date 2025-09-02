const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin'], // ✅ restricts values to only these
    default: 'user'          // ✅ default role for new accounts
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);
