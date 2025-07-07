const { PrismaClient } = require('../../generated/prisma');

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
global.prisma = global.prisma || null;

const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

module.exports = { prisma };
