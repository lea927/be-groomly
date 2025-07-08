// Mock config for tests
module.exports = {
  jwt: {
    secret: 'test-secret',
    expiresIn: '24h',
  },
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
  },
  nodeEnv: 'test',
  port: 3000,
};
