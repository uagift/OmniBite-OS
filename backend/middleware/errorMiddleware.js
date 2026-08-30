/**
 * Express Global Error Handling Middleware
 * Why it exists: Catches and normalizes all synchronous and asynchronous errors globally.
 * What it does: Prevents system crashes, hides raw stacks in production, and formats standardized JSON error responses.
 * How it connects: Declared as the final router handler hook in app.js.
 */

const logger = require('../utils/logger');
const responseHandler = require('../utils/responseHandler');

const errorMiddleware = (err, req, res, next) => {
  logger.error(`Critical Uncaught Dispatch Error! Path: [${req.method}] ${req.originalUrl}`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return responseHandler.error(res, message, err, statusCode);
};

module.exports = errorMiddleware;
