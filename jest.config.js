module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/tests/**/*.test.ts', '**/src/tests/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/config/**',
    '!src/tests/**/*.{js,ts}',
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
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  // Force Jest to exit after tests complete
  forceExit: true,
  // Set a reasonable timeout for tests
  testTimeout: 30000,
  // Detect open handles to help with debugging
  detectOpenHandles: true,
  // Path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@errors/(.*)$': '<rootDir>/src/errors/$1',
    '^@validations/(.*)$': '<rootDir>/src/validations/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  // TypeScript configuration
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  }
};
