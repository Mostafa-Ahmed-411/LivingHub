const Unit = require('../models/Unit');
const Payment = require('../models/Payment');

const getDashboardStats = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const [
      totalUnits,
      rentedUnitsCount,
      soldUnitsCount,
      inactiveUnits,
      favoriteUnits,
      pendingFavoriteUnits,
      pendingPublishUnits,
      unitsByType,
      rentedUnits
    ] = await Promise.all([
      Unit.countDocuments({ ownerId, isDeleted: { $ne: true } }),
      Unit.countDocuments({ ownerId, status: 'rented', isActive: true, isDeleted: { $ne: true } }),
      Unit.countDocuments({ ownerId, status: 'sold', isActive: true, isDeleted: { $ne: true } }),
      Unit.countDocuments({ ownerId, isActive: false, isDeleted: { $ne: true } }),
      Unit.countDocuments({ ownerId, isFeatured: true, featuredUntil: { $gt: new Date() }, isDeleted: { $ne: true } }),
      Unit.countDocuments({ ownerId, featureRequestStatus: 'pending', isDeleted: { $ne: true } }),
      Unit.countDocuments({ ownerId, status: 'pending', isDeleted: { $ne: true } }),
      Unit.aggregate([
        { $match: { ownerId, isDeleted: { $ne: true } } },
        { $group: { _id: '$unitType', count: { $sum: 1 } } }
      ]),
      Unit.find({ ownerId, status: 'rented', isActive: true, isDeleted: { $ne: true } })
        .populate('tenantId', 'fullName')
        .sort({ updatedAt: -1 })
        .limit(5)
    ]);

    const unitBreakdown = {
      beds: unitsByType.find(u => u._id === 'bed')?.count || 0,
      rooms: unitsByType.find(u => u._id === 'room')?.count || 0,
      studios: unitsByType.find(u => u._id === 'studio')?.count || 0,
      apartments: unitsByType.find(u => u._id === 'apartment')?.count || 0
    };

    const recentBookings = rentedUnits.map(u => ({
      _id: u._id,
      tenant: u.tenantId?.fullName || 'N/A',
      property: `${u.unitType.toUpperCase()} in ${u.address?.city || 'N/A'}`,
      date: u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : 'N/A',
      rent: `${u.price} EGP`,
      status: 'Active'
    }));

    const stats = {
      totalUnits,
      endedUnits: rentedUnitsCount + soldUnitsCount,
      inactiveUnits,
      favoriteUnits,
      pendingFavoriteUnits,
      pendingPublishUnits,
      subscriptionDaysLeft: 30,
      unitBreakdown
    };

    res.json({ stats, recentBookings });
  } catch (error) {
    next(error);
  }
};

const getMyUnits = async (req, res, next) => {
  try {
    const { page = 1, limit = 15, filter } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = { ownerId: req.user._id, isDeleted: { $ne: true } };

    if (filter) {
      if (filter === 'active') {
        query.isActive = true;
      } else if (filter === 'inactive') {
        query.isActive = false;
      } else if (filter === 'accepted') {
        query.status = 'available';
      } else if (filter === 'rejected') {
        query.status = 'rejected';
      } else if (filter === 'pending') {
        query.status = { $in: ['pending', 'pending_approval'] };
      } else if (filter === 'featured_on') {
        query.isFeatured = true;
        query.featuredUntil = { $gt: new Date() };
      } else if (filter === 'featured_off') {
        query.$or = [
          { isFeatured: false },
          { isFeatured: { $exists: false } },
          { featuredUntil: { $lte: new Date() } }
        ];
      }
    }

    const [units, total] = await Promise.all([
      Unit.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Unit.countDocuments(query)
    ]);

    res.json({
      units,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
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
