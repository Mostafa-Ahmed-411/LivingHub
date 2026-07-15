const User = require('../models/User');
const Unit = require('../models/Unit');
const AppError = require('../utils/AppError');
const bcrypt = require('bcryptjs');

const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. جلب بيانات المستخدم الحالية للـ Welcome Banner
    const user = await User.findById(userId).select('fullName firstName profileImage');
    const profileName = user ? (user.firstName || user.fullName.split(' ')[0]) : 'Student';

    // 2. جلب الإحصائيات الحقيقية وحسابها (Active Rentals, Saved Units, Monthly Rent)
    const [activeRentalsCount, currentUnit, activeUnitsList] = await Promise.all([
      Unit.countDocuments({ tenantId: userId, status: 'rented' }),
      Unit.findOne({ tenantId: userId, status: 'rented' }).populate('ownerId', 'fullName'),
      // جلب آخر 3 وحدات للطالب كمعاينة
      Unit.find({ tenantId: userId }).limit(3).sort({ updatedAt: -1 }) 
    ]);

    // حساب إجمالي الإيجار الشهري الحالي بناءً على الوحدات المؤجرة
    let totalMonthlyRent = 0;
    if (currentUnit && currentUnit.price) {
      totalMonthlyRent = currentUnit.price;
    }

    // 3. تجهيز بيانات السكن الحالي (Current Rental) إن وجد
    let currentRentalData = null;
    if (currentUnit) {
      currentRentalData = {
        id: currentUnit._id,
        title: currentUnit.title || currentUnit.name || 'Modern Unit',
        address: currentUnit.address || currentUnit.location || 'N/A',
        rent: currentUnit.price || 0,
        landlordName: currentUnit.ownerId?.fullName || 'N/A',
        image: currentUnit.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=140&fit=crop&auto=format'
      };
    }

    // 4. بناء الرد النهائي المتوافق مع الـ Frontend
    res.json({
      profile: {
        name: profileName
      },
      stats: {
        activeRentals: activeRentalsCount,
        savedUnits: 0,
        unreadMessages: 0,
        monthlyRent: totalMonthlyRent
      },
      currentRental: currentRentalData,
      upcomingEvents: currentRentalData ? [
        { title: "Rent Payment Due", date: "Coming Soon", urgent: true, type: "payment" }
      ] : [],
      savedProperties: activeUnitsList.map(unit => ({
        id: unit._id,
        title: unit.title || 'Property',
        price: unit.price,
        location: unit.location || unit.address,
        images: unit.images
      }))
    });

  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshTokens');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const userObj = user.toObject();
    if (userObj.role === 'user') {
      userObj.role = 'student';
    }
    res.json({ user: userObj });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      firstName,
      secondName,
      thirdName,
      fourthName,
      gender,
      governorate,
      dateOfBirth,
      isStudent,
      college,
      year,
      occupation,
      alternativePhone
    } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email.toLowerCase();
    if (phone) user.phone = phone;

    if (firstName) user.firstName = firstName;
    if (secondName) user.secondName = secondName;
    if (thirdName !== undefined) user.thirdName = thirdName || undefined;
    if (fourthName !== undefined) user.fourthName = fourthName || undefined;
    if (gender) user.gender = gender;
    if (governorate) user.governorate = governorate;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (isStudent !== undefined) user.isStudent = (isStudent === 'true' || isStudent === true || isStudent === 'on');
    if (college !== undefined) user.college = college || undefined;
    if (year !== undefined) user.year = year || undefined;
    if (occupation !== undefined) user.occupation = occupation || undefined;
    if (alternativePhone !== undefined) user.alternativePhone = alternativePhone || undefined;

    if (req.file) {
      user.profileImage = req.file.filename;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        firstName: user.firstName,
        secondName: user.secondName,
        thirdName: user.thirdName,
        fourthName: user.fourthName,
        email: user.email,
        phone: user.phone,
        role: user.role === 'user' ? 'student' : user.role,
        gender: user.gender,
        governorate: user.governorate,
        dateOfBirth: user.dateOfBirth,
        isStudent: user.isStudent,
        college: user.college,
        year: user.year,
        occupation: user.occupation,
        alternativePhone: user.alternativePhone,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError('Incorrect current password', 400);
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

const getMyUnits = async (req, res, next) => {
  try {
    const units = await Unit.find({ tenantId: req.user._id, status: 'rented' })
      .populate('ownerId', 'fullName profileImage phone')
      .sort({ updatedAt: -1 });

    res.json({ units });
  } catch (error) {
    next(error);
  }
};

const getMyHistory = async (req, res, next) => {
  try {
    const history = await Unit.find({ tenantId: req.user._id, status: { $in: ['rented', 'sold'] } })
      .populate('ownerId', 'fullName profileImage')
      .sort({ updatedAt: -1 });

    res.json({ history });
  } catch (error) {
    next(error);
  }
};

// ==================== الدالة الجديدة: حذف وحدة سكنية معينة بواسطة المالك ====================
const deleteUnit = async (req, res, next) => {
  try {
    const unitId = req.params.id;
    const ownerId = req.user._id; // التأكد من أن المالك الحالي هو من يحذف لحماية البيانات

    // حذف الشقة التي تطابق المعرّف وصاحبها هو المالك الحالي فقط
    const unit = await Unit.findOneAndDelete({ _id: unitId, ownerId });

    if (!unit) {
      throw new AppError('Unit not found or you do not have permission to delete it.', 404);
    }

    res.json({
      status: 'success',
      message: 'Unit deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getProfile,
  updateProfile,
  changePassword,
  getMyUnits,
  getMyHistory,
  deleteUnit // تصدير الدالة الجديدة لتكون جاهزة للربط في الرووتس
};