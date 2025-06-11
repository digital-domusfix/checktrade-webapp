const request = require('supertest');
const { app, users, jobs } = require('../index.js');

describe('API', () => {
  beforeEach(() => {
    users.length = 0;
    jobs.length = 0;
  });

  test('register user', async () => {
    const payload = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'secret123',
    };

    const res = await request(app)
      .post('/api/identity/register')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.userId).toBeDefined();
    expect(users.length).toBe(1);
    expect(users[0]).toMatchObject(payload);
  });

  test('create job for user', async () => {
    const userRes = await request(app)
      .post('/api/identity/register')
      .send({
        fullName: 'Job User',
        email: 'job@example.com',
        password: 'secret123',
      });
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
