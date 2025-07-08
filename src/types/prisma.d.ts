// This is a temporary solution until we can generate proper Prisma types
// We'll use unknown instead of any to be more type-safe
declare module '@prisma/client' {
  interface UserModel {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    role: string;
    address?: Record<string, string>;
    phone?: string;
    isEmailVerified: boolean;
    isActive: boolean;
    verificationToken?: string;
    verificationTokenExpiry?: Date;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }

  interface PrismaClient {
    user: {
      findUnique: (args: {
        where: { email: string } | { id: string };
      }) => Promise<UserModel | null>;
      create: (args: { data: Record<string, unknown> }) => Promise<UserModel>;
      update: (args: {
        data: Record<string, unknown>;
        where: { id: string };
      }) => Promise<UserModel>;
    };
  }

  export const PrismaClient: {
    new (): PrismaClient;
  };
}
