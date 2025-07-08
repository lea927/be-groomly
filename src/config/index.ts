import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

// Additional required vars in production/staging
const productionEnvVars = ['CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY'];

// Validate required environment variables
function validateEnv(): void {
  const missingVars: string[] = [];

  // Always check required vars
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  // Check production vars only in production/staging
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'staging'
  ) {
    for (const envVar of productionEnvVars) {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

// Validate environment variables (will throw if missing required vars)
validateEnv();

const config = {
  // Auth Configuration
  auth: {
    clerk: {
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY || 'test-key',
      secretKey: process.env.CLERK_SECRET_KEY || 'test-key',
    },
  },
  // CORS Configuration
  cors: {
    credentials: true,
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
  },
  // Database
  database: {
    url: process.env.DATABASE_URL,
  },
  // External APIs
  externalApis: {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
    },
  },
  // JWT Configuration
  jwt: {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
  },
  // Monitoring
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  // Rate Limiting Configuration
  // Protects against brute force attacks and DoS attempts by limiting
  // the number of requests from a single IP address within a time window.
  // Current setting: 100 requests per IP every 15 minutes
  rateLimit: {
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later',
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
};

export default config;
