require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/livinghub');
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@livinghub.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin1234', 12);

    await User.create({
      fullName: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      accountStatus: 'active'
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@livinghub.com');
    console.log('Password: admin1234');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
