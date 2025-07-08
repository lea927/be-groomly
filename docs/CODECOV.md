# Codecov Configuration Guide

This document explains the codecov.yml configuration for the be-groomly project.

## Coverage Thresholds

The codecov.yml configuration has been set to match the Jest coverage thresholds:

- **Branches**: 50%
- **Functions**: 70% 
- **Lines**: 70%
- **Statements**: 70%

These thresholds apply to the overall project coverage. The configuration ensures that the Codecov reports will show failures if coverage drops below these thresholds.

## Configuration Details

- **Project Status**: Monitors overall project coverage against thresholds
- **Patch Status**: Monitors coverage for changes in pull requests
- **Ignored Paths**: 
  - src/config
  - src/tests
  - tests
  - node_modules

## Integration with CI/CD

The GitHub Actions workflow automatically uploads coverage data to Codecov after running tests. This integration ensures that:

1. Coverage reports are generated for each push and pull request
2. Pull requests show coverage changes directly in the GitHub interface
3. Coverage history is tracked over time

## Codecov Dashboard

You can view detailed coverage reports on the Codecov dashboard. The reports include:
- Overall project coverage
- File-by-file coverage breakdown
- Line-by-line coverage visualization
- Coverage trends over time

## Notes

- The configuration is aligned with Jest to maintain consistency between local and CI coverage enforcement
- Consider adjusting thresholds as the project matures and test coverage improves
