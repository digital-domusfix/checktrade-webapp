const express = require('express');
const { v4: uuidv4 } = require('uuid');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const app = express();
app.use(express.json());

const users = [];
const jobs = [];

app.post('/api/identity/register', (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'fullName, email, and password required' });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user = {
    id: uuidv4(),
    fullName,
    email,
    password,
    otp: generateOtp(),
    verified: false,
  };
  users.push(user);

  res.status(201).json({ userId: user.id });
});

app.post('/api/identity/verify-otp', (req, res) => {
  const { userId, emailOtp, mobileOtp } = req.body;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const provided = emailOtp || mobileOtp;
  if (!provided) {
    return res.status(400).json({ error: 'OTP required' });
  }

  if (user.otp !== provided) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  user.verified = true;
  user.otp = null;
  res.json({ success: true });
});

app.post('/api/identity/resend-otp', (req, res) => {
  const { userId } = req.body;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.otp = generateOtp();
  user.verified = false;
  res.json({ success: true });
});

app.post('/api/users/:userId/jobs', (req, res) => {
  const { userId } = req.params;
  const job = { id: uuidv4(), userId, ...req.body };
  jobs.push(job);
  res.status(201).json(job);
});

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = { app, users, jobs };
