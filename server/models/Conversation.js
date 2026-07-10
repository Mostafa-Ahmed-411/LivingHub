const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, { timestamps: true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ unitId: 1, participants: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
