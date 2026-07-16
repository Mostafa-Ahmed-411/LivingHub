require('dotenv').config();
const mongoose = require('mongoose');

// Models
const User = require('../models/User');
const Unit = require('../models/Unit');
const Payment = require('../models/Payment');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const Ad = require('../models/Ad');

const seedDemoData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maeesha');
    console.log('Connected to MongoDB.');

    const admin = await User.findOne({ email: 'admin@maeesha.com' });
    if (!admin) {
      throw new Error('Admin user not found! Please run npm run seed first.');
    }

    const testPasswordHash = '$2b$12$yiN8u7hCDUTgDd813rPNMub3fmKeTpE22u5TxMeJBEfIeKR5HNpEW'; // Test@1234

    // 1. USERS
    const usersData = [
      {
        fullName: 'Mohamed Lashin',
        email: 'mohamedmohamedlashin@gmail.com',
        password: '$2a$12$MAcqseplUhv8994h8Vqx/uZytTaQ11ZRP27JlC9f.JvuejFaAUq2K',
        role: 'owner',
        accountStatus: 'active',
        phone: '01012345678',
        profileImage: 'placeholder.txt'
      },
      {
        _id: new mongoose.Types.ObjectId('6a4d6aab41bc4ada9625a931'),
        fullName: 'Leshoo',
        email: 'mocotign@gmail.com',
        password: '$2a$12$AXjcA9izbOEr4YZXQ/8PDOEi91Mlx8SDnULeooiyf01/KIHXYfvYq',
        role: 'user',
        accountStatus: 'active',
        phone: '01112345678',
        profileImage: 'placeholder.txt'
      },
      {
        fullName: 'Pending Owner',
        email: 'pendingowner@gmail.com',
        password: testPasswordHash,
        role: 'owner',
        accountStatus: 'pending_verification',
        phone: '01212345678',
        verificationCode: '445566',
        verificationCodeExpires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expire in 1 day for testing
        profileImage: 'placeholder.txt'
      },
      {
        fullName: 'Banned User',
        email: 'banneduser@gmail.com',
        password: testPasswordHash,
        role: 'user',
        accountStatus: 'banned',
        isFlagged: true,
        phone: '01512345678',
        profileImage: 'placeholder.txt'
      },
      {
        fullName: 'Active Owner',
        email: 'activeowner@gmail.com',
        password: testPasswordHash,
        role: 'owner',
        accountStatus: 'active',
        phone: '01011122233',
        profileImage: 'placeholder.txt'
      },
      {
        fullName: 'Active User',
        email: 'activeuser@gmail.com',
        password: testPasswordHash,
        role: 'user',
        accountStatus: 'active',
        phone: '01122233344',
        profileImage: 'placeholder.txt'
      }
    ];

    const users = [];
    for (const ud of usersData) {
      let u = await User.findOne({ email: ud.email });
      if (!u) {
        u = await User.create(ud);
      } else {
        u = await User.findOneAndUpdate({ email: ud.email }, ud, { new: true });
      }
      users.push(u);
    }

    const lashin = users[0];
    const leshoo = users[1];
    const activeOwner = users[4];
    const activeUser = users[5];

    // 2. UNITS
    const unitsData = [
      {
        ownerId: lashin._id,
        unitType: 'apartment',
        listingType: 'rent',
        price: 5000,
        address: { governorate: 'Cairo', city: 'Nasr City', street: 'Makram Ebeid', nearestUniversity: 'Al-Azhar' },
        availableFrom: new Date('2026-07-01'),
        availableTo: new Date('2026-12-31'),
        distanceToUniversity: 1.5,
        rating: 4.8,
        description: 'Luxurious apartment near the university.',
        images: ['placeholder1.txt', 'placeholder2.txt', 'placeholder3.txt'],
        status: 'available',
        bedsPerRoom: 2,
        roomsPerApartment: 3,
        floorNumber: 5,
        isActive: true
      },
      {
        ownerId: lashin._id,
        unitType: 'studio',
        listingType: 'sale',
        price: 800000,
        address: { governorate: 'Giza', city: '6th of October', street: 'Mehwar', nearestUniversity: 'MSA' },
        availableFrom: new Date('2026-08-01'),
        availableTo: new Date('2027-08-01'),
        distanceToUniversity: 0.8,
        rating: 4.2,
        description: 'Modern studio for sale.',
        images: ['placeholder1.txt', 'placeholder2.txt', 'placeholder3.txt'],
        status: 'pending_approval',
        bedsPerRoom: 1,
        floorNumber: 2,
        isActive: true
      },
      {
        ownerId: activeOwner._id,
        unitType: 'room',
        listingType: 'rent',
        price: 1500,
        address: { governorate: 'Alexandria', city: 'Sidi Gaber', street: 'Abu Qir', nearestUniversity: 'Alexandria Univ' },
        availableFrom: new Date('2026-06-01'),
        availableTo: new Date('2026-09-01'),
        distanceToUniversity: 3.2,
        rating: 3.5,
        description: 'Shared room for a student.',
        images: ['placeholder1.txt', 'placeholder2.txt', 'placeholder3.txt'],
        status: 'rented',
        tenantId: leshoo._id,
        bedsPerRoom: 2,
        floorNumber: 1,
        isActive: true
      },
      {
        ownerId: activeOwner._id,
        unitType: 'bed',
        listingType: 'rent',
        price: 800,
        address: { governorate: 'Cairo', city: 'Dokki', street: 'Tahrir', nearestUniversity: 'Cairo Univ' },
        availableFrom: new Date('2026-07-15'),
        availableTo: new Date('2026-11-15'),
        distanceToUniversity: 2.1,
        rating: 4.6,
        description: 'Single bed in a shared apartment.',
        images: ['placeholder1.txt', 'placeholder2.txt', 'placeholder3.txt'],
        status: 'sold', // testing 'sold' status with a tenant
        tenantId: activeUser._id,
        bedsPerRoom: 1,
        floorNumber: 3,
        isActive: true
      },
      {
        ownerId: lashin._id,
        unitType: 'apartment',
        listingType: 'rent',
        price: 6000,
        address: { governorate: 'Cairo', city: 'Maadi', street: 'Road 9', nearestUniversity: 'AUC' },
        availableFrom: new Date('2026-07-01'),
        availableTo: new Date('2026-10-31'),
        distanceToUniversity: 4.5,
        rating: 4.0,
        description: 'Apartment waiting for payment.',
        images: ['placeholder1.txt', 'placeholder2.txt', 'placeholder3.txt'],
        status: 'pending_payment',
        bedsPerRoom: 1,
        roomsPerApartment: 2,
        floorNumber: 4,
        isActive: true
      },
      {
        ownerId: activeOwner._id,
        unitType: 'studio',
        listingType: 'rent',
        price: 4500,
        address: { governorate: 'Giza', city: 'Haram', street: 'Faisal', nearestUniversity: 'Cairo Univ' },
        availableFrom: new Date('2026-09-01'),
        availableTo: new Date('2027-01-31'),
        distanceToUniversity: 0.5,
        description: 'Studio that was rejected.',
        images: ['placeholder1.txt', 'placeholder2.txt', 'placeholder3.txt'],
        status: 'rejected',
        rejectionReason: 'Images are not clear enough.',
        bedsPerRoom: 1,
        floorNumber: 6,
        isActive: true
      }
    ];

    const units = [];
    for (const un of unitsData) {
      let u = await Unit.findOne({ description: un.description });
      if (!u) {
        u = await Unit.create(un);
      }
      units.push(u);
    }

    // 3. PAYMENTS
    const paymentsData = [
      { ownerId: lashin._id, unitId: units[0]._id, amount: 200, method: 'vodafone_cash', proofImage: 'placeholder.txt', status: 'confirmed', transactionId: 'TX123456', reviewedBy: admin._id, reviewedAt: new Date() },
      { ownerId: lashin._id, unitId: units[1]._id, amount: 200, method: 'instapay', proofImage: 'placeholder.txt', status: 'confirmed', transactionId: 'TX123457', reviewedBy: admin._id, reviewedAt: new Date() },
      { ownerId: activeOwner._id, unitId: units[2]._id, amount: 200, method: 'bank_transfer', proofImage: 'placeholder.txt', status: 'confirmed', transactionId: 'TX123458', reviewedBy: admin._id, reviewedAt: new Date() },
      { ownerId: activeOwner._id, unitId: units[3]._id, amount: 200, method: 'vodafone_cash', proofImage: 'placeholder.txt', status: 'confirmed', transactionId: 'TX123459', reviewedBy: admin._id, reviewedAt: new Date() },
      { ownerId: lashin._id, unitId: units[4]._id, amount: 200, method: 'instapay', proofImage: 'placeholder.txt', status: 'pending', transactionId: 'TX123460' },
      { ownerId: activeOwner._id, unitId: units[5]._id, amount: 200, method: 'vodafone_cash', proofImage: 'placeholder.txt', status: 'rejected', transactionId: 'TX123461', rejectionReason: 'Fake proof image.', reviewedBy: admin._id, reviewedAt: new Date() }
    ];

    const payments = [];
    for (const p of paymentsData) {
      let pay = await Payment.findOne({ transactionId: p.transactionId });
      if (!pay) {
        pay = await Payment.create(p);
      }
      payments.push(pay);
    }

    // 4. CONVERSATIONS
    const conversationsData = [
      { unitId: units[0]._id, participants: [lashin._id, leshoo._id] },
      { unitId: units[1]._id, participants: [lashin._id, activeUser._id] },
      { unitId: units[2]._id, participants: [activeOwner._id, leshoo._id] },
      { unitId: units[3]._id, participants: [activeOwner._id, activeUser._id] },
      { unitId: units[4]._id, participants: [lashin._id, leshoo._id] },
      { unitId: units[5]._id, participants: [activeOwner._id, leshoo._id] }
    ];

    const conversations = [];
    for (const c of conversationsData) {
      let conv = await Conversation.findOne({ unitId: c.unitId, participants: { $all: c.participants } });
      if (!conv) {
        conv = await Conversation.create(c);
      }
      conversations.push(conv);
    }

    // 5. MESSAGES
    const messagesData = [
      { conversationId: conversations[0]._id, senderId: leshoo._id, content: 'Is this apartment still available?', isRead: true },
      { conversationId: conversations[0]._id, senderId: lashin._id, content: 'Yes, it is!', isRead: false },
      { conversationId: conversations[1]._id, senderId: activeUser._id, content: 'Can I view the studio tomorrow?', isRead: true },
      { conversationId: conversations[2]._id, senderId: activeOwner._id, content: 'Welcome to your new room!', isRead: true },
      { conversationId: conversations[3]._id, senderId: activeUser._id, content: 'Thanks!', isRead: true },
      { conversationId: conversations[4]._id, senderId: leshoo._id, content: 'What is the final price?', isRead: false }
    ];

    const messages = [];
    for (const m of messagesData) {
      let msg = await Message.findOne({ conversationId: m.conversationId, content: m.content });
      if (!msg) {
        msg = await Message.create(m);
      }
      messages.push(msg);
    }

    // Update last messages
    for (let i = 0; i < messages.length; i++) {
      await Conversation.findByIdAndUpdate(messages[i].conversationId, { lastMessage: messages[i]._id });
    }

    // 6. NOTIFICATIONS
    const notificationsData = [
      { userId: lashin._id, type: 'chat', message: 'You have a new message from Leshoo', relatedEntityId: conversations[0]._id, isRead: false },
      { userId: lashin._id, type: 'unit_approved', message: 'Your apartment in Nasr City was approved', relatedEntityId: units[0]._id, isRead: true },
      { userId: activeOwner._id, type: 'unit_rejected', message: 'Your studio in Haram was rejected', relatedEntityId: units[5]._id, isRead: false },
      { userId: lashin._id, type: 'payment_confirmed', message: 'Your payment for Nasr City apartment was confirmed', relatedEntityId: units[0]._id, isRead: true },
      { userId: activeOwner._id, type: 'payment_rejected', message: 'Your payment was rejected', relatedEntityId: units[5]._id, isRead: true },
      { userId: leshoo._id, type: 'booking_confirmed', message: 'Your booking in Alexandria was confirmed', relatedEntityId: units[2]._id, isRead: false }
    ];

    const notifications = [];
    for (const n of notificationsData) {
      let notif = await Notification.findOne({ userId: n.userId, message: n.message });
      if (!notif) {
        notif = await Notification.create(n);
      }
      notifications.push(notif);
    }

    // 7. AUDIT LOGS
    const auditLogsData = [
      { performedBy: admin._id, action: 'approve_unit', targetId: units[0]._id, targetType: 'Unit', previousData: { status: 'pending_approval' } },
      { performedBy: admin._id, action: 'reject_unit', targetId: units[5]._id, targetType: 'Unit', reason: 'Images are not clear enough.', previousData: { status: 'pending_approval' } },
      { performedBy: admin._id, action: 'approve_payment', targetId: payments[0]._id, targetType: 'Payment', previousData: { status: 'pending' } },
      { performedBy: admin._id, action: 'reject_payment', targetId: payments[5]._id, targetType: 'Payment', reason: 'Fake proof image.', previousData: { status: 'pending' } },
      { performedBy: admin._id, action: 'ban_user', targetId: users[3]._id, targetType: 'User' },
      { performedBy: admin._id, action: 'flag_user', targetId: users[3]._id, targetType: 'User', reason: 'User flagged for manual review' }
    ];

    const auditLogs = [];
    for (const a of auditLogsData) {
      let log = await AuditLog.findOne({ targetId: a.targetId, action: a.action });
      if (!log) {
        log = await AuditLog.create(a);
      }
      auditLogs.push(log);
    }

    // 8. ADS
    const adsData = [
      { title: 'Summer Offer', image: 'placeholder.txt', targetLocation: 'home', linkUrl: 'https://maeesha.com/summer', startDate: new Date(), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), isActive: true },
      { title: 'Discount on Apartments', image: 'placeholder.txt', targetLocation: 'search', linkUrl: 'https://maeesha.com/apartments', startDate: new Date(), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), isActive: true },
      { title: 'Student Packs', image: 'placeholder.txt', targetLocation: 'dashboard', linkUrl: 'https://maeesha.com/student', startDate: new Date(), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), isActive: true },
      { title: 'Winter Promo', image: 'placeholder.txt', targetLocation: 'home', linkUrl: 'https://maeesha.com/winter', startDate: new Date(), endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), isActive: true }, // Expired
      { title: 'Owner Special', image: 'placeholder.txt', targetLocation: 'dashboard', linkUrl: 'https://maeesha.com/owner', startDate: new Date(), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), isActive: false }, // Inactive
      { title: 'Featured Unit', image: 'placeholder.txt', targetLocation: 'search', linkUrl: 'https://maeesha.com/featured', startDate: new Date(), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), isActive: true }
    ];

    const ads = [];
    for (const ad of adsData) {
      let a = await Ad.findOne({ title: ad.title });
      if (!a) {
        a = await Ad.create(ad);
      } else {
        a = await Ad.findOneAndUpdate({ title: ad.title }, ad, { new: true });
      }
      ads.push(a);
    }

    console.log('\n--- Seeding Complete ---');
    console.log(`Users added: ${users.length}`);
    console.log(`Units added: ${units.length}`);
    console.log(`Payments added: ${payments.length}`);
    console.log(`Conversations added: ${conversations.length}`);
    console.log(`Messages added: ${messages.length}`);
    console.log(`Notifications added: ${notifications.length}`);
    console.log(`AuditLogs added: ${auditLogs.length}`);
    console.log(`Ads added: ${ads.length}`);
    console.log(`\nAdmin ID used: ${admin._id}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedDemoData();
