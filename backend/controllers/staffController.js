/**
 * Staff Accounts Directory Controller
 * Why it exists: Manages hiring lists, roles assignments, and account locks.
 * What it does: Creates new manager/waiter system accounts, generates temporary security strings, and locks actions.
 * How it connects: Links directly via staffRoutes.js routes.
 */

const bcrypt = require('bcrypt');
const db = require('../config/db');
const emailService = require('../services/emailService');
const responseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

const staffController = {
  /**
   * Adds brand new staff credentials inside the system directory
   */
  create: async (req, res, next) => {
    try {
      const { name, email, phone, role, salary, restaurantId } = req.body;
      const ownerUserId = req.user.id;

      // 1. Verify restaurant belongs to this owner
      const checkRest = await db.query('SELECT name, id FROM restaurants WHERE id = ? AND owner_id = ?', [restaurantId, ownerUserId]);
      if (!checkRest || checkRest.length === 0) {
        return responseHandler.error(res, 'Target restaurant not found or access unauthorized.', null, 403);
      }
      const restaurant = checkRest[0];

      // 2. Validate email availability in master directory
      const existingUsers = await db.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUsers && existingUsers.length > 0) {
        return responseHandler.error(res, 'User email already exists inside our server.', null, 400);
      }

      // 3. Generate a safe temporary alphanumeric password
      const tempPassword = `SupaStaff-${Math.floor(1000 + Math.random() * 9000)}`;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

      // 4. Save into Users Table
      const userResult = await db.query(
        'INSERT INTO users (name, email, password, role, phone, is_active) VALUES (?, ?, ?, ?, ?, 1)',
        [name, email, hashedPassword, role, phone || '']
      );
      const newUserId = userResult.insertId;

      // 5. Save into Staff Specific Details Table
      const hireDateStr = new Date().toISOString().slice(0, 10); // current date yyyy-mm-dd
      await db.query(
        'INSERT INTO staff (user_id, restaurant_id, role, salary, hire_date, status) VALUES (?, ?, ?, ?, ?, ?)',
        [newUserId, restaurantId, role, salary || 0.00, hireDateStr, 'active']
      );

      logger.info(`Staff registration completed: User ID #${newUserId} on Restaurant ID #${restaurantId}`);

      // 6. Fire on-board welcome email receipt containing dynamic credentials
      await emailService.send({
        userId: newUserId,
        restaurantId,
        to: email,
        subject: `👋 Account Created: Staff Portal on ${restaurant.name}`,
        templateName: 'staffCreated',
        replacements: {
          staffName: name,
          staffRole: role.charAt(0).toUpperCase() + role.slice(1),
          restaurantName: restaurant.name,
          portalUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard`,
          staffEmail: email,
          tempPassword
        },
        type: 'system'
      });

      // Audit logs
      await db.query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_val) 
         VALUES (?, 'STAFF_CREATED', 'staff', ?, ?)`,
        [ownerUserId, newUserId, JSON.stringify({ role, restaurantId })]
      );

      return responseHandler.success(res, 'Staff workspace account spawned successfully.', {
        staffId: newUserId,
        email,
        temporaryPassword: tempPassword
      }, 201);

    } catch (error) {
      next(error);
    }
  },

  /**
   * lists all active, mapped staff accounts in the restaurant
   */
  list: async (req, res, next) => {
    try {
      const { restaurantId } = req.query;
      const ownerUserId = req.user.id;

      if (!restaurantId) {
        return responseHandler.error(res, 'Restaurant selection parameter (restaurantId) is required.', null, 400);
      }

      // Verify ownership
      const checkRest = await db.query('SELECT id FROM restaurants WHERE id = ? AND owner_id = ?', [restaurantId, ownerUserId]);
      if (!checkRest || checkRest.length === 0) {
        return responseHandler.error(res, 'Assess Forbidden: unauthorized dashboard query.', null, 403);
      }

      // Perform join selection
      const staffList = await db.query(
        `SELECT u.id AS user_id, u.name, u.email, u.phone, u.is_active, s.id AS staff_id, s.role, s.salary, s.hire_date, s.status
         FROM staff s
         JOIN users u ON s.user_id = u.id
         WHERE s.restaurant_id = ?`,
        [restaurantId]
      );

      return responseHandler.success(res, 'Staff rosters retrieved successfully.', staffList);

    } catch (error) {
      next(error);
    }
  },

  /**
   * Locks/Enables staff profile credentials status
   */
  toggleStatus: async (req, res, next) => {
    try {
      const staffUserId = req.params.id; // user id of target staff
      const { status } = req.body; // 'active' or 'inactive'
      const ownerUserId = req.user.id;

      // Find staff restaurant map
      const staffs = await db.query('SELECT restaurant_id, role FROM staff WHERE user_id = ?', [staffUserId]);
      if (!staffs || staffs.length === 0) {
        return responseHandler.error(res, 'Staff record does not exist.', null, 404);
      }
      const staff = staffs[0];

      // Confirm ownership
      const checkRest = await db.query('SELECT id FROM restaurants WHERE id = ? AND owner_id = ?', [staff.restaurant_id, ownerUserId]);
      if (!checkRest || checkRest.length === 0) {
        return responseHandler.error(res, 'Access Forbidden: Unauthorized staff operations.', null, 403);
      }

      const isActiveBit = (status === 'active') ? 1 : 0;
      
      // Update state in user directory and child staff mapping table
      await db.query('UPDATE users SET is_active = ? WHERE id = ?', [isActiveBit, staffUserId]);
      await db.query('UPDATE staff SET status = ? WHERE user_id = ?', [status, staffUserId]);

      logger.info(`Staff account #${staffUserId} status modified to: ${status}`);

      // Audit logs
      await db.query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id) 
         VALUES (?, 'STAFF_STATUS_TOGGLED', 'staff', ?)`,
        [ownerUserId, staffUserId]
      );

      return responseHandler.success(res, `Staff membership status successfully set to: ${status}.`, {
        staffUserId,
        status
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = staffController;
