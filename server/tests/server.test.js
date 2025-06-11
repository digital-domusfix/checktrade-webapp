const request = require('supertest');
const { app, users, jobs } = require('../index.js');

describe('API', () => {
  beforeEach(() => {
    users.length = 0;
    jobs.length = 0;
  });

  test('register user', async () => {
    const res = await request(app)
      .post('/api/identity/register')
      .send({ login: 'test@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.userId).toBeDefined();
    expect(users.length).toBe(1);
  });

  test('create job for user', async () => {
    const userRes = await request(app)
      .post('/api/identity/register')
      .send({ login: 'job@example.com' });
    const userId = userRes.body.userId;
    const jobRes = await request(app)
      .post(`/api/users/${userId}/jobs`)
      .send({ title: 'Fix sink' });
    expect(jobRes.status).toBe(201);
    expect(jobRes.body.title).toBe('Fix sink');
    expect(jobRes.body.userId).toBe(userId);
    expect(jobs.length).toBe(1);
  });
});
