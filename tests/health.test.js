const request = require('supertest');
const app = require('../server');

describe('Health Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Server is running',
        data: {
          status: 'OK',
          environment: expect.any(String),
          version: expect.any(String),
        },
      });
    });
  });

  describe('GET /api/', () => {
    it('should return welcome message', async () => {
      const response = await request(app)
        .get('/api/')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Welcome to be-groomly API!',
        data: {
          version: '1.0.0',
          documentation: '/api/docs',
          health: '/api/health',
        },
      });
    });
  });

  describe('GET /api/nonexistent', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('Not Found'),
        },
      });
    });
  });
});
