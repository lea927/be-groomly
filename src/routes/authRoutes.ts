import { Router } from 'express';
import authController from '../controllers/authController';
import { validate } from '../middleware/validate';
import * as authValidation from '../validations/authValidation';

const router = Router();

// User registration route
router.post(
  '/register',
  validate(authValidation.registerUserSchemaWithConfirmation),
  authController.register
);

// User login route
router.post(
  '/login',
  validate(authValidation.loginSchema),
  authController.login
);

export default router;
