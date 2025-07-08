// Test setup file
const request = require('supertest');

// Set environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

// Extend Jest with custom matchers if needed
global.request = request;

// Global cleanup after all tests
afterAll(async () => {
  // Close any remaining database connections, timers, etc.
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
});
