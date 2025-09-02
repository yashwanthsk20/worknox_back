const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  class: { type: String, required: true },
  parentName: { type: String, required: true },
  address: { type: String, required: true },
  documents: [String],
  status: { type: String, default: 'pending' }, // pending, approved, rejected
  submittedAt: { type: Date, default: Date.now }
});

// Export model
const Admission = mongoose.model('Admission', admissionSchema);
module.exports = Admission;
