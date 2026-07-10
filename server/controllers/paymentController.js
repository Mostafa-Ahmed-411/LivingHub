const Payment = require('../models/Payment');
const Unit = require('../models/Unit');
const AppError = require('../utils/AppError');

const initiatePayment = async (req, res, next) => {
  try {
    const { unitId, amount, method, transactionId } = req.body;
    
    // Check if unit belongs to this owner and is pending payment
    const unit = await Unit.findOne({ _id: unitId, ownerId: req.user._id });
    if (!unit) {
      throw new AppError('Unit not found or you do not own it', 404);
    }
    
    if (unit.status !== 'pending_payment') {
      throw new AppError('This unit does not require payment at this time', 400);
    }

    if (!req.file) {
      throw new AppError('Payment proof image is required', 400);
    }

    // Check if there is already a pending payment for this unit
    const existingPayment = await Payment.findOne({ unitId, status: 'pending' });
    if (existingPayment) {
      throw new AppError('A payment is already pending review for this unit', 400);
    }

    const payment = await Payment.create({
      ownerId: req.user._id,
      unitId,
      amount,
      method,
      proofImage: req.file.filename,
      transactionId
    });

    res.status(201).json({ message: 'Payment submitted successfully and is pending admin review', payment });
  } catch (error) {
    next(error);
  }
};

const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ ownerId: req.user._id })
      .populate('unitId', 'unitType listingType price address status')
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (error) {
    next(error);
  }
};

module.exports = { initiatePayment, getMyPayments };
