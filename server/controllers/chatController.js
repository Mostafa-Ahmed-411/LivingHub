const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Unit = require('../models/Unit');
const AppError = require('../utils/AppError');

const startOrGetConversation = async (req, res, next) => {
  try {
    const { unitId } = req.body;
    const userId = req.user._id;

    const unit = await Unit.findById(unitId);
    if (!unit) {
      throw new AppError('Unit not found', 404);
    }

    if (unit.ownerId.toString() === userId.toString()) {
      throw new AppError('You cannot start a conversation with yourself', 400);
    }

    let conversation = await Conversation.findOne({
      unitId,
      participants: { $all: [userId, unit.ownerId] }
    }).populate('participants', 'fullName profileImage');

    if (!conversation) {
      conversation = await Conversation.create({
        unitId,
        participants: [userId, unit.ownerId]
      });
      conversation = await conversation.populate('participants', 'fullName profileImage');
    }

    res.json({ conversation });
  } catch (error) {
    next(error);
  }
};

const getMyConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'fullName profileImage')
      .populate('unitId', 'unitType price address status')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json({ conversations });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      throw new AppError('Conversation not found or access denied', 404);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [messages, total] = await Promise.all([
      Message.find({ conversationId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Message.countDocuments({ conversationId })
    ]);

    // Return messages in chronological order for frontend display
    res.json({
      messages: messages.reverse(),
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { startOrGetConversation, getMyConversations, getMessages };
