// Use CommonJS style require for maximum compatibility
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', authController.register);

// Use only CommonJS export style
module.exports = router;
