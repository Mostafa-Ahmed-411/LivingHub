require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

// 💡 استدعاء موديل العقارات (تأكد أن الموديل متسمي Property ومساره صح)
const Property = require('../models/Property'); 

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maeesha');
    console.log('Connected to MongoDB');

    // ================= 1. إدارة حساب الآدمن =================
    const adminEmail = 'admin@maeesha.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists.');
    } else {
      const hashedPassword = await bcrypt.hash('admin1234', 12);
      await User.create({
        fullName: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        accountStatus: 'active'
      });
      console.log('Admin user created successfully! 🎉');
      console.log('Email: admin@maeesha.com | Password: admin1234');
    }

    // ================= 2. استيراد داتا العقارات من الـ JSON =================
    // تحديد مسار ملف الـ JSON (موجود في الفولدر الرئيسي للباك إيند)
    const dataPath = path.join(__dirname, '../properties_mock_data.json');
    
    if (fs.existsSync(dataPath)) {
      const propertiesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

      // مسح العقارات القديمة لمنع تكرارها عند كل تشغيل
      await Property.deleteMany({});
      console.log('Old properties cleared from database.');

      // حقن البيانات الجديدة دفعة واحدة
      await Property.insertMany(propertiesData);
      console.log('Database seeded with Mock JSON Properties successfully! 🚀🔥');
    } else {
      console.log('Warning: properties_mock_data.json file not found. Skipping properties seed.');
    }

    // إغلاق الاتصال بنجاح
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();