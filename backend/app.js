/**
 * Express Application Context bootstrapping module
 * Why it exists: Aggregates Express components, security filters, rate limits, and hooks sub-router blueprints.
 * What it does: Sets up cors/helmet safety layers, registers route prefixes, serves static images, and wires error catch handlers.
 * How it connects: Loaded directly by server.js as the HTTP server controller interface.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Load custom route modules
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const staffRoutes = require('./routes/staffRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Load custom core Middlewares
const errorMiddleware = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');

const app = express();

// 1. Core Security Middleware setup
app.use(helmet({
  // Allows resource serving to bypass default cross-origin restriction blocks for iframe development
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allows server tools / REST clients like postman or local test commands
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in preview sandboxes to make frontend iframe mapping pleasant
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 2. Request parsing layers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Rate limiter protection
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minute window
  max: 300, // max 300 queries per window per computer ip
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Brute check warning: Too many connection queries received from this node. Please slow down.'
});
app.use('/api', generalRateLimiter);

// Log incoming queries beautifully inside dev modes
app.use((req, res, next) => {
  logger.info(`--> [${req.method}] ${req.originalUrl}`);
  next();
});

// 4. Expose public uploads directory dynamically to render menu images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Mount operational REST routers prefixes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 6. Global Catch error hooks (must remain at the absolute end!)
app.use(errorMiddleware);

module.exports = app;
