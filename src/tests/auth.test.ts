import request from 'supertest';
import bcrypt from 'bcrypt';
import { app } from '../server';
import { prisma } from '../libs/prisma';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

// Mock Clerk middleware
jest.mock('@clerk/express', () => ({
  clerkMiddleware:
    () =>
    (_req: Request, _res: Response, next: NextFunction): void =>
      next(),
}));

// Mock prisma client
jest.mock('../libs/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Cast the mocked functions to have the correct mock methods
const mockedPrisma = prisma as unknown as {
  user: {
    create: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

// Cast bcrypt mock
const mockedBcrypt = bcrypt as unknown as {
  hash: jest.Mock;
  compare: jest.Mock;
};

// Cast jwt mock
const mockedJwt = jwt as unknown as {
  sign: jest.Mock;
};

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(() => 'hashedPassword'),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fake-jwt-token'),
}));

describe('Auth Endpoints', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    const validRegisterData = {
      confirmPassword: 'Password123!',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Password123!',
      phone: '+12345678901',
      role: 'PET_OWNER',
    };

    test('should register a new user successfully', async () => {
      // Mock prisma findUnique to return null (no existing user)
      mockedPrisma.user.findUnique.mockResolvedValue(null);

      // Mock prisma create to return a user
      mockedPrisma.user.create.mockResolvedValue({
        address: null,
        createdAt: new Date(),
        email: validRegisterData.email,
        firstName: validRegisterData.firstName,
        id: 'user-id-123',
        isActive: true,
        isEmailVerified: false,
        lastLoginAt: null,
        lastName: validRegisterData.lastName,
        phone: validRegisterData.phone,
        role: validRegisterData.role,
        updatedAt: new Date(),
        verificationToken: 'fake-token',
        verificationTokenExpiry: new Date(),
      });

      // Make request
      const response = await request(app)
        .post('/api/auth/register')
        .send(validRegisterData)
        .expect(201);

      // Assertions
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');

      expect(response.body.data.user.email).toBe(validRegisterData.email);
      expect(response.body.data.token).toBe('fake-jwt-token');

      // Verify prisma was called correctly
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validRegisterData.email },
      });
      expect(mockedPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: validRegisterData.email,
            firstName: validRegisterData.firstName,
            lastName: validRegisterData.lastName,
            phone: validRegisterData.phone,
            role: validRegisterData.role,
          }),
        })
      );

      // Verify bcrypt was called
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(
        validRegisterData.password,
        10
      );

      // Verify jwt was called
      expect(mockedJwt.sign).toHaveBeenCalled();
    });

    test('should fail when email already exists', async () => {
      // Mock prisma findUnique to return an existing user
      mockedPrisma.user.findUnique.mockResolvedValue({
        id: 'existing-user-id',
      });

      // Make request
      const response = await request(app)
        .post('/api/auth/register')
        .send(validRegisterData)
        .expect(409);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User with this email already exists');

      // Verify prisma findUnique was called but not create
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validRegisterData.email },
      });
      expect(mockedPrisma.user.create).not.toHaveBeenCalled();
    });

    test('should fail when password validation fails', async () => {
      const invalidData = {
        ...validRegisterData,
        confirmPassword: '12345',
        password: '12345', // too short
      };

      // Make request
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');

      // Verify prisma was not called
      expect(mockedPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(mockedPrisma.user.create).not.toHaveBeenCalled();
    });

    test('should fail when passwords do not match', async () => {
      // Reset mocks to ensure clean state, but set up proper return value
      mockedPrisma.user.findUnique.mockResolvedValue(null);

      const mismatchedPasswords = {
        ...validRegisterData,
        confirmPassword: 'DifferentPassword123!',
      };

      // Make request
      const response = await request(app)
        .post('/api/auth/register')
        .send(mismatchedPasswords)
        .expect(400);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');

      // Verify prisma was not called
      expect(mockedPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(mockedPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    const validLoginData = {
      email: 'john@example.com',
      password: 'Password123!',
    };

    const mockUser = {
      address: null,
      createdAt: new Date(),
      email: 'john@example.com',
      firstName: 'John',
      id: 'user-id-123',
      isActive: true,
      isEmailVerified: false,
      lastLoginAt: null,
      lastName: 'Doe',
      passwordHash: 'hashedPassword',
      phone: '+12345678901',
      role: 'PET_OWNER',
      updatedAt: new Date(),
    };

    test('should login a user successfully', async () => {
      // Mock prisma findUnique to return a user
      mockedPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Mock bcrypt.compare to return true (valid password)
      mockedBcrypt.compare.mockResolvedValue(true);

      // Mock prisma update to return the updated user
      mockedPrisma.user.update.mockResolvedValue({
        ...mockUser,
        lastLoginAt: new Date(),
      });

      // Make request
      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData)
        .expect(200);

      // Assertions
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User logged in successfully');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(validLoginData.email);
      expect(response.body.data.token).toBe('fake-jwt-token');

      // Verify prisma was called correctly
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email },
      });

      // Verify bcrypt was called to compare passwords
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        validLoginData.password,
        mockUser.passwordHash
      );

      // Verify user lastLoginAt was updated
      expect(mockedPrisma.user.update).toHaveBeenCalledWith({
        data: { lastLoginAt: expect.any(Date) },
        where: { id: mockUser.id },
      });

      // Verify jwt was called
      expect(mockedJwt.sign).toHaveBeenCalled();
    });

    test('should fail when user does not exist', async () => {
      // Mock prisma findUnique to return null (no user found)
      mockedPrisma.user.findUnique.mockResolvedValue(null);

      // Make request
      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData)
        .expect(401);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User account does not exist');

      // Verify prisma was called but not bcrypt or jwt
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email },
      });
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
      expect(mockedJwt.sign).not.toHaveBeenCalled();
    });

    test('should fail when account is deactivated', async () => {
      // Mock prisma findUnique to return an inactive user
      mockedPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      // Make request
      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData)
        .expect(401);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('This account has been deactivated');

      // Verify prisma was called but not mockedBcrypt.compare
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email },
      });
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    test('should fail with invalid password', async () => {
      // Mock prisma findUnique to return a user
      mockedPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Mock bcrypt.compare to return false (invalid password)
      mockedBcrypt.compare.mockResolvedValue(false);

      // Make request
      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData)
        .expect(401);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');

      // Verify prisma and bcrypt were called, but not jwt
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        validLoginData.password,
        mockUser.passwordHash
      );
      expect(mockedJwt.sign).not.toHaveBeenCalled();
    });

    test('should fail when validation fails', async () => {
      const invalidData = {
        email: 'not-an-email',
        password: '',
      };

      // Make request
      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidData)
        .expect(400);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');

      // Verify no prisma calls were made
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });
  });
});
