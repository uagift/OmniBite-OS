/**
 * Full-Stack Express & Vite Server Integration Entrypoint
 * Why it exists: Combines the MVC CommonJS backend api routes & socket listeners
 * with the React/Vite development server in a single unified Node process on Port 3000.
 */

import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Initialize environment variables
const dotenv = require('dotenv');
dotenv.config();

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the CommonJS MVC backend modules
const backendApp = require('../backend/app.js');
const socketConfig = require('../backend/config/socket.js');
const logger = require('../backend/utils/logger.js');

async function bootstrap() {
  const app = express();
  const PORT = 3000;

  // Expose static HTML/CSS templates directory for direct live browser testing
  app.use('/templates', express.static(path.join(process.cwd(), 'templates')));

  // Intercept and route /api, /uploads, and other backend assets to the MVC Express app
  app.use((req, res, next) => {
    if (
      req.path.startsWith('/api') || 
      req.path.startsWith('/uploads') || 
      req.path.startsWith('/socket.io')
    ) {
      return backendApp(req, res, next);
    }
    next();
  });

  // Create standard HTTP server wrapping our master Express app
  const server = http.createServer(app);

  // Initialize unified Socket.io server onto the HTTP server
  socketConfig.initSocket(server);

  logger.info('================================================================');
  logger.info(' ⚡ PROVISIONING INTEGRATED FULL-STACK VITE + EXPRESS ENVIRONMENT  ');
  logger.info('================================================================');

  if (process.env.NODE_ENV !== 'production') {
    logger.info('Booting Vite development server middleware in the background...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    // Inject Vite middleware for rendering the React front-end
    app.use(vite.middlewares);
    logger.info('✅ Vite Dev Server connected successfully on Port 3000!');
  } else {
    logger.info('Running in PRODUCTION mode. Serving pre-compiled static assets...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // SPA routing redirection
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind and listen on port 3000
  server.listen(PORT, '0.0.0.0', () => {
    logger.info('================================================================');
    logger.info(` 🚀 FULL-STACK HUB INITIALIZED SUCCESSFULLY!                          `);
    logger.info(` 🛰️  Unified Portal Address: http://0.0.0.0:${PORT}                 `);
    logger.info(` 📡 Sockets & API routes mounted together on the same network port   `);
    logger.info('================================================================');
  });
}

bootstrap().catch((err) => {
  console.error('CRITICAL: Server crashed during integration bootstrap phase!', err);
  process.exit(1);
});
