const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const File = require('../models/File.model');
const upload = require('../middleware/upload.middleware');
const { optionalAuth } = require('../middleware/auth.middleware');
const path = require('path');
const fs = require('fs');

// Tier limits configuration
const TIER_LIMITS = {
  anonymous: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    linkValidity: 1 // 1 day
  },
  signed: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    linkValidity: 7 // 7 days
  },
  paid: {
    maxFileSize: 500 * 1024 * 1024, // 500MB
    linkValidity: 30 // 30 days
  }
};

// Upload file
router.post('/upload', optionalAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Determine user tier
    const userTier = req.user ? req.user.tier : 'anonymous';
    const tierLimit = TIER_LIMITS[userTier];

    // Check file size against tier limit
    if (req.file.size > tierLimit.maxFileSize) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        message: `File size exceeds limit for ${userTier} tier (${tierLimit.maxFileSize / (1024 * 1024)}MB)` 
      });
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + tierLimit.linkValidity);

    // Create file record
    const fileData = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      userId: req.user ? req.user._id : null,
      userTier: userTier,
      expiresAt: expiresAt,
      securityPin: req.body.securityPin || null
    };

    const file = new File(fileData);
    await file.save();

    // Build frontend share URL:
    const getFrontendBase = (req) => {
      if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL.replace(/\/$/, '');
      // Use X-Forwarded-Proto and X-Forwarded-Host when behind proxies
      const xfProto = req.get('X-Forwarded-Proto');
      const xfHost = req.get('X-Forwarded-Host') || req.get('X-Forwarded-Server');
      if (xfProto && xfHost) return `${xfProto}://${xfHost}`;
      // Use origin header if present
      const origin = req.get('origin');
      if (origin) return origin.replace(/\/$/, '');
      // Use protocol and host from request
      const host = req.get('host');
      if (host) return `${req.protocol}://${host}`;
      return 'http://localhost:5173';
    };

    const frontendBase = getFrontendBase(req);
    const shareUrl = `${frontendBase}/download/${file.shortUrl}`;

    // Generate QR code (store as data URL)
    try {
      const qrCodeData = await QRCode.toDataURL(shareUrl);
      file.qrCode = qrCodeData;
      await file.save();
    } catch (qrErr) {
      // Log QR generation error but don't fail the upload
      console.error('QR code generation failed:', qrErr.message || qrErr);
    }

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        originalName: file.originalName,
        shortUrl: file.shortUrl,
        shareUrl: shareUrl,
        qrCode: file.qrCode,
        expiresAt: file.expiresAt,
        fileSize: file.fileSize
      }
    });
  } catch (error) {
    // Clean up file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get file info by short URL
router.get('/:shortUrl', async (req, res) => {
  try {
    const file = await File.findOne({ shortUrl: req.params.shortUrl });

    if (!file) {
      return res.status(404).json({ message: 'File not found or expired' });
    }

    // Check if file is expired
    if (new Date() > file.expiresAt) {
      return res.status(410).json({ message: 'File has expired' });
    }

    // Construct share URL using same helper so result matches upload-generated link
    const getFrontendBase = (req) => {
      if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL.replace(/\/$/, '');
      const xfProto = req.get('X-Forwarded-Proto');
      const xfHost = req.get('X-Forwarded-Host') || req.get('X-Forwarded-Server');
      if (xfProto && xfHost) return `${xfProto}://${xfHost}`;
      const origin = req.get('origin');
      if (origin) return origin.replace(/\/$/, '');
      const host = req.get('host');
      if (host) return `${req.protocol}://${host}`;
      return 'http://localhost:5173';
    };

    const frontendBase = getFrontendBase(req);
    const shareUrl = `${frontendBase}/download/${file.shortUrl}`;

    // Generate QR code on-the-fly if missing
    if (!file.qrCode) {
      try {
        const qrCodeData = await QRCode.toDataURL(shareUrl);
        file.qrCode = qrCodeData;
        await file.save();
      } catch (qrErr) {
        console.error('QR code generation failed:', qrErr.message || qrErr);
      }
    }

    res.json({
      file: {
        id: file._id,
        originalName: file.originalName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        requiresPin: !!file.securityPin,
        expiresAt: file.expiresAt,
        downloadCount: file.downloadCount,
        shortUrl: file.shortUrl,
        shareUrl: shareUrl,
        qrCode: file.qrCode
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download file
router.post('/download/:shortUrl', async (req, res) => {
  try {
    const file = await File.findOne({ shortUrl: req.params.shortUrl });

    if (!file) {
      return res.status(404).json({ message: 'File not found or expired' });
    }

    // Check if file is expired
    if (new Date() > file.expiresAt) {
      return res.status(410).json({ message: 'File has expired' });
    }

    // Check security PIN if required
    if (file.securityPin && file.securityPin !== req.body.pin) {
      return res.status(401).json({ message: 'Invalid security PIN' });
    }

    // Check if file exists
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Update download count and last accessed
    file.downloadCount += 1;
    file.lastAccessed = new Date();
    await file.save();

    // Send file
    res.download(file.filePath, file.originalName);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
