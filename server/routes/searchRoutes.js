const express = require('express');
const { query } = require('express-validator');
const validate = require('../middlewares/validate');
const searchController = require('../controllers/searchController');

const router = express.Router();

const searchValidation = [
  query('unitType').optional().isIn(['apartment', 'room', 'studio', 'bed', 'All']).withMessage('Invalid unit type'),
  query('listingType').optional().isIn(['rent', 'sale', 'All', 'Rent', 'Sale']).withMessage('Invalid listing type'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number'),
  query('governorate').optional().isString().withMessage('Governorate must be a string'),
  query('district').optional().isString().withMessage('District must be a string'),
  query('city').optional().isString().withMessage('City must be a string'),
  query('nearestUniversity').optional().isString().withMessage('nearestUniversity must be a string'),
  query('availableFrom').optional().isISO8601().withMessage('availableFrom must be a valid date'),
  query('availableTo').optional().isISO8601().withMessage('availableTo must be a valid date'),
  query('floors').optional().isString().withMessage('Floors must be a string'),
  query('minRating').optional().isFloat({ min: 1, max: 5 }).withMessage('minRating must be a float between 1 and 5'),
  query('availability').optional().isIn(['available', 'all']).withMessage('Invalid availability'),
  query('sort').optional().isString().withMessage('Sort must be a string'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be greater than 0'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  validate
];

router.get('/recommended', searchController.getRecommendedUnits);
router.get('/stats', searchController.getStats);
router.get('/active-ad', searchController.getActiveAd);
router.get('/', searchValidation, searchController.searchUnits);

module.exports = router;
