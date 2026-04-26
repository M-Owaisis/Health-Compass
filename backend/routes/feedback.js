const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/feedback/submit
// @desc    Submit user feedback for Phase 4A
// @access  Public
router.post('/submit', async (req, res) => {
  try {
    const feedbackData = req.body;
    
    const newFeedback = new Feedback(feedbackData);
    await newFeedback.save();
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: newFeedback
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving feedback'
    });
  }
});

// @route   GET /api/feedback/all
// @desc    Get all feedback entries
// @access  Admin Only
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching feedbacks'
    });
  }
});

module.exports = router;
