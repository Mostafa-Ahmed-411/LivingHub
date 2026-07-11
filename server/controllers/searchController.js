const Unit = require('../models/Unit');

const getRecommendedUnits = async (req, res, next) => {
  try {
    const units = await Unit.find({ status: 'available', isActive: true })
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

    const query = { isActive: true };

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

    // availableFrom / availableTo dates filter
    if (availableFrom) {
      query.availableFrom = { $lte: new Date(availableFrom) };
    }
    if (availableTo) {
      query.availableTo = { $gte: new Date(availableTo) };
    }

    // floors filter (floorNumber) - multi-select supported (comma-separated, e.g. "2,3,+15")
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

    // rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    let sortOptions = { createdAt: -1 }; // default: newest
    if (sort) {
      const normSort = sort.toLowerCase().trim();
      if (normSort === 'newest') {
        sortOptions = { createdAt: -1 };
      } else if (normSort === 'oldest') {
        sortOptions = { createdAt: 1 };
      } else if (normSort === 'price_asc' || normSort === 'price: low to high') {
        sortOptions = { price: 1 };
      } else if (normSort === 'price_desc' || normSort === 'price: high to low') {
        sortOptions = { price: -1 };
      } else if (normSort === 'nearest_university' || normSort === 'nearest to university') {
        sortOptions = { distanceToUniversity: 1 };
      } else if (normSort === 'farthest_university' || normSort === 'farthest from university') {
        sortOptions = { distanceToUniversity: -1 };
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [units, total] = await Promise.all([
      Unit.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate('ownerId', 'fullName profileImage'),
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

module.exports = { getRecommendedUnits, searchUnits };
