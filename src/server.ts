import app from './app';
import { env } from './config/env';
import { connectRedis, redisClient } from './config/redis';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    // Ensure Redis is connected before accepting traffic
    await connectRedis();

    const server = app.listen(env.PORT, () => {
      logger.info(`🛡️ SecureAPI Gateway running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
    });

    // Graceful Shutdown Handler
    const shutdown = async () => {
      logger.info('Received shutdown signal. Shutting down gracefully...');
      server.close(async () => {
        logger.info('Closed out remaining connections.');
        if (redisClient.isOpen) {
          await redisClient.quit();
        }
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

startServer();
