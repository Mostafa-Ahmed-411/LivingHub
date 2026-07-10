const Unit = require('../models/Unit');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');

const addUnit = async (req, res, next) => {
  try {
    const { unitType, listingType, specifications, bedsPerRoom, roomsPerApartment,
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

    const unit = await Unit.create({
      ownerId: req.user._id,
      unitType,
      listingType: unitType !== 'apartment' ? 'rent' : listingType,
      specifications,
      bedsPerRoom,
      roomsPerApartment: unitType === 'apartment' ? roomsPerApartment : undefined,
      floorNumber,
      address: typeof address === 'string' ? JSON.parse(address) : address,
      price,
      description,
      images,
      status: 'pending_payment'
    });

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'status_change',
      targetId: unit._id,
      targetType: 'Unit',
      reason: 'Unit created',
      previousData: { status: null, newStatus: 'pending_payment' }
    });

    res.status(201).json({ message: 'Unit created. Please complete the payment to proceed.', unit });
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

    res.json({ unit });
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

    const { unitType, listingType, specifications, bedsPerRoom, roomsPerApartment,
            floorNumber, address, price, description } = req.body;

    if (isRestricted) {
      // Only allow description and images changes for rented/sold units
      if (unitType || listingType || price || address || floorNumber || bedsPerRoom || roomsPerApartment) {
        throw new AppError('Only description and images can be edited for rented/sold units', 400);
      }

      if (description !== undefined) unit.description = description;
      if (req.files && req.files.length > 0) {
        unit.images = req.files.map(f => f.filename);
      }
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
      if (listingType !== undefined) unit.listingType = listingType;
      if (specifications !== undefined) unit.specifications = specifications;
      if (bedsPerRoom !== undefined) unit.bedsPerRoom = bedsPerRoom;
      if (roomsPerApartment !== undefined) unit.roomsPerApartment = roomsPerApartment;
      if (floorNumber !== undefined) unit.floorNumber = floorNumber;
      if (address !== undefined) unit.address = typeof address === 'string' ? JSON.parse(address) : address;
      if (price !== undefined) unit.price = price;
      if (description !== undefined) unit.description = description;
      if (req.files && req.files.length > 0) {
        unit.images = req.files.map(f => f.filename);
      }

      if (needsReApproval) {
        unit.status = 'pending_approval';
        await AuditLog.create({
          performedBy: req.user._id,
          action: 'status_change',
          targetId: unit._id,
          targetType: 'Unit',
          reason: 'Critical fields edited, re-approval required',
          previousData: { status: previousData.status, price: previousData.price, unitType: previousData.unitType }
        });
      }
    }

    await unit.save();

    res.json({ message: 'Unit updated successfully', unit });
  } catch (error) {
    next(error);
  }
};

const deactivateUnit = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      throw new AppError('Unit not found', 404);
    }

    if (req.user.role !== 'admin' && unit.ownerId.toString() !== req.user._id.toString()) {
      throw new AppError('You can only deactivate your own units', 403);
    }

    unit.isActive = false;
    await unit.save();

    await AuditLog.create({
      performedBy: req.user._id,
      action: 'status_change',
      targetId: unit._id,
      targetType: 'Unit',
      reason: 'Unit deactivated by ' + (req.user.role === 'admin' ? 'admin' : 'owner')
    });

    res.json({ message: 'Unit deactivated successfully' });
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
    await unit.save();

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

module.exports = { addUnit, getUnit, editUnit, deactivateUnit, updateUnitStatus };
