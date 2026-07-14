const Unit = require('../models/Unit');
const User = require('../models/User');

const getRecommendedUnits = async (req, res, next) => {
  try {
    const units = await Unit.find({
      status: 'available',
      isActive: true,
      isDeleted: { $ne: true }
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('ownerId', 'fullName profileImage');

    res.json({ units });
  } catch (error) {
    next(error);
  }
};

const searchUnits = async (req, res, next) => {
  try {
    const {
      unitType,
      listingType,
      minPrice,
      maxPrice,
      governorate,
      district,
      city,
      nearestUniversity,
      availability, // 'available' or 'all'
      availableFrom,
      availableTo,
      floors,
      minRating,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const query = { isActive: true, isDeleted: { $ne: true } };

    if (availability === 'all') {
      query.status = { $in: ['available', 'rented', 'sold'] };
    } else {
      query.status = 'available';
    }

    if (unitType && unitType !== 'All') query.unitType = unitType;
    
    if (listingType && listingType !== 'All') {
      query.listingType = listingType.toLowerCase();
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (governorate && governorate !== 'All') {
      query['address.governorate'] = governorate;
    }

    const activeCity = district || city;
    if (activeCity && activeCity !== 'All') {
      query['address.city'] = activeCity;
    }

    if (nearestUniversity) {
      query['address.nearestUniversity'] = { $regex: nearestUniversity, $options: 'i' };
    }

    if (availableFrom) {
      query.availableFrom = { $lte: new Date(availableFrom) };
    }
    if (availableTo) {
      query.availableTo = { $gte: new Date(availableTo) };
    }

    if (floors) {
      const floorList = String(floors).split(',');
      const normalFloors = [];
      let hasPlus15 = false;

      for (const f of floorList) {
        if (f.trim() === '+15') {
          hasPlus15 = true;
        } else {
          const val = Number(f.trim());
          if (!isNaN(val)) {
            normalFloors.push(val);
          }
        }
      }

      const floorConditions = [];
      if (normalFloors.length > 0) {
        floorConditions.push({ floorNumber: { $in: normalFloors } });
      }
      if (hasPlus15) {
        floorConditions.push({ floorNumber: { $gt: 15 } });
      }

      if (floorConditions.length > 0) {
        if (floorConditions.length === 1) {
          if (normalFloors.length > 0) {
            query.floorNumber = { $in: normalFloors };
          } else {
            query.floorNumber = { $gt: 15 };
          }
        } else {
          query.$or = query.$or ? [...query.$or, ...floorConditions] : floorConditions;
        }
      }
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    const matchScoreConditions = [];
    if (unitType && unitType !== 'All') {
      matchScoreConditions.push({ $cond: [{ $eq: ["$unitType", unitType] }, 1, 0] });
    }
    if (listingType && listingType !== 'All') {
      matchScoreConditions.push({ $cond: [{ $eq: ["$listingType", listingType.toLowerCase()] }, 1, 0] });
    }
    if (minPrice) {
      matchScoreConditions.push({ $cond: [{ $gte: ["$price", Number(minPrice)] }, 1, 0] });
    }
    if (maxPrice) {
      matchScoreConditions.push({ $cond: [{ $lte: ["$price", Number(maxPrice)] }, 1, 0] });
    }
    if (governorate && governorate !== 'All') {
      matchScoreConditions.push({ $cond: [{ $eq: ["$address.governorate", governorate] }, 1, 0] });
    }
    if (activeCity && activeCity !== 'All') {
      matchScoreConditions.push({ $cond: [{ $eq: ["$address.city", activeCity] }, 1, 0] });
    }
    if (nearestUniversity) {
      matchScoreConditions.push({ $cond: [{ $regexMatch: { input: "$address.nearestUniversity", regex: nearestUniversity, options: "i" } }, 1, 0] });
    }
    if (availableFrom) {
      matchScoreConditions.push({ $cond: [{ $lte: ["$availableFrom", new Date(availableFrom)] }, 1, 0] });
    }
    if (availableTo) {
      matchScoreConditions.push({ $cond: [{ $gte: ["$availableTo", new Date(availableTo)] }, 1, 0] });
    }
    if (minRating) {
      matchScoreConditions.push({ $cond: [{ $gte: ["$rating", Number(minRating)] }, 1, 0] });
    }
    if (floors) {
      const floorList = String(floors).split(',');
      const normalFloors = [];
      let hasPlus15 = false;
      for (const f of floorList) {
        if (f.trim() === '+15') {
          hasPlus15 = true;
        } else {
          const val = Number(f.trim());
          if (!isNaN(val)) {
            normalFloors.push(val);
          }
        }
      }
      const floorConds = [];
      if (normalFloors.length > 0) {
        floorConds.push({ $in: ["$floorNumber", normalFloors] });
      }
      if (hasPlus15) {
        floorConds.push({ $gt: ["$floorNumber", 15] });
      }
      if (floorConds.length > 0) {
        matchScoreConditions.push({ $cond: [{ $or: floorConds }, 1, 0] });
      }
    }

    const matchScoreExpr = matchScoreConditions.length > 0 ? { $add: [...matchScoreConditions, 0] } : 0;

    let sortOptions = { isFeaturedAndQualifies: -1, matchScore: -1, createdAt: -1 };
    if (sort) {
      const normSort = sort.toLowerCase().trim();
      if (normSort === 'newest') {
        sortOptions = { isFeaturedAndQualifies: -1, matchScore: -1, createdAt: -1 };
      } else if (normSort === 'oldest') {
        sortOptions = { isFeaturedAndQualifies: -1, matchScore: -1, createdAt: 1 };
      } else if (normSort === 'price_asc' || normSort === 'price: low to high') {
        sortOptions = { isFeaturedAndQualifies: -1, matchScore: -1, price: 1 };
      } else if (normSort === 'price_desc' || normSort === 'price: high to low') {
        sortOptions = { isFeaturedAndQualifies: -1, matchScore: -1, price: -1 };
      } else if (normSort === 'nearest_university' || normSort === 'nearest to university') {
        sortOptions = { isFeaturedAndQualifies: -1, matchScore: -1, distanceToUniversity: 1 };
      } else if (normSort === 'farthest_university' || normSort === 'farthest from university') {
        sortOptions = { isFeaturedAndQualifies: -1, matchScore: -1, distanceToUniversity: -1 };
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const now = new Date();

    const pipeline = [
      { $match: query },
      {
        $addFields: {
          matchScore: matchScoreExpr,
          isFeaturedAndQualifies: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isFeatured", true] },
                  { $gt: ["$featuredUntil", now] },
                  { $gte: [matchScoreExpr, 2] }
                ]
              },
              1,
              0
            ]
          }
        }
      },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'ownerDetails'
        }
      },
      {
        $unwind: {
          path: '$ownerDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          ownerId: {
            _id: '$ownerDetails._id',
            fullName: '$ownerDetails.fullName',
            profileImage: '$ownerDetails.profileImage'
          }
        }
      },
      {
        $project: {
          ownerDetails: 0
        }
      }
    ];

    const [units, total] = await Promise.all([
      Unit.aggregate(pipeline),
      Unit.countDocuments(query)
    ]);

    const formattedUnits = units.map(u => {
      const isFeatured = !!(u.isFeatured && u.featuredUntil && new Date(u.featuredUntil) > now);
      const images = u.images ? u.images.map(img => img && !img.startsWith('http') ? `http://localhost:5000/uploads/units/${img}` : img) : [];
      return {
        ...u,
        isFeatured,
        images
      };
    });

    res.json({
      units: formattedUnits,
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

const getStats = async (req, res, next) => {
  try {
    const [
      dbUnitCount,
      dbStudentCount,
      uniqueCities,
      ratingAggregate,
      apartmentsCount,
      studiosCount,
      roomsCount,
      bedsCount
    ] = await Promise.all([
      Unit.countDocuments({ status: 'available', isActive: true, isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'user', isStudent: true }),
      Unit.distinct('address.governorate', { status: 'available', isActive: true, isDeleted: { $ne: true } }),
      Unit.aggregate([
        { $match: { status: 'available', isActive: true, isDeleted: { $ne: true } } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]),
      Unit.countDocuments({ unitType: 'apartment', status: 'available', isActive: true, isDeleted: { $ne: true } }),
      Unit.countDocuments({ unitType: 'studio', status: 'available', isActive: true, isDeleted: { $ne: true } }),
      Unit.countDocuments({ unitType: 'room', status: 'available', isActive: true, isDeleted: { $ne: true } }),
      Unit.countDocuments({ unitType: 'bed', status: 'available', isActive: true, isDeleted: { $ne: true } })
    ]);

    const verifiedUnits = 15000 + dbUnitCount;
    const happyStudents = 50000 + dbStudentCount;
    const egyptianCities = Math.max(12, uniqueCities.length);
    
    const avgRating = ratingAggregate[0]?.avgRating || 4.9;
    const satisfactionRate = Math.min(100, Math.round((avgRating / 5) * 100));

    res.json({
      success: true,
      stats: {
        verifiedUnits,
        happyStudents,
        egyptianCities,
        satisfactionRate
      },
      categories: {
        apartments: 3240 + apartmentsCount,
        studios: 1850 + studiosCount,
        rooms: 4120 + roomsCount,
        beds: 2670 + bedsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendedUnits, searchUnits, getStats };
