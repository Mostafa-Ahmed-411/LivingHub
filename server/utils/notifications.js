const Notification = require('../models/Notification');
const User = require('../models/User');

const notifyAdmins = async (app, type, message, relatedEntityId) => {
  try {
    const admins = await User.find({ role: 'admin' });
    if (!admins.length) return;

    const notificationsData = admins.map(admin => ({
      userId: admin._id,
      type,
      message,
      relatedEntityId
    }));

    const createdNotifs = await Notification.insertMany(notificationsData);
    
    // Real-time socket push
    const io = app ? app.get('io') : null;
    if (io) {
      createdNotifs.forEach(notif => {
        io.to(`user_${notif.userId}`).emit('newNotification', notif);
      });
    }
  } catch (error) {
    console.error('Error notifying admins:', error);
  }
};

const notifyUser = async (app, userId, type, message, relatedEntityId) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      message,
      relatedEntityId
    });
    
    // Real-time socket push
    const io = app ? app.get('io') : null;
    if (io) {
      io.to(`user_${userId}`).emit('newNotification', notification);
    }
    return notification;
  } catch (error) {
    console.error('Error notifying user:', error);
  }
};

const notifyAllUsers = async (app, type, message, relatedEntityId) => {
  try {
    // Notify all non-admin users
    const users = await User.find({ role: { $in: ['user', 'owner'] } });
    if (!users.length) return;

    const notificationsData = users.map(user => ({
      userId: user._id,
      type,
      message,
      relatedEntityId
    }));

    const createdNotifs = await Notification.insertMany(notificationsData);
    
    // Real-time socket push
    const io = app ? app.get('io') : null;
    if (io) {
      createdNotifs.forEach(notif => {
        io.to(`user_${notif.userId}`).emit('newNotification', notif);
      });
    }
  } catch (error) {
    console.error('Error notifying all users:', error);
  }
};

module.exports = {
  notifyAdmins,
  notifyUser,
  notifyAllUsers
};
