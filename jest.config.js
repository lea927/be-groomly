module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js', '**/src/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/tests/**/*.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  // Force Jest to exit after tests complete
  forceExit: true,
  // Set a reasonable timeout for tests
  testTimeout: 30000,
  // Detect open handles to help with debugging
  detectOpenHandles: true,
  // Path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
