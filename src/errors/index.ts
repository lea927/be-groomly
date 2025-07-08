import { AppError } from '../types/errors';

/**
 * Custom error class for unauthorized actions (status code 401)
 */
export class UnauthorizedError extends Error implements AppError {
  statusCode = 401;

  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Custom error class for bad request errors (validation, duplicates, etc.) (status code 400)
 */
export class BadRequestError extends Error implements AppError {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

/**
 * Custom error class for configuration errors (status code 500)
 */
export class ConfigurationError extends Error implements AppError {
  statusCode = 500;

  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

/**
 * Custom error class for forbidden actions (status code 403)
 */
export class ForbiddenError extends Error implements AppError {
  statusCode = 403;

  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Custom error class for not found errors (status code 404)
 */
export class NotFoundError extends Error implements AppError {
  statusCode = 404;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Custom error class for conflict errors (status code 409)
 */
export class ConflictError extends Error implements AppError {
  statusCode = 409;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

// Export all errors
export const errors = {
  BadRequestError,
  ConfigurationError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
};
