/**
 * Supa Menu Hub Server Bootstrap Module
 * Why it exists: Aggregates environment variables, boots HTML port bindings, and hooks Socket.io instances.
 * What it does: Registers dotenv configuration, starts HTTP listening, and handles signal cleanups.
 * How it connects: The absolute entry point file run in development ("npm run dev") or production ("npm start").
 */

// Load environment variables immediately on startup
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const http = require('http');
const app = require('./app');
const socketConfig = require('./config/socket');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Create standard HTTP server utilizing our customized Express container app
const server = http.createServer(app);

// Integrate real-time Socket.io instances onto server bindings
const io = socketConfig.initSocket(server);

// Boot server listening port
server.listen(PORT, '0.0.0.0', () => {
  logger.info('================================================================');
  logger.info(` 🚀 SUPA MENU BACKEND SERVER HAS SUCCESSFUL STARTED!                   `);
  logger.info(` 🛰️  Listening on network host: http://0.0.0.0:${PORT}              `);
  logger.info(` 📡 Socket.io interface active and accepting real-time connections    `);
  logger.info('================================================================');
});

// Guard uncaught exceptions to log details clearly before failure
process.on('uncaughtException', (err) => {
  logger.error('CRITICAL: Uncaught Exception thrown in master loop!', err);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('CRITICAL: Unhandled promise rejection detected!', reason);
});
