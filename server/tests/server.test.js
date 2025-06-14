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

  test('registration fails with weak password', async () => {
    const res = await request(app)
      .post('/api/identity/register')
      .send({ email: 'weak@example.com', password: 'short1', role: 'homeowner' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/password/i);
  });

  test('registration fails without role', async () => {
    const res = await request(app)
      .post('/api/identity/register')
      .send({ email: 'norole@example.com', password: 'secret123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/role/);
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

  test('complete contractor onboarding', async () => {
    const res = await request(app)
      .post('/api/identity/register')
      .send({
        email: 'pro@example.com',
        password: 'secret123',
        role: 'contractor',
      });
    const userId = res.body.userId;

    const onboardRes = await request(app)
      .post('/api/identity/onboarding')
      .send({
        userId,
        businessName: 'Plumb Co',
        tradeCategory: 'plumbing',
        subcategories: ['repair'],
        yearsExperience: 5,
        city: 'Halifax',
        postalCode: 'B2T 1A1',
        travelRadius: 10,
      });

    expect(onboardRes.status).toBe(200);
    const user = users.find((u) => u.id === userId);
    expect(user.tradeCategory).toBe('plumbing');
    expect(user.subcategories).toEqual(['repair']);
  });

  test('onboarding rejects invalid postal code', async () => {
    const res = await request(app)
      .post('/api/identity/register')
      .send({
        email: 'badpc@example.com',
        password: 'secret123',
        role: 'contractor',
      });
    const userId = res.body.userId;

    const onboardRes = await request(app)
      .post('/api/identity/onboarding')
      .send({
        userId,
        tradeCategory: 'plumbing',
        subcategories: ['repair'],
        city: 'Halifax',
        postalCode: '123',
        travelRadius: 5,
      });

    expect(onboardRes.status).toBe(400);
    expect(onboardRes.body.error).toMatch(/postal/);
  });
});
