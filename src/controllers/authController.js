const { ZodError } = require('zod');
const authService = require('../services/authService');
const authValidation = require('../validations/authValidation');
const logger = require('../config/logger');

function register(req, res) {
  try {
    const validatedData =
      authValidation.registerUserSchemaWithConfirmation.parse(req.body);

    return authService
      .registerUser(validatedData)
      .then(({ user, token }) => {
        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          data: { user, token },
        });
      })
      .catch(handleError(res));
  } catch (error) {
    return handleError(res)(error);
  }
}

/**
 * Error handler function factory
 *
 * @param {Object} res - Express response object
 * @returns {Function} Error handler function
 */
function handleError(res) {
  return (error) => {
    // Handle validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }

    // Handle existing user error
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    // Log and return server error
    logger.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    });
  };
}

// Export controller functions
module.exports = {
  register,
};
