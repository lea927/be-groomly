import express from 'express';
import healthController from '../controllers/healthController';
import authRoutes from './authRoutes';
import petRoutes from './petRoutes';
import clerkWebhookRoutes from './clerkWebhookRoutes';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// Public routes
router.get('/health', healthController.healthCheck);
router.get('/', healthController.apiInfo);
router.use('/auth', authRoutes);
router.use('/webhooks', clerkWebhookRoutes);

// Protected routes
router.use('/pets', requireAuth(), petRoutes);

export default router;
