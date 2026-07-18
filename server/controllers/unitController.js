const Unit = require('../models/Unit');
const Settings = require('../models/Settings');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const { notifyAdmins } = require('../utils/notifications');

const addUnit = async (req, res, next) => {
  try {
    const { title, unitType, listingType, specifications, bedsPerRoom, roomsPerApartment,
            floorNumber, address, price, description } = req.body;

    // Server-side validation: non-apartment units can only be rented
    if (unitType !== 'apartment' && listingType === 'sale') {
      throw new AppError('Only apartments can be listed for sale', 400);
    }

    // roomsPerApartment only makes sense for apartments
    if (unitType !== 'apartment' && roomsPerApartment) {
      throw new AppError('roomsPerApartment is only valid for apartment units', 400);
    }

    const images = req.files ? req.files.map(f => f.filename) : [];

    // 1. Fetch Settings.maxFreeUnitsPerOwner
    const settings = await Settings.findOne();
    const maxFreeUnits = (settings && typeof settings.maxFreeUnitsPerOwner === 'number')
      ? settings.maxFreeUnitsPerOwner
      : 2;

    // 2. Count the owner's current units where status === "available"
    const publishedCount = await Unit.countDocuments({
      ownerId: req.user._id,
      status: 'available',
      isActive: true,
      isDeleted: { $ne: true }
    });

    // 3. Set status based on limit
    let status = 'pending';
    let message = 'Unit created and is pending admin approval.';
    if (req.user.role === 'admin' || publishedCount < maxFreeUnits) {
      status = 'available';
      message = 'Unit published successfully.';
    }

    const unit = await Unit.create({
      ownerId: req.user._id,
      title,
      unitType,
      listingType: unitType !== 'apartment' ? 'rent' : listingType,
      specifications: typeof specifications === 'string' ? JSON.parse(specifications) : specifications,
      bedsPerRoom,
      roomsPerApartment: unitType === 'apartment' ? roomsPerApartment : undefined,
      floorNumber,
      address: typeof address === 'string' ? JSON.parse(address) : address,
      price,
      description,
      images,
      status
    });

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'status_change',
      targetId: unit._id,
      targetType: 'Unit',
      reason: 'Unit created',
      previousData: { status: null, newStatus: status }
    });

    if (status === 'pending') {
      await notifyAdmins(req.app, 'admin_request', `New unit pending approval: ${unit.title}`, unit._id);
    }

    res.status(201).json({ message, unit });
  } catch (error) {
    next(error);
  }
};

const getUnit = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id)
      .populate('ownerId', 'fullName profileImage phone email');

    if (!unit) {
      throw new AppError('Unit not found', 404);
    }

    const Review = require('../models/Review');
    const reviews = await Review.find({ unitId: unit._id })
      .populate('tenantId', 'fullName profileImage');

    const unitObj = unit.toObject();
    unitObj.reviewsList = reviews.map(r => ({
      _id: r._id,
      tenantName: r.tenantId?.fullName || 'Verified Tenant',
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt
    }));

    res.json({ unit: unitObj });
  } catch (error) {
    next(error);
  }
};

