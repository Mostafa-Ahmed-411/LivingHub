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

const adUpdateValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('targetLocation').optional().isIn(['home', 'search', 'dashboard']).withMessage('Invalid location'),
  body('startDate').optional().isISO8601().withMessage('Invalid start date format'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date format'),
  validate
];

// All admin routes require admin role
router.use(auth, checkRole('admin'));

const settingsValidation = [
  body('maxFreeUnitsPerOwner')
    .isInt({ min: 1 })
    .withMessage('maxFreeUnitsPerOwner must be a positive integer'),
  validate
];

router.get('/settings', adminController.getSettings);
router.patch('/settings', settingsValidation, adminController.updateSettings);

// Stats & Pendings
router.get('/stats', adminController.getDashboardStats);
router.get('/pendings', adminController.getPendings);
router.get('/units/pending', adminController.getPendingUnits);

// Approvals / Rejections
router.post('/units/:id/approve', adminController.approveUnit);
router.patch('/units/:id/approve', adminController.approveUnit);
router.post('/units/:id/reject', rejectValidation, adminController.rejectUnit);
router.patch('/units/:id/reject', rejectValidation, adminController.rejectUnit);
router.post('/payments/:id/approve', adminController.approvePayment);
router.post('/payments/:id/reject', rejectValidation, adminController.rejectPayment);

// Feature Request Management
router.get('/units/feature-requests', adminController.getFeatureRequests);
router.patch('/units/:id/approve-feature', adminController.approveFeature);
router.patch('/units/:id/reject-feature', adminController.rejectFeature);

// User Management
router.get('/users', adminController.getUsers);
router.post('/users/:id/ban', adminController.toggleUserBan);
router.post('/users/:id/flag', adminController.flagUser);

// Ads Management
router.post('/ads', upload('ads').single('image'), adValidation, adminController.createAd);
router.get('/ads', adminController.getAds);
router.patch('/ads/:id', upload('ads').single('image'), adUpdateValidation, adminController.updateAd);
router.delete('/ads/:id', adminController.deleteAd);
router.post('/ads/:id/toggle', adminController.toggleAdStatus);

// Audit Logs
router.get('/audit-logs', adminController.getAuditLogs);

// Reports
router.get('/reports', adminController.getReports);
router.patch('/reports/:id/resolve', adminController.resolveReport);
router.patch('/reports/:id/dismiss', adminController.dismissReport);

module.exports = router;
