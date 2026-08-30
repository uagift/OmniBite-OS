/**
 * JWT Authentication Controller
 * Why it exists: Orchestrates signing up, scanning passwords, validating credentials, and issuing tokens.
 * What it does: Registers new users, parses hashes, signs JWTs, and updates session indices.
 * How it connects: Declared as target callback actions on authRoutes endpoint registrations.
 */

const bcrypt = require('bcrypt');
const db = require('../config/db');
const generateToken = require('../utils/generateToken');
const responseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

const authController = {
  /**
   * Registers a new tenant or user in the SaaS platform
   */
  register: async (req, res, next) => {
    try {
      const { name, email, password, role, phone } = req.body;

      // Check if user already exists
      const existingUsers = await db.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUsers && existingUsers.length > 0) {
        return responseHandler.error(res, 'User email already exists. Please choose another email.', null, 400);
      }

      // Hash password using bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Save user to DB
      // Default roles strictly map to user parameters
      const defaultRole = role || 'customer';
      const insertResult = await db.query(
        'INSERT INTO users (name, email, password, role, phone, is_active) VALUES (?, ?, ?, ?, ?, 1)',
        [name, email, hashedPassword, defaultRole, phone || '']
      );

      const userId = insertResult.insertId;
      logger.info(`New user registered! User ID: ${userId}, Email: ${email}, Role: ${defaultRole}`);

      const userPayload = { id: userId, name, email, role: defaultRole };
      const token = generateToken(userPayload);

      // Audit log create user
      await db.query(
        "INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, 'USER_REGISTERED', 'users', ?)",
        [userId, userId]
      );

      return responseHandler.success(res, 'Account created successfully', {
        user: userPayload,
        token
      }, 201);

    } catch (error) {
      next(error);
    }
  },

  /**
   * User login logic and JWT sign emission
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Query database for user
      const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (!users || users.length === 0) {
        return responseHandler.error(res, 'Invalid credentials! No registered account found with this email.', null, 401);
      }

      const user = users[0];

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return responseHandler.error(res, 'Invalid password! Please double check your credentials and retry.', null, 401);
      }

      // Ensure account is active
      if (!user.is_active) {
        return responseHandler.error(res, 'Access Forbidden: This user account has been disabled by administrators.', null, 403);
      }

      // Issue JWT session
      const userPayload = { id: user.id, name: user.name, email: user.email, role: user.role };
      const token = generateToken(userPayload);

      logger.info(`User signed in! User ID: ${user.id}, Email: ${user.email}`);

      // Audit logs
      await db.query(
        "INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, 'USER_LOGIN', 'users', ?)",
        [user.id, user.id]
      );

      return responseHandler.success(res, 'Session started successfully', {
        user: userPayload,
        token
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Retrieves active identity profile based on current verified JWT headers
   */
  getProfile: async (req, res, next) => {
    try {
      // Injected by authMiddleware
      return responseHandler.success(res, 'Profile retrieved', { user: req.user });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
