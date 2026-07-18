// حقن متغيرات البيئة الخاصة بـ JWT في أول سطر لتجنب خطأ secretOrPrivateKey
process.env.JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretFallbackKey123456!!!";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "90d";

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./utils/AppError");

// Route imports
const authRoutes = require("./routes/authRoutes");
const unitRoutes = require("./routes/unitRoutes");
const searchRoutes = require("./routes/searchRoutes");
const ownerDashboardRoutes = require("./routes/ownerDashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userDashboardRoutes = require("./routes/userDashboardRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const ownerUnitRoutes = require("./routes/ownerUnitRoutes");
const unlockRoutes = require("./routes/unlockRoutes");

const app = express();

// Security & Parsing middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);
app.use(
    cors({
        origin: [
            process.env.CLIENT_URL || "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
        ],
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  console.log('[BODY]', req.body);
  console.log('[QUERY]', req.query);
  next();
});

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/owner/dashboard", ownerDashboardRoutes);
app.use("/api/owner/units", ownerUnitRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user/dashboard", userDashboardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/unlock", unlockRoutes);

// Catch unhandled routes
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;