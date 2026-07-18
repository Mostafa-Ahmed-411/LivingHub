const User = require('../models/User');
const Unit = require('../models/Unit');
const AppError = require('../utils/AppError');

const checkUnlockStatus = async (req, res, next) => {
  try {
    const { unitId } = req.params;
    const unit = await Unit.findById(unitId);
    if (!unit) {
      throw new AppError('Unit not found', 404);
    }

    // If owner or admin, auto unlocked
    if (req.user.role === 'admin' || unit.ownerId.toString() === req.user._id.toString()) {
      return res.json({ unlocked: true });
    }

    // Check if user has this unit in unlockedUnits
    const user = await User.findById(req.user._id);
    const unlocked = user.unlockedUnits.includes(unitId);

    res.json({
      unlocked,
      freeUnlocksUsed: user.freeUnlocksUsed,
      paidUnlocksRemaining: user.paidUnlocksRemaining,
      paidUnlocksExpiresAt: user.paidUnlocksExpiresAt
    });
  } catch (error) {
    next(error);
  }
};

const unlockUnit = async (req, res, next) => {
  try {
    const { unitId } = req.params;
    const unit = await Unit.findById(unitId);
    if (!unit) {
      throw new AppError('Unit not found', 404);
    }

    // If owner or admin, auto unlocked
    if (req.user.role === 'admin' || unit.ownerId.toString() === req.user._id.toString()) {
      return res.json({ success: true, unlocked: true });
    }

    const user = await User.findById(req.user._id);
    
    // Already unlocked?
    if (user.unlockedUnits.includes(unitId)) {
      return res.json({ success: true, unlocked: true });
    }

    // Check free unlocks first
    if (user.freeUnlocksUsed < 2) {
      user.freeUnlocksUsed += 1;
      user.unlockedUnits.push(unitId);
      await user.save();
      return res.json({
        success: true,
        unlocked: true,
        freeUnlocksUsed: user.freeUnlocksUsed,
        paidUnlocksRemaining: user.paidUnlocksRemaining
      });
    }

    // Check paid unlocks
    const now = new Date();
    if (user.paidUnlocksRemaining > 0 && user.paidUnlocksExpiresAt && user.paidUnlocksExpiresAt > now) {
      user.paidUnlocksRemaining -= 1;
      user.unlockedUnits.push(unitId);
      await user.save();
      return res.json({
        success: true,
        unlocked: true,
        freeUnlocksUsed: user.freeUnlocksUsed,
        paidUnlocksRemaining: user.paidUnlocksRemaining
      });
    }

    // Out of unlocks
    throw new AppError('لقد استهلكت محاولات التواصل المتاحة لك. يرجى شحن باقة تواصل إضافية (10 مرات بـ 20 ج).', 400);
  } catch (error) {
    next(error);
  }
};

module.exports = { checkUnlockStatus, unlockUnit };
