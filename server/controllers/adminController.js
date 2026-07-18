const User = require('../models/User');
const Unit = require('../models/Unit');
const Payment = require('../models/Payment');
const Ad = require('../models/Ad');
const AuditLog = require('../models/AuditLog');
const Report = require('../models/Report');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const Settings = require('../models/Settings');
const { notifyAllUsers } = require('../utils/notifications');

// --- Dashboard Stats ---
const getDashboardStats = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalOwners,
      unitsByType,
      rentedUnits,
      availableUnits,
      pendingApprovals,
      pendingPayments,
      adsOccupied,
      avgRatingAgg,
      sparkUsersRaw,
      sparkUnitsRaw,
      growthUsersRaw,
      growthUnitsRaw,
      recentLogs,
      openReportsCount,
      recentAuditCount
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'owner' }),
      Unit.aggregate([{ $group: { _id: { type: '$unitType', isActive: '$isActive' }, count: { $sum: 1 } } }]),
      Unit.countDocuments({ status: 'rented' }),
      Unit.countDocuments({ status: 'available' }),
      Unit.countDocuments({ status: { $in: ['pending_approval', 'pending'] }, isActive: true }),
      Payment.countDocuments({ status: 'pending' }),
      Ad.countDocuments({ isActive: true }),
      Unit.aggregate([{ $group: { _id: null, avgRating: { $avg: '$rating' } } }]),
      User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, value: { $sum: 1 } } }
      ]),
      Unit.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, value: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, users: { $sum: 1 } } }
      ]),
      Unit.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, props: { $sum: 1 } } }
      ]),
      AuditLog.find().sort({ createdAt: -1 }).limit(7).populate('performedBy', 'fullName'),
      Report.countDocuments({ status: 'open' }),
      AuditLog.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);

    const averageRating = avgRatingAgg.length > 0 ? parseFloat(avgRatingAgg[0].avgRating.toFixed(1)) : 4.8;

    const formattedUnitsByType = {
      apartment: { total: 0, active: 0, inactive: 0 },
      studio: { total: 0, active: 0, inactive: 0 },
      room: { total: 0, active: 0, inactive: 0 },
      bed: { total: 0, active: 0, inactive: 0 }
    };
    
    let totalAllUnits = 0;
    let activeUnitsTotal = 0;
    let inactiveUnitsTotal = 0;

    unitsByType.forEach(item => {
      const type = item._id.type;
      const isActive = item._id.isActive;
      const count = item.count;
      
      if (formattedUnitsByType[type]) {
        formattedUnitsByType[type].total += count;
        if (isActive) {
          formattedUnitsByType[type].active += count;
          activeUnitsTotal += count;
        } else {
          formattedUnitsByType[type].inactive += count;
          inactiveUnitsTotal += count;
        }
        totalAllUnits += count;
      }
    });

    // Format Sparklines (fill in missing days with 0)
    const sparklineUsers = [];
    const sparklineUnits = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      const userCount = sparkUsersRaw.find(x => x._id === dateStr)?.value || 0;
      const unitCount = sparkUnitsRaw.find(x => x._id === dateStr)?.value || 0;
      
      sparklineUsers.push({ value: userCount });
      sparklineUnits.push({ value: unitCount });
    }

    // Format Growth Data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const growthData = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(sixMonthsAgo);
      d.setMonth(d.getMonth() + i);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const monthLabel = monthNames[m - 1];
      
      const usersCount = growthUsersRaw.find(x => x._id.month === m && x._id.year === y)?.users || 0;
      const propsCount = growthUnitsRaw.find(x => x._id.month === m && x._id.year === y)?.props || 0;
      
      growthData.push({ month: monthLabel, users: usersCount, props: propsCount });
    }

    // Format Recent Activity
    const recentActivity = recentLogs.map((log) => {
      let type = 'audit';
      let color = 'bg-purple-50 text-purple-600';
      if (log.action.includes('user')) { type = 'user'; color = 'bg-blue-50 text-blue-600'; }
      else if (log.action.includes('unit')) { type = 'unit'; color = 'bg-green-50 text-green-600'; }
      else if (log.action.includes('payment')) { type = 'payment'; color = 'bg-emerald-50 text-emerald-600'; }

      const diffMs = Date.now() - new Date(log.createdAt).getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const timeStr = diffHrs < 1 ? 'Just now' : diffHrs < 24 ? `${diffHrs} hours ago` : `${Math.floor(diffHrs/24)} days ago`;

      return {
        id: log._id,
        type,
        title: log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        desc: log.reason ? log.reason : `Performed by ${log.performedBy?.fullName || 'System'}`,
        time: timeStr,
        color
      };
    });

    res.json({
      stats: {
        totalUsers,
        totalOwners,
        totalUnits: totalAllUnits,
        activeUnits: activeUnitsTotal,
        inactiveUnits: inactiveUnitsTotal,
        unitsByType: formattedUnitsByType,
        rentedUnits,
        availableUnits,
        pendingApprovals,
        pendingPayments,
        openReports: openReportsCount,
        openAuditLogs: recentAuditCount,
        adsOccupied,
        averageRating
      },
      sparklineUsers,
      sparklineUnits,
      growthData,
      recentActivity
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

    if (payment.paymentType === 'contact_package') {
      const user = await User.findById(payment.ownerId);
      if (user) {
        user.paidUnlocksRemaining = (user.paidUnlocksRemaining || 0) + 10;
        user.paidUnlocksExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await user.save();
      }

      await Notification.create({
        userId: payment.ownerId,
        type: 'payment_confirmed',
        message: 'تم تأكيد الدفع بنجاح وشحن باقة الـ 10 تواصل صالحة لمدة 30 يوماً.',
        relatedEntityId: payment._id
      });
    } else {
      // Auto-advance the unit status
      const unit = await Unit.findById(payment.unitId);
      if (unit && unit.status === 'pending_payment') {
        unit.status = 'pending_approval';
        await unit.save({ validateModifiedOnly: true });
      }

      await Notification.create({
        userId: payment.ownerId,
        type: 'payment_confirmed',
        message: 'Your payment has been confirmed. Your unit is now pending approval.',
        relatedEntityId: payment.unitId
      });
    }

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'approve_payment',
      targetId: payment._id,
      targetType: 'Payment',
      previousData: { status: 'pending' }
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
    const { title, description, targetLocation, linkUrl, startDate, endDate } = req.body;

    if (!req.file) throw new AppError('Ad image is required', 400);

    const ad = await Ad.create({
      title,
      description,
      image: req.file.filename,
      targetLocation,
      linkUrl,
      startDate,
      endDate
    });

    await notifyAllUsers(req.app, 'push_ad', `New advertisement: ${ad.title}`, ad._id);

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

const updateAd = async (req, res, next) => {
  try {
    const { title, description, targetLocation, linkUrl, startDate, endDate, isActive } = req.body;
    const ad = await Ad.findById(req.params.id);
    if (!ad) throw new AppError('Ad not found', 404);

    if (title) ad.title = title;
    if (description !== undefined) ad.description = description;
    if (targetLocation) ad.targetLocation = targetLocation;
    if (linkUrl !== undefined) ad.linkUrl = linkUrl;
    if (startDate) ad.startDate = startDate;
    if (endDate) ad.endDate = endDate;
    if (isActive !== undefined) ad.isActive = isActive === 'true' || isActive === true;

    if (req.file) {
      ad.image = req.file.filename;
    }

    await ad.save();
    res.json({ message: 'Ad updated successfully', ad });
  } catch (error) {
    next(error);
  }
};

const deleteAd = async (req, res, next) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) throw new AppError('Ad not found', 404);
    res.json({ message: 'Ad deleted successfully' });
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
    await unit.save({ validateModifiedOnly: true });

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
    await unit.save({ validateModifiedOnly: true });

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

// --- Audit Logs ---
const getAuditLogs = async (req, res, next) => {
  try {
    const { action, page = 1, limit = 20 } = req.query;
    const query = {};

    if (action && action !== 'All') {
      query.action = { $regex: action, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('performedBy', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      AuditLog.countDocuments(query)
    ]);

    const formattedLogs = logs.map(log => {
      let level = 'info';
      if (log.action.includes('approve') || log.action.includes('unban')) level = 'success';
      else if (log.action.includes('reject') || log.action.includes('ban')) level = 'danger';
      else if (log.action.includes('flag') || log.action.includes('status_change')) level = 'warning';

      return {
        _id: log._id,
        action: log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        actor: log.performedBy?.email || log.performedBy?.fullName || 'System',
        actorName: log.performedBy?.fullName || 'System',
        targetType: log.targetType,
        targetId: log.targetId,
        reason: log.reason || '',
        level,
        time: log.createdAt
      };
    });

    res.json({
      logs: formattedLogs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

// --- Reports ---
const getReports = async (req, res, next) => {
  try {
    const { status, reportType, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (reportType && reportType !== 'All') query.reportType = reportType;

    const skip = (Number(page) - 1) * Number(limit);

    const [reports, total] = await Promise.all([
      Report.find(query)
        .populate('reportedBy', 'fullName email')
        .populate('resolvedBy', 'fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Report.countDocuments(query)
    ]);

    res.json({
      reports,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

const resolveReport = async (req, res, next) => {
  try {
    const { resolution } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) throw new AppError('Report not found', 404);
    if (report.status !== 'open') throw new AppError('Report is already processed', 400);

    report.status = 'resolved';
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    report.resolution = resolution || 'Resolved by admin';
    await report.save();

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'resolve_report',
      targetId: report._id,
      targetType: 'Report',
      reason: report.resolution
    });

    res.json({ message: 'Report resolved successfully', report });
  } catch (error) {
    next(error);
  }
};

const dismissReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) throw new AppError('Report not found', 404);
    if (report.status !== 'open') throw new AppError('Report is already processed', 400);

    report.status = 'dismissed';
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    report.resolution = 'Dismissed by admin';
    await report.save();

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'dismiss_report',
      targetId: report._id,
      targetType: 'Report',
      reason: 'Report dismissed'
    });

    res.json({ message: 'Report dismissed successfully', report });
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
  updateAd,
  deleteAd,
  toggleAdStatus,
  getFeatureRequests,
  approveFeature,
  rejectFeature,
  updateSettings,
  getSettings,
  getAuditLogs,
  getReports,
  resolveReport,
  dismissReport
};
