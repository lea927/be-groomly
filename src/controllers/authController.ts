import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import * as authValidation from '../validations/authValidation';
import {
  AuthResponse,
  UserLoginCredentials,
  UserRegistrationData,
} from '../types';

function register(req: Request, res: Response, next: NextFunction): void {
  try {
    const validatedData = authValidation.registerUserSchema.parse(
      req.body
    ) as UserRegistrationData;

    authService
      .registerUser(validatedData)
      .then(({ token, user }: AuthResponse) => {
        res.status(201).json({
          data: { token, user },
          message: 'User registered successfully',
          success: true,
        });
      })
      .catch(next);
  } catch (error) {
    next(error);
  }
}

function login(req: Request, res: Response, next: NextFunction): void {
  try {
    const validatedData = authValidation.loginSchema.parse(
      req.body
    ) as UserLoginCredentials;

    authService
      .loginUser(validatedData)
      .then(({ token, user }: AuthResponse) => {
        res.status(200).json({
          data: { token, user },
          message: 'User logged in successfully',
          success: true,
        });
      })
      .catch(next);
  } catch (error) {
    next(error);
  }
}

// Export controller functions
export default {
  login,
  register,
};
