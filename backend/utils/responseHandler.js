/**
 * Standard API Response Utility
 * Why it exists: Enforces structural uniformity across all HTTP responses of the Supa Menu API.
 * What it does: Formats data into standardized objects for success and error payloads.
 * How it connects: Directly invoked in controllers to respond to clients.
 */

const responseHandler = {
  success: (res, message = 'Success', data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },

  error: (res, message = 'Internal Server Error', error = null, statusCode = 500) => {
    const response = {
      success: false,
      message
    };
    if (error && process.env.NODE_ENV !== 'production') {
      response.error = error.message || error;
      response.stack = error.stack;
    }
    return res.status(statusCode).json(response);
  },

  validationError: (res, errors = []) => {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Array.isArray(errors) ? errors : [errors]
    });
  }
};

module.exports = responseHandler;
