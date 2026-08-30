/**
 * Automatic MySQL Database Initializer & Seed Script
 * Why it exists: Provides an automated, single-command utility to create the database schema and seed mock data.
 * What it does: Connects to the MySQL server, creates the schema, runs the schema.sql DDL commands, and inserts mock owner/manager/menu records.
 * How it connects: Executed via "npm run init-db" or direct node command "node scripts/setupDb.js".
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

// Load environment variables manually
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const host = process.env.DB_HOST || '127.0.0.1';
const port = parseInt(process.env.DB_PORT || '3306');
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'supa_menu_db';

async function setupDatabase() {
  logger.info('================================================================');
  logger.info('   ⚙️ STARTING AUTOMATIC SQL DATABASE INITIALIZER & SEEDER       ');
  logger.info('================================================================');

  let configConnection;

  try {
    // 1. Establish initial connection to MySQL server without database name to ensure the database itself exists
    logger.info(`Connecting to MySQL host: ${host}:${port} as user "${user}"...`);
    configConnection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });

    logger.info(`Creating database "${database}" if it does not already exist...`);
    await configConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await configConnection.end();

    // 2. Reconnect directly to the target database
    logger.info(`Database confirmed. Reconnecting directly to database: "${database}"...`);
    const dbConnection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      multipleStatements: true
    });

    // 3. Load and parse schema.sql
    const schemaPath = path.join(__dirname, '../schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at path: ${schemaPath}`);
    }

    logger.info('Reading "schema.sql" file patterns...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    logger.info('Executing SQL DDL schema instructions to construct tables...');
    await dbConnection.query(schemaSql);
    logger.info('✅ Database structures compiled successfully!');

    // 4. Seed Seed Initial Data (Owner, manager, waiter accounts & default menu)
    logger.info('Pre-seeding initial default users and restaurant SaaS templates...');

    // Hash a generic test password 'password123'
    const defaultPasswordHash = await bcrypt.hash('password123', 10);

    // Insert Default Owner Account
    const [ownerResult] = await dbConnection.query(
      `INSERT INTO users (name, email, password, role, phone, is_active) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      ['Jean Bosco', 'owner@supamenu.com', defaultPasswordHash, 'owner', '+250788123456']
    );
    const ownerId = ownerResult.insertId;
    logger.info(`-> Seeded Owner Account: email: "owner@supamenu.com", password: "password123" (Id: ${ownerId})`);

    // Insert Default Customer Account
    const [customerResult] = await dbConnection.query(
      `INSERT INTO users (name, email, password, role, phone, is_active) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      ['Diane Uwase', 'customer@supamenu.com', defaultPasswordHash, 'customer', '+250788776655']
    );
    const customerId = customerResult.insertId;
    logger.info(`-> Seeded Customer Account: email: "customer@supamenu.com", password: "password123" (Id: ${customerId})`);

    // Insert Default Restaurant
    const [restaurantResult] = await dbConnection.query(
      `INSERT INTO restaurants (name, description, logo, address, phone, owner_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [
        "L'Epicurien Kigali",
        'Fine French cuisine & grill menu specialties in Kigali city centre',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        'KG 9 Ave, Kigali',
        '+250788998877',
        ownerId
      ]
    );
    const restaurantId = restaurantResult.insertId;
    logger.info(`-> Seeded Restaurant: "L'Epicurien Kigali" (Id: ${restaurantId})`);

    // Seed Tables with associated QR Server links
    logger.info('Seeding restaurant tables & generating QR image links...');
    const tablesToSeed = [1, 2, 3, 4, 5];
    for (const itemNum of tablesToSeed) {
      const scanPayload = `http://localhost:3000/menu?restaurantId=${restaurantId}&table=${itemNum}`;
      const encodedPayload = encodeURIComponent(scanPayload);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedPayload}&margin=10`;

      await dbConnection.query(
        `INSERT INTO restaurant_tables (table_number, restaurant_id, qr_code_url, status) 
         VALUES (?, ?, ?, 'free')`,
        [itemNum.toString(), restaurantId, qrUrl]
      );
    }
    logger.info(`-> Seeded 5 dining tables with live table-QR links.`);

    // Seed Mapped Manager Staff Account
    const [managerResult] = await dbConnection.query(
      `INSERT INTO users (name, email, password, role, phone, is_active) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      ['Eric Kabera', 'manager@supamenu.com', defaultPasswordHash, 'manager', '+250788222333']
    );
    const managerUserId = managerResult.insertId;

    await dbConnection.query(
      `INSERT INTO staff (user_id, restaurant_id, role, salary, hire_date, status) 
       VALUES (?, ?, ?, 450000.00, CURDATE(), 'active')`,
      [managerUserId, restaurantId, 'manager']
    );
    logger.info(`-> Seeded Manager Staff: email: "manager@supamenu.com", password: "password123"`);

    // Seed Categories
    const [appetizerCat] = await dbConnection.query(
      `INSERT INTO categories (name, description, restaurant_id) VALUES (?, ?, ?)`,
      ['Appetizers & Starters', 'Fresh options to begin your tasting experience', restaurantId]
    );
    const [mainsCat] = await dbConnection.query(
      `INSERT INTO categories (name, description, restaurant_id) VALUES (?, ?, ?)`,
      ['Main Dishes & Grills', 'Chef-featured premium grills and entrees', restaurantId]
    );

    // Seed Menu Items
    await dbConnection.query(
      `INSERT INTO menu_items (name, description, price, image, stock_quantity, is_available, category_id, restaurant_id) 
       VALUES 
       (?, ?, ?, ?, ?, 1, ?, ?),
       (?, ?, ?, ?, ?, 1, ?, ?),
       (?, ?, ?, ?, ?, 1, ?, ?),
       (?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        'Beef Brochettes', 'Charcoal-grilled premium tender beef skewers marinated in local herbs & pili-pili', 3500.00, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', 50, mainsCat.insertId, restaurantId,
        'Grilled Tilapia Whole', 'Fresh Lake Kivu whole Tilapia slow charcoal roasted with garlic and kachumbari salad', 8500.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2', 15, mainsCat.insertId, restaurantId,
        'Samosa Basket', 'Crisp fried thin pastry triangles stuffed with aromatic spiced beef (3 pieces)', 1800.00, 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78', 120, appetizerCat.insertId, restaurantId,
        'Akabanga Chicken Wings', '8 Pieces of fire glazed wings tossed in rich Akabanga chili butter sauce', 4500.00, 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f', 40, appetizerCat.insertId, restaurantId
      ]
    );
    logger.info(`-> Seeded 4 signature menu recipes inside Categories.`);

    await dbConnection.end();
    logger.info('================================================================');
    logger.info(' 🎉 DATABASE STRUCTURE SUCCESSFULLY PROVISIONED & PRE-SEEDED!  ');
    logger.info('   You are ready to run: npm start                             ');
    logger.info('================================================================');

  } catch (error) {
    logger.error('CRITICAL: Initializer run aborted due to exception:', error);
    if (configConnection) await configConnection.end();
    process.exit(1);
  }
}

setupDatabase();
