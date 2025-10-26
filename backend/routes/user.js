const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const File = require('../models/File.model');
const { auth } = require('../middleware/auth.middleware');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's file history
router.get('/files', auth, async (req, res) => {
  try {
    const files = await File.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-filePath');

    res.json({ files });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const files = await File.find({ userId: req.userId });

    const totalUploads = files.length;
    const totalDownloads = files.reduce((sum, file) => sum + file.downloadCount, 0);
    const totalSize = files.reduce((sum, file) => sum + file.fileSize, 0);

    res.json({
      analytics: {
        totalUploads,
        totalDownloads,
        totalSize,
        activeFiles: files.filter(f => new Date() < f.expiresAt).length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upgrade to paid tier
router.post('/upgrade', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.tier === 'paid') {
      return res.status(400).json({ message: 'User is already on paid tier' });
    }

    // In production, this would integrate with a payment gateway
    // For now, just upgrade the tier
    user.tier = 'paid';
    user.subscriptionEndDate = new Date();
    user.subscriptionEndDate.setMonth(user.subscriptionEndDate.getMonth() + 1);
    await user.save();

    res.json({
      message: 'Upgraded to paid tier successfully',
      user: {
        id: user._id,
        email: user.email,
        tier: user.tier,
        subscriptionEndDate: user.subscriptionEndDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
