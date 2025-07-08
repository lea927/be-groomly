// Test setup file
import request from 'supertest';

// Set environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

// Extend global with custom properties
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      request: typeof request;
    }
  }
}

// Add supertest to global scope for convenience
(global as any).request = request;

// Global cleanup after all tests
afterAll(async () => {
  // Close any remaining database connections, timers, etc.
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
});
