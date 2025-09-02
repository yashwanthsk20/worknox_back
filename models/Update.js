const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, default: 'general' }, // announcement, deadline, result, general
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Create model
const Update = mongoose.model('Update', updateSchema);

// Export model
module.exports = Update;
