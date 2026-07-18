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
    required: true, // تم إبقاؤه إجبارياً ولكن سنضمن تعبئته دائماً في الـ pre-validate
    trim: true,
    minlength: 2,
    maxlength: 150 // زيادة المساحة لتستوعب الأسماء الطويلة المركبة
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
  },
  freeUnlocksUsed: {
    type: Number,
    default: 0
  },
  paidUnlocksRemaining: {
    type: Number,
    default: 0
  },
  paidUnlocksExpiresAt: Date,
  unlockedUnits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit'
  }]
}, { timestamps: true });

// ضمان بناء الـ fullName دائماً لتخطي شرط الـ Validation بنجاح
userSchema.pre('validate', function(next) {
  const parts = [this.firstName, this.secondName, this.thirdName, this.fourthName].filter(Boolean);
  
  if (parts.length > 0) {
    this.fullName = parts.join(' ');
  } else if (!this.fullName) {
    // حل احتياطي في حال عدم إرسال حقول الأسماء المنفصلة من الواجهة
    this.fullName = "New User"; 
  }
  next();
});

module.exports = mongoose.model('User', userSchema);