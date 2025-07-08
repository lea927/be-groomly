import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

/**
 * Middleware to validate requests using Zod schemas
 * @param schema - Zod schema for validation
 * @returns Express middleware function
 */
export const validate = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: {
            errors: error.errors,
          },
          message: 'Validation failed',
          success: false,
        });
      } else {
        next(error);
      }
    }
  };
};
