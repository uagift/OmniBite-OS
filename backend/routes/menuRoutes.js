/**
 * Menu Item Endpoints & Upload Router
 * Why it exists: Hooks up catalog editing operations and supports uploading media via Multer.
 * What it does: Sets up a local disk storage engine, validates forms, and controls access rules.
 * How it connects: Mounted inside app.js under `/api/menu` path.
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, query } = require('express-validator');
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const logger = require('../utils/logger');

const router = express.Router();

// Define uploads directory dynamically. Ensure destination directory exists on startup.
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    logger.info(`Supa Menu system configured local uploads directory: "${uploadsDir}"`);
  } catch (error) {
    logger.error('Failed to provision local disk upload folder dynamically:', error);
  }
}

// Set up disk storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Standardizes names cleanly (e.g. dish-171718128.jpg)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter validates media extensions to block insecure payloads
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image file format! Only JPG, JPEG, PNG, or WEBP are permitted.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 Megapixel / megabyte size limit
  }
});

/**
 * @route   POST /api/menu
 * @desc    On-board an item inside the catalogs (supports file attachments: "image")
 * @access  Private (Owner, Manager only)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['owner', 'manager']),
  upload.single('image'),
  [
    body('name').trim().notEmpty().withMessage('Menu item name is required.'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a valid positive number.'),
    body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer.'),
    body('isAvailable').optional().trim(),
    body('categoryId').isInt().withMessage('CategoryId must be linked to an integer category ID.'),
    body('restaurantId').isInt().withMessage('RestaurantId must be linked to an integer restaurant ID.'),
    body('imageUrl').optional().trim(), // image fallback locator string
    validationMiddleware
  ],
  menuController.create
);

/**
 * @route   GET /api/menu
 * @desc    Public menu catalog querying (Supports category filter and search queries!)
 * @access  Public
 */
router.get(
  '/',
  [
    query('restaurantId').notEmpty().withMessage('restaurantId query parameter is required.'),
    query('categoryId').optional().isInt().withMessage('categoryId must be an integer.'),
    query('search').optional().trim(),
    validationMiddleware
  ],
  menuController.list
);

/**
 * @route   PUT /api/menu/:id
 * @desc    Edit dish fields, adjust stock level, or restock (Supports file attachments: "image")
 * @access  Private (Owner, Manager only)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['owner', 'manager']),
  upload.single('image'),
  [
    body('name').optional().trim().notEmpty().withMessage('Menu item name cannot be empty.'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a valid positive number.'),
    body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer.'),
    body('isAvailable').optional().trim(),
    body('categoryId').optional().isInt().withMessage('CategoryId must be an integer.'),
    body('imageUrl').optional().trim(),
    validationMiddleware
  ],
  menuController.update
);

/**
 * @route   DELETE /api/menu/:id
 * @desc    Remove a dish completely from available catalogs
 * @access  Private (Owner, Manager only)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['owner', 'manager']),
  menuController.delete
);

module.exports = router;
