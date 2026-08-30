/**
 * System Alerts & Notifications Endpoints Router
 * Why it exists: Binds alert logs and unread statuses to logged in accounts.
 * What it does: Grants access to query, edit read status, or flush notifications.
 * How it connects: Mounted inside app.js under `/api/notifications` path.
 */

const express = require('express');
const { query } = require('express-validator');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

// Enforce full active user session authentication on all alerts routers
router.use(authMiddleware);

/**
 * @route   GET /api/notifications
 * @desc    Load system notifications cards for active account (e.g. waiter alerts)
 * @access  Private (Registered users)
 */
router.get(
  '/',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100.'),
    validationMiddleware
  ],
  notificationController.list
);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Flag target alert card read status as true
 * @access  Private (Registered owner user)
 */
router.put('/:id/read', notificationController.markAsRead);

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Flag all alerts in account read status as true
 * @access  Private (Registered users)
 */
router.put('/read-all', notificationController.markAllAsRead);

module.exports = router;
