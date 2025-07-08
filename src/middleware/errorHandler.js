const logger = require('../config/logger');
const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    return res.status(statusCode).json({
      success: false,
      message, // Move message to the top level to match test expectations
      error: {
        errors: err.errors,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    });
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
  } else if (err.name === 'BadRequestError') {
    statusCode = 400;
  } else if (err.name === 'ConfigurationError') {
    statusCode = 500;
    logger.error('Configuration error:', err);
  } else if (err.message && err.message.includes('already exists')) {
    statusCode = 409;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message, // Move message to the top level to match test expectations
    error: {
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });

  // Call next() to ensure proper Express error handling
  if (next) {
    next();
  }
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};
