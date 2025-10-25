import mongoose from 'mongoose';
import shortid from 'shortid';

export const fileSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
    min: [1, 'File size must be greater than 0 bytes'],
    max: [1073741824, 'File size exceeds the maximum limit of 1GB'],
  },
  mimeType: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    unique: true,
    default: shortid.generate,
  },
  qrCode: {
    type: String,
    unique: true,
  },
  securityPin: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastAccessedAt: {
    type: Date,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  userTier: {
    type: String,
    enum: ['anonymous', 'free', 'premium'],
    default: 'anonymous',
    required: true,
  },
  expiresAt: {
    type: Date,
    default: null,
    index: { expires: 0 },
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  lastDownloadedAt: {
    type: Date,
    default: null,
  },
  storageProvider: {
    type: String,
    enum: ['local', 's3', 'cloudinary'],
    default: 'local',
  },
});

// Auto-calculate expiry based on user tier
fileSchema.pre('save', function (next) {
  if (!this.expiresAt) {
    const now = new Date();
    const validityMinutes =
      this.userTier === 'premium' ? 1440 :
      this.userTier === 'free' ? 60 : 30;
    this.expiresAt = new Date(now.getTime() + validityMinutes * 60000);
  }
  next();
});

export const File = mongoose.model('File', fileSchema);
