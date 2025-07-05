const express = require('express');
const healthController = require('../controllers/healthController');

const router = express.Router();

// Health check endpoint
router.get('/health', healthController.getHealth);

// Root endpoint
router.get('/', healthController.getRoot);

module.exports = router;
