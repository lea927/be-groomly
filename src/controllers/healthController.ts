import { Request, Response } from 'express';

export function healthCheck(_req: Request, res: Response): void {
  res.status(200).json({
    data: {
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    },
    message: 'Server is healthy',
    success: true,
  });
}

export function apiInfo(_req: Request, res: Response): void {
  res.status(200).json({
    data: {
      documentation: '/api/docs',
      version: process.env.npm_package_version || '1.0.0',
    },
    message: 'API Information',
    success: true,
  });
}

export default {
  apiInfo,
  healthCheck,
};
