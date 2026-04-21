const express = require('express');
const router = express.Router();
const { 
  generateTests, 
  generateAdaptiveQuestion, 
  getCognitiveDomains,
  calculateMocaScore 
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// Generate full test set (enhanced with MoCA standards)
router.post('/generate-tests', protect, generateTests);

// Generate single adaptive question (GRE-style)
router.post('/adaptive-question', protect, generateAdaptiveQuestion);

// Get cognitive domain information
router.get('/domains', getCognitiveDomains);

// Calculate MoCA-equivalent score
router.post('/calculate-score', protect, calculateMocaScore);

module.exports = router;
