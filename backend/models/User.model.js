import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    default: function() {
      return this.email ? this.email.split('@')[0] : '';
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  tier: {
    type: String,
    enum: ['anonymous', 'free', 'premium'],
    default: 'free'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'expired', 'none'],
    default: 'none'
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  uploadCount: {
    type: Number,
    default: 0
  },
  totalDownloads: {
    type: Number,
    default: 0
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  tier: { type: String, enum: ['anonymous', 'signed', 'paid'], default: 'signed' }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};


// Compare entered password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check premium status
userSchema.methods.isPremium = function() {
  return this.tier === 'premium' && this.subscriptionStatus === 'active';
};

// Auto-expire subscriptions (optional)
userSchema.methods.checkSubscriptionStatus = function() {
  if (this.subscriptionEndDate && this.subscriptionEndDate < new Date()) {
    this.tier = 'free';
    this.subscriptionStatus = 'expired';
  }
};

module.exports = mongoose.model('User', userSchema);
