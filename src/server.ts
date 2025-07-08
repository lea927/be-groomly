import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { clerkMiddleware } from '@clerk/express';

// Import the migrated files using ES modules
import config from './config/index';
import logger from './config/logger';
import { errorHandler, notFound } from './middleware/errorHandler';
import routes from './routes';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(
  morgan('combined', {
    stream: { write: (message: string) => logger.info(message) },
  })
);

// Authentication middleware (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.use(clerkMiddleware());
}

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = config.port;

// Start the server function
const startServer = (): void => {
  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      logger.info('Process terminated');
      process.exit(0);
    });
  });
};

// Export both the app and the start function
export { app, startServer };
