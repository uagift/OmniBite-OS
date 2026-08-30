/**
 * Business Performance Metrics Endpoints Router
 * Why it exists: Protects and exposes financial KPI calculations to system owners.
 * What it does: Validates queries and forces strict Owner permissions locks.
 * How it connects: Mounted inside app.js under `/api/analytics` path.
 */

const express = require('express');
const { query } = require('express-validator');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Load dynamic KPIs (Revenue today/week/month, top sellers, averages)
 * @access  Private (Owner only)
 */
router.get(
  '/dashboard',
  authMiddleware,
  roleMiddleware(['owner']),
  [
    query('restaurantId').notEmpty().withMessage('restaurantId selection query parameter is required.'),
    validationMiddleware
  ],
  analyticsController.getDashboardKPI
);

module.exports = router;
