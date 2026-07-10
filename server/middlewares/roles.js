const AppError = require('../utils/AppError');
const Unit = require('../models/Unit');

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

const checkOwnerApproved = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') return next();

    if (req.user.accountStatus !== 'active') {
      return next(new AppError('Your account is not active yet', 403));
    }

    const hasPendingPayment = await Unit.findOne({
      ownerId: req.user._id,
      status: 'pending_payment',
      isActive: true
    });

    if (hasPendingPayment) {
      return next(
        new AppError('You have a unit with pending payment. Complete the payment before adding a new unit.', 403)
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkRole, checkOwnerApproved };
