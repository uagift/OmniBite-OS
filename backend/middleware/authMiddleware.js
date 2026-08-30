/**
 * JWT Authentication Middleware
 * Why it exists: Protects private restaurant routes from anonymous access.
 * What it does: Extracts the Bearer token from authorization headers and decodes/verifies the user.
 * How it connects: Imposed as top-level router checks on private endpoints.
 */

const jwt = require('jsonwebtoken');
const responseHandler = require('../utils/responseHandler');
const db = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return responseHandler.error(res, 'Authentication token required', null, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_default_jwt_secret');

    // Query DB briefly to confirm user is active and exists
    const users = await db.query('SELECT id, name, email, role, is_active FROM users WHERE id = ?', [decoded.id]);
    if (!users || users.length === 0) {
      return responseHandler.error(res, 'User record does not exist', null, 401);
    }

    const user = users[0];
    if (!user.is_active) {
      return responseHandler.error(res, 'Account is currently disabled', null, 403);
    }

    // Attach contextual user objects to request lifecycle
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return responseHandler.error(res, 'Session token expired, please sign in again', null, 401);
    }
    return responseHandler.error(res, 'Invalid authorization token status', null, 401);
  }
};

module.exports = authMiddleware;
