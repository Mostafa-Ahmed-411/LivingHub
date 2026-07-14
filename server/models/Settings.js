const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  maxFreeUnitsPerOwner: {
    type: Number,
    default: 2,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
