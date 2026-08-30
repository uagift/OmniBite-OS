/**
 * Menu Catalog Management Controller
 * Why it exists: Enables kitchen staff and owners to curate, price, and restock active dishes.
 * What it does: Creates new keys, updates item profiles, modifies stock quantities, and handles deletes.
 * How it connects: Mounted within menuRoutes.js routers.
 */

const db = require('../config/db');
const responseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

const menuController = {
  /**
   * Appends a brand new menu item to a restaurant category
   */
  create: async (req, res, next) => {
    try {
      const { name, description, price, stockQuantity, isAvailable, categoryId, restaurantId, imageUrl } = req.body;
      const operatorId = req.user.id;

      // 1. Confirm operator is authorized for target restaurant
      const isOwner = await db.query('SELECT id FROM restaurants WHERE id = ? AND owner_id = ?', [restaurantId, operatorId]);
      const isManager = await db.query('SELECT id FROM staff WHERE user_id = ? AND restaurant_id = ? AND role = "manager" AND status = "active"', [operatorId, restaurantId]);

      if ((!isOwner || isOwner.length === 0) && (!isManager || isManager.length === 0)) {
        return responseHandler.error(res, 'Access Forbidden: Authorization failed to create menu items.', null, 403);
      }

      // 2. Validate category maps to this restaurant
      const categories = await db.query('SELECT id FROM categories WHERE id = ? AND restaurant_id = ?', [categoryId, restaurantId]);
      if (!categories || categories.length === 0) {
        return responseHandler.error(res, 'Target food category does not map to this restaurant branch.', null, 400);
      }

      // 3. Resolve upload file if uploaded via Multer
      let imagePath = imageUrl || '';
      if (req.file) {
        // Uploaded via standard Multer flow
        imagePath = `/uploads/${req.file.filename}`;
      }

      // 4. Perform insertion
      const availabilityState = (isAvailable === undefined || isAvailable === 'true' || isAvailable === 1) ? 1 : 0;
      const stock = stockQuantity ? parseInt(stockQuantity) : 0;

      const result = await db.query(
        `INSERT INTO menu_items (name, description, price, image, stock_quantity, is_available, category_id, restaurant_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, description || '', parseFloat(price), imagePath, stock, availabilityState, categoryId, restaurantId]
      );
      const menuItemId = result.insertId;

      logger.info(`New dish inserted! ID #${menuItemId}, Name: "${name}"`);

      // Audit logs
      await db.query(
        "INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, 'MENU_ITEM_CREATED', 'menu_items', ?)",
        [operatorId, menuItemId]
      );

      return responseHandler.success(res, 'New menu item cataloged successfully.', {
        menuItemId,
        name,
        price,
        stockQuantity: stock
      }, 201);

    } catch (error) {
      next(error);
    }
  },

  /**
   * Lists items under categories for a target restaurant
   */
  list: async (req, res, next) => {
    try {
      const { restaurantId, categoryId, search } = req.query;
      if (!restaurantId) {
        return responseHandler.error(res, 'Restaurant selection param is required.', null, 400);
      }

      let sql = 'SELECT * FROM menu_items WHERE restaurant_id = ?';
      const params = [restaurantId];

      if (categoryId) {
        sql += ' AND category_id = ?';
        params.push(categoryId);
      }

      if (search) {
        sql += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      sql += ' ORDER BY is_available DESC, name ASC';

      const list = await db.query(sql, params);
      return responseHandler.success(res, 'Menu catalogs parsed successfully.', list);

    } catch (error) {
      next(error);
    }
  },

  /**
   * Modifies an existing ingredient/dish record
   */
  update: async (req, res, next) => {
    try {
      const menuItemId = req.params.id;
      const { name, description, price, stockQuantity, isAvailable, categoryId, imageUrl } = req.body;
      const operatorId = req.user.id;

      // 1. Fetch item
      const items = await db.query('SELECT * FROM menu_items WHERE id = ?', [menuItemId]);
      if (!items || items.length === 0) {
        return responseHandler.error(res, 'Target dishes catalog record not found.', null, 404);
      }
      const item = items[0];

      // 2. Validate authorization
      const isOwner = await db.query('SELECT id FROM restaurants WHERE id = ? AND owner_id = ?', [item.restaurant_id, operatorId]);
      const isManager = await db.query('SELECT id FROM staff WHERE user_id = ? AND restaurant_id = ? AND role = "manager" AND status = "active"', [operatorId, item.restaurant_id]);

      if ((!isOwner || isOwner.length === 0) && (!isManager || isManager.length === 0)) {
        return responseHandler.error(res, 'Access Forbidden: Unauthorized item modification.', null, 403);
      }

      // 3. Image resolve
      let finalImagePath = imageUrl || item.image;
      if (req.file) {
        finalImagePath = `/uploads/${req.file.filename}`;
      }

      // Convert variables
      const finalPrice = price ? parseFloat(price) : item.price;
      const finalStock = stockQuantity !== undefined ? parseInt(stockQuantity) : item.stock_quantity;
      const finalAvailability = isAvailable !== undefined ? ((isAvailable === 'true' || isAvailable === 1 || isAvailable === true) ? 1 : 0) : item.is_available;
      const finalCategory = categoryId ? parseInt(categoryId) : item.category_id;

      await db.query(
        `UPDATE menu_items 
         SET name = ?, description = ?, price = ?, image = ?, stock_quantity = ?, is_available = ?, category_id = ?
         WHERE id = ?`,
        [
          name || item.name,
          description !== undefined ? description : item.description,
          finalPrice,
          finalImagePath,
          finalStock,
          finalAvailability,
          finalCategory,
          menuItemId
        ]
      );

      // Audit logs
      if (finalStock !== item.stock_quantity) {
        await db.query(
          "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, prev_val, new_val) VALUES (?, 'STOCK_CHANGED', 'menu_items', ?, ?, ?)",
          [operatorId, menuItemId, item.stock_quantity.toString(), finalStock.toString()]
        );
      } else {
        await db.query(
          "INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, 'MENU_ITEM_UPDATED', 'menu_items', ?)",
          [operatorId, menuItemId]
        );
      }

      return responseHandler.success(res, 'Menu item updated completed successfully.', { menuItemId });

    } catch (error) {
      next(error);
    }
  },

  /**
   * deletes menu item from catalogs
   */
  delete: async (req, res, next) => {
    try {
      const menuItemId = req.params.id;
      const operatorId = req.user.id;

      const items = await db.query('SELECT restaurant_id, name FROM menu_items WHERE id = ?', [menuItemId]);
      if (!items || items.length === 0) {
        return responseHandler.error(res, 'Dish not found.', null, 404);
      }
      const item = items[0];

      // Validate credentials
      const isOwner = await db.query('SELECT id FROM restaurants WHERE id = ? AND owner_id = ?', [item.restaurant_id, operatorId]);
      const isManager = await db.query('SELECT id FROM staff WHERE user_id = ? AND restaurant_id = ? AND role = "manager" AND status = "active"', [operatorId, item.restaurant_id]);

      if ((!isOwner || isOwner.length === 0) && (!isManager || isManager.length === 0)) {
        return responseHandler.error(res, 'Access Forbidden: Unauthorized dish delete operation.', null, 403);
      }

      await db.query('DELETE FROM menu_items WHERE id = ?', [menuItemId]);

      // Audit logs
      await db.query(
        "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, prev_val) VALUES (?, 'MENU_ITEM_DELETED', 'menu_items', ?, ?)",
        [operatorId, menuItemId, item.name]
      );

      return responseHandler.success(res, 'Menu item dropped successfully from active catalog.', { menuItemId });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = menuController;
