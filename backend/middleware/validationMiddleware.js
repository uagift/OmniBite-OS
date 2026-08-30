/**
 * Express Request Validator Handler Middleware
 * Why it exists: Aggregates express-validation states to short-circuit invalid schemas immediately.
 * What it does: Checks standard express-validation states, intercepts errors, and returns pristine error lists.
 * How it connects: Imposed immediately after body checks on custom validator routers.
 */

const { validationResult } = require('express-validator');
const responseHandler = require('../utils/responseHandler');

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors nicely
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));
    return responseHandler.validationError(res, formattedErrors);
  }
  next();
};

module.exports = validationMiddleware;
