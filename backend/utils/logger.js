/**
 * Logger Utility
 * Why it exists: Provides consistent, level-based console logging across the application.
 * What it does: Prints info, warn, and error logs with timestamps and formatting.
 * How it connects: Used by controllers, service layers, and Express error handlers.
 */

const logger = {
  info: (message, meta = '') => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (message, meta = '') => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  error: (message, error = '') => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error ? error.stack || error : '');
  }
};

module.exports = logger;
