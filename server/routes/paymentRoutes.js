const express = require('express');
const { body } = require('express-validator');
const auth = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roles');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

const initiatePaymentValidation = [
  body('unitId').isMongoId().withMessage('Invalid unit ID'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('method').isIn(['vodafone_cash', 'instapay', 'bank_transfer', 'online_gateway']).withMessage('Invalid payment method'),
  validate
];

// All payment routes require owner role
router.use(auth, checkRole('owner'));

router.post(
  '/initiate',
  upload('payments').single('proofImage'),
  initiatePaymentValidation,
  paymentController.initiatePayment
);

router.get('/my-payments', paymentController.getMyPayments);

module.exports = router;
