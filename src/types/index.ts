// Basic type definitions
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// User-related types
export enum UserRole {
  CLIENT = 'CLIENT',
  GROOMER = 'GROOMER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
