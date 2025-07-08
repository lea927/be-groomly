"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Test setup file
const supertest_1 = __importDefault(require("supertest"));
// Set environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';
// Add supertest to global scope for convenience
global.request = supertest_1.default;
// Global cleanup after all tests
afterAll(async () => {
    // Close any remaining database connections, timers, etc.
    await new Promise((resolve) => {
        setTimeout(resolve, 100);
    });
});
//# sourceMappingURL=setup.js.map