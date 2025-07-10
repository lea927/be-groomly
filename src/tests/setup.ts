import { jest } from '@jest/globals';

// Clerk mocks with sorted keys and explicit types
jest.mock('@clerk/express', () => ({
  clerkMiddleware:
    (): ((req: unknown, res: unknown, next: () => void) => void) =>
    (_req, _res, next) => {
      next();
    },
  getAuth: (_req: unknown): { sessionId: string; userId: string } => ({
    sessionId: 'test-session-123',
    userId: 'test-user-123',
  }),
  requireAuth:
    (): ((
      req: { auth?: { sessionId: string; userId: string } },
      res: unknown,
      next: () => void
    ) => void) =>
    (req, _res, next) => {
      req.auth = {
        sessionId: 'test-session-123',
        userId: 'test-user-123',
      };
      next();
    },
}));

// Mock Prisma client with sorted keys
jest.mock('../libs/prisma', () => ({
  prisma: {
    pet: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));
