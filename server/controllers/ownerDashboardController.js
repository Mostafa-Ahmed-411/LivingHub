const Unit = require('../models/Unit');
const Payment = require('../models/Payment');

const getDashboardStats = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const [unitsByType, rentedCount, availableCount, totalUnits] = await Promise.all([
      Unit.aggregate([
        { $match: { ownerId, isActive: true } },
        { $group: { _id: '$unitType', count: { $sum: 1 } } }
      ]),
      Unit.countDocuments({ ownerId, status: 'rented', isActive: true }),
      Unit.countDocuments({ ownerId, status: 'available', isActive: true }),
      Unit.countDocuments({ ownerId, isActive: true })
    ]);

    const stats = {
      totalUnits,
      rentedCount,
      availableCount,
      unitsByType: unitsByType.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    };

    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

const getMyUnits = async (req, res, next) => {
  try {
    const units = await Unit.find({ ownerId: req.user._id, isActive: true })
      .sort({ createdAt: -1 });

    res.json({ units });
  } catch (error) {
    next(error);
  }
};

const getMyHistory = async (req, res, next) => {
  try {
    const history = await Unit.find({
      ownerId: req.user._id,
      status: { $in: ['rented', 'sold'] }
    }).populate('tenantId', 'fullName profileImage')
      .sort({ updatedAt: -1 });

    res.json({ history });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getMyUnits, getMyHistory };
