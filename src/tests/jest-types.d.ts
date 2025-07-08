// Type declaration for server.js
declare module '../../server' {
  import { Express } from 'express';
  const app: Express;
  export = app;
}

// Define Jest mock extensions
declare global {
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Mock<T = any, _Y extends any[] = any[]> {
      mockResolvedValue(value: T): this;
      mockRejectedValue(value: Error | unknown): this;
    }
  }
}

// Override the prisma module for tests
declare module '../libs/prisma' {
  export const prisma: {
    user: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      findUnique: jest.Mock<Promise<any>>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      create: jest.Mock<Promise<any>>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      update: jest.Mock<Promise<any>>;
    };
  };
}

// Augment bcrypt in test environment
declare module 'bcrypt' {
  export const hash: jest.Mock;
  export const compare: jest.Mock;
}

// Augment jsonwebtoken in test environment
declare module 'jsonwebtoken' {
  export const sign: jest.Mock;
}
