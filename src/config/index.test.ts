// Mock config for tests
export default {
  cors: {
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*',
  },
  database: {
    url: 'postgresql://test:test@localhost:5432/test_db',
  },
  externalApis: {
    sendgrid: {
      apiKey: 'test-sendgrid-key',
    },
    stripe: {
      secretKey: 'test-stripe-key',
    },
  },
  jwt: {
    expiresIn: '24h',
    secret: 'test-secret',
  },
  monitoring: {
    sentryDsn: 'test-sentry-dsn',
  },
  nodeEnv: 'test',
  port: 3000,
  rateLimit: {
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
};