const editUnit = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      throw new AppError('Unit not found', 404);
    }

    // Ownership check (owners can only edit their own units)
    if (req.user.role !== 'admin' && unit.ownerId.toString() !== req.user._id.toString()) {
      throw new AppError('You can only edit your own units', 403);
    }

    const restrictedStatuses = ['rented', 'sold'];
    const isRestricted = restrictedStatuses.includes(unit.status);

    const { title, unitType, listingType, specifications, bedsPerRoom, roomsPerApartment,
            floorNumber, address, price, description, isActive } = req.body;

    const getUpdatedImages = () => {
      let keepImages = [];
      if (req.body.existingImages) {
        const parsed = typeof req.body.existingImages === 'string'
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
        
        keepImages = parsed.map(img => {
          if (!img) return null;
          if (img.startsWith('http')) {
            const parts = img.split('/uploads/units/');
            return parts[parts.length - 1];
          }
          return img;
        }).filter(Boolean);
      }

      const newFiles = req.files ? req.files.map(f => f.filename) : [];

      if ((req.files && req.files.length > 0) || req.body.existingImages !== undefined) {
        return [...keepImages, ...newFiles];
      }
      return unit.images;
    };

    if (isRestricted) {
      // Only allow description, images, and title changes for rented/sold units
      if (unitType || listingType || price || address || floorNumber || bedsPerRoom || roomsPerApartment) {
        throw new AppError('Only title, description and images can be edited for rented/sold units', 400);
      }

      if (title !== undefined) unit.title = title;
      if (description !== undefined) unit.description = description;
      unit.images = getUpdatedImages();
    } else {
      const previousData = unit.toObject();
      const needsReApproval = unit.status === 'available' &&
        ((price !== undefined && price !== unit.price) ||
         (unitType !== undefined && unitType !== unit.unitType) ||
         (listingType !== undefined && listingType !== unit.listingType));

      if (unitType) {
        if (unitType !== 'apartment' && (listingType === 'sale' || (unit.listingType === 'sale' && !listingType))) {
          throw new AppError('Only apartments can be listed for sale', 400);
        }
        unit.unitType = unitType;
      }
      if (title !== undefined) unit.title = title;
      if (listingType !== undefined) unit.listingType = listingType;
      if (specifications !== undefined) unit.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
      if (bedsPerRoom !== undefined) unit.bedsPerRoom = bedsPerRoom;
      if (roomsPerApartment !== undefined) unit.roomsPerApartment = roomsPerApartment;
      if (floorNumber !== undefined) unit.floorNumber = floorNumber;
      if (address !== undefined) unit.address = typeof address === 'string' ? JSON.parse(address) : address;
      if (price !== undefined) unit.price = price;
      if (description !== undefined) unit.description = description;
      if (isActive !== undefined) {
        unit.isActive = (isActive === 'true' || isActive === true);
        if (!unit.isActive) {
          unit.isFeatured = false;
          unit.featureRequestStatus = 'none';
        }
      }
      unit.images = getUpdatedImages();

      if (needsReApproval) {
        unit.status = 'pending';
        await AuditLog.create({
          performedBy: req.user._id,
          action: 'status_change',
          targetId: unit._id,
          targetType: 'Unit',
          reason: 'Critical fields edited, re-approval required',
          previousData: { status: previousData.status, price: previousData.price, unitType: previousData.unitType }
        });

        await notifyAdmins(req.app, 'admin_request', `Unit updated, requires re-approval: ${unit.title}`, unit._id);
      }
    }

    await unit.save();

    res.json({ message: 'Unit updated successfully', unit });
  } catch (error) {
    next(error);
  }
};

const deleteUnit = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      throw new AppError('Unit not found', 404);
    }

    if (req.user.role !== 'admin') {
      throw new AppError('Only admins can delete units', 403);
    }

    unit.isDeleted = true;
    unit.isActive = false;
    unit.isFeatured = false;
    unit.featureRequestStatus = 'none';
    await unit.save({ validateModifiedOnly: true });

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'status_change',
      targetId: unit._id,
      targetType: 'Unit',
      reason: 'Unit deleted by admin'
    });

    res.json({ message: 'Unit deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const updateUnitStatus = async (req, res, next) => {
  try {
    const { status, tenantId } = req.body;
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      throw new AppError('Unit not found', 404);
    }

    if (req.user.role !== 'admin' && unit.ownerId.toString() !== req.user._id.toString()) {
      throw new AppError('You can only update status of your own units', 403);
    }

    if (!['rented', 'sold'].includes(status)) {
      throw new AppError('Owners can only mark units as rented or sold', 400);
    }

    if (unit.status !== 'available') {
      throw new AppError('Only available units can be marked as rented or sold', 400);
    }

    if (status === 'sold' && unit.listingType !== 'sale') {
      throw new AppError('Only units listed for sale can be marked as sold', 400);
    }

    const previousData = unit.toObject();

    unit.status = status;
    if (tenantId) unit.tenantId = tenantId;
    await unit.save({ validateModifiedOnly: true });

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'status_change',
      targetId: unit._id,
      targetType: 'Unit',
      reason: `Unit marked as ${status}`,
      previousData
    });

    res.json({ message: `Unit marked as ${status} successfully`, unit });
  } catch (error) {
    next(error);
  }
};

const getFeaturedUnits = async (req, res, next) => {
  try {
    const featured = await Unit.find({
      status: 'available',
      isActive: true,
      isDeleted: { $ne: true },
      isFeatured: true,
      featuredUntil: { $gt: new Date() }
    })
    .sort({ featuredAt: -1 })
    .populate('ownerId', 'fullName profileImage');

    res.json({ success: true, units: featured });
  } catch (error) {
    next(error);
  }
};

const rateUnit = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const numRating = Number(rating);

    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      throw new AppError('Rating must be a number between 1 and 5', 400);
    }

    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      throw new AppError('Unit not found', 404);
    }

    const currentRating = unit.rating || 0;
    const currentReviewsCount = unit.reviewsCount || 0;

    const newReviewsCount = currentReviewsCount + 1;
    let newRating;
    if (currentReviewsCount === 0) {
      newRating = numRating;
    } else {
      newRating = ((currentRating * currentReviewsCount) + numRating) / newReviewsCount;
    }

    unit.rating = Math.round(newRating * 10) / 10;
    unit.reviewsCount = newReviewsCount;
    await unit.save({ validateModifiedOnly: true });

    res.json({
      success: true,
      message: 'Unit rated successfully',
      rating: unit.rating,
      reviewsCount: unit.reviewsCount
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addUnit, getUnit, editUnit, deleteUnit, updateUnitStatus, getFeaturedUnits, rateUnit };
