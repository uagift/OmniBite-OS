/**
 * Category Endpoints Router
 * Why it exists: Registers endpoint controls to categorize food catalogs.
 * What it does: Protects CRUD paths to owners and managers, while keeping GET accessible.
 * How it connects: Mounted inside app.js under `/api/categories` routing context.
 */

const express = require('express');
const { body, query } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

/**
 * @route   POST /api/categories
 * @desc    Establish a brand new catalog category
 * @access  Private (Owner, Manager only)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['owner', 'manager']),
  [
    body('name').trim().notEmpty().withMessage('Category display name is required.'),
    body('description').optional().trim(),
    body('restaurantId').isInt().withMessage('Mapped restaurantId must be an integer.'),
    validationMiddleware
  ],
  categoryController.create
);

/**
 * @route   GET /api/categories
 * @desc    Load categories linked to restaurant
 * @access  Public
 */
router.get(
  '/',
  [
    query('restaurantId').notEmpty().withMessage('restaurantId query parameter is required.'),
    validationMiddleware
  ],
  categoryController.list
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Rename category name/desc parameters
 * @access  Private (Owner, Manager only)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['owner', 'manager']),
  [
    body('name').optional().trim().notEmpty().withMessage('Display name string cannot be blank.'),
    body('description').optional().trim(),
    validationMiddleware
  ],
  categoryController.update
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Purge category item completely (CASCADE triggers delete on children items)
 * @access  Private (Owner, Manager only)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['owner', 'manager']),
  categoryController.delete
);

module.exports = router;
