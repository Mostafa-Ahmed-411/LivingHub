const User = require('../models/User');
const Unit = require('../models/Unit');
const AppError = require('../utils/AppError');
const bcrypt = require('bcryptjs');

const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalBookings, activeBookings, completedTransactions] = await Promise.all([
      Unit.countDocuments({ tenantId: userId }), // all history
      Unit.countDocuments({ tenantId: userId, status: 'rented' }),
      Unit.countDocuments({ tenantId: userId, status: { $in: ['rented', 'sold'] } })
    ]);

    res.json({
      stats: {
        totalBookings,
        activeBookings,
        completedTransactions
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshTokens');
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, phone } = req.body;
    const user = await User.findById(req.user._id);

    // Email/phone uniqueness is handled by Mongoose unique indexes (will throw 11000 handled by errorHandler)
    if (fullName) user.fullName = fullName;
    if (email) user.email = email.toLowerCase();
    if (phone) user.phone = phone;

    if (req.file) {
      user.profileImage = req.file.filename;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError('Incorrect current password', 400);
    }

    user.password = await bcrypt.hash(newPassword, 12);
    // Optional: could invalidate all refreshTokens here if strict security is required
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

const getMyUnits = async (req, res, next) => {
  try {
    const units = await Unit.find({ tenantId: req.user._id, status: 'rented' })
      .populate('ownerId', 'fullName profileImage phone')
      .sort({ updatedAt: -1 });

    res.json({ units });
  } catch (error) {
    next(error);
  }
};

const getMyHistory = async (req, res, next) => {
  try {
    const history = await Unit.find({ tenantId: req.user._id, status: { $in: ['rented', 'sold'] } })
      .populate('ownerId', 'fullName profileImage')
      .sort({ updatedAt: -1 });

    res.json({ history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getProfile,
  updateProfile,
  changePassword,
  getMyUnits,
  getMyHistory
};
