const express = require('express');
const { query } = require('express-validator');
const validate = require('../middlewares/validate');
const searchController = require('../controllers/searchController');

const router = express.Router();

const searchValidation = [
  query('unitType').optional().isIn(['apartment', 'room', 'studio', 'bed']).withMessage('Invalid unit type'),
  query('listingType').optional().isIn(['rent', 'sale']).withMessage('Invalid listing type'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number'),
  query('sort').optional().isIn(['newest', 'price_asc', 'price_desc']).withMessage('Invalid sort option'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be greater than 0'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  validate
];

router.get('/recommended', searchController.getRecommendedUnits);
router.get('/', searchValidation, searchController.searchUnits);

module.exports = router;
