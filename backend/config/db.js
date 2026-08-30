/**
 * MySQL Database Config & Connector
 * Why it exists: Aggregates connections into a fast, reusable client-pool for executing queries.
 * What it does: Sets up a standard mysql2/promise client pool with automatic reconnections, logging, and query utilities.
 * How it connects: Exports a promise-based connection pool to all model/service logic.
 */

const mysql = require('mysql2');
const logger = require('../utils/logger');

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'supa_menu_db',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

// Initialize the pool
let pool;

try {
  pool = mysql.createPool(dbConfig);
  logger.info(`MySQL connection pool configured for host: ${dbConfig.host}:${dbConfig.port}`);
} catch (error) {
  logger.error('Failed to instantiate MySQL pool. Please verify your config:', error);
}

// Reusable promise execution helper
const query = async (sql, params) => {
  try {
    if (!pool) {
      throw new Error('Database pool not initialized. Check your credentials in .env.');
    }
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    logger.error(`Database Query Error! SQL: "${sql}"`, error);
    throw error;
  }
};

module.exports = {
  pool,
  query
};
