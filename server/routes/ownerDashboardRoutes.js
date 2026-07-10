const express = require('express');
const auth = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roles');
const ownerDashboardController = require('../controllers/ownerDashboardController');

const router = express.Router();

router.use(auth, checkRole('owner'));

router.get('/stats', ownerDashboardController.getDashboardStats);
router.get('/units', ownerDashboardController.getMyUnits);
router.get('/history', ownerDashboardController.getMyHistory);

module.exports = router;
