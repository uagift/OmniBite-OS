/**
 * Staff Accounts Directory Endpoints Router
 * Why it exists: Binds staff CRUD directories to Owner permissions guardrails.
 * What it does: Imposes payload schemas and verifies roles parameters before operations.
 * How it connects: Mounted inside app.js under `/api/staff` path.
 */

const express = require('express');
const { body, query } = require('express-validator');
const staffController = require('../controllers/staffController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

/**
 * @route   POST /api/staff
 * @desc    Assemble credentials and hire manager/waiter (Sends automated portal welcomes)
 * @access  Private (Owner only)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['owner']),
  [
    body('name').trim().notEmpty().withMessage('Full name parameter is required.'),
    body('email').isEmail().normalizeEmail().withMessage('Please supply a valid working email.'),
    body('phone').optional().trim(),
    body('role').isIn(['manager', 'waiter']).withMessage('Role must be either: manager or waiter.'),
    body('salary').optional().isFloat({ min: 0 }).withMessage('Salary must be a positive number.'),
    body('restaurantId').isInt().withMessage('Selected Restaurant assignment ID must be an integer.'),
    validationMiddleware
  ],
  staffController.create
);

/**
 * @route   GET /api/staff
 * @desc    Query employees directory at a specific restaurant ID assignment
 * @access  Private (Owner only)
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['owner']),
  [
    query('restaurantId').notEmpty().withMessage('restaurantId query parameter is required.'),
    validationMiddleware
  ],
  staffController.list
);

/**
 * @route   PUT /api/staff/:id
 * @desc    Lock or restore employee account profiles (toggle state)
 * @access  Private (Owner only)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['owner']),
  [
    body('status').isIn(['active', 'inactive']).withMessage('Status must be set to either: active or inactive.'),
    validationMiddleware
  ],
  staffController.toggleStatus
);

module.exports = router;
