const mongoose = require('mongoose');
const { PAYMENT_METHODS, PAYMENT_STATUSES } = require('../utils/constants');

const paymentSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  method: {
    type: String,
    enum: PAYMENT_METHODS,
    required: true
  },
  proofImage: String,
  transactionId: String,
  status: {
    type: String,
    enum: PAYMENT_STATUSES,
    default: 'pending'
  },
  rejectionReason: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
