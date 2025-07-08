// Basic type definitions
export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    errors?: unknown[];
    stack?: string;
  };
}

// User-related types
export enum UserRole {
  PET_OWNER = 'PET_OWNER',
  GROOMER = 'GROOMER',
  ADMIN = 'ADMIN',
}

export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface SafeUser {
  address?: UserAddress;
  createdAt: Date;
  email: string;
  firstName: string;
  id: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  lastName: string;
  phone?: string;
  role: string;
  updatedAt: Date;
}

export interface UserRegistrationData {
  address?: UserAddress;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
  role?: string;
}

export interface UserLoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: SafeUser;
}
