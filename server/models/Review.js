const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// منع الطالب من تقييم نفس السكن أكتر من مرة واحدة
reviewSchema.index({ unitId: 1, tenantId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);