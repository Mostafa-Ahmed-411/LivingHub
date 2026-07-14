const User = require('../models/User');
const Unit = require('../models/Unit');
const Payment = require('../models/Payment');
const Ad = require('../models/Ad');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const Settings = require('../models/Settings');

// --- Dashboard Stats ---
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalOwners,
      unitsByType,
      rentedUnits,
      availableUnits,
      pendingApprovals,
      pendingPayments
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'owner' }),
      Unit.aggregate([{ $group: { _id: '$unitType', count: { $sum: 1 } } }]),
      Unit.countDocuments({ status: 'rented' }),
      Unit.countDocuments({ status: 'available' }),
      Unit.countDocuments({ status: { $in: ['pending_approval', 'pending'] }, isActive: true }),
      Payment.countDocuments({ status: 'pending' })
    ]);

    res.json({
      stats: {
        totalUsers,
        totalOwners,
        unitsByType: unitsByType.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
        rentedUnits,
        availableUnits,
        pendingApprovals,
        pendingPayments
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- Pendings (Units & Payments) ---
const getPendings = async (req, res, next) => {
  try {
    const [pendingUnits, pendingPayments] = await Promise.all([
      Unit.find({ status: { $in: ['pending_approval', 'pending'] }, isActive: true })
        .populate('ownerId', 'fullName email phone')
        .sort({ createdAt: 1 }),
      Payment.find({ status: 'pending' })
        .populate('ownerId', 'fullName email phone')
        .populate('unitId', 'unitType listingType price address status')
        .sort({ createdAt: 1 })
    ]);

    res.json({ pendingUnits, pendingPayments });
  } catch (error) {
    next(error);
  }
};

const getPendingUnits = async (req, res, next) => {
  try {
    const pendingUnits = await Unit.find({ status: { $in: ['pending_approval', 'pending'] }, isActive: true })
      .populate('ownerId', 'fullName email phone')
      .sort({ createdAt: 1 });

    res.json({ success: true, units: pendingUnits });
  } catch (error) {
    next(error);
  }
};

const approveUnit = async (req, res, next) => {
  try {
    const unit = await Unit.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ['pending_approval', 'pending'] } },
      { status: 'available' },
      { new: false }
    );

    if (!unit) {
      throw new AppError('Unit not found or already processed', 404);
    }

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'approve_unit',
      targetId: unit._id,
      targetType: 'Unit',
      previousData: { status: unit.status }
    });

    await Notification.create({
      userId: unit.ownerId,
      type: 'unit_approved',
      message: 'Your unit has been approved and is now live.',
      relatedEntityId: unit._id
    });

    res.json({ message: 'Unit approved successfully' });
  } catch (error) {
    next(error);
  }
};

const rejectUnit = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) throw new AppError('Rejection reason is required', 400);

    const unit = await Unit.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ['pending_approval', 'pending'] } },
      { status: 'rejected', rejectionReason: reason },
      { new: false }
    );

    if (!unit) {
      throw new AppError('Unit not found or already processed', 404);
    }

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'reject_unit',
      targetId: unit._id,
      targetType: 'Unit',
      reason,
      previousData: { status: unit.status }
    });

    await Notification.create({
      userId: unit.ownerId,
      type: 'unit_rejected',
      message: `Your unit was rejected. Reason: ${reason}`,
      relatedEntityId: unit._id
    });

    res.json({ message: 'Unit rejected successfully' });
  } catch (error) {
    next(error);
  }
};

const approvePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      { status: 'confirmed', reviewedBy: req.user._id, reviewedAt: Date.now() },
      { new: false }
    );

    if (!payment) {
      throw new AppError('Payment not found or already processed', 404);
    }

    // Auto-advance the unit status
    const unit = await Unit.findById(payment.unitId);
    if (unit && unit.status === 'pending_payment') {
      unit.status = 'pending_approval';
      await unit.save();
    }

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'approve_payment',
      targetId: payment._id,
      targetType: 'Payment',
      previousData: { status: payment.status }
    });

    await Notification.create({
      userId: payment.ownerId,
      type: 'payment_confirmed',
      message: 'Your payment has been confirmed. Your unit is now pending approval.',
      relatedEntityId: payment.unitId
    });

    res.json({ message: 'Payment approved successfully' });
  } catch (error) {
    next(error);
  }
};

const rejectPayment = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) throw new AppError('Rejection reason is required', 400);

    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      { status: 'rejected', rejectionReason: reason, reviewedBy: req.user._id, reviewedAt: Date.now() },
      { new: false }
    );

    if (!payment) {
      throw new AppError('Payment not found or already processed', 404);
    }

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'reject_payment',
      targetId: payment._id,
      targetType: 'Payment',
      reason,
      previousData: { status: payment.status }
    });

    await Notification.create({
      userId: payment.ownerId,
      type: 'payment_rejected',
      message: `Your payment was rejected. Reason: ${reason}`,
      relatedEntityId: payment.unitId
    });

    res.json({ message: 'Payment rejected successfully' });
  } catch (error) {
    next(error);
  }
};

