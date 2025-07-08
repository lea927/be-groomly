import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
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
  // Rate Limiting
  rateLimit: {
    max: 100, // limit each IP to 100 requests per windowMs
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
};

export default config;
