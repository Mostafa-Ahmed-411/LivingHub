const jwt = require('jsonwebtoken');

// قيم احتياطية صارمة في حال عدم قراءة ملف الـ .env مؤقتاً
const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretFallbackKey123456!!!";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "mySuperSecretRefreshFallbackKey123456!!!";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "90d";

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' } // صلاحية الـ Access Token الأساسية
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const hashToken = (token) => {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashToken
};