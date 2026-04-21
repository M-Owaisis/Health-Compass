const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendSpecialistContactEmail } = require('../middleware/emailService');

// @desc    Send contact request to clinical specialist
// @route   POST /api/support/contact
// @access  Private (Pro only - enforcement handled here or via middleware)
router.post('/contact', protect, async (req, res) => {
  try {
    const { patientName, message } = req.body;
    const caregiverEmail = req.user.email;

    if (!patientName || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Patient name and message are required.' 
      });
    }

    // Double check subscription tier (optional but recommended)
    if (req.user.subscriptionTier !== 'pro') {
      return res.status(403).json({
        success: false,
        message: 'Priority specialist support is only available for Pro members.'
      });
    }

    const emailResult = await sendSpecialistContactEmail(patientName, caregiverEmail, message);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: 'Message sent to specialist successfully.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email.',
        error: emailResult.error
      });
    }
  } catch (error) {
    console.error('Contact specialist error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

module.exports = router;
