/**
 * Socket.io Server Context Configuration
 * Why it exists: Bootstraps the real-time websocket server with Express.
 * What it does: Sets up Socket.io server instance with standard CORS rules.
 * How it connects: Links directly within server.js to bind websocket interfaces to the main server port.
 */

const { Server } = require('socket.io');
const logger = require('../utils/logger');
const { registerOrderSocketHandlers } = require('../sockets/orderSocket');

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    logger.info(`Websocket Client Connected: ${socket.id}`);

    // Register customized order real-time events listeners (join-restaurant, join-table, call-waiter, etc.)
    registerOrderSocketHandlers(io, socket);

    socket.on('disconnect', () => {
      logger.info(`Websocket Client Disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

module.exports = {
  initSocket,
  getIO
};
