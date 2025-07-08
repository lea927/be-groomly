import winston from 'winston';
import config from './index';

// Create base logger configuration
const loggerConfig = {
  defaultMeta: { service: 'be-groomly' },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  transports: [] as winston.transport[],
};

// In production (cloud deployments), only use console logging
if (config.nodeEnv === 'production') {
  loggerConfig.transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
    })
  );
} else {
  // In development, use both file and console logging
  loggerConfig.transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const logger = winston.createLogger(loggerConfig);

export default logger;
