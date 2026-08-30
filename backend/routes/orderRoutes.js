/**
 * Order Tracking Endpoints Router
 * Why it exists: Registers paths for table ordering checkout and staff order management queues.
 * What it does: Imposes payload assertions, guides auth conditions, and supports public/private states.
 * How it connects: Mounted inside app.js under `/api/orders` base path.
 */

const express = require('express');
const { body, query } = require('express-validator');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Submit a fresh diner order cart (Supports optional customer authentication)
 * @access  Public / Optional Authenticated Customer
 */
router.post(
  '/',
  (req, res, next) => {
    // Elegant Optional Auth logic: if Bearer header is present, we enforce JWT check;
    // else we treat them as an anonymous guest/customer on table!
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      return authMiddleware(req, res, next);
    }
    next();
  },
  [
    body('restaurantId').isInt().withMessage('restaurantId must be an integer.'),
    body('tableId').isInt().withMessage('tableId must be an integer.'),
    body('paymentMethod').optional().isIn(['MoMo', 'Card', 'Cash']).withMessage('Payment method must be one of: MoMo, Card, Cash.'),
    body('notes').optional().trim(),
    body('items').isArray({ min: 1 }).withMessage('Items array is required and must contain at least one element.'),
    body('items.*.menuItemId').isInt().withMessage('menuItemId within items must be an integer.'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('quantity within items must be a positive integer.'),
    validationMiddleware
  ],
  orderController.create
);

/**
 * @route   GET /api/orders
 * @desc    Load order tracking queues for server staff (requires permission roles)
 * @access  Private (Owner, Manager, Waiter only)
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['owner', 'manager', 'waiter']),
  [
    query('restaurantId').notEmpty().withMessage('restaurantId query parameter is required.'),
    query('status').optional().isIn(['pending', 'accepted', 'preparing', 'ready', 'delivered', 'completed', 'cancelled']).withMessage('Invalid status term.'),
    query('paymentStatus').optional().isIn(['pending', 'paid', 'failed']).withMessage('Invalid paymentStatus term.'),
    validationMiddleware
  ],
  orderController.list
);

/**
 * @route   GET /api/orders/:id
 * @desc    Load single order description with line items
 * @access  Public (Guest scanner or connected account)
 */
router.get('/:id', orderController.getById);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Change Order Status (Accepted, Preparing, Ready, Delivered, Completed, Cancelled)
 * @access  Private (Owner, Manager, Waiter only)
 */
router.put(
  '/:id/status',
  authMiddleware,
  roleMiddleware(['owner', 'manager', 'waiter']),
  [
    body('status').isIn(['pending', 'accepted', 'preparing', 'ready', 'delivered', 'completed', 'cancelled']).withMessage('Invalid state status parameter.'),
    validationMiddleware
  ],
  orderController.changeStatus
);

module.exports = router;
