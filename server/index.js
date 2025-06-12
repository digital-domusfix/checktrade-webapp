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
  const { fullName = '', email, password, role } = req.body;

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ error: 'email, password, and role required' });
  }

  if (password.length < 8 || !/\d/.test(password)) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 8 characters and contain a number' });
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
    role,
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

app.get('/api/identity/me', (req, res) => {
  const user = users[0];
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    isActive: user.verified,
    isOnboarded: !!user.isOnboarded,
  });
});

app.post('/api/identity/profile', (req, res) => {
  const { userId, firstName, lastName, phone, city, postalCode } = req.body;
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.firstName = firstName;
  user.lastName = lastName;
  user.phone = phone;
  user.city = city;
  user.postalCode = postalCode;
  user.isOnboarded = true;
  res.json({ success: true });
});

app.post('/api/identity/onboarding', (req, res) => {
  const {
    userId,
    businessName,
    tradeCategory,
    subcategories,
    yearsExperience,
    city,
    postalCode,
    travelRadius,
  } = req.body;
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!tradeCategory || !Array.isArray(subcategories) || subcategories.length === 0) {
    return res.status(400).json({ error: 'tradeCategory and subcategories required' });
  }
  if (!city || !travelRadius) {
    return res.status(400).json({ error: 'city and travelRadius required' });
  }
  if (postalCode && !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postalCode)) {
    return res.status(400).json({ error: 'Invalid postal code' });
  }
  const years = Number(yearsExperience);
  if (yearsExperience !== undefined && (Number.isNaN(years) || years < 0 || years > 50)) {
    return res.status(400).json({ error: 'Invalid years of experience' });
  }

  user.businessName = businessName;
  user.tradeCategory = tradeCategory;
  user.subcategories = subcategories;
  user.yearsExperience = yearsExperience === undefined ? undefined : years;
  user.city = city;
  user.postalCode = postalCode;
  user.travelRadius = Number(travelRadius);

  res.json({ success: true });
});

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = { app, users, jobs };
