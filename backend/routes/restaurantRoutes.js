/**
 * Restaurant Management Endpoints Router
 * Why it exists: Registers paths for branching new restaurants or updating active details.
 * What it does: Imposes express-validator schemas, ensures JWT auth, and locks functions to Owners.
 * How it connects: Mounted inside app.js under `/api/restaurants` path.
 */

const express = require('express');
const { body } = require('express-validator');
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

/**
 * @route   POST /api/restaurants
 * @desc    On-board active restaurant and auto-seed tables + generate table QR codes
 * @access  Private (Owner only)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['owner']),
  [
    body('name').trim().notEmpty().withMessage('Restaurant display name is required.'),
    body('address').trim().notEmpty().withMessage('Physical location coordinates/address is required.'),
    body('phone').trim().notEmpty().withMessage('Contact support call line is required.'),
    body('logoUrl').optional().isURL().withMessage('Logo field must be a valid image locator URL.'),
    body('tablesCount').optional().isInt({ min: 1, max: 100 }).withMessage('TablesCount count must be between 1 and 100.'),
    validationMiddleware
  ],
  restaurantController.create
);

/**
 * @route   GET /api/restaurants/:id
 * @desc    Load single restaurant branch profile with categories and tables lists (For client QR scanners!)
 * @access  Public
 */
router.get('/:id', restaurantController.getById);

/**
 * @route   PUT /api/restaurants/:id
 * @desc    Modify restaurant parameters
 * @access  Private (Owner only)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['owner']),
  [
    body('name').optional().trim().notEmpty().withMessage('Restaurant display name cannot be blank.'),
    body('address').optional().trim().notEmpty().withMessage('Physical address cannot be blank.'),
    body('phone').optional().trim().notEmpty().withMessage('Contact support line cannot be blank.'),
    body('logo').optional().trim(),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be one of: active, inactive'),
    validationMiddleware
  ],
  restaurantController.update
);

module.exports = router;
