const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../server');
const { prisma } = require('../src/libs/prisma');
const jwt = require('jsonwebtoken');
const config = require('../src/config');

// Mock prisma client
jest.mock('../src/libs/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }
  }
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => 'hashedPassword'),
  compare: jest.fn()
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fake-jwt-token')
}));

describe('Auth Endpoints', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    const validRegisterData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+12345678901',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: 'PET_OWNER'
    };

    test('should register a new user successfully', async () => {
      // Mock prisma findUnique to return null (no existing user)
      prisma.user.findUnique.mockResolvedValue(null);

      // Mock prisma create to return a user
      prisma.user.create.mockResolvedValue({
        id: 'user-id-123',
        email: validRegisterData.email,
        firstName: validRegisterData.firstName,
        lastName: validRegisterData.lastName,
        phone: validRegisterData.phone,
        role: validRegisterData.role,
        address: null,
        isEmailVerified: false,
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        verificationToken: 'fake-token',
        verificationTokenExpiry: new Date()
      });

      // Make request
      const response = await request(app)
        .post('/api/auth/signup')
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
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validRegisterData.email }
      });
      expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          email: validRegisterData.email,
          firstName: validRegisterData.firstName,
          lastName: validRegisterData.lastName,
          phone: validRegisterData.phone,
          role: validRegisterData.role,
        })
      }));
      
      // Verify bcrypt was called
      expect(bcrypt.hash).toHaveBeenCalledWith(validRegisterData.password, 10);
      
      // Verify jwt was called
      expect(jwt.sign).toHaveBeenCalled();
    });

    test('should fail when email already exists', async () => {
      // Mock prisma findUnique to return an existing user
      prisma.user.findUnique.mockResolvedValue({ id: 'existing-user-id' });

      // Make request
      const response = await request(app)
        .post('/api/auth/signup')
        .send(validRegisterData)
        .expect(409);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User with this email already exists');
      
      // Verify prisma findUnique was called but not create
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validRegisterData.email }
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    test('should fail when password validation fails', async () => {
      const invalidData = {
        ...validRegisterData,
        password: '12345', // too short
        confirmPassword: '12345'
      };

      // Make request
      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidData)
        .expect(400);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      
      // Verify prisma was not called
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    test('should fail when passwords do not match', async () => {
      const mismatchedPasswords = {
        ...validRegisterData,
        confirmPassword: 'DifferentPassword123!'
      };

      // Make request
      const response = await request(app)
        .post('/api/auth/signup')
        .send(mismatchedPasswords)
        .expect(400);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      
      // Verify prisma was not called
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    const validLoginData = {
      email: 'john@example.com',
      password: 'Password123!'
    };

    const mockUser = {
      id: 'user-id-123',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+12345678901',
      passwordHash: 'hashedPassword',
      role: 'PET_OWNER',
      address: null,
      isEmailVerified: false,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    test('should login a user successfully', async () => {
      // Mock prisma findUnique to return a user
      prisma.user.findUnique.mockResolvedValue(mockUser);
      
      // Mock bcrypt.compare to return true (valid password)
      bcrypt.compare.mockResolvedValue(true);
      
      // Mock prisma update to return the updated user
      prisma.user.update.mockResolvedValue({
        ...mockUser,
        lastLoginAt: new Date()
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
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email }
      });
      
      // Verify bcrypt was called to compare passwords
      expect(bcrypt.compare).toHaveBeenCalledWith(
        validLoginData.password, 
        mockUser.passwordHash
      );
      
      // Verify user lastLoginAt was updated
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { lastLoginAt: expect.any(Date) }
      });
      
      // Verify jwt was called
      expect(jwt.sign).toHaveBeenCalled();
    });

    test('should fail when user does not exist', async () => {
      // Mock prisma findUnique to return null (no user found)
      prisma.user.findUnique.mockResolvedValue(null);

      // Make request
      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData)
        .expect(401);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User account does not exist');
      
      // Verify prisma was called but not bcrypt or jwt
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email }
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('should fail when account is deactivated', async () => {
      // Mock prisma findUnique to return an inactive user
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        isActive: false
      });

      // Make request
      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData)
        .expect(401);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('This account has been deactivated');
      
      // Verify prisma was called but not bcrypt.compare
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email }
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test('should fail with invalid password', async () => {
      // Mock prisma findUnique to return a user
      prisma.user.findUnique.mockResolvedValue(mockUser);
      
      // Mock bcrypt.compare to return false (invalid password)
      bcrypt.compare.mockResolvedValue(false);

      // Make request
      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData)
        .expect(401);

      // Assertions
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
      
      // Verify prisma and bcrypt were called, but not jwt
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email }
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        validLoginData.password, 
        mockUser.passwordHash
      );
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('should fail when validation fails', async () => {
      const invalidData = {
        email: 'not-an-email',
        password: ''
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
