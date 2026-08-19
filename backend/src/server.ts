import dns from 'dns';

// Configure DNS fallback to Google Public DNS to prevent Windows/ISP UDP SRV lookup refusal
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore fallback error if environment overrides
}

import env from './config/env.js';
import logger from './config/logger.js';
import app from './app.js';
import { connectDB, disconnectDB } from './config/database.js';
import { preCachePopularRoutes } from './controllers/flightController.js';

// Server Initialization & Graceful Shutdown
const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on port ${env.PORT} in [${env.NODE_ENV}] mode`);
    logger.info(`📡 API available at http://localhost:${env.PORT}/api`);
    logger.info(`🏥 Health check at http://localhost:${env.PORT}/health`);

    preCachePopularRoutes().catch((err) =>
      logger.warn(`Pre-caching skipped: ${err?.message || err}`)
    );
  });

  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      logger.info('HTTP server closed cleanly.');
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer().catch((err) => {
  logger.error({ err }, 'Fatal server boot failure');
  process.exit(1);
});
