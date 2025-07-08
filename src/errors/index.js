/**
 * Custom error class for unauthorized actions (status code 401)
 */
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

/**
 * Custom error class for bad request errors (validation, duplicates, etc.) (status code 400)
 */
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

/**
 * Custom error class for configuration errors (status code 500)
 */
class ConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigurationError';
    this.statusCode = 500;
  }
}

/**
 * Custom error class for forbidden actions (status code 403)
 */
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

/**
 * Custom error class for not found errors (status code 404)
 */
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/**
 * Custom error class for conflict errors (e.g., duplicate resources) (status code 409)
 */
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

module.exports = {
  UnauthorizedError,
  BadRequestError,
  ConfigurationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
