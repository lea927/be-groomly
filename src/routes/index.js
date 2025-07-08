const express = require('express');
const healthController = require('../controllers/healthController');
// Import auth routes from TypeScript file
const authRoutes = require('./authRoutes');

const router = express.Router();

// Health check endpoint
router.get('/health', healthController.getHealth);

// Root endpoint
router.get('/', healthController.getRoot);

// Mount auth routes
router.use('/auth', authRoutes);

module.exports = router;
