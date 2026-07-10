const mongoose = require('mongoose');
const { AUDIT_ACTIONS } = require('../utils/constants');

const auditLogSchema = new mongoose.Schema({
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: AUDIT_ACTIONS,
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetType: {
    type: String,
    enum: ['Unit', 'Payment', 'User'],
    required: true
  },
  reason: String,
  previousData: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

auditLogSchema.index({ targetId: 1, action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
