// Test setup file
const request = require('supertest');

// Extend Jest with custom matchers if needed
global.request = request;

// Global cleanup after all tests
afterAll(async () => {
  // Close any remaining database connections, timers, etc.
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
});
