const authService = require('../services/authService');
const authValidation = require('../validations/authValidation');

function register(req, res, next) {
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
      .catch(next);
  } catch (error) {
    next(error);
  }
}

function login(req, res, next) {
  try {
    const validatedData = authValidation.loginSchema.parse(req.body);

    return authService
      .loginUser(validatedData)
      .then(({ user, token }) => {
        res.status(200).json({
          success: true,
          message: 'User logged in successfully',
          data: { user, token },
        });
      })
      .catch(next);
  } catch (error) {
    next(error);
  }
}

// Export controller functions
module.exports = {
  register,
  login,
};
