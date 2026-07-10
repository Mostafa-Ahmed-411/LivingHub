const mongoose = require('mongoose');
const { ROLES, ACCOUNT_STATUSES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  secondName: {
    type: String,
    trim: true
  },
  thirdName: {
    type: String,
    trim: true
  },
  fourthName: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female']
  },
  governorate: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  isStudent: {
    type: Boolean,
    default: true
  },
  college: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    trim: true
  },
  occupation: {
    type: String,
    trim: true
  },
  alternativePhone: {
    type: String,
    trim: true
  },
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

userSchema.pre('validate', function(next) {
  if (this.firstName && this.secondName) {
    this.fullName = [this.firstName, this.secondName, this.thirdName, this.fourthName]
      .filter(Boolean)
      .join(' ');
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
