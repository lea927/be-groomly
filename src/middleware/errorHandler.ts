import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import logger from '../config/logger';
import { AppError } from '../types/errors';

// Define an error handler middleware
const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
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
    res.status(statusCode).json({
      error: {
        errors: err.errors,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
      message,
      success: false,
    });
    return;
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
    error: {
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    message,
    success: false,
  });

  // Call next() to ensure proper Express error handling
  if (next) {
    next();
  }
};

const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as AppError;
  error.statusCode = 404;
  next(error);
};

export { errorHandler, notFound };
