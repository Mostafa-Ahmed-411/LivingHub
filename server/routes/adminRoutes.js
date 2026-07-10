const express = require('express');
const { body } = require('express-validator');
const auth = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roles');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');
const adminController = require('../controllers/adminController');

const router = express.Router();

const rejectValidation = [
  body('reason').trim().notEmpty().withMessage('Rejection reason is required'),
  validate
];

const adValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('targetLocation').isIn(['home', 'search', 'dashboard']).withMessage('Invalid location'),
  body('startDate').isISO8601().withMessage('Invalid start date format'),
  body('endDate').isISO8601().withMessage('Invalid end date format'),
  validate
];

// All admin routes require admin role
router.use(auth, checkRole('admin'));

// Stats & Pendings
router.get('/stats', adminController.getDashboardStats);
router.get('/pendings', adminController.getPendings);

// Approvals / Rejections
router.post('/units/:id/approve', adminController.approveUnit);
router.post('/units/:id/reject', rejectValidation, adminController.rejectUnit);
router.post('/payments/:id/approve', adminController.approvePayment);
router.post('/payments/:id/reject', rejectValidation, adminController.rejectPayment);

// User Management
router.get('/users', adminController.getUsers);
router.post('/users/:id/ban', adminController.toggleUserBan);
router.post('/users/:id/flag', adminController.flagUser);

// Ads Management
router.post('/ads', upload('ads').single('image'), adValidation, adminController.createAd);
router.get('/ads', adminController.getAds);
router.post('/ads/:id/toggle', adminController.toggleAdStatus);

module.exports = router;
