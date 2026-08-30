/**
 * Core Orchestrated Order Management Service
 * Why it exists: Manages critical order transactional mechanics, stock decreases, alerts, and logger audits.
 * What it does: Runs validation, saves orders/items, decrements menu count, dispatches low-stock emails, and issues real-time Socket events.
 * How it connects: Invoked by the order controllers to fulfill guest orders transactionally.
 */

const db = require('../config/db');
const emailService = require('./emailService');
const socketConfig = require('../config/socket');
const logger = require('../utils/logger');

class OrderService {
  /**
   * Safe transaction-equivalent order creator
   */
  async createCustomerOrder(orderPayload) {
    const {
      restaurantId,
      tableId,
      customerId,
      paymentMethod,
      notes,
      items // Array of { menuItemId, quantity }
    } = orderPayload;

    try {
      logger.info(`Starting order creation workflow for Table #${tableId} at Restaurant #${restaurantId}`);

      // 1. Fetch restaurant and table particulars
      const restaurants = await db.query('SELECT name, owner_id FROM restaurants WHERE id = ?', [restaurantId]);
      if (!restaurants || restaurants.length === 0) {
        throw new Error('Target restaurant does not exist.');
      }
      const restaurant = restaurants[0];

      const tables = await db.query('SELECT table_number FROM restaurant_tables WHERE id = ? AND restaurant_id = ?', [tableId, restaurantId]);
      if (!tables || tables.length === 0) {
        throw new Error('Target table does not exist at this restaurant.');
      }
      const table = tables[0];

      // 2. Fetch all menu items referenced in payload to validate availability and pricing
      const menuItemIds = items.map(i => i.menuItemId);
      if (menuItemIds.length === 0) {
        throw new Error('Order must contain at least one menu item.');
      }

      const placeholders = menuItemIds.map(() => '?').join(',');
      const dbItems = await db.query(
        `SELECT id, name, price, stock_quantity, is_available, category_id 
         FROM menu_items 
         WHERE id IN (${placeholders}) AND restaurant_id = ?`,
        [...menuItemIds, restaurantId]
      );

      // Map DB items by ID for O(1) checks
      const catalogMap = {};
      dbItems.forEach(item => {
        catalogMap[item.id] = item;
      });

      // Validate quantities, stock levels, and active menu items
      let calculatedTotal = 0;
      const verifiedItems = items.map(clientItem => {
        const dbItem = catalogMap[clientItem.menuItemId];
        if (!dbItem) {
          throw new Error(`Menu item ID ${clientItem.menuItemId} is not active or has been removed from this restaurant's menu.`);
        }
        if (!dbItem.is_available) {
          throw new Error(`Sorry, "${dbItem.name}" is currently sold out and unavailable!`);
        }
        if (dbItem.stock_quantity < clientItem.quantity) {
          throw new Error(`Insufficient stock for "${dbItem.name}". Only ${dbItem.stock_quantity} servings remaining.`);
        }

        const quantity = parseInt(clientItem.quantity);
        const unitPrice = parseFloat(dbItem.price);
        calculatedTotal += unitPrice * quantity;

        return {
          ...dbItem,
          orderQuantity: quantity,
          subtotal: unitPrice * quantity
        };
      });

      // 3. Generate a distinctive, highly secure Order Number
      const timestampSec = Math.floor(Date.now() / 1000);
      const randHex = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `SM-${timestampSec}-${randHex}`;

      // 4. Save primary Order record
      const orderResult = await db.query(
        `INSERT INTO orders (order_number, customer_id, restaurant_id, table_id, total, status, payment_status, payment_method, notes) 
         VALUES (?, ?, ?, ?, ?, 'pending', 'pending', ?, ?)`,
        [orderNumber, customerId || null, restaurantId, tableId, calculatedTotal, paymentMethod || 'MoMo', notes || '']
      );
      const insertedOrderId = orderResult.insertId;

      // 5. Save order items, decrement stock quantities, check low stock alerts
      let itemsRowsHtml = '';
      for (const item of verifiedItems) {
        // Save order_items row
        await db.query(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, notes) 
           VALUES (?, ?, ?, ?, ?)`,
          [insertedOrderId, item.id, item.orderQuantity, item.price, '']
        );

        // Update stock levels
        const updatedStock = item.stock_quantity - item.orderQuantity;
        await db.query(
          'UPDATE menu_items SET stock_quantity = ? WHERE id = ?',
          [updatedStock, item.id]
        );

        // Prepare table row for email receipt compilation
        itemsRowsHtml += `
          <tr>
            <td>${item.name}</td>
            <td style="text-align: center;">${item.orderQuantity}</td>
            <td style="text-align: right;">${(item.price * item.orderQuantity).toFixed(0)} RWF</td>
          </tr>
        `;

        // Check Low Stock Warning threshold level (alerts operator if stock dips to 5 or below)
        if (updatedStock <= 5) {
          logger.warn(`Low stock threshold reached for "${item.name}"! Quantity: ${updatedStock}`);
          
          // Obtain owner email
          const ownerUsers = await db.query('SELECT name, email FROM users WHERE id = ?', [restaurant.owner_id]);
          if (ownerUsers && ownerUsers.length > 0) {
            const owner = ownerUsers[0];
            await emailService.send({
              userId: restaurant.owner_id,
              restaurantId: restaurantId,
              to: owner.email,
              subject: `🚨 Stock Warning: replenish "${item.name}"`,
              templateName: 'lowStock',
              replacements: {
                restaurantName: restaurant.name,
                menuItemName: item.name,
                currentStock: updatedStock
              },
              type: 'low_stock'
            });
          }
        }
      }

      // 6. Push real-time event updates via global Socket.io client layer
      const io = socketConfig.getIO();
      if (io) {
        // Emit in restaurant room so all waiter and kitchen terminals hear it
        io.to(`restaurant_${restaurantId}`).emit('new-order', {
          orderId: insertedOrderId,
          orderNumber,
          tableNumber: table.table_number,
          total: calculatedTotal,
          items: verifiedItems.map(vi => ({ name: vi.name, qty: vi.orderQuantity })),
          notes,
          status: 'pending'
        });
        logger.info(`Fired real-time websocket alert for order ${orderNumber} to room restaurant_${restaurantId}`);
      }

      // 7. Fire outbound transactional email alert to the owner/operator
      const owners = await db.query('SELECT email FROM users WHERE id = ?', [restaurant.owner_id]);
      if (owners && owners.length > 0) {
        await emailService.send({
          userId: restaurant.owner_id,
          restaurantId: restaurantId,
          to: owners[0].email,
          subject: `🔔 New Supa Menu Order Ref: ${orderNumber}`,
          templateName: 'newOrder',
          replacements: {
            orderNumber,
            restaurantName: restaurant.name,
            tableNumber: table.table_number,
            paymentMethod: paymentMethod || 'MoMo',
            notes: notes || 'None',
            itemsRows: itemsRowsHtml,
            totalAmount: calculatedTotal.toLocaleString(),
            dashboardUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard`
          },
          type: 'order'
        });
      }

      // 8. Create standard audit trail log
      await db.query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, prev_val, new_val) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [customerId || null, 'ORDER_PLACED', 'orders', insertedOrderId, null, JSON.stringify({ orderNumber, total: calculatedTotal })]
      );

      return {
        orderId: insertedOrderId,
        orderNumber,
        total: calculatedTotal,
        itemsCount: verifiedItems.length
      };

    } catch (error) {
      logger.error('Failed to create customer order stream safely in service:', error);
      throw error;
    }
  }

  /**
   * High performance order status updater that triggers socket updates & email states
   */
  async updateOrderStatus(orderId, nextStatus, operatorUserId) {
    try {
      logger.info(`Transitioning Order #${orderId} status to state: "${nextStatus}" by operator user: #${operatorUserId}`);

      // Fetch existing order with customer detail
      const orders = await db.query(
        `SELECT o.*, r.name AS restaurant_name, r.id AS restaurant_id, t.table_number, u.email AS customer_email, u.name AS customer_name, u.id AS customer_id
         FROM orders o
         JOIN restaurants r ON o.restaurant_id = r.id
         JOIN restaurant_tables t ON o.table_id = t.id
         LEFT JOIN users u ON o.customer_id = u.id
         WHERE o.id = ?`,
        [orderId]
      );

      if (!orders || orders.length === 0) {
        throw new Error('Order was not found in active records.');
      }
      const order = orders[0];
      const prevStatus = order.status;

      // Update the DB state
      await db.query('UPDATE orders SET status = ? WHERE id = ?', [nextStatus, orderId]);

      // If status transitions to 'completed', auto mark payment as 'paid' to balance books
      if (nextStatus === 'completed') {
        await db.query("UPDATE orders SET payment_status = 'paid' WHERE id = ?", [orderId]);
      }

      // Update table state dynamically if status transitions
      if (nextStatus === 'delivered') {
        await db.query('UPDATE restaurant_tables SET status = ? WHERE id = ?', ['served', order.table_id]);
      } else if (nextStatus === 'completed') {
        await db.query('UPDATE restaurant_tables SET status = ? WHERE id = ?', ['free', order.table_id]);
      }

      // Record logs in audit_logs
      await db.query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, prev_val, new_val) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [operatorUserId, 'ORDER_STATUS_CHANGED', 'orders', orderId, prevStatus, nextStatus]
      );

      // Emit socket notification
      const io = socketConfig.getIO();
      if (io) {
        io.to(`restaurant_${order.restaurant_id}`).emit('order-updated', {
          orderId,
          orderNumber: order.order_number,
          status: nextStatus
        });
        
        // Also alert specifically to table clients
        io.to(`table_${order.restaurant_id}_${order.table_number}`).emit('order-status', {
          orderNumber: order.order_number,
          status: nextStatus
        });
      }

      // Inform customer via targeted email depending on lifecycle
      if (order.customer_email) {
        let templateMap = {
          'accepted': { template: 'accepted', subject: `✅ Order Accepted: #${order.order_number}` },
          'preparing': { template: 'preparing', subject: `🍳 Cooking Now: #${order.order_number}` },
          'ready': { template: 'ready', subject: `🍽️ Order Ready for pickup: #${order.order_number}` },
          'delivered': { template: 'delivered', subject: `💜 Order Delivered: #${order.order_number}` }
        };

        const mailTarget = templateMap[nextStatus];
        if (mailTarget) {
          await emailService.send({
            userId: order.customer_id,
            restaurantId: order.restaurant_id,
            to: order.customer_email,
            subject: mailTarget.subject,
            templateName: mailTarget.template,
            replacements: {
              customerName: order.customer_name || 'Valued Guest',
              orderNumber: order.order_number,
              restaurantName: order.restaurant_name,
              tableNumber: order.table_number,
              totalAmount: parseFloat(order.total).toLocaleString()
            },
            type: 'order'
          });
        }
      }

      return true;
    } catch (error) {
      logger.error(`Error transitioning Order #${orderId} status`, error);
      throw error;
    }
  }
}

module.exports = new OrderService();
