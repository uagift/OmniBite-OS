/**
 * Specialized Sockets Listeners Wrapper
 * Why it exists: Aggregates real-time events, room subscriptions, waiter calls, and statuses tracking.
 * What it does: Sets up client event triggers for kitchen dashboards and tables.
 * How it connects: Links directly inside the bootstrap socket.js config.
 */

const logger = require('../utils/logger');

const registerOrderSocketHandlers = (io, socket) => {
  // Join room for specific Restaurant (for staff dashboards to receive only their orders)
  socket.on('join-restaurant', (restaurantId) => {
    socket.join(`restaurant_${restaurantId}`);
    logger.info(`Socket ${socket.id} joined restaurant room: restaurant_${restaurantId}`);
  });

  // Join room for specific Customer Table (for table-specific notifications)
  socket.on('join-table', ({ restaurantId, tableNumber }) => {
    socket.join(`table_${restaurantId}_${tableNumber}`);
    logger.info(`Socket ${socket.id} joined table room: table_${restaurantId}_${tableNumber}`);
  });

  // Call Waiter Event - Custome on table triggers this to alert waiter terminal
  socket.on('call-waiter', ({ restaurantId, tableNumber, reason }) => {
    logger.info(`🔔 Waiter CALLED! Restaurant #${restaurantId}, Table ${tableNumber}. Reason: "${reason || 'Service requested'}"`);
    
    // Broadcast this alert to the entire restaurant work channel room
    io.to(`restaurant_${restaurantId}`).emit('waiter-requested', {
      tableNumber,
      reason: reason || 'Service requested',
      timestamp: new Date().toISOString()
    });
  });

  // Clear Table Event - Custome exits or waiter completes, resets room status
  socket.on('clear-table', ({ restaurantId, tableNumber }) => {
    logger.info(`🧹 Table cleared. Restaurant #${restaurantId}, Table ${tableNumber}`);
    io.to(`restaurant_${restaurantId}`).emit('table-status-reset', {
      tableNumber,
      status: 'free'
    });
  });
};

module.exports = {
  registerOrderSocketHandlers
};
