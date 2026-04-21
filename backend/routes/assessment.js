// backend/routes/assessment.js
const express = require('express');
const router = express.Router();
const mlService = require('../services/mlService');
const { protect } = require('../middleware/auth');
const AssessmentHistory = require('../models/AssessmentHistory');

router.post('/classify-risk', protect, async (req, res) => {
  try {
    const { assessmentResults, profile } = req.body;
    
    if (!assessmentResults || !profile) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: assessmentResults and profile'
      });
    }
    
    const result = await mlService.classifyRisk(assessmentResults, profile);
    
    res.json(result);
  } catch (error) {
    console.error('Classification route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

router.get('/ml-health', async (req, res) => {
  const health = await mlService.healthCheck();
  res.json(health);
});

const User = require('../models/User');

// Save assessment to history
router.post('/save-result', protect, async (req, res) => {
  try {
    const { profile, scores, prediction, interpretation } = req.body;
    console.log("SAVE-RESULT PAYLOAD:", JSON.stringify(req.body, null, 2));
    
    const historyEntry = await AssessmentHistory.create({
      caregiverId: req.user._id,
      patientProfile: profile,
      scores,
      prediction,
      interpretation
    });
    
    res.status(201).json({
      success: true,
      data: historyEntry
    });
  } catch (error) {
    console.error('Failed to save assessment result:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not save assessment history.'
    });
  }
});

// Get user's assessment history
router.get('/history', protect, async (req, res) => {
  try {
    const history = await AssessmentHistory.find({ caregiverId: req.user._id })
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Failed to get history:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not fetch history.'
    });
  }
});

module.exports = router;