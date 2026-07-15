const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const authController = require('../controllers/authController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 51,
  message: { status: 'error', message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

const signupValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('secondName')
    .trim()
    .notEmpty().withMessage('Second name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Second name must be between 2 and 50 characters'),
  body('thirdName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Third name must be between 2 and 50 characters'),
  body('fourthName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Fourth name must be between 2 and 50 characters'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .customSanitizer(value => {
      if (!value) return value;
      let clean = value.replace(/[\s-+]/g, '');
      if (clean.startsWith('20') && clean.length === 12) {
        clean = '0' + clean.slice(2);
      }
      return clean;
    })
    .matches(/^01[0125][0-9]{8}$/).withMessage('Invalid Egyptian phone number (must be 11 digits starting with 01)'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['student', 'owner', 'user']).withMessage('Role must be student, user, or owner'),
  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  body('governorate')
    .trim()
    .notEmpty().withMessage('Governorate is required'),
  body('dateOfBirth')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Invalid date format for date of birth'),
  body('isStudent')
    .optional()
    .customSanitizer(value => {
      if (value === 'true' || value === true || value === 'on') return true;
      if (value === 'false' || value === false) return false;
      return value;
    }),
  body('college')
    .optional({ checkFalsy: true })
    .trim(),
  body('year')
    .optional({ checkFalsy: true })
    .trim(),
  body('occupation')
    .optional({ checkFalsy: true })
    .trim(),
  body('alternativePhone')
    .optional({ checkFalsy: true })
    .customSanitizer(value => {
      if (!value) return value;
      let clean = value.replace(/[\s-+]/g, '');
      if (clean.startsWith('20') && clean.length === 12) {
        clean = '0' + clean.slice(2);
      }
      return clean;
    })
    .matches(/^01[0125][0-9]{8}$/).withMessage('Invalid Egyptian alternative phone number'),
  validate
];

const loginValidation = [
  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const verifyValidation = [
  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('code')
    .trim().notEmpty().withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Verification code must be 6 digits'),
  validate
];

const resendOTPValidation = [
  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  validate
];

const forgotPasswordValidation = [
  body('identifier').trim().notEmpty().withMessage('Email or phone is required'),
  validate
];

const resetPasswordValidation = [
  body('token').trim().notEmpty().withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  validate
];

router.post('/signup', signupValidation, authController.signup);
router.post('/verify', verifyValidation, authController.verifyAccount);
router.post('/login', loginLimiter, loginValidation, authController.login);
router.post('/refresh', authController.refreshAccessToken);
router.post('/logout', auth, authController.logout);
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);
router.post('/resend-otp', resendOTPValidation, authController.resendOTP);

module.exports = router;