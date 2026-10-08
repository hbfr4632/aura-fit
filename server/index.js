import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const users = [
  {
    id: 'u_01',
    name: 'Ariana',
    email: 'ariana@aurafit.app',
    password: 'password123',
  },
];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Aura Fit API' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const match = users.find((user) => user.email === email && user.password === password);

  if (!match) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  return res.json({
    id: match.id,
    name: match.name,
    email: match.email,
    token: 'demo-token',
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const exists = users.some((user) => user.email === email);
  if (exists) {
    return res.status(409).json({ message: 'Email already in use.' });
  }

  const user = { id: `u_${Date.now()}`, name, email, password };
  users.push(user);

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    token: 'demo-token',
  });
});

app.listen(PORT, () => {
  console.log(`Aura Fit API running at http://localhost:${PORT}`);
});
