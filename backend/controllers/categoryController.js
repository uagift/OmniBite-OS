/**
 * Category Configurations Controller
 * Why it exists: Supports dividing dishes and drinks into sections (e.g. Appetizers, Desserts).
 * What it does: Creates, updates, deletes, and lists active food catalog categories.
 * How it connects: Links dynamically within categoryRoutes.js.
 */

const db = require('../config/db');
const responseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

const categoryController = {
  /**
   * Adds custom category tags to a restaurant catalog
   */
  create: async (req, res, next) => {
    try {
      const { name, description, restaurantId } = req.body;
      const operatorId = req.user.id;

      // Validate restaurant ownership or manager delegation level
      const isOwner = await db.query('SELECT id FROM restaurants WHERE id = ? AND owner_id = ?', [restaurantId, operatorId]);
      const isManager = await db.query('SELECT id FROM staff WHERE user_id = ? AND restaurant_id = ? AND role = "manager" AND status = "active"', [operatorId, restaurantId]);

      if ((!isOwner || isOwner.length === 0) && (!isManager || isManager.length === 0)) {
        return responseHandler.error(res, 'Access Forbidden: Access unauthorized to add categories.', null, 403);
      }

      // Perform insertion
      const result = await db.query(
        'INSERT INTO categories (name, description, restaurant_id) VALUES (?, ?, ?)',
        [name, description || '', restaurantId]
      );
      const categoryId = result.insertId;

      // Audit log categories
      await db.query(
        "INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, 'CATEGORY_CREATED', 'categories', ?)",
        [operatorId, categoryId]
      );

      return responseHandler.success(res, 'Menu Category compiled successfully.', {
        categoryId,
        name,
        restaurantId
      }, 201);

    } catch (error) {
      next(error);
    }
  },

  /**
   * lists active categories inside a target restaurant
   */
  list: async (req, res, next) => {
    try {
      const { restaurantId } = req.query;
      if (!restaurantId) {
        return responseHandler.error(res, 'Restaurant identity parameter is required.', null, 400);
      }

      const list = await db.query(
        'SELECT id, name, description, created_at FROM categories WHERE restaurant_id = ? ORDER BY name ASC',
        [restaurantId]
      );

      return responseHandler.success(res, 'Categories loaded successfully.', list);

    } catch (error) {
      next(error);
    }
  },

  /**
   * updates name or description details
   */
  update: async (req, res, next) => {
    try {
      const categoryId = req.params.id;
      const { name, description } = req.body;
      const operatorId = req.user.id;

      // Find category
      const categories = await db.query('SELECT restaurant_id, name FROM categories WHERE id = ?', [categoryId]);
      if (!categories || categories.length === 0) {
        return responseHandler.error(res, 'Menu Category was not found.', null, 404);
      }
      const category = categories[0];

      // Verify access constraints
      const isOwner = await db.query('SELECT id FROM restaurants WHERE id = ? AND owner_id = ?', [category.restaurant_id, operatorId]);
      const isManager = await db.query('SELECT id FROM staff WHERE user_id = ? AND restaurant_id = ? AND role = "manager" AND status = "active"', [operatorId, category.restaurant_id]);

      if ((!isOwner || isOwner.length === 0) && (!isManager || isManager.length === 0)) {
        return responseHandler.error(res, 'Access Forbidden: Unauthorized modification of category parameters.', null, 403);
      }

      await db.query(
        'UPDATE categories SET name = ?, description = ? WHERE id = ?',
        [name || category.name, description || '', categoryId]
      );

      return responseHandler.success(res, 'Category updated successfully.', { categoryId });

    } catch (error) {
      next(error);
    }
  },

  /**
   * deletes category completely
   */
  delete: async (req, res, next) => {
    try {
      const categoryId = req.params.id;
      const operatorId = req.user.id;

      // Find category
      const categories = await db.query('SELECT restaurant_id FROM categories WHERE id = ?', [categoryId]);
      if (!categories || categories.length === 0) {
        return responseHandler.error(res, 'Category not found.', null, 404);
      }
      const category = categories[0];

      // Verify access constraints
      const isOwner = await db.query('SELECT id FROM restaurants WHERE id = ? AND owner_id = ?', [category.restaurant_id, operatorId]);
      const isManager = await db.query('SELECT id FROM staff WHERE user_id = ? AND restaurant_id = ? AND role = "manager" AND status = "active"', [operatorId, category.restaurant_id]);

      if ((!isOwner || isOwner.length === 0) && (!isManager || isManager.length === 0)) {
        return responseHandler.error(res, 'Access Forbidden: Unauthorized deletion of category.', null, 403);
      }

      // Delete action clears CASCADE connected menu items automatically due to schema definitions!
      await db.query('DELETE FROM categories WHERE id = ?', [categoryId]);

      // Audit logs
      await db.query(
        "INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, 'CATEGORY_DELETED', 'categories', ?)",
        [operatorId, categoryId]
      );

      return responseHandler.success(res, 'Category and all associated menus flushed successfully.', { categoryId });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;
