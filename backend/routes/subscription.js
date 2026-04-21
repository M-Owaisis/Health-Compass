const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Upgrade subscription tier
router.post('/upgrade', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    
    // Validate plan
    const validPlans = ['free', 'basic', 'pro'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan selected.'
      });
    }

    // Update user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.subscriptionTier = plan;
    await user.save();

    // Send confirmation email
    const { sendSubscriptionEmail } = require('../middleware/emailService');
    await sendSubscriptionEmail(user.email, user.name, plan);

    res.status(200).json({
      success: true,
      data: {
        subscriptionTier: user.subscriptionTier
      },
      message: `Successfully upgraded to ${plan.toUpperCase()} plan!`
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not update subscription.'
    });
  }
});

// Get current subscription status
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscriptionTier');
    res.status(200).json({
      success: true,
      data: {
        subscriptionTier: user.subscriptionTier
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not fetch subscription status' });
  }
});

module.exports = router;
