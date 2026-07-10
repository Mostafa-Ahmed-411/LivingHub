const express = require('express');
const { body } = require('express-validator');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');
const userDashboardController = require('../controllers/userDashboardController');

const router = express.Router();

const updateProfileValidation = [
  body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty').isLength({ min: 2, max: 50 }),
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('secondName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Second name must be between 2 and 50 characters'),
  body('thirdName').optional({ checkFalsy: true }).trim().isLength({ min: 2, max: 50 }),
  body('fourthName').optional({ checkFalsy: true }).trim().isLength({ min: 2, max: 50 }),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email format').normalizeEmail(),
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
    .matches(/^01[0125][0-9]{8}$/).withMessage('Invalid Egyptian phone number'),
  body('gender').optional().isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  body('governorate').optional().trim().notEmpty(),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('isStudent')
    .optional()
    .customSanitizer(value => {
      if (value === 'true' || value === true || value === 'on') return true;
      if (value === 'false' || value === false) return false;
      return value;
    }),
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

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/\d/).withMessage('New password must contain at least one number'),
  validate
];

// All user dashboard routes require authentication
router.use(auth);

// It's accessible to 'user' and technically 'owner' since owners can also be tenants
router.get('/stats', userDashboardController.getDashboardStats);
router.get('/profile', userDashboardController.getProfile);
router.put('/profile', upload('profiles').single('profileImage'), updateProfileValidation, userDashboardController.updateProfile);
router.put('/change-password', changePasswordValidation, userDashboardController.changePassword);
router.get('/units', userDashboardController.getMyUnits);
router.get('/history', userDashboardController.getMyHistory);

module.exports = router;
