/**
 * Order Handlers Controller
 * Why it exists: Interfaces customer request bodies (carts) to Core OrderServices and staff monitors.
 * What it does: Creates new orders, loads historical/live order queues, handles filtered lists, and triggers status state shifts.
 * How it connects: Links endpoints directly inside orderRoutes.js.
 */

const orderService = require('../services/orderService');
const db = require('../config/db');
const responseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

const orderController = {
  /**
   * Translates front-end client carts and places a database order stream
   */
  create: async (req, res, next) => {
    try {
      const { restaurantId, tableId, paymentMethod, notes, items } = req.body;
      const customerId = req.user ? req.user.id : null; // customer could be anonymous guest or registered user

      // Check input elements structure
      if (!restaurantId || !tableId || !items || !Array.isArray(items) || items.length === 0) {
        return responseHandler.error(res, 'Invalid billing card structure. Required: restaurantId, tableId, and items array.', null, 400);
      }

      // Delegate creating steps to the safe orderService
      const orderSummary = await orderService.createCustomerOrder({
        restaurantId,
        tableId,
        customerId,
        paymentMethod,
        notes,
        items
      });

      return responseHandler.success(res, 'Order transmitted successfully! Kitchen has been notified.', orderSummary, 201);

    } catch (error) {
      next(error);
    }
  },

  /**
   * Retrieves single order detail record with full order row items
   */
  getById: async (req, res, next) => {
    try {
      const orderId = req.params.id;

      // Extract primary order
      const orders = await db.query(
        `SELECT o.*, r.name AS restaurant_name, t.table_number 
         FROM orders o
         JOIN restaurants r ON o.restaurant_id = r.id
         JOIN restaurant_tables t ON o.table_id = t.id
         WHERE o.id = ?`,
        [orderId]
      );

      if (!orders || orders.length === 0) {
        return responseHandler.error(res, 'Requested order was not found.', null, 404);
      }
      const order = orders[0];

      // Extract connection items
      const items = await db.query(
        `SELECT oi.id, oi.quantity, oi.unit_price, (oi.quantity * oi.unit_price) AS subtotal, mi.name, mi.image, mi.price
         FROM order_items oi
         JOIN menu_items mi ON oi.menu_item_id = mi.id
         WHERE oi.order_id = ?`,
        [orderId]
      );

      return responseHandler.success(res, 'Order item details resolved.', {
        ...order,
        items
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Lists restaurant orders on staff queues with filter checks
   */
  list: async (req, res, next) => {
    try {
      const { restaurantId, status, paymentStatus } = req.query;
      const operatorUserId = req.user.id; // manager, waiter or owner

      if (!restaurantId) {
        return responseHandler.error(res, 'Restaurant ID filter parameter is required.', null, 400);
      }

      // 1. Verify operator is connected to the restaurant
      const isOwner = await db.query('SELECT id FROM restaurants WHERE id = ? AND owner_id = ?', [restaurantId, operatorUserId]);
      const isStaff = await db.query('SELECT id, role FROM staff WHERE user_id = ? AND restaurant_id = ? AND status = "active"', [operatorUserId, restaurantId]);

      if ((!isOwner || isOwner.length === 0) && (!isStaff || isStaff.length === 0)) {
        return responseHandler.error(res, 'Access Forbidden: Unauthorized queue check.', null, 403);
      }

      // 2. Select query with filters
      let sql = `
        SELECT o.id, o.order_number, o.total, o.status, o.payment_status, o.payment_method, o.notes, o.created_at, t.table_number, u.name AS customer_name
        FROM orders o
        JOIN restaurant_tables t ON o.table_id = t.id
        LEFT JOIN users u ON o.customer_id = u.id
        WHERE o.restaurant_id = ?
      `;
      const params = [restaurantId];

      if (status) {
        sql += ' AND o.status = ?';
        params.push(status);
      }

      if (paymentStatus) {
        sql += ' AND o.payment_status = ?';
        params.push(paymentStatus);
      }

      sql += ' ORDER BY o.created_at DESC';

      const orders = await db.query(sql, params);
      return responseHandler.success(res, 'Orders queue fetched successfully.', orders);

    } catch (error) {
      next(error);
    }
  },

  /**
   * Updates state transition boundaries
   */
  changeStatus: async (req, res, next) => {
    try {
      const orderId = req.params.id;
      const { status } = req.body; // pending, accepted, preparing, ready, delivered, completed, cancelled
      const operatorUserId = req.user.id;

      if (!status) {
        return responseHandler.error(res, 'State status parameter is required.', null, 400);
      }

      // Check permissions of operator matching order
      const orders = await db.query('SELECT restaurant_id FROM orders WHERE id = ?', [orderId]);
      if (!orders || orders.length === 0) {
        return responseHandler.error(res, 'Order details not found.', null, 404);
      }
      const restaurantId = orders[0].restaurant_id;

      const isOwner = await db.query('SELECT id FROM restaurants WHERE id = ? AND owner_id = ?', [restaurantId, operatorUserId]);
      const isStaff = await db.query('SELECT id, role FROM staff WHERE user_id = ? AND restaurant_id = ? AND status = "active"', [operatorUserId, restaurantId]);

      if ((!isOwner || isOwner.length === 0) && (!isStaff || isStaff.length === 0)) {
        return responseHandler.error(res, 'Access Forbidden: Unauthorized status operations.', null, 403);
      }

      // Trigger status transitions through the order service layer
      await orderService.updateOrderStatus(orderId, status, operatorUserId);

      return responseHandler.success(res, `Order has migrated to status state: "${status}".`, {
        orderId,
        status
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;
