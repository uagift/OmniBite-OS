/**
 * Authentication Endpoints Router
 * Why it exists: Binds incoming registration and session login calls to controller handlers.
 * What it does: Imposes query parameter validations, sanitizations, and attaches JWT profiling.
 * How it connects: Mounted inside app.js under `/api/auth` path.
 */

const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Sign up new owner, manager or customer
 * @access  Public
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Full name is required.'),
    body('email').isEmail().normalizeEmail().withMessage('Please specify a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('role').optional().isIn(['owner', 'manager', 'waiter', 'customer']).withMessage('Role must be one of: owner, manager, waiter, customer.'),
    body('phone').optional().trim(),
    validationMiddleware
  ],
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Establish user session/cookie credentials
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('A valid email address is required.'),
    body('password').notEmpty().withMessage('Password field cannot be blank.'),
    validationMiddleware
  ],
  authController.login
);

/**
 * @route   GET /api/auth/profile
 * @desc    Retrieve active credentials summary from headers
 * @access  Private
 */
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
