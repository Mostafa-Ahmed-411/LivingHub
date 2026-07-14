const Unit = require('../models/Unit');

const checkFeaturedExpiry = async () => {
  try {
    const result = await Unit.updateMany(
      { isFeatured: true, featuredUntil: { $lt: new Date() } },
      { $set: { isFeatured: false, featureRequestStatus: 'none' } }
    );
    if (result.modifiedCount > 0) {
      console.log(`[Featured Expiry Job] Expired ${result.modifiedCount} units.`);
    }
  } catch (error) {
    console.error(`[Featured Expiry Job] Error running featured expiry: ${error.message}`);
  }
};

const startFeaturedExpiryJob = () => {
  // Run check immediately on startup
  checkFeaturedExpiry();

  // Run checking daily (once every 24 hours, or e.g. hourly)
  // Let's check every hour to be precise: 3600000 ms
  setInterval(checkFeaturedExpiry, 60 * 60 * 1000);
};

module.exports = { startFeaturedExpiryJob, checkFeaturedExpiry };
