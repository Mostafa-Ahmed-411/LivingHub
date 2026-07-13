require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

// استدعاء الـ Models (تأكد من مطابقة المسارات والأسماء عندك)
const User = require("./models/User"); 
const Unit = require("./models/Unit");

const seedCleanDashboard = async () => {
    try {
        // 1. الاتصال بقاعدة البيانات
        await connectDB();
        console.log("MongoDB connected successfully...");

        // 2. البحث عن حسابك وتأكيد صلاحيات الـ Owner وتنشيطه
        const ownerEmail = "tamr24543@gmail.com";
        const owner = await User.findOne({ email: ownerEmail });

        if (!owner) {
            console.log(`❌ User with email ${ownerEmail} not found. Please register or check the email!`);
            process.exit(1);
        }

        console.log(`Found User: ${owner.firstName || "Owner"}. Updating status...`);
        
        owner.accountStatus = "active";
        owner.role = "owner";
        await owner.save();
        console.log("✅ Owner profile status set to Active and verified.");

        // 3. تنظيف وتصفير جدول العقارات (Units) المربوطة بـ حسابك تماماً
        console.log("Clearing old listings to reset dashboard to zero...");
        const deleteResult = await Unit.deleteMany({ ownerId: owner._id });
        
        console.log(`🧹 Done! Cleared ${deleteResult.deletedCount} units.`);
        console.log("🎉 Dashboard is now completely customized for a brand new Owner! All stats reset to 0.");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error during cleaning/seeding process:", error);
        process.exit(1);
    }
};

seedCleanDashboard();