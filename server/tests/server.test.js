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
      role: 'homeowner',
    };

    const res = await request(app)
      .post('/api/identity/register')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.userId).toBeDefined();
    expect(users.length).toBe(1);
    expect(users[0]).toMatchObject(payload);
  });

  test('registration fails when email already exists', async () => {
    const payload = {
      fullName: 'Existing User',
      email: 'existing@example.com',
      password: 'secret123',
      role: 'homeowner',
    };

    await request(app).post('/api/identity/register').send(payload);
    const res = await request(app).post('/api/identity/register').send(payload);

    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
    expect(users.length).toBe(1);
  });

  test('registers without full name', async () => {
    const payload = {
      email: 'nofull@example.com',
      password: 'secret123',
      role: 'contractor',
    };

    const res = await request(app)
      .post('/api/identity/register')
      .send(payload);

    expect(res.status).toBe(201);
    expect(users[0]).toMatchObject({ ...payload, fullName: '' });
  });

  test('create job for user', async () => {
    const userRes = await request(app)
      .post('/api/identity/register')
      .send({
        fullName: 'Job User',
        email: 'job@example.com',
        password: 'secret123',
        role: 'homeowner',
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

  test('verify otp for user', async () => {
    const payload = {
      fullName: 'OTP User',
      email: 'otp@example.com',
      password: 'secret123',
      role: 'contractor',
    };

    const res = await request(app)
      .post('/api/identity/register')
      .send(payload);

    const userId = res.body.userId;
    const otp = users.find((u) => u.id === userId).otp;

    const verifyRes = await request(app)
      .post('/api/identity/verify-otp')
      .send({ userId, emailOtp: otp });

    expect(verifyRes.status).toBe(200);
    const user = users.find((u) => u.id === userId);
    expect(user.verified).toBe(true);
  });

  test('resend otp', async () => {
    const payload = {
      fullName: 'Resend User',
      email: 'resend@example.com',
      password: 'secret123',
      role: 'contractor',
    };

    const res = await request(app)
      .post('/api/identity/register')
      .send(payload);

    const userId = res.body.userId;
    const firstOtp = users.find((u) => u.id === userId).otp;

    const resendRes = await request(app)
      .post('/api/identity/resend-otp')
      .send({ userId });

    expect(resendRes.status).toBe(200);
    const user = users.find((u) => u.id === userId);
    expect(user.otp).not.toBe(firstOtp);
    expect(user.verified).toBe(false);
  });
});
