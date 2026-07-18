const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const unlockController = require('../controllers/unlockController');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// All unlock & payment routes require authentication
router.use(auth);

router.get('/unlock-status/:unitId', unlockController.checkUnlockStatus);
router.post('/unlock-unit/:unitId', unlockController.unlockUnit);
router.post('/request-contact-package', upload('payments').single('proofImage'), paymentController.buyContactPackage);

module.exports = router;
