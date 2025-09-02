const express = require('express');
const multer = require('multer');
const router = express.Router();
const Admission = require('../models/Admission.js');
const { sendAdmissionReceipt } = require('../utils/mailer.js');  // 👈 email helper

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Submit admission form
router.post('/submit', upload.array('documents', 5), async (req, res) => {
  try {
    const { fullName, email, phone, dateOfBirth, class: studentClass, parentName, address } = req.body;
    const documents = req.files ? req.files.map(file => file.filename) : [];

    const admission = new Admission({
      fullName,
      email,
      phone,
      dateOfBirth,
      class: studentClass,
      parentName,
      address,
      documents
    });

    await admission.save();

    // Send confirmation email (non-blocking)
    let emailSent = false;
    try {
      await sendAdmissionReceipt({
        to: email,
        name: fullName,
        applicationId: admission._id.toString()
      });
      emailSent = true;
    } catch (mailErr) {
      console.error('Email error:', mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: admission._id,
      emailSent
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error submitting application'
    });
  }
});

// Get all admissions (no middleware)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const admissions = await Admission.find(filter).sort({ submittedAt: -1 });

    res.json({
      success: true,
      admissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admissions'
    });
  }
});

// Update admission status (no middleware)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      admission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating status'
    });
  }
});

module.exports = router;
