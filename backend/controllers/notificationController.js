/**
 * Operational Alerts & Notifications Controller
 * Why it exists: Holds records of active alerts, email dispatches, and stock warnings.
 * What it does: Fetches notification files, updates unread markers, and filters listings.
 * How it connects: Declared directly inside notificationRoutes.js.
 */

const db = require('../config/db');
const responseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

const notificationController = {
  /**
   * lists notifications of active logged-in user
   */
  list: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { limit } = req.query;

      const maxLimit = limit ? parseInt(limit) : 25;
      
      const alerts = await db.query(
        `SELECT id, title, message, type, is_read, sent_at 
         FROM notifications 
         WHERE user_id = ? 
         ORDER BY sent_at DESC 
         LIMIT ?`,
        [userId, maxLimit]
      );

      return responseHandler.success(res, 'Notifications retrieved.', alerts);

    } catch (error) {
      next(error);
    }
  },

  /**
   * Sets single is_read state to true
   */
  markAsRead: async (req, res, next) => {
    try {
      const alertId = req.params.id;
      const userId = req.user.id;

      // Validate owner
      const checkAlert = await db.query('SELECT user_id FROM notifications WHERE id = ?', [alertId]);
      if (!checkAlert || checkAlert.length === 0) {
        return responseHandler.error(res, 'Notification alert not found.', null, 404);
      }

      if (checkAlert[0].user_id !== userId) {
        return responseHandler.error(res, 'Access Forbidden: Unauthorized modification.', null, 403);
      }

      await db.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [alertId]);

      return responseHandler.success(res, 'Marked notification as read.', { alertId });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Marks ALL user notifications as read in one batch
   */
  markAllAsRead: async (req, res, next) => {
    try {
      const userId = req.user.id;

      await db.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);

      return responseHandler.success(res, 'All notifications flagged as read.');

    } catch (error) {
      next(error);
    }
  }
};

module.exports = notificationController;
