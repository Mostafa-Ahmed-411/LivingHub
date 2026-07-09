const mongoose = require('mongoose');
const { UNIT_TYPES, LISTING_TYPES, UNIT_STATUSES } = require('../utils/constants');

const unitSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  unitType: {
    type: String,
    enum: UNIT_TYPES,
    required: true
  },
  listingType: {
    type: String,
    enum: LISTING_TYPES,
    required: true
  },
  specifications: {
    type: mongoose.Schema.Types.Mixed
  },
  bedsPerRoom: Number,
  roomsPerApartment: Number,
  floorNumber: Number,
  address: {
    governorate: { type: String, required: true },
    city: { type: String, required: true },
    street: String,
    nearestUniversity: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: String,
  images: [String],
  status: {
    type: String,
    enum: UNIT_STATUSES,
    default: 'pending_payment'
  },
  rejectionReason: String,
  isActive: {
    type: Boolean,
    default: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

unitSchema.index({ status: 1, isActive: 1 });
unitSchema.index({ ownerId: 1 });
unitSchema.index({ 'address.governorate': 1, 'address.city': 1 });
unitSchema.index({ price: 1 });

module.exports = mongoose.model('Unit', unitSchema);
