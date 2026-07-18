require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

// 💡 استدعاء موديل العقارات
const Unit = require('../models/Unit');

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

      const adminUser = await User.findOne({ email: adminEmail });
      if (!adminUser) {
        throw new Error('Admin user must exist to seed properties.');
      }
      
      const mappedProperties = propertiesData.map(item => {
        let uType = item.unitType ? item.unitType.toLowerCase() : 'studio';
        if (uType === 'private room') uType = 'room';
        if (uType === 'entire apartment') uType = 'apartment';
        if (uType === 'bed space') uType = 'bed';
        
        let lType = item.listingFor ? item.listingFor.toLowerCase() : 'rent';
        
        let status = 'available';
        if (item.status === 'inActive') status = 'pending_approval';
        if (item.status === 'Ended') status = 'rented';
        
        const specifications = {
          deposit: item.depositPrice ? Number(item.depositPrice) : Number(item.price),
          baths: item.bathroomsCount || 1,
          area: item.area || 50,
          aptPeople: item.bedsCount || 1,
          includesWater: true,
          includesGas: true,
          includesElectricity: true,
          amenities: {
            shared: { fridge: true, washingMachine: true, sharedBathroom: true, sharedKitchen: true, heater: true },
            room: { window: true, ac: true, tvScreen: true, wardrobe: true },
            building: { wifi: true, cleaner: true, security: true, securityCameras: true }
          }
        };

        return {
          ownerId: adminUser._id,
          title: item.title,
          unitType: uType,
          listingType: lType,
          price: Number(item.price),
          floorNumber: 3,
          bedsPerRoom: item.bedsCount || 1,
          roomsPerApartment: item.roomsPerApartment || item.roomsCount || 1,
          address: {
            governorate: item.governorate || 'Cairo',
            city: item.district || 'Zamalek',
            street: item.address || '',
            nearestUniversity: item.university || ''
          },
          availableFrom: new Date(),
          availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          rating: 4.5,
          reviewsCount: 0,
          description: item.description || '',
          images: [item.image].filter(Boolean),
          status: status,
          isActive: item.available !== false,
          views: item.views || 0,
          specifications
        };
      });

      // مسح العقارات القديمة لمنع تكرارها عند كل تشغيل
      await Unit.deleteMany({ ownerId: adminUser._id });
      console.log('Old admin properties cleared from database.');

      // حقن البيانات الجديدة دفعة واحدة
      await Unit.insertMany(mappedProperties);
      console.log('Database seeded with mapped JSON Properties successfully! 🚀🔥');
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