// --- User Management ---
const getUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) {
      query.role = role === 'student' ? 'user' : role;
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query).select('-password -refreshTokens').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query)
    ]);

    const mappedUsers = users.map(user => {
      const u = user.toObject();
      if (u.role === 'user') {
        u.role = 'student';
      }
      return u;
    });

    res.json({
      users: mappedUsers,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

const toggleUserBan = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);
    if (user.role === 'admin') throw new AppError('Cannot ban another admin', 403);

    const isBanning = user.accountStatus !== 'banned';
    user.accountStatus = isBanning ? 'banned' : 'active';
    
    // Invalidate sessions if banning
    if (isBanning) user.refreshTokens = [];
    
    await user.save();

    await AuditLog.create({
      performedBy: req.user._id,
      action: isBanning ? 'ban_user' : 'unban_user',
      targetId: user._id,
      targetType: 'User'
    });

    res.json({ message: `User ${isBanning ? 'banned' : 'unbanned'} successfully` });
  } catch (error) {
    next(error);
  }
};

const flagUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);

    user.isFlagged = !user.isFlagged;
    await user.save();

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'flag_user',
      targetId: user._id,
      targetType: 'User',
      reason: user.isFlagged ? 'User flagged for manual review' : 'User unflagged'
    });

    res.json({ message: `User ${user.isFlagged ? 'flagged' : 'unflagged'} successfully` });
  } catch (error) {
    next(error);
  }
};

// --- Ads Management ---
const createAd = async (req, res, next) => {
  try {
    const { title, targetLocation, linkUrl, startDate, endDate } = req.body;

    if (!req.file) throw new AppError('Ad image is required', 400);

    const ad = await Ad.create({
      title,
      image: req.file.filename,
      targetLocation,
      linkUrl,
      startDate,
      endDate
    });

    res.status(201).json({ message: 'Ad created successfully', ad });
  } catch (error) {
    next(error);
  }
};

const getAds = async (req, res, next) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json({ ads });
  } catch (error) {
    next(error);
  }
};

const toggleAdStatus = async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) throw new AppError('Ad not found', 404);

    ad.isActive = !ad.isActive;
    await ad.save();

    res.json({ message: `Ad ${ad.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    next(error);
  }
};

const getFeatureRequests = async (req, res, next) => {
  try {
    const units = await Unit.find({ featureRequestStatus: 'pending', isActive: true, isDeleted: { $ne: true } })
      .populate('ownerId', 'fullName email phone')
      .sort({ featureRequestedAt: 1 });

    res.json({ success: true, units });
  } catch (error) {
    next(error);
  }
};

const approveFeature = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      throw new AppError('Unit not found', 404);
    }

    if (unit.featureRequestStatus !== 'pending') {
      throw new AppError('No pending feature request found for this unit', 400);
    }

    unit.featureRequestStatus = 'approved';
    unit.isFeatured = true;
    unit.featuredAt = new Date();
    unit.featuredUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await unit.save();

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'approve_feature',
      targetId: unit._id,
      targetType: 'Unit',
      reason: 'Feature request approved'
    });

    await Notification.create({
      userId: unit.ownerId,
      type: 'feature_approved',
      message: 'Your request to feature your unit has been approved.',
      relatedEntityId: unit._id
    });

    res.json({ success: true, message: 'Feature request approved successfully', unit });
  } catch (error) {
    next(error);
  }
};

const rejectFeature = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      throw new AppError('Unit not found', 404);
    }

    if (unit.featureRequestStatus !== 'pending') {
      throw new AppError('No pending feature request found for this unit', 400);
    }

    unit.featureRequestStatus = 'rejected';
    await unit.save();

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'reject_feature',
      targetId: unit._id,
      targetType: 'Unit',
      reason: 'Feature request rejected'
    });

    await Notification.create({
      userId: unit.ownerId,
      type: 'feature_rejected',
      message: 'Your request to feature your unit has been rejected.',
      relatedEntityId: unit._id
    });

    res.json({ success: true, message: 'Feature request rejected successfully', unit });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const { maxFreeUnitsPerOwner } = req.body;
    const parsedLimit = parseInt(maxFreeUnitsPerOwner, 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      throw new AppError('maxFreeUnitsPerOwner must be a positive integer', 400);
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ maxFreeUnitsPerOwner: parsedLimit });
    } else {
      settings.maxFreeUnitsPerOwner = parsedLimit;
    }
    await settings.save();

    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    next(error);
  }
};

const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ maxFreeUnitsPerOwner: 2 });
    }
    res.json({ settings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getPendings,
  getPendingUnits,
  approveUnit,
  rejectUnit,
  approvePayment,
  rejectPayment,
  getUsers,
  toggleUserBan,
  flagUser,
  createAd,
  getAds,
  toggleAdStatus,
  getFeatureRequests,
  approveFeature,
  rejectFeature,
  updateSettings,
  getSettings
};
