const Unit = require('../models/Unit');
const AppError = require('../utils/AppError');
const AuditLog = require('../models/AuditLog');
const { notifyAdmins } = require('../utils/notifications');

const requestFeature = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      throw new AppError('Unit not found', 404);
    }

    // Validate: unit belongs to the requesting owner
    if (unit.ownerId.toString() !== req.user._id.toString()) {
      throw new AppError('You can only request feature for your own units', 403);
    }

    // Validate: status is strictly available
    if (unit.status !== 'available') {
      throw new AppError('Only active/available units can be featured', 400);
    }

    // Guard against duplicate feature requests
    if (unit.featureRequestStatus === 'pending') {
      throw new AppError('A feature request is already pending for this unit', 400);
    }

    if (unit.isFeatured && unit.featuredUntil && new Date(unit.featuredUntil) > new Date()) {
      throw new AppError('This unit is already featured', 400);
    }

    // Check global featured slots cap (max 20)
    const currentFeaturedCount = await Unit.countDocuments({
      isFeatured: true,
      featuredUntil: { $gt: new Date() },
      isActive: true,
      isDeleted: { $ne: true }
    });
    if (currentFeaturedCount >= 20) {
      throw new AppError('Featured slots are currently full (20/20). Please try again in a few days.', 400);
    }

    unit.featureRequestStatus = 'pending';
    unit.featureRequestedAt = new Date();
    await unit.save({ validateModifiedOnly: true });

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'request_feature',
      targetId: unit._id,
      targetType: 'Unit',
      reason: 'Feature request submitted'
    });

    await notifyAdmins(req.app, 'admin_request', `New feature request for unit: ${unit.title}`, unit._id);

    res.json({ success: true, message: 'Feature request submitted successfully', unit });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestFeature
};

