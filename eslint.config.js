const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  // Ignores - expanded to include all patterns from .eslintignore
  { 
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '.git',
      '.github',
      '.husky',
      '*.lock',
      '*.log',
      'logs',
      'generated',
      'prisma/migrations',
      'railway.json',
      'commitlint.config.js',
      'jest.config.js',
      'jest.setup.js'
    ] 
  },
  
  // Files to lint
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  
  // Common settings
  {
    languageOptions: {
      ecmaVersion: 2022,
    }
  },
  
  // Common rules for all files
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'eqeqeq': 'error',
      'no-console': 'warn',
      'no-trailing-spaces': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'sort-keys': ['error', 'asc', { caseSensitive: false, natural: true }],
      'sort-vars': ['error', { ignoreCase: true }],
    },
  },
  
  // JavaScript files during migration - allow require imports
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        console: 'readonly',
        exports: 'writable',
        global: 'readonly',
        module: 'writable',
        process: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      }
    },
  },
  
  // TypeScript specific settings
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-require-imports': 'error',
    },
  },
  
  // Test files
  {
    files: ['**/*.{test,spec}.{js,ts}', '**/tests/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  
  // Apply recommended configs after our custom rules
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
];
