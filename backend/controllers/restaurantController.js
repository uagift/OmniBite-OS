/**
 * Restaurant Management Controller
 * Why it exists: Fulfills administrative workflows for creating/modifying physical restaurants.
 * What it does: Creates new locations, issues scannable table QR presets, updates details, and uploads logos.
 * How it connects: Declared as target callback paths in restaurantRoutes.js.
 */

const db = require('../config/db');
const responseHandler = require('../utils/responseHandler');
const qrService = require('../services/qrService');
const logger = require('../utils/logger');

const restaurantController = {
  /**
   * Provisions a brand new restaurant tenant branch
   */
  create: async (req, res, next) => {
    try {
      const { name, description, address, phone, logoUrl, tablesCount } = req.body;
      const ownerId = req.user.id; // Owner extracted via JWT authentication

      // Insert core restaurant parameters
      const result = await db.query(
        'INSERT INTO restaurants (name, description, logo, address, phone, owner_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, description || '', logoUrl || '', address, phone, ownerId, 'active']
      );
      const restaurantId = result.insertId;
      logger.info(`New restaurant established! ID: ${restaurantId}, Name: ${name}`);

      // Seed tables dynamically depending on tablesCount variable (default to 5 tables)
      const maxTables = tablesCount ? parseInt(tablesCount) : 5;
      for (let i = 1; i <= maxTables; i++) {
        const tableNum = `${i}`;
        const qrUrl = qrService.generateTableQrUrl(restaurantId, tableNum);
        
        await db.query(
          'INSERT INTO restaurant_tables (table_number, restaurant_id, qr_code_url, status) VALUES (?, ?, ?, ?)',
          [tableNum, restaurantId, qrUrl, 'free']
        );
      }

      // Write Audit log creation details
      await db.query(
        "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_val) VALUES (?, 'RESTAURANT_CREATED', 'restaurants', ?, ?)",
        [ownerId, restaurantId, JSON.stringify({ name, tables: maxTables })]
      );

      return responseHandler.success(res, 'Restaurant established successfully with tables.', {
        restaurantId,
        name,
        tablesSeeded: maxTables
      }, 201);

    } catch (error) {
      next(error);
    }
  },

  /**
   * Retrieves info of specific restaurant by active key parameter, lists menu items, categories, and active tables.
   */
  getById: async (req, res, next) => {
    try {
      const restaurantId = req.params.id;

      const restaurants = await db.query('SELECT * FROM restaurants WHERE id = ?', [restaurantId]);
      if (!restaurants || restaurants.length === 0) {
        return responseHandler.error(res, 'Target restaurant record not found.', null, 404);
      }
      const restaurant = restaurants[0];

      // Fetch tables, categories
      const tables = await db.query('SELECT id, table_number, qr_code_url, status FROM restaurant_tables WHERE restaurant_id = ?', [restaurantId]);
      const categories = await db.query('SELECT id, name, description FROM categories WHERE restaurant_id = ?', [restaurantId]);

      return responseHandler.success(res, 'Restaurant profile details loaded.', {
        restaurant,
        tables,
        categories
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * Updates attributes of specific restaurant branch (supports logo url updates as well)
   */
  update: async (req, res, next) => {
    try {
      const restaurantId = req.params.id;
      const { name, description, address, phone, logo, status } = req.body;
      const ownerId = req.user.id;

      // Ensure request matches owner boundaries
      const checkRest = await db.query('SELECT owner_id, name, logo FROM restaurants WHERE id = ?', [restaurantId]);
      if (!checkRest || checkRest.length === 0) {
        return responseHandler.error(res, 'Restaurant not found.', null, 404);
      }

      if (checkRest[0].owner_id !== ownerId) {
        return responseHandler.error(res, 'Access Denied: You are not authorized to modify this restaurant.', null, 403);
      }

      // Perform update query
      await db.query(
        `UPDATE restaurants 
         SET name = ?, description = ?, address = ?, phone = ?, logo = ?, status = ?
         WHERE id = ?`,
        [
          name || checkRest[0].name,
          description || '',
          address || '',
          phone || '',
          logo || checkRest[0].logo,
          status || 'active',
          restaurantId
        ]
      );

      // Audit logs
      await db.query(
        "INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, 'RESTAURANT_UPDATED', 'restaurants', ?)",
        [ownerId, restaurantId]
      );

      return responseHandler.success(res, 'Restaurant updated completed.', { restaurantId });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = restaurantController;
