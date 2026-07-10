const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const authController = require('../controllers/authController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { status: 'error', message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

const signupValidation = [
  body('fullName')
    .trim().notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Full name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional()
    .matches(/^01[0125][0-9]{8}$/).withMessage('Invalid Egyptian phone number (must be 11 digits starting with 01)'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  body('role')
    .optional()
    .isIn(['user', 'owner']).withMessage('Role must be user or owner'),
  validate
];

const loginValidation = [
  body('identifier').trim().notEmpty().withMessage('Email or phone is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const verifyValidation = [
  body('identifier').trim().notEmpty().withMessage('Email or phone is required'),
  body('code')
    .trim().notEmpty().withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Verification code must be 6 digits'),
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
router.post('/resend-otp', forgotPasswordValidation, authController.resendOTP);

module.exports = router;
