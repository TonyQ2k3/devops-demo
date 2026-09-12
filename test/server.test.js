const request = require('supertest');
const os = require('os');
const app = require('../app');

describe('Express Server Endpoints', () => {
  describe('GET /', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual({
        message: 'Hello from NodeJS web app!',
        hostname: os.hostname(),
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /healthz', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/healthz');
      expect(response.status).toBe(200);
      expect(response.text).toBe('ok');
    });
  });
});