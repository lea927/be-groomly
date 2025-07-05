module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  // Force Jest to exit after tests complete
  forceExit: true,
  // Set a reasonable timeout for tests
  testTimeout: 30000,
  // Detect open handles to help with debugging
  detectOpenHandles: true
};
