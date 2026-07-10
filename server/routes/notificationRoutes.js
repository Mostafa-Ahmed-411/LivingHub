const express = require('express');
const auth = require('../middlewares/auth');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.use(auth);

router.get('/', notificationController.getNotifications);
router.put('/mark-all-read', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;
