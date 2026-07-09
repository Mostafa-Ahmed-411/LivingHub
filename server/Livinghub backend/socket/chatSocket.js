const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const { containsBlockedContent } = require('../utils/messageFilter');

module.exports = (io) => {
  // Authentication middleware for sockets
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    // Join a room specific to this user to receive personal notifications
    socket.join(`user_${socket.userId}`);

    socket.on('joinConversation', async ({ conversationId }) => {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.userId
      });

      if (conversation) {
        socket.join(`conv_${conversationId}`);
      }
    });

    socket.on('sendMessage', async (data, callback) => {
      try {
        const { conversationId, content } = data;

        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: socket.userId
        });

        if (!conversation) return callback({ error: 'Conversation not found' });

        const blockedReason = containsBlockedContent(content);
        if (blockedReason) return callback({ error: blockedReason });

        const message = await Message.create({
          conversationId,
          senderId: socket.userId,
          content
        });

        conversation.lastMessage = message._id;
        await conversation.save();

        // Broadcast to others in the conversation room
        socket.to(`conv_${conversationId}`).emit('messageReceived', message);

        // Send notification to the other participant
        const receiverId = conversation.participants.find(id => id.toString() !== socket.userId.toString());
        if (receiverId) {
          const notification = await Notification.create({
            userId: receiverId,
            type: 'chat',
            message: 'You have a new message',
            relatedEntityId: conversationId
          });
          
          io.to(`user_${receiverId}`).emit('newNotification', notification);
        }

        callback({ success: true, message });
      } catch (err) {
        callback({ error: 'Failed to send message' });
      }
    });

    socket.on('markAsRead', async ({ messageIds }) => {
      try {
        await Message.updateMany(
          { _id: { $in: messageIds }, senderId: { $ne: socket.userId } },
          { $set: { isRead: true } }
        );
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    });

    socket.on('disconnect', () => {
      // Socket.io handles leaving rooms automatically
    });
  });
};
