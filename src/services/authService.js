const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { prisma } = require('../libs/prisma');
const jwt = require('jsonwebtoken');
const config = require('../config/index');
const {
  UnauthorizedError,
  ConfigurationError,
  ConflictError,
} = require('../errors');

async function registerUser(userData) {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Generate verification token
  const verificationToken = uuidv4();
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Hash the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(userData.password, saltRounds);

  // Create the user in the database
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      passwordHash,
      role: userData.role || 'PET_OWNER',
      address: userData.address,
      verificationToken,
      verificationTokenExpiry,
    },
  });

  // Generate JWT token
  const token = generateToken(user.id);

  // Create a safe user object without sensitive data
  const safeUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
    address: user.address,
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  // TODO: Send verification email

  return {
    user: safeUser,
    token,
  };
}

/**
 * Generate JWT token
 */
function generateToken(userId) {
  if (!config.jwt.secret) {
    throw new ConfigurationError(
      'JWT secret is not defined in environment variables'
    );
  }

  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn || '24h',
  });
}

/**
 * Login a user with email and password
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<{user: Object, token: string}>} User data and JWT token
 */
async function loginUser(credentials) {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new UnauthorizedError('User account does not exist');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('This account has been deactivated');
  }

  const passwordValid = await bcrypt.compare(
    credentials.password,
    user.passwordHash
  );
  if (!passwordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const token = generateToken(user.id);

  const safeUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
    address: user.address,
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: safeUser,
    token,
  };
}

const authService = {
  registerUser,
  loginUser,
};

// Use CommonJS export style
module.exports = authService;
