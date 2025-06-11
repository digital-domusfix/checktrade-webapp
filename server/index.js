const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const users = [];
const jobs = [];

app.post('/api/identity/register', (req, res) => {
  const { login } = req.body;
  if (!login) {
    return res.status(400).json({ error: 'login required' });
  }
  const user = { id: uuidv4(), login };
  users.push(user);
  res.status(201).json({ userId: user.id });
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
