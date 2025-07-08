import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { prisma } from '../libs/prisma';
import config from '../config';
import {
  ConflictError,
  ConfigurationError,
  UnauthorizedError,
} from '../errors';
import {
  AuthResponse,
  SafeUser,
  UserLoginCredentials,
  UserRegistrationData,
} from '../types';

/**
 * Register a new user
 * @param userData - User registration data
 * @returns User data and JWT token
 */
export async function registerUser(
  userData: UserRegistrationData
): Promise<AuthResponse> {
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
      address: userData.address ? JSON.stringify(userData.address) : null,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      passwordHash,
      phone: userData.phone,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      role: (userData.role || 'PET_OWNER') as any,
      verificationToken,
      verificationTokenExpiry,
    },
  });

  // Generate JWT token
  const token = generateToken(user.id);

  // Create a safe user object without sensitive data
  const safeUser: SafeUser = toSafeUser(user);

  // TODO: Send verification email

  return {
    token,
    user: safeUser,
  };
}

/**
 * Generate JWT token
 * @param userId - User ID to encode in the token
 * @returns JWT token string
 */
function generateToken(userId: string): string {
  if (!config.jwt.secret) {
    throw new ConfigurationError(
      'JWT secret is not defined in environment variables'
    );
  }

  // Use direct string option without type issues
  return jwt.sign({ userId }, config.jwt.secret as string, {
    expiresIn: '24h', // Fixed value to avoid type issues
  });
}

/**
 * Login a user with email and password
 * @param credentials - User login credentials
 * @returns User data and JWT token
 */
export async function loginUser(
  credentials: UserLoginCredentials
): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new UnauthorizedError('User account does not exist');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('This account has been deactivated');
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Update last login timestamp
  await prisma.user.update({
    data: {
      lastLoginAt: new Date(),
    },
    where: { id: user.id },
  });

  // Generate JWT token
  const token = generateToken(user.id);

  // Create a safe user object without sensitive data
  const safeUser: SafeUser = toSafeUser(user);

  return {
    token,
    user: safeUser,
  };
}

/**
 * Convert a database user model to a safe user object without sensitive data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSafeUser(user: any): SafeUser {
  // Parse address if it's a string
  let parsedAddress;
  if (user.address) {
    if (typeof user.address === 'string') {
      try {
        parsedAddress = JSON.parse(user.address);
      } catch (_e) {
        parsedAddress = undefined;
      }
    } else {
      parsedAddress = user.address;
    }
  }

  return {
    address: parsedAddress,
    createdAt: user.createdAt,
    email: user.email,
    firstName: user.firstName,
    id: user.id,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    lastLoginAt: user.lastLoginAt ?? undefined,
    lastName: user.lastName,
    phone: user.phone ?? undefined,
    role: user.role,
    updatedAt: user.updatedAt,
  };
}
