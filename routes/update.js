const express = require('express');
const authMiddleware = require('../auth.middleware.js');
const Update = require('../models/Update');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const updates = await Update.find({ isActive: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      updates
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching updates' 
    });
  }
});

// Create update (Admin only)
router.post('/add',  async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { title, content, type } = req.body;

    const update = new Update({
      title,
      content,
      type
    });

    await update.save();

    res.status(201).json({
      success: true,
      message: 'Update created successfully',
      update
    });
  } catch (error) {
    console.error("Error saving update:", error); 
    res.status(500).json({ 
      success: false, 
      message: 'Error creating update' 
    });
  }
});

// Delete update (Admin only)
router.delete('/:id',  async (req, res) => {
  try {
    await Update.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Update deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting update' 
    });
  }
});

module.exports = router;