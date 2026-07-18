const mongoose = require('mongoose');
const { AD_LOCATIONS } = require('../utils/constants');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  targetLocation: {
    type: String,
    enum: AD_LOCATIONS,
    required: true
  },
  linkUrl: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);
