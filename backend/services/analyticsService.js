/**
 * Aggregated Analytics Performance Service
 * Why it exists: Computes financial insights and high-level summaries for restaurant owners.
 * What it does: Runs heavily optimized SQL queries using groupings to compute KPIs like average ticket totals, gross metrics, and item rankings.
 * How it connects: Invoked directly within the analytics controllers to dispatch dashboard metrics.
 */

const db = require('../config/db');
const logger = require('../utils/logger');

class AnalyticsService {
  /**
   * Generates a complete financial dashboard packet for a specific restaurant ID.
   * @param {number} restaurantId 
   * @returns {Object} Data objects containing revenues, order counts, averages, and best items
   */
  async getDashboardKPIData(restaurantId) {
    try {
      logger.info(`Computing metrics dashboard for Restaurant ID: ${restaurantId}`);

      // 1. Revenue Metrics (Today, Week, Month)
      // Standardizes timestamps dynamically to match strict client regions
      const revenues = await db.query(
        `SELECT
          COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() THEN total ELSE 0 END), 0) AS revenue_today,
          COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN total ELSE 0 END), 0) AS revenue_week,
          COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN total ELSE 0 END), 0) AS revenue_month
         FROM orders
         WHERE restaurant_id = ? AND status != 'cancelled' AND payment_status = 'paid'`,
        [restaurantId]
      );

      // 2. Order volumes
      const countsAndAverages = await db.query(
        `SELECT
          COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) AS orders_today,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) AS orders_pending,
          COALESCE(AVG(total), 0) AS avg_order_value
         FROM orders
         WHERE restaurant_id = ? AND status != 'cancelled'`,
        [restaurantId]
      );

      // 3. Top Selling dishes list (Max 5)
      const topSellingItems = await db.query(
        `SELECT 
          mi.id,
          mi.name,
          mi.price,
          SUM(oi.quantity) AS units_sold,
          SUM(oi.quantity * oi.unit_price) AS generated_revenue
         FROM order_items oi
         JOIN menu_items mi ON oi.menu_item_id = mi.id
         JOIN orders o ON oi.order_id = o.id
         WHERE o.restaurant_id = ? AND o.status != 'cancelled' AND o.payment_status = 'paid'
         GROUP BY mi.id, mi.name, mi.price
         ORDER BY units_sold DESC
         LIMIT 5`,
        [restaurantId]
      );

      // 4. Order statuses breakdown
      const statusBreakdown = await db.query(
        `SELECT status, COUNT(*) AS ord_count 
         FROM orders 
         WHERE restaurant_id = ?
         GROUP BY status`,
        [restaurantId]
      );

      return {
        revenueToday: parseFloat(revenues[0].revenue_today),
        revenueThisWeek: parseFloat(revenues[0].revenue_week),
        revenueThisMonth: parseFloat(revenues[0].revenue_month),
        ordersToday: parseInt(countsAndAverages[0].orders_today),
        ordersPending: parseInt(countsAndAverages[0].orders_pending),
        averageOrderValue: parseFloat(countsAndAverages[0].avg_order_value).toFixed(2),
        topItems: topSellingItems,
        statusCounts: statusBreakdown
      };
    } catch (error) {
      logger.error(`Error computing business indices for restaurant #${restaurantId}`, error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();
