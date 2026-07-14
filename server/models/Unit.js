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
  availableFrom: {
    type: Date
  },
  availableTo: {
    type: Date
  },
  distanceToUniversity: {
    type: Number,
    default: 1.0
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 1.0,
    max: 5.0
  },
  reviewsCount: {
    type: Number,
    default: 0
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
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  featureRequestStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none'
  },
  featureRequestedAt: Date,
  featuredAt: Date,
  featuredUntil: Date
}, { timestamps: true });

unitSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.isFeatured = !!(ret.isFeatured && ret.featuredUntil && new Date(ret.featuredUntil) > new Date());
    if (ret.images && Array.isArray(ret.images)) {
      ret.images = ret.images.map(img => {
        if (img && !img.startsWith('http')) {
          return `http://localhost:5000/uploads/units/${img}`;
        }
        return img;
      });
    }
    return ret;
  }
});

unitSchema.set('toObject', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.isFeatured = !!(ret.isFeatured && ret.featuredUntil && new Date(ret.featuredUntil) > new Date());
    if (ret.images && Array.isArray(ret.images)) {
      ret.images = ret.images.map(img => {
        if (img && !img.startsWith('http')) {
          return `http://localhost:5000/uploads/units/${img}`;
        }
        return img;
      });
    }
    return ret;
  }
});

unitSchema.index({ status: 1, isActive: 1 });
unitSchema.index({ ownerId: 1 });
unitSchema.index({ 'address.governorate': 1, 'address.city': 1 });
unitSchema.index({ price: 1 });

module.exports = mongoose.model('Unit', unitSchema);
