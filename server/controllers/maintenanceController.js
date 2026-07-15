const Maintenance = require('../models/Maintenance');
const Unit = require('../models/Unit');

// 1. تقديم بلاغ صيانة جديد
exports.createTicket = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const tenantId = req.user.id; // يتم قراءته من الـ Auth middleware بعد التحقق من التوكن

    // البحث عن السكن النشط الحالي الخاص بالطالب
    const activeUnit = await Unit.findOne({ tenantId, status: 'rented' });

    if (!activeUnit) {
      return res.status(400).json({
        status: 'fail',
        message: 'You do not have any active rented units to report issues for.'
      });
    }

    const newTicket = await Maintenance.create({
      unitId: activeUnit._id,
      tenantId,
      ownerId: activeUnit.ownerId,
      title,
      description,
      category,
      status: 'Pending'
    });

    res.status(201).json({
      status: 'success',
      ticket: newTicket
    });
  } catch (err) {
    next(err);
  }
};

// 2. جلب جميع بلاغات الطالب الحالية
exports.getMyTickets = async (req, res, next) => {
  try {
    const tenantId = req.user.id;

    const tickets = await Maintenance.find({ tenantId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: tickets.length,
      tickets
    });
  } catch (err) {
    next(err);
  }
};