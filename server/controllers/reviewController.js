const Review = require('../models/Review');
const Unit = require('../models/Unit');

// 1. تقديم تقييم جديد لشقة وللمالك
exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const tenantId = req.user.id;

    // البحث عن السكن النشط للطالب للتأكد أنه ساكن بالفعل قبل التقييم
    const activeUnit = await Unit.findOne({ tenantId, status: 'rented' });

    if (!activeUnit) {
      return res.status(400).json({
        status: 'fail',
        message: 'You can only review properties that you have active rental contracts with.'
      });
    }

    // التحقق من عدم كتابة تقييم سابق لنفس الشقة من هذا الطالب
    const existingReview = await Review.findOne({ unitId: activeUnit._id, tenantId });
    if (existingReview) {
      return res.status(400).json({
        status: 'fail',
        message: 'You have already reviewed this property.'
      });
    }

    const newReview = await Review.create({
      unitId: activeUnit._id,
      tenantId,
      ownerId: activeUnit.ownerId,
      rating,
      comment
    });

    // حساب متوسط التقييم الجديد وتحديثه في موديل الـ Unit تلقائياً
    const stats = await Review.aggregate([
      { $match: { unitId: activeUnit._id } },
      {
        $group: {
          _id: '$unitId',
          nRating: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    if (stats.length > 0) {
      await Unit.findByIdAndUpdate(activeUnit._id, {
        rating: stats[0].avgRating,
        reviewsCount: stats[0].nRating
      });
    }

    res.status(201).json({
      status: 'success',
      review: newReview
    });
  } catch (err) {
    next(err);
  }
};