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
      city,
      nearestUniversity,
      availability, // 'available' or 'all'
      sort, // 'newest', 'price_asc', 'price_desc'
      page = 1,
      limit = 10
    } = req.query;

    const query = { isActive: true };

    if (availability !== 'all') {
      query.status = 'available';
    } else {
      query.status = { $in: ['available', 'rented', 'sold'] };
    }

    if (unitType) query.unitType = unitType;
    if (listingType) query.listingType = listingType;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (governorate) query['address.governorate'] = governorate;
    if (city) query['address.city'] = city;
    if (nearestUniversity) {
      query['address.nearestUniversity'] = { $regex: nearestUniversity, $options: 'i' };
    }

    let sortOptions = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };

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
