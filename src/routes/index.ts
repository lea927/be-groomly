import express from 'express';
import healthController from '../controllers/healthController';
import authRoutes from './authRoutes';

const router = express.Router();

// Health check endpoint
router.get('/health', healthController.healthCheck);

// Root endpoint
router.get('/', healthController.apiInfo);

// Mount auth routes
router.use('/auth', authRoutes);

export default router;
