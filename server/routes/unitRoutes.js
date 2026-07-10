const express = require('express');
const { body } = require('express-validator');
const auth = require('../middlewares/auth');
const { checkRole, checkOwnerApproved } = require('../middlewares/roles');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');
const unitController = require('../controllers/unitController');

const router = express.Router();

const addUnitValidation = [
  body('unitType').isIn(['apartment', 'room', 'studio', 'bed']).withMessage('Invalid unit type'),
  body('listingType').isIn(['rent', 'sale']).withMessage('Invalid listing type'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('address').notEmpty().withMessage('Address is required'),
  validate
];

const editUnitValidation = [
  body('unitType').optional().isIn(['apartment', 'room', 'studio', 'bed']).withMessage('Invalid unit type'),
  body('listingType').optional().isIn(['rent', 'sale']).withMessage('Invalid listing type'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  validate
];

const statusValidation = [
  body('status').isIn(['rented', 'sold']).withMessage('Status must be rented or sold'),
  validate
];

router.post(
  '/',
  auth,
  checkRole('owner', 'admin'),
  checkOwnerApproved,
  upload('units').array('images', 10),
  addUnitValidation,
  unitController.addUnit
);

router.get('/:id', unitController.getUnit);

router.put(
  '/:id',
  auth,
  checkRole('owner', 'admin'),
  upload('units').array('images', 10),
  editUnitValidation,
  unitController.editUnit
);

router.delete(
  '/:id',
  auth,
  checkRole('owner', 'admin'),
  unitController.deactivateUnit
);

router.put(
  '/:id/status',
  auth,
  checkRole('owner', 'admin'),
  statusValidation,
  unitController.updateUnitStatus
);

module.exports = router;
