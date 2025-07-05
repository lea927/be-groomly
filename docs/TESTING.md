# Testing Guide

## Overview

This project uses Jest as the testing framework with Supertest for API testing. The test setup is optimized for both local development and CI/CD environments.

## Test Scripts

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode (coverage + proper exit handling)
npm run test:ci

# Run tests in watch mode (development)
npm run test:watch
```

## Test Structure

```
tests/
├── setup.js          # Global test setup and configuration
├── health.test.js     # Health endpoint tests
└── ...               # Additional test files
```

## Key Features

### 🔧 **Server Lifecycle Management**
- Server only starts when `server.js` is run directly
- Tests import the Express app without starting the server
- Proper cleanup ensures Jest exits cleanly

### 📊 **Coverage Requirements**
- Minimum 50% coverage for branches (startup-friendly)
- Minimum 80% coverage for functions, lines, and statements
- Coverage reports generated in `coverage/` directory
- CI enforces coverage thresholds
- **Codecov integration**: Automatic upload and visualization

### 🚀 **CI/CD Optimizations**
- `test:ci` script optimized for GitHub Actions
- Uses `--forceExit` to prevent hanging
- Includes `--detectOpenHandles` for debugging
- Proper timeout handling (30 seconds)

## Writing Tests

### Basic Test Structure

```javascript
const request = require('supertest');
const app = require('../server');

describe('Feature Tests', () => {
  afterAll(async () => {
    // Clean up any resources
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  it('should test something', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      // ... expected structure
    });
  });
});
```

### Best Practices

1. **Use `afterAll` for cleanup** - Always include cleanup in test files
2. **Test API contracts** - Verify response structure, not just status codes
3. **Use descriptive test names** - Clear, specific test descriptions
4. **Group related tests** - Use `describe` blocks for organization
5. **Mock external dependencies** - Don't rely on external services

## Common Issues & Solutions

### Jest Hanging
- **Problem**: Jest doesn't exit after tests complete
- **Solution**: Tests now use proper server lifecycle management
- **Detection**: Run with `--detectOpenHandles` flag

### Coverage Issues
- **Problem**: Coverage below threshold
- **Solution**: Add tests for uncovered branches/lines
- **Check**: Run `npm run test:coverage` to see gaps

### Timeout Errors
- **Problem**: Tests taking too long
- **Solution**: 30-second timeout configured
- **Debug**: Check for hanging promises or connections

## Debugging

```bash
# Debug with open handles detection
npx jest --detectOpenHandles

# Debug specific test file
npx jest tests/health.test.js --verbose

# Debug with coverage
npx jest --coverage --detectOpenHandles
```

## Integration with Git Hooks

Tests run automatically on:
- **Pre-commit**: Fast test run (no coverage)
- **CI/CD**: Full test suite with coverage
- **Pre-push**: Blocked if tests fail

This ensures code quality at every stage of development.
