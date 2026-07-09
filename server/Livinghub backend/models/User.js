const mongoose = require('mongoose');
const { ROLES, ACCOUNT_STATUSES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ROLES,
    default: 'user'
  },
  accountStatus: {
    type: String,
    enum: ACCOUNT_STATUSES,
    default: 'pending_verification'
  },
  profileImage: String,
  verificationCode: String,
  verificationCodeExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  refreshTokens: [String],
  isFlagged: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
