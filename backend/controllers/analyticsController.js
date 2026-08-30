/**
 * Business Financial Analytics Controller
 * Why it exists: Grants managers and restaurant owners raw operational awareness data metrics.
 * What it does: Calls specialized analytics queries to compile revenue indices, rankings, and volumes.
 * How it connects: Links directly via analyticsRoutes.js.
 */

const analyticsService = require('../services/analyticsService');
const db = require('../config/db');
const responseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

const analyticsController = {
  /**
   * Loads high level KPI indexes for Owner dashboard displays
   */
  getDashboardKPI: async (req, res, next) => {
    try {
      const { restaurantId } = req.query;
      const ownerUserId = req.user.id; // Owner identity via JWT

      if (!restaurantId) {
        return responseHandler.error(res, 'Restaurant ID Selection parameter (restaurantId) is required.', null, 400);
      }

      // Verify that this restaurant belongs to current owner
      const checkRest = await db.query('SELECT name FROM restaurants WHERE id = ? AND owner_id = ?', [restaurantId, ownerUserId]);
      if (!checkRest || checkRest.length === 0) {
        return responseHandler.error(res, 'Access Forbidden: Unauthorized analytics query.', null, 403);
      }

      // Gather analytical data from optimized service logic
      const report = await analyticsService.getDashboardKPIData(restaurantId);

      return responseHandler.success(res, `KPI analytics calculated for ${checkRest[0].name}.`, report);

    } catch (error) {
      next(error);
    }
  }
};

module.exports = analyticsController;
