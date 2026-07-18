const express = require('express');
const auth = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roles');
const ownerUnitController = require('../controllers/ownerUnitController');

const router = express.Router();

// Only owners can request features
router.use(auth, checkRole('owner', 'admin'));

router.patch('/:id/request-feature', ownerUnitController.requestFeature);

module.exports = router;
